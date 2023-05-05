import React, { useState, useEffect, useRef } from "react";
import { select } from "d3";
import { Tooltip, Button } from "antd";
import { CaretRightOutlined, PauseOutlined } from "@ant-design/icons";
import { useDimensions } from "../../../Utilities/Hooks/useDimensions";
import { useColorIndication } from "../../../Utilities/Hooks/useColorIndication";
import * as d3 from "d3";
import Progress from "./Progress";

const CircularProgressBar = () => {
  const svgRef = useRef();
  const [{ height, width }, containerRef] = useDimensions();
  const [bounceBall, setBounceBall] = useState(false);

  const svgWidth = 150;
  const arcWidth = 12;
  const [start, setStart] = useState(false);
  const [progressPercentage, setProgressPercentage] = useState(1);
  const colorIndicator = useColorIndication(progressPercentage);

  const handleClick = () => setStart(!start);
  function valuetext(value) {
    return `${value}°C`;
  }
  function setProgressValue(event, value) {
    setProgressPercentage(value);
  }

  useEffect(() => {
    select(svgRef.current)
      .style("border", "1px solid #BDBDBD")
      .attr("width", width)
      .attr("height", height);
  }, [width, height]);

  useEffect(() => {
    function loop(elapsed) {
      console.log("timer===", elapsed);
      let per = progressPercentage;
      if (per > 99) {
        per = 1;
      } else {
        per = per + 0.1;
      }

      setProgressPercentage(per);
    }
    const t = d3.timer(loop);
    if (!start) {
      t.stop();
    } else {
      t.restart(loop);
    }
    return () => t.stop();
  }, [progressPercentage, start]);

  return (
    <>
      <div
        ref={containerRef}
        style={{
          minHeight: "200px",
          width: "100%",
        }}
      >
        <Progress
          height={height}
          svgWidth={svgWidth}
          arcWidth={arcWidth}
          progressPercentage={progressPercentage}
          colorIndicator={colorIndicator}
        />
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

export default CircularProgressBar;
