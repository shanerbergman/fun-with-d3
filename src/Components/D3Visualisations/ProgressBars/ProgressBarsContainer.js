import React, { useState, useEffect } from "react";
import { Tooltip, Button } from "antd";
import { CaretRightOutlined, PauseOutlined } from "@ant-design/icons";
import { useDimensions } from "../../../Utilities/Hooks/useDimensions";
import { useColorIndication } from "../../../Utilities/Hooks/useColorIndication";
import * as d3 from "d3";
import CircularProgress from "./CircularProgress";
import VerticalProgress from "./VerticalProgress";
import ControlContainer from "../Controls/ControlContainer";

const ProgressBarsContainer = () => {
  const [{ height, width }, containerRef] = useDimensions();

  const [start, setStart] = useState(false);
  const [progressPercentage, setProgressPercentage] = useState(1);
  const colorIndicator = useColorIndication(progressPercentage);

  const handleClick = () => setStart(!start);

  useEffect(() => {
    function loop(elapsed) {
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

  console.log("progressPercentage", progressPercentage);
  return (
    <>
      <div
        ref={containerRef}
        style={{
          minHeight: "200px",
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {height > 0 && (
          <CircularProgress
            height={height}
            progressPercentage={progressPercentage}
            colorIndicator={colorIndicator}
          />
        )}

        {height > 0 && (
          <VerticalProgress
            height={height}
            progressPercentage={progressPercentage}
            colorIndicator={colorIndicator}
          />
        )}
      </div>
      <ControlContainer>
        <Tooltip title={start ? "Pause Progress" : "Start Progress"}>
          <Button
            onClick={handleClick}
            shape="circle"
            icon={start ? <PauseOutlined /> : <CaretRightOutlined />}
          />
        </Tooltip>
      </ControlContainer>
    </>
  );
};

export default ProgressBarsContainer;
