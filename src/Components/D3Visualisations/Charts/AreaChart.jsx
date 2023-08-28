import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const AreaChart = ({ width, height }) => {
  const svgRef = useRef();

  useEffect(() => {
    const margin = { top: 60, right: 70, bottom: 40, left: 70 };
    const useableWidth = width - margin.left - margin.right;
    const useableHeight = height - margin.top - margin.bottom;

    // set up svg container
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const x = d3.scaleTime().range([0, useableWidth]);

    const y = d3.scaleLinear().range([useableHeight, 0]);

    d3.csv("./BTC-USD.csv").then((data) => {
      const parseDate = d3.timeParse("%Y-%m-%d");
      data.forEach((d) => {
        d.Date = parseDate(d.Date);
        d.Close = +d.Close;
      });

      x.domain(d3.extent(data, (d) => d.Date));
      y.domain([0, d3.max(data, (d) => d.Close)]);
      // add x axis
      svg
        .append("g")
        .attr("transform", `translate(0, ${useableHeight})`)
        .call(d3.axisBottom(x));
      // add y axis
      svg.append("g").call(d3.axisLeft(y));
      svg
        .append("g")
        .attr("transform", `translate(${useableWidth}, 0)`)
        .call(d3.axisRight(y));
      // create line
      const line = d3
        .line()
        .x((d) => x(d.Date))
        .y((d) => y(d.Close));

      // create area

      const area = d3
        .area()
        .x((d) => x(d.Date))
        .y0(useableHeight)
        .y1((d) => y(d.Close));

      svg
        .append("path")
        .datum(data)
        .attr("clas", "area")
        .attr("d", area)
        .style("fill", "steelblue")
        .style("opacity", 0.45);

      svg
        .append("path")
        .datum(data)
        .attr("class", "line")
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1)
        .attr("d", line);
    });
  }, [width]);

  return (
    <>
      <svg ref={svgRef}></svg>
    </>
  );
};

export default AreaChart;
