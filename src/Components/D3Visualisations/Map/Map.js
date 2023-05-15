import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import * as topojson from "topojson";

const Map = ({ width, height }) => {
  const svgRef = useRef();

  const getData = () => {
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    const projection = d3.geoAlbersUsa().scale(1300).translate([487.5, 305]);
    const path = d3.geoPath(projection);

    const g = svg.append("g");

    d3.json(`https://cdn.jsdelivr.net/npm/us-atlas@3/counties-10m.json`).then(
      (data) => {
        const countries = topojson.feature(data, data.objects.states);

        g.selectAll(`path`)
          .data(countries.features)
          .enter()
          .append(`path`)
          .attr(`class`, `state`)
          .attr(`d`, path)
          .attr(`fill`, "white")
          .attr(`stroke`, `black`);
      }
    );
  };

  useEffect(() => {
    getData();
  }, [width]);

  return <svg ref={svgRef} viewBox="0 0 975 610"></svg>;
};

export default Map;
