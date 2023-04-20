import React from "react";
import GridItem from "./GridItem";

const Grid = () => {
  const ITEMS = [
    "rex-ray",
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

  return (
    <div className="container">
      <div className="grid-row">
        {ITEMS.map((item) => {
          return <GridItem id={item} />;
        })}
      </div>
    </div>
  );
};

export default Grid;
