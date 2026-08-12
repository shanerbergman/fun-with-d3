import React, { useState, useEffect, useRef } from "react";
import useResizeObserver from "../../../Utilities/Hooks/useResizeObserver";
import Map from "./Map";

const MapContainer = () => {
  const containerRef = useRef();
  const dimensions = useResizeObserver(containerRef);
  const [width, setWidth] = useState(0);
  const [stateInfo, setStateInfo] = useState(null);

  useEffect(() => {
    if (dimensions) setWidth(dimensions.width);
  }, [dimensions]);

  return (
    <>
      <div className="viz-card__body map-body" ref={containerRef}>
        {width > 0 && (
          <Map width={width} height={340} setStateInfo={setStateInfo} />
        )}
      </div>
      <div className="viz-card__foot">
        <span className={`readout${stateInfo ? "" : " readout--empty"}`}>
          {stateInfo || "Hover a state for its name"}
        </span>
      </div>
    </>
  );
};

export default MapContainer;
