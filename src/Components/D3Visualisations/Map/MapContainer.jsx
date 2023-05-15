import React, { useState, useEffect, useRef } from "react";
import { Tooltip, Button } from "antd";
import useResizeObserver from "../../../Utilities/Hooks/useResizeObserver";
import Map from "./Map";
import ControlContainer from "../Controls/ControlContainer";

const MapContainer = () => {
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
          minHeight: "200px",
          width: "100%",
        }}
      >
        {width > 0 && <Map width={width} height={400} />}
      </div>
      <ControlContainer></ControlContainer>
    </>
  );
};

export default MapContainer;
