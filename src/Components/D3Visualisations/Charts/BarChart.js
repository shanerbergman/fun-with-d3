import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const BarChart = ({ data, width, height }) => {
  const svgRef = useRef();

  useEffect(() => {
    // set up svg container
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .style("overflow", "visible");

    // set up svg scale
    const xScale = d3
      .scaleBand()
      .domain(data.map((val, i) => i))
      .range([0, width])
      .padding(0.5);

    const yScale = d3.scaleLinear().domain([0, height]).range([height, 0]);

    // set up color scale
    const colorScale = d3
      .scaleLinear()
      .domain([25, 150])
      .range(["#D13D73", "#2db89a"])
      .clamp(true);

    // set up the axes
    const xAxis = d3.axisBottom(xScale).ticks(data.length);
    svg
      .select(`.x-axis`)
      .style(`transform`, `translatey(${height}px)`)
      .call(xAxis);

    const yAxis = d3.axisLeft(yScale).ticks(5);
    svg
      .select(`.y-axis`)
      .style(`transform`, `translatex${width}px`)
      .call(yAxis);

    // set the data
    svg
      .selectAll(`.bar`)
      .data(data)
      .join(`rect`)
      .attr(`class`, `bar`)
      .style(`transform`, `scale(1,-1)`)
      .attr(`x`, (v, i) => xScale(i))
      .attr(`y`, -height)
      .attr(`width`, xScale.bandwidth())
      .on("mouseenter", (event, value) => {
        const index = svg.selectAll(".bar").nodes().indexOf(event.target);
        svg
          .selectAll(".tooltip")
          .data([value])
          .join((enter) => enter.append("text").attr("y", yScale(value) - 4))
          .attr("class", "tooltip")
          .text(value.toFixed(1))
          .attr("x", xScale(index) + xScale.bandwidth() / 2)
          .attr("text-anchor", "middle")
          .transition()
          .attr("y", yScale(value) - 8)
          .attr("opacity", 1);
        svg.selectAll(".bar").attr("opacity", (d, i) => {
          return index === i ? 0.5 : 1;
        });
      })
      .on("mouseleave", () => svg.select(".tooltip").remove())
      .transition()
      .attr("fill", colorScale)
      .attr(`height`, (val) => height - yScale(val));
  }, [data, width]);

  return (
    <svg ref={svgRef}>
      <g className="x-axis" />
      <g className="y-axis" />
    </svg>
  );
};

export default BarChart;
