import React, { useState, useEffect, useRef } from "react";
import useResizeObserver from "../../../Utilities/Hooks/useResizeObserver";
import ChoroplethMap from "./ChoroplethMap";
import Select from "../../UI/Select";

const OPTIONS = [
  { value: "fertilityRate", label: "Fertility Rate" },
  { value: "medianAge", label: "Median Age" },
  { value: "population", label: "Population" },
];

const ChoroplethMapContainer = () => {
  const containerRef = useRef();
  const dimensions = useResizeObserver(containerRef);
  const [width, setWidth] = useState(0);
  const [selectedType, setSelectedType] = useState("fertilityRate");

  useEffect(() => {
    if (dimensions) setWidth(dimensions.width);
  }, [dimensions]);

  return (
    <>
      <div className="viz-card__body map-body" ref={containerRef}>
        {width > 0 && (
          <ChoroplethMap
            key={`choropleth_${width}`}
            width={width}
            height={340}
            selectedType={selectedType}
          />
        )}
      </div>
      <div className="viz-card__foot">
        <Select
          label="Measure"
          value={selectedType}
          options={OPTIONS}
          onChange={setSelectedType}
        />
      </div>
    </>
  );
};

export default ChoroplethMapContainer;
