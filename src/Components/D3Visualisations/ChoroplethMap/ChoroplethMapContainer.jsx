import React, { useState, useEffect, useRef } from "react";
import { Select, Space } from "antd";
import useResizeObserver from "../../../Utilities/Hooks/useResizeObserver";
import ChoroplethMap from "./ChoroplethMap";
import ControlContainer from "../Controls/ControlContainer";

const ChoroplethMapContainer = () => {
  const containerRef = useRef();
  const dimensions = useResizeObserver(containerRef);
  const [width, setWidth] = useState(0);
  const [selectedType, setSelectedType] = useState("fertilityRate");

  const handleChange = (e) => setSelectedType(e);

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
        }}
      >
        {width > 0 && (
          <ChoroplethMap
            key={`choropleth_${width}`}
            width={width}
            height={400}
            selectedType={selectedType}
          />
        )}
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
