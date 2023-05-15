import React, { useState } from "react";
import { Tooltip, Button } from "antd";
import { useDimensions } from "../../../Utilities/Hooks/useDimensions";
import Map from "./Map";
import ControlContainer from "../Controls/ControlContainer";

const MapContainer = () => {
  const [{ height, width }, containerRef] = useDimensions();

  return (
    <>
      <div
        ref={containerRef}
        style={{
          minHeight: "200px",
          width: "100%",
        }}
      >
        <Map width={width} height={400} />
      </div>
      <ControlContainer></ControlContainer>
    </>
  );
};

export default MapContainer;
