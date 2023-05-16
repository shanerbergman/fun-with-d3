import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const AreaChart = ({ data, width, height }) => {
  const svgRef = useRef();

  useEffect(() => {
    // set up svg container
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .style("overflow", "visible");

    // remove old area svg
    svg.selectAll(".area").remove();

    // create scales
    const xScale = d3
      .scaleLinear()
      .domain([0, data.length - 1])
      .range([0, width]);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data)])
      .range([height, 0]);

    // create area
    const area = d3
      .area()
      .x((d, i) => xScale(i))
      .y0(height)
      .y1((d) => yScale(d))
      .curve(d3.curveCardinal);

    // append new area to svg
    const areaPath = svg.selectAll(".area").data([data]);

    areaPath
      .enter()
      .append("g")
      .attr("class", "area")
      .append("path")
      .attr("fill", "steelblue")
      .merge(areaPath)
      .transition()
      .duration(500)
      .attr("d", area);
    // add axis
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(xAxis)
      .attr("class", "area");

    svg.append("g").call(yAxis).attr("class", "area");
  }, [data, width, height]);

  return (
    <>
      <svg ref={svgRef}>
        <g className="x-axis" />
        <g className="y-axis" />
      </svg>
    </>
  );
};

export default AreaChart;

/* CHAT GPT TRANSITION

    // set up svg container
    const svg = d3.select(svgRef.current);

    // create scales
    const xScale = d3
      .scaleLinear()
      .domain([0, data.length - 1])
      .range([0, width]);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data)])
      .range([height, 0]);

    // create area
    const area = d3
      .area()
      .x((d, i) => xScale(i))
      .y0(height)
      .y1((d) => yScale(d))
      .curve(d3.curveCardinal);

    // select the existing area path or create a new one
    const areaPath = svg.select(".area path").empty()
      ? svg.append("g").attr("class", "area").append("path")
      : svg.select(".area path");

    // animate transition for data change
    areaPath
      .datum(data)
      .transition()
      .duration(500)
      .attr("d", area)
      .attr("fill", "steelblue");

    // update axis
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    svg
      .select(".x-axis")
      .attr("transform", `translate(0,${height})`)
      .call(xAxis);

    svg.select(".y-axis").call(yAxis);
    */
