import React, { useState, useEffect, useRef } from "react";
import { Tooltip, Button, Radio } from "antd";
import { SyncOutlined } from "@ant-design/icons";
import useResizeObserver from "../../../Utilities/Hooks/useResizeObserver";
import BarChart from "./BarChart";
import LineChart from "./LineChart";
import ScatterChart from "./ScatterChart";
import AreaChart from "./AreaChart";
import ControlContainer from "../Controls/ControlContainer";

const CHART_TYPES = [
  {
    label: "Bar",
    value: "bar",
  },
  {
    label: "Scatter",
    value: "scatter",
  },
  {
    label: "Area",
    value: "area",
  },
];

function ChartContainer({ type }) {
  const containerRef = useRef();
  const dimensions = useResizeObserver(containerRef);
  const [width, setWidth] = useState(0);
  const [data, setData] = useState(null);

  const [chartType, setChartType] = useState("line");

  const handleClick = () => {
    generateData();
  };

  const handleChange = (e) => {
    setChartType(e.target.value);
  };

  const generateData = () => {
    const data = [];
    const count = Math.floor(Math.random() * (14 - 7 + 1) + 7);
    for (let i = 0; i <= count; i++) {
      const d = Math.random() * (400 - 15 - 25);
      data.push(d);
    }

    setData(data);
  };

  useEffect(() => {
    if (width > 0) {
      generateData();
    }
  }, [width]);

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
        {width > 0 && data && (
          <>
            {type === "line" && (
              <LineChart
                key={`line_${width}`}
                data={data}
                height={400}
                width={width - 10}
              />
            )}

            {type === "bar" && (
              <BarChart
                key={`bar_${width}`}
                data={data}
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
