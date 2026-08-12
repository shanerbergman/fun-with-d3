/**
 * Headless checks for the radial bar chart's data rollup and ring geometry,
 * run against the real public/BTC-USD.csv.
 *
 *   npm run test:radial
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  toWeekly,
  weekStart,
  indexForAngle,
  angleCenter,
  angleAt,
  bandWidth,
  yearTicks,
  ANGLE_START,
  ANGLE_SWEEP,
  RING_GAP,
} from "./weeklyData.js";

let failures = 0;
const ok = (name, cond, extra = "") => {
  console.log(`${cond ? "  pass" : "  FAIL"}  ${name}${extra ? `  ← ${extra}` : ""}`);
  if (!cond) failures++;
};

const here = path.dirname(fileURLToPath(import.meta.url));
const csvPath = path.resolve(here, "../../../../public/BTC-USD.csv");

/** Minimal CSV parse — enough for a well-formed Yahoo Finance export. */
function parseCsv(text) {
  const [head, ...lines] = text.trim().split("\n");
  const cols = head.split(",");
  return lines.map((line) => {
    const cells = line.split(",");
    return Object.fromEntries(cols.map((c, i) => [c, cells[i]]));
  });
}

const rows = parseCsv(fs.readFileSync(csvPath, "utf8"));
const weeks = toWeekly(rows, 5);

// --- 1. rollup ------------------------------------------------------------
console.log("\n1. weekly rollup over the last 5 years");
{
  ok("csv actually loaded", rows.length > 3000, `${rows.length} daily rows`);
  ok(
    "week count looks like 5 years",
    weeks.length >= 250 && weeks.length <= 266,
    `${weeks.length} weeks`
  );

  const first = weeks[0];
  const last = weeks[weeks.length - 1];
  console.log(
    `       ${first.week.toISOString().slice(0, 10)} → ${last.week
      .toISOString()
      .slice(0, 10)}`
  );

  ok(
    "spans ~5 years",
    (last.week - first.week) / 31557600000 > 4.9,
    `${((last.week - first.week) / 31557600000).toFixed(2)} years`
  );
  ok("ascending by week", weeks.every((d, i) => i === 0 || d.week > weeks[i - 1].week));
  ok("every close is a positive number", weeks.every((d) => Number.isFinite(d.close) && d.close > 0));
  ok("weeks are unique", new Set(weeks.map((d) => +d.week)).size === weeks.length);

  // No missing weeks: consecutive entries should be exactly 7 days apart.
  const gaps = weeks.slice(1).map((d, i) => (d.week - weeks[i].week) / 86400000);
  const bad = gaps.filter((g) => g !== 7);
  ok("no gaps in the series", bad.length === 0, `${bad.length} irregular gaps`);

  ok("every week starts on a Sunday", weeks.every((d) => d.week.getUTCDay() === 0));
  ok(
    "close date falls inside its own week",
    weeks.every((d) => weekStart(+d.date) === +d.week)
  );

  const peak = weeks.reduce((a, b) => (b.close > a.close ? b : a));
  console.log(
    `       peak $${Math.round(peak.close).toLocaleString()} week of ${peak.week
      .toISOString()
      .slice(0, 10)}`
  );
  ok("peak is in the 2021 runup", peak.week.getUTCFullYear() === 2021, `${peak.week.getUTCFullYear()}`);
}

// --- 2. hover mapping -----------------------------------------------------
console.log("\n2. angle → week mapping round-trips");
{
  const n = weeks.length;
  let mismatches = 0;
  for (let i = 0; i < n; i++) {
    if (indexForAngle(angleCenter(i, n), n) !== i) mismatches++;
  }
  ok("every bar centre maps back to itself", mismatches === 0, `${mismatches} off`);

  // Just inside each bar's leading edge should also resolve to that bar.
  let edgeMiss = 0;
  for (let i = 0; i < n; i++) {
    const a = angleAt(i, n) + bandWidth(n) * 0.01;
    if (indexForAngle(a, n) !== i) edgeMiss++;
  }
  ok("leading edges resolve correctly", edgeMiss === 0, `${edgeMiss} off`);

  ok("first bar sits at the start angle", indexForAngle(ANGLE_START + 1e-9, n) === 0);
  ok(
    "last bar reaches the end of the sweep",
    indexForAngle(ANGLE_START + ANGLE_SWEEP - 1e-9, n) === n - 1
  );

  // The top gap must return null so hovering it clears the readout.
  const gapCentre = ANGLE_START - RING_GAP / 2;
  ok("top gap returns null", indexForAngle(gapCentre, n) === null);
  ok("just past the sweep returns null", indexForAngle(ANGLE_START + ANGLE_SWEEP + 0.01, n) === null);

  // atan2 output is (-π, π]; the ring crosses that seam, so check both sides.
  const wrapped = [-Math.PI + 0.01, Math.PI - 0.01, 0, Math.PI / 2, -Math.PI / 2 + 0.5];
  ok(
    "handles the atan2 seam",
    wrapped.every((a) => {
      const i = indexForAngle(a, n);
      return i === null || (i >= 0 && i < n);
    })
  );

  ok("empty series is safe", indexForAngle(0, 0) === null);
}

// --- 2b. arc convention ---------------------------------------------------
// Regression: d3.arc measures from 12 o'clock, atan2 from 3 o'clock. Passing
// an atan2 angle straight to d3.arc renders the ring a quarter turn away from
// its own labels and hit-testing.
console.log("\n2b. d3.arc angles line up with atan2 angles");
{
  const { toArcAngle } = await import("./weeklyData.js");

  // Where d3.arc actually puts a point for a given arc angle.
  const arcPoint = (a) => [Math.sin(a), -Math.cos(a)];
  // Where cos/sin (and therefore our labels and guide line) put it.
  const mathPoint = (a) => [Math.cos(a), Math.sin(a)];

  const close = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]) < 1e-9;

  const samples = [ANGLE_START, 0, Math.PI / 3, -Math.PI / 2, 2, -2.5];
  ok(
    "toArcAngle maps both conventions to the same point",
    samples.every((a) => close(arcPoint(toArcAngle(a)), mathPoint(a)))
  );

  // The very first bar must begin just clockwise of 12 o'clock.
  const [fx, fy] = arcPoint(toArcAngle(ANGLE_START));
  ok("first bar starts near the top", fy < -0.98 && fx > 0, `(${fx.toFixed(3)}, ${fy.toFixed(3)})`);

  // A quarter of the way round should be near 3 o'clock.
  const quarter = ANGLE_START + ANGLE_SWEEP / 4;
  const [qx, qy] = arcPoint(toArcAngle(quarter));
  ok("quarter way round is near 3 o'clock", qx > 0.98 && Math.abs(qy) < 0.12, `(${qx.toFixed(3)}, ${qy.toFixed(3)})`);
}

// --- 3. year ticks --------------------------------------------------------
console.log("\n3. year labels");
{
  const ticks = yearTicks(weeks);
  console.log(`       ${ticks.map((t) => t.year).join(", ")}`);
  ok("one tick per year", ticks.length >= 4 && ticks.length <= 6, `${ticks.length} ticks`);
  ok("ticks ascend", ticks.every((t, i) => i === 0 || t.index > ticks[i - 1].index));
  ok("indices are in range", ticks.every((t) => t.index >= 0 && t.index < weeks.length));
}

// --- 4. windowing ---------------------------------------------------------
console.log("\n4. window selection");
{
  const all = toWeekly(rows, null);
  ok("null window keeps everything", all.length > weeks.length, `${all.length} vs ${weeks.length} weeks`);
  const one = toWeekly(rows, 1);
  ok("1-year window is ~52 weeks", one.length >= 50 && one.length <= 55, `${one.length} weeks`);
  ok("bad rows are dropped", toWeekly([{ Date: "nope", Close: "x" }], 5).length === 0);
  ok("empty input is safe", toWeekly([], 5).length === 0);
}

console.log(`\n${failures === 0 ? "all pass" : `${failures} failure(s)`}\n`);
process.exit(failures ? 1 : 0);
