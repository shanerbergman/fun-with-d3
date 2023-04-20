import React from "react";
import ChartHeader from "./ChartHeader";

const ChartContainer = ({ children }) => {
  return (
    <div
      style={{
        border: "solid 1px black",
        height: "100%",
        width: "100%",
        backgroundColor: "#f0f8ff",
      }}
    >
      <ChartHeader />
      {children}
    </div>
  );
};

export default ChartContainer;
