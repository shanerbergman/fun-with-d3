import React, { useState } from "react";
import GridItem from "./GridItem";
import FullScreenItem from "../FullScreenItem/FullScreenItem";
const Grid = () => {
  const [fullScreen, setFullScreen] = useState(null);
  const ITEMS = [
    "circleAnimations",
    "sputnik",
    "edgex",
    "openswitch",
    "scaleio",
    "csi",
    "kubernetes",
    "grpc",
    "envoy",
    "istio",
  ];

  const toggleFullScreen = (id) => {
    if (id === fullScreen) {
      setFullScreen(null);
    } else {
      setFullScreen(id);
    }
  };
  return (
    <div className="container">
      {fullScreen ? (
        <FullScreenItem id={fullScreen} toggleFullScreen={toggleFullScreen} />
      ) : (
        <div className="grid-row">
          {ITEMS.map((item) => {
            return <GridItem toggleFullScreen={toggleFullScreen} id={item} />;
          })}
        </div>
      )}
    </div>
  );
};

export default Grid;
