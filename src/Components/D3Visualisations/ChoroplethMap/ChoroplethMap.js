import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import * as topojson from "topojson";

const COLORS = ["#ffeda0", "#f03b20"];

const TYPES = {
  fertilityRate: {
    color: COLORS,
    title: "Fertility Rate",
  },
  medianAge: {
    color: COLORS,
    title: "Median Age",
  },
  population: {
    color: COLORS,
    title: "Population",
  },
};

const FILES = [
  { type: "json", url: "https://unpkg.com/world-atlas@1.1.4/world/50m.json" },
  {
    type: "csv",
    url: "https://gist.githubusercontent.com/mmmaaatttttt/7ca3c5ee12e94d181e20e7444637a713/raw/4477edee37b447cfeba9f4a7dea0c2f55368b337/country_data.csv",
  },
];
const ChoroplethMap = ({ width, height, selectedType }) => {
  const svgRef = useRef();
  const [countryData, setCountries] = useState(null);
  const [populationData, setPopulationData] = useState(null);

  useEffect(() => {
    Promise.all(
      FILES.map((file) => {
        if (file.type === "json") {
          return d3.json(file.url);
        }
        if (file.type === "csv") {
          return d3.csv(file.url);
        }
      })
    ).then(function (values) {
      const geoData = topojson.feature(
        values[0],
        values[0].objects.countries
      ).features;

      const population = values[1];
      let countries = [];
      population.forEach((row) => {
        geoData
          .filter((d) => d.id === row.countryCode)
          .forEach((d) => {
            d.properties = row;
            countries.push(d);
          });
      });
      setPopulationData(population);
      setCountries(countries);
    });
  }, []);

  useEffect(() => {
    if (countryData) {
      const projection = d3
        .geoMercator()
        .scale(75)
        .translate([width / 2, height / 1.4]);

      const path = d3.geoPath().projection(projection);

      d3.select(svgRef.current)
        .attr("width", width)
        .attr("height", height)
        .selectAll(".country")
        .data(countryData)
        .enter()
        .append("path")
        .attr("class", "country")
        .attr("d", path);

      const colorScale = d3
        .scaleLinear()
        .domain([
          0,
          d3.max(populationData, (d) => {
            return parseFloat(d[selectedType]);
          }),
        ])
        .range(TYPES[selectedType].color)
        .clamp(true);

      d3.selectAll(".country")
        .transition()
        .duration(750)
        .ease(d3.easeBackIn)
        .attr("fill", (d) => {
          var data = d.properties[selectedType];
          return data ? colorScale(data) : "#ccc";
        });

      function legend({
        color,
        title,
        tickSize = 6,
        width = 350,
        height = 44 + tickSize,
        marginTop = 18,
        marginRight = 0,
        marginBottom = 16 + tickSize,
        marginLeft = 20,
        ticks = width / 64,
        tickFormat,
        tickValues,
      } = {}) {
        d3.selectAll(`.legendBox`).remove();
        const legendSVG = d3.selectAll(`.legend`);

        const legendBox = legendSVG
          .append("g")
          .attr("class", "legendBox")
          .attr("width", width)
          .attr("height", height)
          .attr("viewBox", [0, 0, width, height])
          .style("overflow", "visible")
          .style("display", "block");

        let tickAdjust = (g) =>
          g
            .selectAll(".tick line")
            .attr("y1", marginTop + marginBottom - height);
        let x;

        x = Object.assign(
          color
            .copy()
            .interpolator(d3.interpolateRound(marginLeft, width - marginRight)),
          {
            range() {
              return [marginLeft, width - marginRight];
            },
          }
        );

        legendBox
          .append("image")
          .attr("x", marginLeft)
          .attr("y", marginTop)
          .attr("width", width - marginLeft - marginRight)
          .attr("height", height - marginTop - marginBottom)
          .attr("preserveAspectRatio", "none")
          .attr("xlink:href", ramp(color.interpolator()).toDataURL());

        legendBox
          .append("g")
          .attr("transform", `translate(0,${height - marginBottom})`)
          .call(
            d3
              .axisBottom(x)
              .ticks(
                ticks,
                typeof tickFormat === "string" ? tickFormat : undefined
              )
              .tickFormat(
                typeof tickFormat === "function" ? tickFormat : undefined
              )
              .tickSize(tickSize)
              .tickValues(tickValues)
          )
          .call(tickAdjust)
          .call((g) => g.select(".domain").remove())
          .call((g) =>
            g
              .append("text")
              .attr("x", marginLeft)
              .attr("y", marginTop + marginBottom - height - 6)
              .attr("fill", "currentColor")
              .attr("text-anchor", "start")
              .attr("font-weight", "bold")
              .text(title)
          );

        return legendBox.node();
      }

      function ramp(color, n = 256) {
        var canvas = document.createElement("canvas");
        canvas.width = n;
        canvas.height = 1;
        const context = canvas.getContext("2d");
        for (let i = 0; i < n; ++i) {
          context.fillStyle = color(i / (n - 1));
          context.fillRect(i, 0, 1, 1);
        }
        return canvas;
      }

      legend({
        color: d3.scaleSequential(
          [
            0,
            d3.max(populationData, (d) => {
              return parseFloat(d[selectedType]);
            }),
          ],
          TYPES[selectedType].color
        ),
        title: TYPES[selectedType].title,
        tickFormat: (d) => {
          if (selectedType === "population") {
            const t = d.toString();
            if (t.length === 9) {
              // millions
              return t.substring(0, 3) + "mi";
            }
            if (t.length === 10) {
              // billions
              return t.substring(0, 4) + "mi";
            }
            return;
          }
          return d;
        },
      });
    }
  }, [countryData, selectedType, width]);

  return (
    <>
      <svg ref={svgRef}>
        <g className="legend">
          <g className="legendBox" />
        </g>
      </svg>
    </>
  );
};

export default ChoroplethMap;
