import React, { useState, useEffect, useRef } from "react";
import { Tooltip, Button } from "antd";
import useResizeObserver from "../../../Utilities/Hooks/useResizeObserver";
import Map from "./Map";
import ControlContainer from "../Controls/ControlContainer";

const MapContainer = () => {
  const containerRef = useRef();
  const dimensions = useResizeObserver(containerRef);
  const [width, setWidth] = useState(0);
  const [stateInfo, setStateInfo] = useState(null);

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
          <Map width={width} height={400} setStateInfo={setStateInfo} />
        )}
      </div>
      <ControlContainer>
        <div style={{ height: "32px" }}>
          {stateInfo ? stateInfo : "Hover over state for State Name"}
        </div>
      </ControlContainer>
    </>
  );
};

export default MapContainer;
