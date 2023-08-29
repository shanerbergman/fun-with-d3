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

    const tooltip = d3
      .select(".areaDiv")
      .append("div")
      .attr("class", "tooltip");

    const tooltipRawDate = d3
      .select(".areaDiv")
      .append("div")
      .attr("class", "tooltip");

    const gradient = svg
      .append("defs")
      .append("linearGradient")
      .attr("id", "gradient")
      .attr("x1", "0%")
      .attr("x2", "0%")
      .attr("y1", "0%")
      .attr("y2", "100%")
      .attr("spreadMethod", "pad");

    gradient
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#f7941D")
      .attr("stop-opacity", 1);

    gradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#f7941D")
      .attr("stop-opacity", 0);

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
        .style("font-size", "14px")
        .call(
          d3
            .axisBottom(x)
            .tickValues(x.ticks(d3.timeYear.every(1)))
            .tickFormat(d3.timeFormat("%Y"))
        )
        .selectAll(".tick line")
        .style("stroke-opacity", 1);

      // add y axis
      svg.append("g").call(d3.axisLeft(y));
      svg
        .append("g")
        .attr("transform", `translate(${useableWidth}, 0)`)
        .style("font-size", "14px")
        .call(
          d3
            .axisRight(y)
            .ticks(8)
            .tickFormat((d) => {
              if (isNaN(d)) return;
              return `$${d
                .toFixed(0)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
            })
        );
      svg.selectAll(".tick text").attr("fill", "#777");
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
        .style("fill", "url(#gradient)");

      const path = svg
        .append("path")
        .datum(data)
        .attr("class", "line")
        .attr("fill", "none")
        .attr("stroke", "#f7941D")
        .attr("stroke-width", 1)
        .attr("d", line);

      const circle = svg
        .append("circle")
        .attr("r", 0)
        .attr("fill", "red")
        .style("stroke", "white")
        .attr("opacity", 0.7)
        .style("pointer-events", "none");

      const tooltipLineX = svg
        .append("line")
        .attr("class", "tooltip-line")
        .attr("id", "tooltip-line-x")
        .attr("stroke", "red")
        .attr("stroke-width", 1)
        .attr("stroke-dasharray", "2,2");

      const tooltipLineY = svg
        .append("line")
        .attr("class", "tooltip-line")
        .attr("id", "tooltip-line-y")
        .attr("stroke", "red")
        .attr("stroke-width", 1)
        .attr("stroke-dasharray", "2,2");

      const listeningRect = svg
        .append("rect")
        .attr("class", "listening-rect")
        .attr("width", width)
        .attr("height", height);

      listeningRect.on("mousemove", (event) => {
        const [xCoord] = d3.pointer(event, this);
        const bisectDate = d3.bisector((d) => d.Date).left;
        const x0 = x.invert(xCoord);
        const i = bisectDate(data, x0, 1);
        const d0 = data[i - 1];
        const d1 = data[i];
        const d = x0 - d0.Date > d1.Date - x0 ? d1 : d0;
        const xPos = x(d.Date);
        const yPos = y(d.Close);

        circle.attr("cx", xPos).attr("cy", yPos);
        circle.transition().duration(50).attr("r", 5);

        tooltipLineX
          .style("display", "block")
          .attr("x1", xPos)
          .attr("x2", xPos)
          .attr("y1", 0)
          .attr("y2", useableHeight);
        tooltipLineY
          .style("display", "block")
          .attr("y1", yPos)
          .attr("y2", yPos)
          .attr("x1", 0)
          .attr("x2", useableWidth);

        tooltip
          .style("display", "block")
          .style("left", `${useableWidth + 100}px`)
          .style("top", `${yPos + 120}px`)
          .html(`$${d.Close !== undefined ? d.Close.toFixed(2) : "N/A"}`);

        tooltipRawDate
          .style("display", "block")
          .style("left", `${xPos + 60}px`)
          .style("top", `${useableHeight + 140}px`)
          .html(
            `${
              d.Date !== undefined ? d.Date.toISOString().slice(0, 10) : "N/A"
            }`
          );
      });

      listeningRect.on("mouseout", () => {
        circle.transition().duration(50).attr("r", 0);
        tooltip.style("display", "none");
        tooltipRawDate.style("display", "none");
        tooltipLineX.attr("x1", 0).attr("x2", 0);
        tooltipLineY.attr("y1", 0).attr("y2", 0);
        tooltipLineX.style("display", "none");
        tooltipLineY.style("display", "none");
      });

      svg
        .append("text")
        .attr("class", "chart-title")
        .attr("x", margin.left - 115)
        .attr("y", margin.top - 100)
        .style("font-size", "20px")
        .style("font-weight", "bold")
        .style("font-family", "sans-serif")
        .text("Bitcoin Price (USD)");
    });
  }, [width]);

  return (
    <div className="areaDiv">
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default AreaChart;
