import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const VerticalProgress = ({ height, progressPercentage, colorIndicator }) => {
  const svgRef = useRef();
  const segmentWidth = 50;
  console.log(height);
  console.log(progressPercentage);
  const calculateProgressHeight = () => {
    const progressFill = height * (progressPercentage / 100);

    //if (progressFill < 10) return 10;
    return progressFill;
  };

  useEffect(() => {
    const svg = d3
      .select(svgRef.current)
      .attr("width", 100)
      .attr("height", height)
      .style("overflow", "visible");

    /*svg
      .append("rect")
      .attr("class", "bg-rect")
      .attr("ry", 10)
      .attr("fill", "gray")
      .attr("height", height)
      .attr("width", 20)
      .attr("x", 0);*/

    svg
      .select(`.vertical-bar`)
      .attr("height", calculateProgressHeight())
      .attr("width", 20)
      .attr("y", 0);
  }, [progressPercentage]);

  return (
    <svg ref={svgRef}>
      <rect
        className="bar-background"
        fill="grey"
        height={height}
        width="20"
      ></rect>
      <rect className="vertical-bar" fill={colorIndicator}></rect>
    </svg>
  );
};

export default VerticalProgress;

/*
  useEffect(() => {
    const svg = d3
      .select(svgRef.current)
      .attr("width", 100)
      .attr("height", height)
      .style("overflow", "visible");

    svg
      .append("rect")
      .attr("class", "bg-rect")
      .attr("ry", 10)
      .attr("fill", "gray")
      .attr("height", height)
      .attr("width", 20)
      .attr("x", 0);
    if (progressPercentage > 2) {
      svg
        .append("rect")
        .attr("class", "vertical-bar")
        .attr("ry", 10)
        .attr("fill", "red")
        .attr("height", calculateProgressHeight())
        .attr("width", 20)
        .attr("x", 0);
    }
  }, [progressPercentage]);
  */
