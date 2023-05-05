import React, { useState, useEffect, useRef } from "react";
import { select } from "d3";
import { Tooltip, Button } from "antd";
import { CaretRightOutlined, PauseOutlined } from "@ant-design/icons";
import { useDimensions } from "../../../Utilities/Hooks/useDimensions";
import BouncingBall from "./BouncingBall";

const CircleAnimations = () => {
  const svgRef = useRef();
  const [{ height, width }, containerRef] = useDimensions();
  const [bounceBall, setBounceBall] = useState(false);
  const [mounted, setMounted] = useState(false);

  const handleClick = () => {
    setBounceBall(!bounceBall);
  };

  useEffect(() => {
    select(svgRef.current)
      .style("border", "1px solid #BDBDBD")
      .attr("width", width)
      .attr("height", height);
  }, [width, height, mounted]);

  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
    }, 500);
  }, []);

  return (
    <>
      <div
        ref={containerRef}
        style={{
          minHeight: "200px",
          width: "100%",
        }}
      >
        {width > 0 && (
          <svg ref={svgRef}>
            <BouncingBall
              bounceBall={bounceBall}
              max_h={height - 30}
              max_w={width - 30}
            />
          </svg>
        )}
      </div>

      <Tooltip title={bounceBall ? "Pause Bouncing" : "Start Bouncing"}>
        <Button
          onClick={handleClick}
          shape="circle"
          icon={bounceBall ? <PauseOutlined /> : <CaretRightOutlined />}
        />
      </Tooltip>
    </>
  );
};

export default CircleAnimations;
