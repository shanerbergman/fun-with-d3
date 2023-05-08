// BarChart.js
import React, { useState, useEffect } from "react";
import { Tooltip, Button } from "antd";
import { SyncOutlined } from "@ant-design/icons";
import { useDimensions } from "../../../Utilities/Hooks/useDimensions";
import Chart from "./Chart";
import { HEIGHT_CONSTANT } from "../Constants";
import ControlContainer from "../Controls/ControlContainer";

function BarChartContainer() {
  const [{ height, width }, containerRef] = useDimensions();
  const [data, setData] = useState(null);

  const handleClick = () => {
    generateData();
  };

  const generateData = () => {
    const data = [];
    const count = Math.floor(Math.random() * (14 - 7 + 1) + 7);
    for (let i = 0; i <= count; i++) {
      const d = Math.random() * (height - 15 - 25);
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
          minHeight: "200px",
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        {height > 0 && width > 0 && data && (
          <Chart
            data={data}
            height={height - HEIGHT_CONSTANT}
            width={width - 10}
          />
        )}
      </div>
      <ControlContainer>
        <Tooltip title={"Update Data"}>
          <Button
            onClick={handleClick}
            shape="circle"
            icon={<SyncOutlined />}
          />
        </Tooltip>
      </ControlContainer>
    </>
  );
}

export default BarChartContainer;
