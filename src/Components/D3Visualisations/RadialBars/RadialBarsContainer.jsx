import React, { useState, useEffect, useRef } from "react";
import useResizeObserver from "../../../Utilities/Hooks/useResizeObserver";
import RadialBarChart from "./RadialBarChart";
import useLivePrices from "./useLivePrices";

const CANVAS_HEIGHT = 340;

const fmtClock = new Intl.DateTimeFormat(undefined, {
  hour: "2-digit",
  minute: "2-digit",
});

const RadialBarsContainer = () => {
  const containerRef = useRef();
  const dimensions = useResizeObserver(containerRef);
  const [width, setWidth] = useState(0);

  const { weeks, status, updatedAt, error } = useLivePrices();

  useEffect(() => {
    if (dimensions) setWidth(dimensions.width);
  }, [dimensions]);

  const label =
    status === "loading"
      ? "Loading prices…"
      : status === "live"
      ? `Live · Coinbase · updated ${updatedAt ? fmtClock.format(updatedAt) : "—"}`
      : "Bundled data · live feed unavailable";

  return (
    <>
      <div className="viz-card__body radial-body" ref={containerRef}>
        {width > 0 && (
          <RadialBarChart
            width={width}
            height={CANVAS_HEIGHT}
            weeks={weeks}
          />
        )}
      </div>
      <div className="viz-card__foot">
        <span className={`feed feed--${status}`}>
          <span className="feed__dot" aria-hidden="true" />
          {label}
        </span>
        <span className="viz-card__note radial__hint">
          {error || "Hover the ring for that week’s close"}
        </span>
      </div>
    </>
  );
};

export default RadialBarsContainer;
