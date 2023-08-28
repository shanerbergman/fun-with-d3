import React, { useState, useEffect, useRef } from "react";
import { Tooltip, Button, Radio } from "antd";
import { SyncOutlined } from "@ant-design/icons";
import useResizeObserver from "../../../Utilities/Hooks/useResizeObserver";
import BarChart from "./BarChart";
import LineChart from "./LineChart";
import ScatterChart from "./ScatterChart";
import AreaChart from "./AreaChart";
import ControlContainer from "../Controls/ControlContainer";

function ChartContainer({ type }) {
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

      <ControlContainer>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "175px",
          }}
        ></div>
      </ControlContainer>
    </>
  );
}

export default ChartContainer;
