import React, { useState } from "react";
import { Select, Space } from "antd";
import { useDimensions } from "../../../Utilities/Hooks/useDimensions";
import ChoroplethMap from "./ChoroplethMap";
import ControlContainer from "../Controls/ControlContainer";

const ChoroplethMapContainer = () => {
  const [{ height, width }, containerRef] = useDimensions();
  const [selectedType, setSelectedType] = useState("fertilityRate");

  const handleChange = (e) => setSelectedType(e);

  return (
    <>
      <div
        ref={containerRef}
        style={{
          minHeight: "400px",
          width: "100%",
        }}
      >
        <ChoroplethMap width={width} height={400} selectedType={selectedType} />
      </div>
      <ControlContainer>
        <Space wrap>
          <Select
            defaultValue="fertilityRate"
            style={{ width: 200 }}
            onChange={handleChange}
            options={[
              { value: "fertilityRate", label: "Fertility Rate" },
              { value: "medianAge", label: "Median Age" },
              { value: "population", label: "Population" },
            ]}
          />
        </Space>
      </ControlContainer>
    </>
  );
};

export default ChoroplethMapContainer;
