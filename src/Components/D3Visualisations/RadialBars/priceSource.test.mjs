/**
 * Checks for the Coinbase Exchange feed. `fetch` is injected, so these run
 * offline against payloads shaped from Coinbase's published OpenAPI examples.
 *
 *   npm run test:feed
 */
import {
  planBackfill,
  parseCandles,
  parseTicker,
  mergeLive,
  fetchHistory,
  candlesUrl,
  tickerUrl,
  MAX_CANDLES,
} from "./priceSource.js";
import { weekStart } from "./weeklyData.js";

let failures = 0;
const ok = (name, cond, extra = "") => {
  console.log(`${cond ? "  pass" : "  FAIL"}  ${name}${extra ? `  ← ${extra}` : ""}`);
  if (!cond) failures++;
};

const DAY = 86400000;
const NOW = Date.UTC(2026, 7, 20, 15, 30); // fixed clock: 2026-08-20

// --- 1. pagination --------------------------------------------------------
console.log("\n1. backfill respects the 300-candle cap");
{
  const ranges = planBackfill(NOW, 5);
  console.log(`       ${ranges.length} requests for a 5-year window`);

  ok("covers the window in a handful of requests", ranges.length >= 6 && ranges.length <= 9, `${ranges.length}`);
  ok("oldest first", ranges.every((r, i) => i === 0 || r.start >= ranges[i - 1].start));

  const oversized = ranges.filter((r) => (r.end - r.start) / DAY > MAX_CANDLES);
  ok("no chunk can exceed 300 candles", oversized.length === 0, `${oversized.length} oversized`);

  ok("ends at now", Math.abs(+ranges[ranges.length - 1].end - NOW) < DAY, "");
  const span = (+ranges[ranges.length - 1].end - +ranges[0].start) / (365.25 * DAY);
  ok("spans ~5 years", span > 4.9 && span < 5.2, `${span.toFixed(2)} years`);

  // Gaps between chunks must be at most one day, or candles go missing.
  const gaps = ranges.slice(1).map((r, i) => (r.start - ranges[i].end) / DAY);
  ok("chunks are contiguous", gaps.every((g) => g <= 1.01), `max gap ${Math.max(0, ...gaps).toFixed(2)}d`);

  ok("url carries granularity and ISO bounds",
    candlesUrl(ranges[0].start, ranges[0].end).includes("granularity=86400") &&
    /start=\d{4}-\d{2}-\d{2}T/.test(candlesUrl(ranges[0].start, ranges[0].end)));
  ok("ticker url is the public product ticker", tickerUrl().endsWith("/products/BTC-USD/ticker"));
}

// --- 2. candle parsing ----------------------------------------------------
// Coinbase rows are [time, low, high, open, close, volume] — low/high BEFORE
// open/close. Reading index 3 would silently plot opening prices.
console.log("\n2. candle rows are read in Coinbase's field order");
{
  //          time        low     high    open    close   volume
  const row = [1755648000, 61000.5, 65000.9, 62000.1, 64500.7, 1234.5];
  const [pt] = parseCandles([row]);

  ok("close comes from index 4", pt.close === 64500.7, `got ${pt.close}`);
  ok("not the open at index 3", pt.close !== 62000.1);
  ok("not the high at index 2", pt.close !== 65000.9);
  ok("seconds converted to ms", pt.ms === 1755648000 * 1000, `${pt.ms}`);

  ok("string prices are coerced", parseCandles([[1755648000, "1", "2", "3", "64500.7", "5"]])[0].close === 64500.7);
  ok("short rows dropped", parseCandles([[1, 2, 3]]).length === 0);
  ok("non-positive closes dropped", parseCandles([[1755648000, 1, 2, 3, 0, 5]]).length === 0);
  ok("null close dropped", parseCandles([[1755648000, 1, 2, 3, null, 5]]).length === 0);
  ok("empty array is fine", parseCandles([]).length === 0);

  let threw = false;
  try { parseCandles({ message: "NotFound" }); } catch { threw = true; }
  ok("an error object throws rather than yielding junk", threw);
}

// --- 3. ticker parsing ----------------------------------------------------
console.log("\n3. ticker parsing");
{
  const payload = {
    trade_id: 86326522,
    price: "6268.48",
    size: "0.00698254",
    time: "2020-03-20T00:22:57.833Z",
    bid: "6265.15",
    ask: "6267.71",
    volume: "53602.03940154",
  };
  const t = parseTicker(payload);
  ok("string price coerced to number", t.price === 6268.48, `${t.price}`);
  ok("ISO time parsed", t.ms === Date.parse("2020-03-20T00:22:57.833Z"));

  ok("missing time falls back to now", Number.isFinite(parseTicker({ price: "1" }).ms));

  for (const bad of [{}, { price: "abc" }, { price: "0" }, null]) {
    let threw = false;
    try { parseTicker(bad); } catch { threw = true; }
    ok(`rejects ${JSON.stringify(bad)}`, threw);
  }
}

// --- 4. merging a live tick ----------------------------------------------
console.log("\n4. live ticks fold into the right week");
{
  const mkWeek = (ms, close) => ({ week: new Date(weekStart(ms)), date: new Date(ms), close });
  const base = [
    mkWeek(Date.UTC(2026, 7, 2), 100),
    mkWeek(Date.UTC(2026, 7, 9), 200),
    mkWeek(Date.UTC(2026, 7, 16), 300),
  ];

  // Same week as the last entry → update in place.
  const same = mergeLive(base, { ms: Date.UTC(2026, 7, 20), price: 321 });
  ok("updates the current week", same.length === 3 && same[2].close === 321, `len ${same.length}`);
  ok("marks it in progress", same[2].partial === true);
  ok("does not mutate the input", base[2].close === 300);

  // Next week → append.
  const rolled = mergeLive(base, { ms: Date.UTC(2026, 7, 24), price: 400 });
  ok("opens a new week on rollover", rolled.length === 4 && rolled[3].close === 400, `len ${rolled.length}`);
  ok("new week starts on a Sunday", rolled[3].week.getUTCDay() === 0);

  // Stale tick → ignored.
  const stale = mergeLive(base, { ms: Date.UTC(2026, 6, 1), price: 999 });
  ok("ignores a stale tick", stale === base);

  ok("ignores a junk tick", mergeLive(base, { ms: NOW, price: NaN }) === base);
  ok("ignores a null tick", mergeLive(base, null) === base);

  // Window trimming as weeks roll over. The series has to *end* at the current
  // week, otherwise the tick is legitimately stale and no merge happens.
  const long = [];
  const lastWeek = weekStart(NOW);
  for (let i = 399; i >= 0; i--) long.push(mkWeek(lastWeek - i * 7 * DAY, 100 + i));
  ok("fixture really is over-long", long.length === 400 && +long[long.length - 1].week === lastWeek);

  const trimmed = mergeLive(long, { ms: NOW, price: 500 }, 5);
  const spanYears = (trimmed[trimmed.length - 1].week - trimmed[0].week) / (365.25 * DAY);
  ok("trims to the rolling window", spanYears <= 5.05, `${spanYears.toFixed(2)} years, ${trimmed.length} weeks`);
  ok("keeps the newest week after trimming", +trimmed[trimmed.length - 1].week === lastWeek && trimmed[trimmed.length - 1].close === 500);
}

// --- 5. end-to-end with a fake fetch --------------------------------------
console.log("\n5. full backfill against a stubbed Coinbase");
{
  let calls = 0;
  const fakeFetch = async (url) => {
    calls++;
    const start = Date.parse(new URL(url).searchParams.get("start"));
    const end = Date.parse(new URL(url).searchParams.get("end"));
    const rows = [];
    // Coinbase returns newest first; emit descending to prove we sort.
    for (let t = end; t >= start; t -= DAY) {
      const price = 20000 + ((t / DAY) % 500) * 40;
      rows.push([Math.floor(t / 1000), price - 50, price + 50, price - 10, price, 1]);
    }
    return { ok: true, status: 200, json: async () => rows };
  };

  const weeks = await fetchHistory({ fetchImpl: fakeFetch, now: NOW, yearsBack: 5 });

  console.log(`       ${calls} requests → ${weeks.length} weeks`);
  ok("made one request per planned chunk", calls === planBackfill(NOW, 5).length, `${calls}`);
  ok("rolled up to ~5 years of weeks", weeks.length >= 250 && weeks.length <= 266, `${weeks.length}`);
  ok("ascending by week", weeks.every((d, i) => i === 0 || d.week > weeks[i - 1].week));
  ok("weeks are unique", new Set(weeks.map((d) => +d.week)).size === weeks.length);
  ok("all closes positive", weeks.every((d) => d.close > 0));
  ok("last week flagged in progress", weeks[weeks.length - 1].partial === true);
  ok("reaches the present", NOW - +weeks[weeks.length - 1].week < 8 * DAY, "");

  // Failure path.
  let threw = false;
  try {
    await fetchHistory({ fetchImpl: async () => ({ ok: false, status: 429 }), now: NOW });
  } catch (e) {
    threw = /429/.test(e.message);
  }
  ok("surfaces a rate-limit response", threw);

  let emptyThrew = false;
  try {
    await fetchHistory({ fetchImpl: async () => ({ ok: true, json: async () => [] }), now: NOW });
  } catch { emptyThrew = true; }
  ok("throws when every chunk is empty", emptyThrew);
}

console.log(`\n${failures === 0 ? "all pass" : `${failures} failure(s)`}\n`);
process.exit(failures ? 1 : 0);
