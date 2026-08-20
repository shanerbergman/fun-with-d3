/**
 * Data shaping and ring geometry for the radial bar chart.
 *
 * Kept free of d3, React and the DOM so the weekly rollup and the
 * angle→week hover mapping can be exercised headlessly.
 */

/** Total radians left empty at the top, so the ring reads as a timeline. */
export const RING_GAP = 0.16;

/** 12 o'clock, in atan2 terms. Bars run clockwise from just after the gap. */
export const ANGLE_START = -Math.PI / 2 + RING_GAP / 2;
export const ANGLE_SWEEP = 2 * Math.PI - RING_GAP;

const MS_DAY = 86400000;

/** Sunday 00:00 UTC of the week containing `ms`. UTC throughout so the
 *  rollup doesn't shift under a reader in a different timezone. */
export function weekStart(ms) {
  const d = new Date(ms);
  const day = d.getUTCDay();
  return Date.UTC(
    d.getUTCFullYear(),
    d.getUTCMonth(),
    d.getUTCDate() - day
  );
}

/**
 * Roll daily rows up to one point per week, keeping each week's *last*
 * close — the weekly closing price rather than an average.
 *
 * @param rows      raw CSV rows: { Date: "YYYY-MM-DD", Close: "123.45" }
 * @param yearsBack window measured back from the newest row (null = all)
 * @returns [{ week: Date, close: number, date: Date }] ascending by week,
 *          where `date` is the actual trading day the close came from.
 */
export function toWeekly(rows, yearsBack = 5) {
  const parsed = [];
  for (const row of rows) {
    const ms = Date.parse(row.Date);
    const close = Number(row.Close);
    if (!Number.isFinite(ms) || !Number.isFinite(close) || close <= 0) continue;
    parsed.push({ ms, close });
  }
  return rollupWeekly(parsed, yearsBack);
}

/**
 * The shared rollup. Both the bundled CSV and the live Coinbase feed funnel
 * through here, so there is only one definition of "a week's close".
 *
 * @param points    [{ ms, close }] in any order
 * @param yearsBack window measured back from the newest point (null = all)
 */
export function rollupWeekly(points, yearsBack = 5) {
  const parsed = points.filter(
    (p) => Number.isFinite(p.ms) && Number.isFinite(p.close) && p.close > 0
  );
  if (!parsed.length) return [];

  parsed.sort((a, b) => a.ms - b.ms);

  let cutoff = -Infinity;
  if (yearsBack != null) {
    const newest = new Date(parsed[parsed.length - 1].ms);
    cutoff = Date.UTC(
      newest.getUTCFullYear() - yearsBack,
      newest.getUTCMonth(),
      newest.getUTCDate()
    );
  }

  // Last row wins per week because `parsed` is ascending.
  const byWeek = new Map();
  for (const p of parsed) {
    if (p.ms < cutoff) continue;
    byWeek.set(weekStart(p.ms), p);
  }

  return [...byWeek.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([week, p]) => ({
      week: new Date(week),
      date: new Date(p.ms),
      close: p.close,
    }));
}

/** Angular width of one week's bar. */
export const bandWidth = (count) => (count > 0 ? ANGLE_SWEEP / count : 0);

/** Start angle of bar `i`. */
export const angleAt = (i, count) => ANGLE_START + i * bandWidth(count);

/** Centre angle of bar `i` — used to place the hover guide and year ticks. */
export const angleCenter = (i, count) =>
  ANGLE_START + (i + 0.5) * bandWidth(count);

/**
 * Convert one of our angles into the convention d3.arc expects.
 *
 * Everything above is in atan2 terms: 0 points right (3 o'clock), and the
 * angle grows clockwise on screen because SVG's y axis points down. That's
 * required, because hover comes straight from Math.atan2 and label positions
 * come straight from Math.cos/Math.sin.
 *
 * d3.arc instead measures from 12 o'clock. Feeding it an atan2 angle renders
 * the ring a quarter turn out of step with its own labels and hit-testing.
 */
export const toArcAngle = (angle) => angle + Math.PI / 2;

const TAU = 2 * Math.PI;

/**
 * Map a pointer angle (as returned by Math.atan2(dy, dx)) to a week index.
 * Bars are only a few pixels wide at 260 weeks, so hover is resolved from
 * the angle rather than per-element mouseover.
 *
 * @returns index, or null when the pointer falls in the top gap.
 */
export function indexForAngle(theta, count) {
  if (count <= 0) return null;
  let rel = (theta - ANGLE_START) % TAU;
  if (rel < 0) rel += TAU;
  if (rel > ANGLE_SWEEP) return null; // inside the gap
  const i = Math.floor(rel / bandWidth(count));
  return i >= count ? count - 1 : i;
}

/**
 * First bar index of each calendar year present, for the ring's year labels.
 * @returns [{ year, index }]
 */
export function yearTicks(weeks) {
  const seen = new Set();
  const ticks = [];
  weeks.forEach((d, index) => {
    const year = d.week.getUTCFullYear();
    if (!seen.has(year)) {
      seen.add(year);
      ticks.push({ year, index });
    }
  });
  // The first year is usually a partial stub sitting right against the gap.
  return ticks.length > 1 && ticks[0].index < 2 ? ticks.slice(1) : ticks;
}
