import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const BarChart = ({ data, width, height }) => {
  const svgRef = useRef();

  useEffect(() => {
    const margin = { top: 60, right: 30, bottom: 40, left: 70 };
    const useableWidth = width - margin.left - margin.right;
    const useableHeight = height - margin.top - margin.bottom;

    // set up svg container
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    d3.csv("widget_sales.csv").then(function (data) {
      data.forEach((d) => {
        d.total = +d.total;
      });

      data.sort((a, b) => d3.descending(a.total, b.total));

      const x = d3
        .scaleLinear()
        .range([0, useableWidth])
        .domain([0, d3.max(data, (d) => d.total)]);

      const y = d3
        .scaleBand()
        .range([0, useableHeight])
        .padding(0.1)
        .domain(data.map((d) => d.type));

      svg
        .selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("y", (d) => y(d.type))
        .attr("height", y.bandwidth())
        .attr("x", 0)
        .attr("width", (d) => x(d.total))
        .style("fill", "steelblue");

      const xAxis = d3.axisBottom(x).ticks(5).tickSize(0);
      const yAxis = d3.axisLeft(y).tickSize(0).tickPadding(10);

      svg
        .append("g")
        .attr("class", "x axis")
        .style("font-size", "10px")
        .attr("transform", `translate(0, ${useableHeight})`)
        .call(xAxis)
        .call((g) => g.select(".domain").remove());

      svg
        .append("g")
        .attr("class", "y axis")
        .style("font-size", "8px")
        .call(yAxis)
        .selectAll("path")
        .style("stroke-width", "1.75px");

      svg.selectAll(".y.axis .tick text").text((d) => d.toUpperCase());

      svg
        .selectAll("line.vertical-grid")
        .data(x.ticks(5))
        .enter()
        .append("line")
        .attr("class", "vertical-grid")
        .attr("x1", (d) => x(d))
        .attr("y1", 0)
        .attr("x2", (d) => x(d))
        .attr("y2", useableHeight)
        .style("stroke", "#e0e0e0")
        .style("stroke-width", 0.5)
        .style("stroke-dasharray", "3 3");

      svg
        .selectAll(".label")
        .data(data)
        .enter()
        .append("text")
        .attr("x", (d) => x(d.total) + 5)
        .attr("y", (d) => y(d.type) + y.bandwidth() / 2)
        .attr("dy", ".35em")
        .style("font-size", "10px")
        .style("font-family", "sans-serif")
        .style("font-weight", "bold")
        .style("fill", "#3c3d28")
        .text((d) => d.total);

      svg
        .append("text")
        .attr(
          "transform",
          "translate(" +
            useableWidth / 2 +
            "," +
            (useableHeight + margin.bottom / 2) +
            ")"
        )
        .style("text-anchor", "middle")
        .style("font-size", "10px")
        .style("font-family", "sans-serif")
        .style("fill", "black")
        .attr("dy", "1.5em")
        .text("Total Sold");

      svg
        .append("text")
        .attr("x", margin.left - 120)
        .attr("y", margin.top - 100)
        .style("font-size", "24px")
        .style("font-weight", "bold")
        .style("font-family", "sans-serif")
        .style("fill", "black")
        .text("Widgets Sold");
    });
  }, [width]);

  return <svg ref={svgRef}></svg>;
};

export default BarChart;
