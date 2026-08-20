/**
 * Live BTC prices from the Coinbase Exchange public API.
 *
 * Both endpoints used here are unauthenticated (`security: []` in Coinbase's
 * OpenAPI spec) — no key, no signup, nothing to leak in the client bundle.
 *
 *   GET /products/BTC-USD/candles?granularity=86400&start=&end=
 *   GET /products/BTC-USD/ticker
 *
 * `fetch` is injected everywhere so the parsing and pagination can be tested
 * against recorded payloads without touching the network.
 */
// Explicit .js extension: this module is imported both by Vite and directly by
// node for the tests, and node's ESM resolver does not guess extensions.
import { rollupWeekly, weekStart } from "./weeklyData.js";

const API = "https://api.exchange.coinbase.com";

export const PRODUCT = "BTC-USD";
export const GRANULARITY = 86400; // one day, in seconds
export const MAX_CANDLES = 300; // hard API limit per request

/** Stay under the 300-candle cap with room for inclusive boundaries. */
const CHUNK_DAYS = 280;
const DAY_MS = 86400000;

export const candlesUrl = (start, end) =>
  `${API}/products/${PRODUCT}/candles?granularity=${GRANULARITY}` +
  `&start=${new Date(start).toISOString()}&end=${new Date(end).toISOString()}`;

export const tickerUrl = () => `${API}/products/${PRODUCT}/ticker`;

/**
 * Split the requested window into chunks of at most CHUNK_DAYS.
 *
 * Coinbase caps a single response at 300 candles and *rejects* — rather than
 * truncating — any range that would exceed it, so five years of daily candles
 * has to be walked backwards in pieces.
 *
 * @returns [{ start: Date, end: Date }] oldest first
 */
export function planBackfill(now = Date.now(), yearsBack = 5) {
  const end = new Date(now);
  const start = new Date(
    Date.UTC(
      end.getUTCFullYear() - yearsBack,
      end.getUTCMonth(),
      end.getUTCDate()
    )
  );

  const ranges = [];
  let cursor = +end;

  while (cursor > +start && ranges.length < 64) {
    const chunkStart = Math.max(+start, cursor - CHUNK_DAYS * DAY_MS);
    ranges.push({ start: new Date(chunkStart), end: new Date(cursor) });
    if (chunkStart === +start) break;
    cursor = chunkStart - DAY_MS;
  }

  return ranges.reverse();
}

/**
 * Coinbase candle rows are `[time, low, high, open, close, volume]`.
 *
 * Note the ordering: low and high come *before* open and close, which is not
 * the OHLC order most APIs use. Reading index 3 as the close would silently
 * plot opening prices — right shape, wrong numbers.
 */
export function parseCandles(payload) {
  if (!Array.isArray(payload)) {
    throw new Error("Coinbase returned an unexpected candle payload");
  }

  const points = [];
  for (const row of payload) {
    if (!Array.isArray(row) || row.length < 5) continue;
    const ms = Number(row[0]) * 1000; // seconds → ms
    const close = Number(row[4]);
    if (!Number.isFinite(ms) || !Number.isFinite(close) || close <= 0) continue;
    points.push({ ms, close });
  }
  return points;
}

/** Ticker gives price as a *string* and time as an ISO 8601 stamp. */
export function parseTicker(payload) {
  const price = Number(payload?.price);
  if (!Number.isFinite(price) || price <= 0) {
    throw new Error("Coinbase ticker had no usable price");
  }
  const ms = Date.parse(payload?.time);
  return { price, ms: Number.isFinite(ms) ? ms : Date.now() };
}

async function getJson(fetchImpl, url, signal) {
  const res = await fetchImpl(url, { signal });
  if (!res.ok) throw new Error(`Coinbase responded ${res.status}`);
  return res.json();
}

/**
 * Backfill the full window and roll it up to weekly closes.
 * The final week is flagged `partial` — it is still in progress.
 */
export async function fetchHistory({
  fetchImpl = fetch,
  now = Date.now(),
  yearsBack = 5,
  signal,
} = {}) {
  const ranges = planBackfill(now, yearsBack);

  // Seven-ish requests, well under Coinbase's ~10/s public limit.
  const chunks = await Promise.all(
    ranges.map((r) => getJson(fetchImpl, candlesUrl(r.start, r.end), signal))
  );

  const points = chunks.flatMap(parseCandles);
  if (!points.length) throw new Error("Coinbase returned no candles");

  const weeks = rollupWeekly(points, yearsBack);
  if (weeks.length) weeks[weeks.length - 1].partial = true;
  return weeks;
}

export async function fetchTicker({ fetchImpl = fetch, signal } = {}) {
  return parseTicker(await getJson(fetchImpl, tickerUrl(), signal));
}

/**
 * Fold a live tick into the weekly series: update the current week's close, or
 * open a new week if the week has rolled over since the last fetch.
 *
 * Returns a new array (never mutates) so React sees the change.
 */
export function mergeLive(weeks, tick, yearsBack = 5) {
  if (!tick || !Number.isFinite(tick.price)) return weeks;

  const wk = weekStart(tick.ms);
  const next = weeks.slice();
  const last = next[next.length - 1];

  if (last && +last.week === wk) {
    next[next.length - 1] = {
      ...last,
      close: tick.price,
      date: new Date(tick.ms),
      partial: true,
    };
  } else if (!last || wk > +last.week) {
    next.push({
      week: new Date(wk),
      date: new Date(tick.ms),
      close: tick.price,
      partial: true,
    });
  } else {
    return weeks; // stale tick, older than what we already have
  }

  // Keep the rolling window from growing without bound as weeks roll over.
  if (yearsBack != null && next.length) {
    const newest = next[next.length - 1].week;
    const cutoff = Date.UTC(
      newest.getUTCFullYear() - yearsBack,
      newest.getUTCMonth(),
      newest.getUTCDate()
    );
    while (next.length && +next[0].week < cutoff) next.shift();
  }

  return next;
}
