import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const ScatterChart = ({ data, height, width }) => {
  const svgRef = useRef();

  const generateData = () => {
    const data = [];
    const count = Math.floor(Math.random() * (500 - 7 + 1) + 7);
    for (let i = 0; i <= count; i++) {
      const x = Math.random() * (400 - 15 - 25);
      const y = Math.random() * (400 - 15 - 25);
      data.push({ GrLivArea: x, SalePrice: y });
    }

    return data;
  };

  useEffect(() => {
    const data = generateData();

    // set up svg container
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .style("overflow", "visible");

    debugger;
    // Add X axis
    var x = d3.scaleLinear().domain([0, 400]).range([0, width]);
    svg
      .select(".x-axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3.scaleLinear().domain([0, 400]).range([height, 0]);
    svg.select(".y-axis").call(d3.axisLeft(y));

    // Add dots
    svg
      .selectAll("dots")
      .remove()
      .append("g")
      .attr(`class`, `dots`)
      .selectAll("dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", function (d) {
        return x(d.GrLivArea);
      })
      .attr("cy", function (d) {
        return y(d.SalePrice);
      })
      .attr("r", 1.5)
      .style("fill", "#69b3a2");
  }, [data, width]);

  return (
    <svg ref={svgRef}>
      <g className="x-axis" />
      <g className="y-axis" />
    </svg>
  );
};

export default ScatterChart;
