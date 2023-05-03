import React, { useState, useEffect, useRef } from "react";
import { select, timer } from "d3";
import BouncingBall from "./BouncingBall";

const CircleAnimations = ({ width, height, max_h }) => {
  const svgRef = useRef();
  const [bounceBall, setBounceBall] = useState(false);

  console.log("CircleAnimations ", height);
  const handleClick = () => {
    setBounceBall(!bounceBall);
  };

  useEffect(() => {
    select(svgRef.current)
      .style("border", "1px solid #BDBDBD")
      .attr("width", width)
      .attr("height", height);
  }, [width, height]);
  return (
    <div>
      <svg ref={svgRef}>
        <BouncingBall bounceBall={bounceBall} max_h={max_h} />
      </svg>
      <div onClick={handleClick}>CLICK</div>
    </div>
  );
};

export default CircleAnimations;
