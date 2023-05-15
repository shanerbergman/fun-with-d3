import React, { useState, useEffect } from "react";
import { Tooltip, Button, Radio } from "antd";
import { SyncOutlined } from "@ant-design/icons";
import { useDimensions } from "../../../Utilities/Hooks/useDimensions";
import BarChart from "./BarChart";
import AreaChart from "./AreaChart";
import { HEIGHT_CONSTANT } from "../Constants";
import ControlContainer from "../Controls/ControlContainer";

const CHART_TYPES = [
  {
    label: "Bar",
    value: "bar",
  },
  {
    label: "Area",
    value: "area",
  },
];

function ChartContainer() {
  const [{ height, width }, containerRef] = useDimensions();
  const [data, setData] = useState(null);

  const [chartType, setChartType] = useState("bar");

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
    if (height > 0) {
      generateData();
    }
  }, [height]);

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
      >
        {height > 0 && width > 0 && data && (
          <>
            {chartType === "bar" && (
              <BarChart data={data} height={400} width={width - 10} />
            )}
            {chartType === "area" && (
              <AreaChart data={data} height={400} width={width - 10} />
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
        >
          <Tooltip title={"Update Data"}>
            <Button
              onClick={handleClick}
              shape="circle"
              icon={<SyncOutlined />}
            />
          </Tooltip>
          <Tooltip title={"Chart Type"}>
            <Radio.Group
              options={CHART_TYPES}
              onChange={handleChange}
              value={chartType}
              optionType="button"
              buttonStyle="solid"
            />
          </Tooltip>
        </div>
      </ControlContainer>
    </>
  );
}

export default ChartContainer;
