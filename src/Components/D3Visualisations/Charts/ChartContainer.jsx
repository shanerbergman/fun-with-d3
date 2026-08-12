import React, { useState, useEffect, useRef } from "react";
import useResizeObserver from "../../../Utilities/Hooks/useResizeObserver";
import BarChart from "./BarChart";
import LineChart from "./LineChart";
import AreaChart from "./AreaChart";

const CHART_HEIGHT = 420;

/**
 * Per-type card chrome. `sliderId` is the mount point the d3-simple-slider
 * range control attaches to — it lives in the card footer, so the chart body
 * stays purely plot.
 */
const META = {
  line: {
    source: "Jail Data Initiative",
    tech: "d3-scaleTime · bisector hover",
    sliderId: "slider-line-chart",
  },
  area: {
    source: "Yahoo Finance",
    tech: "d3-area · linearGradient",
    sliderId: "slider-area-chart",
  },
  bar: {
    source: "Sample dataset",
    tech: "d3-scaleBand",
  },
};

function ChartContainer({ type }) {
  const containerRef = useRef();
  const dimensions = useResizeObserver(containerRef);
  const [width, setWidth] = useState(0);

  const meta = META[type] ?? {};

  useEffect(() => {
    if (dimensions) setWidth(dimensions.width);
  }, [dimensions]);

  return (
    <>
      <div
        className="viz-card__body chart-body"
        ref={containerRef}
      >
        {width > 0 && (
          <>
            {type === "line" && (
              <LineChart
                key={`line_${width}`}
                height={CHART_HEIGHT}
                width={width}
              />
            )}
            {type === "area" && (
              <AreaChart
                key={`area_${width}`}
                height={CHART_HEIGHT}
                width={width}
              />
            )}
            {type === "bar" && (
              <BarChart
                key={`bar_${width}`}
                height={CHART_HEIGHT}
                width={width}
              />
            )}
          </>
        )}
      </div>
      <div className="viz-card__foot">
        <span className="viz-card__note">
          Data source: {meta.source} · {meta.tech}
        </span>
        {meta.sliderId && (
          <div className="slider-mount" id={meta.sliderId} aria-hidden="true" />
        )}
      </div>
    </>
  );
}

export default ChartContainer;
