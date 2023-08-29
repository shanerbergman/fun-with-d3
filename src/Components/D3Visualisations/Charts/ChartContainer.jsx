import React, { useState, useEffect, useRef } from "react";
import useResizeObserver from "../../../Utilities/Hooks/useResizeObserver";
import BarChart from "./BarChart";
import LineChart from "./LineChart";
import AreaChart from "./AreaChart";
import ControlContainer from "../Controls/ControlContainer";
import "./chart.css";

function ChartContainer({ type, source }) {
  const containerRef = useRef();
  const dimensions = useResizeObserver(containerRef);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (dimensions) {
      const { width } = dimensions;
      setWidth(width);
    }
  }, [dimensions]);

  return (
    <>
      <div
        ref={containerRef}
        style={{
          minHeight: "400px",
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
        className={"chart-container"}
      >
        {width > 0 && (
          <>
            {type === "line" && (
              <LineChart
                key={`line_${width}`}
                height={400}
                width={width - 10}
              />
            )}

            {type === "bar" && (
              <BarChart key={`bar_${width}`} height={400} width={width - 10} />
            )}

            {type === "area" && (
              <AreaChart
                key={`area_${width}`}
                height={400}
                width={width - 10}
              />
            )}
          </>
        )}
      </div>

      {source && (
        <ControlContainer>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "175px",
            }}
          >
            <div style={{ fontSize: "11px" }}>Data Source: {source}</div>
          </div>
        </ControlContainer>
      )}
    </>
  );
}

export default ChartContainer;
