import React, { useRef, useEffect } from "react";
import { sliderBottom } from "d3-simple-slider";
import * as d3 from "d3";
import ControlContainer from "../Controls/ControlContainer";

const LineChart = ({ width, height }) => {
  const svgRef = useRef();

  useEffect(() => {
    const margin = { top: 60, right: 30, bottom: 40, left: 60 };
    const W = width - margin.left - margin.right;
    const H = height - margin.top - margin.bottom;

    // set up svg container
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("class", "line-chart")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const tooltip = d3
      .select(".chart-container")
      .append("div")
      .attr("class", "tooltip");

    const x = d3.scaleTime().range([0, W]);

    const y = d3.scaleLinear().range([H, 0]);

    d3.csv("/jdi_data_daily.csv").then(function (data) {
      // Parse the date and convert the population to a number
      const parseDate = d3.timeParse("%Y-%m-%d");
      data.forEach((d) => {
        d.date = parseDate(d.date);
        d.population = +d.population;
      });

      // Define the x and y domains

      x.domain(d3.extent(data, (d) => d.date));
      y.domain([85000, d3.max(data, (d) => d.population)]);

      // Add the x-axis
      svg
        .append("g")
        .attr("transform", `translate(0,${H})`)
        .style("font-size", "14px")
        .call(
          d3
            .axisBottom(x)
            .tickValues(x.ticks(d3.timeMonth.every(6)))
            .tickFormat(d3.timeFormat("%b %Y"))
        )
        .call((g) => g.select(".domain").remove())
        .selectAll(".tick line")
        .style("stroke-opacity", 0);
      svg.selectAll(".tick text").attr("fill", "#777");

      // Add the y-axis
      svg
        .append("g")
        .style("font-size", "14px")
        .call(
          d3
            .axisLeft(y)
            .ticks((d3.max(data, (d) => d.population) - 85000) / 5000)
            .tickFormat((d) => {
              return `${(d / 1000).toFixed(0)}k`;
            })
            .tickSize(0)
            .tickPadding(5)
        )
        .call((g) => g.select(".domain").remove())
        .selectAll(".tick text")
        .style("fill", "#777")
        .style("visibility", (d, i, nodes) => {
          if (i === 0) {
            return "hidden";
          } else {
            return "visible";
          }
        });

      // Add vertical gridlines
      svg
        .selectAll("xGrid")
        .data(x.ticks().slice(1))
        .join("line")
        .attr("x1", (d) => x(d))
        .attr("x2", (d) => x(d))
        .attr("y1", 0)
        .attr("y2", H)
        .attr("stroke", "#e0e0e0")
        .attr("stroke-width", 0.5);

      // // Add horizontal gridlines

      svg
        .selectAll("yGrid")
        .data(
          y.ticks((d3.max(data, (d) => d.population) - 65000) / 5000).slice(1)
        )
        .join("line")
        .attr("x1", 0)
        .attr("x2", W)
        .attr("y1", (d) => y(d))
        .attr("y2", (d) => y(d))
        .attr("stroke", "#e0e0e0")
        .attr("stroke-width", 0.5);

      // Create the line generator

      const line = d3
        .line()
        .x((d) => x(d.date))
        .y((d) => y(d.population));

      // Add the line path to the SVG element

      svg
        .append("path")
        .datum(data)
        .attr("class", "line-chart-line")
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1)
        .attr("d", line);

      const circle = svg
        .append("circle")
        .attr("r", 0)
        .attr("fill", "steelblue")
        .style("stroke", "white")
        .attr("opacity", 0.7)
        .style("pointer-events", "none");

      const listeningRect = svg
        .append("rect")
        .attr("class", "listening-rect")
        .attr("width", W)
        .attr("height", H);

      listeningRect.on("mousemove", (event) => {
        const [xCoord] = d3.pointer(event);
        const bisectDate = d3.bisector((d) => d.date).left;
        const x0 = x.invert(xCoord);
        const i = bisectDate(data, x0, 1);
        const d0 = data[i - 1];
        const d1 = data[i];
        const d = x0 - d0.date > d1.date - x0 ? d1 : d0;
        const xPosition = x(d.date);
        const yPosition = y(d.population);

        circle.attr("cx", xPosition).attr("cy", yPosition);

        circle.transition().duration(50).attr("r", 5);

        tooltip
          .style("display", "block")
          .style("left", `${xPosition + 20}px`)
          .style("top", `${yPosition + margin.top}px`)
          .html(
            `<strong>Date:</strong> ${d.date.toLocaleDateString()}<br><strong>Population:</strong> ${
              d.population !== undefined
                ? (d.population / 1000).toFixed(0) + "k"
                : "N/A"
            }`
          );
      });
      // // Add the chart title

      listeningRect.on("mouseleave", () => {
        circle.transition().duration(50).attr("r", 0);
        tooltip.style("display", "none");
      });

      const slider = sliderBottom()
        .min(d3.min(data, (d) => d.date))
        .max(d3.max(data, (d) => d.date))
        .width(300)
        .tickFormat(d3.timeFormat("%Y-%m-%d"))
        .ticks(3)
        .default([d3.min(data, (d) => d.date), d3.max(data, (d) => d.date)])
        .fill("steelblue");

      slider.on("onchange", (val) => {
        // Set new domain for x scale
        x.domain(val);

        // Filter data based on slider values
        const filteredData = data.filter(
          (d) => d.date >= val[0] && d.date <= val[1]
        );

        // Update the line and area to new domain
        svg.select(".line-chart-line").attr("d", line(filteredData));

        // Set new domain for y scale based on new data
        y.domain([85000, d3.max(filteredData, (d) => d.population)]);

        // Update the x-axis with new domain
        svg
          .select(".x-axis")
          .transition()
          .duration(300) // transition duration in ms
          .call(
            d3
              .axisBottom(x)
              .tickValues(x.ticks(d3.timeYear.every(1)))
              .tickFormat(d3.timeFormat("%Y"))
          );

        // Update the y-axis with new domain
        svg
          .select(".y-axis")
          .transition()
          .duration(300) // transition duration in ms
          .call(
            d3
              .axisRight(y)
              .ticks(10)
              .tickFormat((d) => {
                if (d <= 0) return "";
                return `$${d.toFixed(2)}`;
              })
          );
      });

      const gRange = d3
        .select("#slider-line-chart")
        .append("svg")
        .attr("width", 500)
        .attr("height", 100)
        .append("g")
        .attr("transform", "translate(90,30)");

      gRange.call(slider);

      svg
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - H / 2)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("font-size", "14px")
        .style("fill", "#777")
        .style("font-family", "sans-serif")
        .text("Total Population");

      svg
        .append("text")
        .attr("class", "chart-title")
        .attr("x", margin.left - 115)
        .attr("y", margin.top - 100)
        .style("font-size", "24px")
        .style("font-weight", "bold")
        .style("font-family", "sans-serif")
        .text("US Prison Populations");
    });
  }, []);

  return (
    <div>
      <div className="lineDiv">
        <svg ref={svgRef}></svg>
      </div>
      <ControlContainer>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: { width },
          }}
        >
          <div style={{ fontSize: "11px" }}>
            Data Source: Jail Data Initiative
          </div>
          <div id="slider-line-chart"></div>
        </div>
      </ControlContainer>
    </div>
  );
};

export default LineChart;
