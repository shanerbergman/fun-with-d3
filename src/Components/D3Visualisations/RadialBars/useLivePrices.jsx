import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { toWeekly } from "./weeklyData";
import { fetchHistory, fetchTicker, mergeLive } from "./priceSource";

export const POLL_MS = 5 * 60 * 1000; // "every few minutes"
const YEARS_BACK = 5;

/**
 * Weekly BTC closes, live.
 *
 * Load order:
 *   1. Backfill five years of daily candles from Coinbase, roll up to weeks.
 *   2. Poll the ticker every POLL_MS and fold the price into the current week.
 *   3. If the backfill fails for any reason — CORS, offline, rate limit — fall
 *      back to the CSV bundled in public/ and say so in the UI.
 *
 * Polling pauses while the tab is hidden and fires once on return, so a
 * backgrounded tab doesn't spend requests all day.
 *
 * @returns { weeks, status, updatedAt, error }
 *          status: "loading" | "live" | "bundled"
 */
export default function useLivePrices() {
  const [weeks, setWeeks] = useState([]);
  const [status, setStatus] = useState("loading");
  const [updatedAt, setUpdatedAt] = useState(null);
  const [error, setError] = useState(null);

  // Held in a ref so the poll can merge without being re-created each tick.
  const weeksRef = useRef([]);
  const statusRef = useRef("loading");

  const commit = (next, nextStatus) => {
    weeksRef.current = next;
    setWeeks(next);
    if (nextStatus) {
      statusRef.current = nextStatus;
      setStatus(nextStatus);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;
    let timer = null;

    const loadBundled = async (reason) => {
      try {
        const rows = await d3.csv("./BTC-USD.csv");
        if (cancelled) return;
        commit(toWeekly(rows, YEARS_BACK), "bundled");
        setError(reason);
      } catch {
        if (!cancelled) setError("No price data available");
      }
    };

    const poll = async () => {
      if (cancelled || statusRef.current !== "live") return;
      if (typeof document !== "undefined" && document.hidden) return;
      try {
        const tick = await fetchTicker({ signal: controller.signal });
        if (cancelled) return;
        commit(mergeLive(weeksRef.current, tick, YEARS_BACK));
        setUpdatedAt(new Date());
        setError(null);
      } catch (err) {
        // A failed poll is not fatal — the chart keeps the data it has.
        if (!cancelled && err?.name !== "AbortError") {
          setError("Live update failed; showing last known prices");
        }
      }
    };

    (async () => {
      try {
        const history = await fetchHistory({
          yearsBack: YEARS_BACK,
          signal: controller.signal,
        });
        if (cancelled) return;
        commit(history, "live");
        setUpdatedAt(new Date());
        await poll(); // top up with the very latest tick immediately
      } catch (err) {
        if (cancelled || err?.name === "AbortError") return;
        await loadBundled("Live feed unreachable; showing bundled data");
      }
      if (!cancelled) timer = setInterval(poll, POLL_MS);
    })();

    // Catch up as soon as the tab comes back into view.
    const onVisible = () => {
      if (!document.hidden) poll();
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      cancelled = true;
      controller.abort();
      if (timer) clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  return { weeks, status, updatedAt, error };
}
