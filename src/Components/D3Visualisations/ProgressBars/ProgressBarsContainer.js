import React, { useState, useEffect } from "react";
import { Tooltip, Button } from "antd";
import { CaretRightOutlined, PauseOutlined } from "@ant-design/icons";
import { useDimensions } from "../../../Utilities/Hooks/useDimensions";
import * as d3 from "d3";
import CircularProgress from "./CircularProgress";
import CircularProgress2 from "./CircularProgress2";
import ControlContainer from "../Controls/ControlContainer";

const ProgressBarsContainer = () => {
  const [{ height, width }, containerRef] = useDimensions();

  const [start, setStart] = useState(false);
  const [progressPercentage, setProgressPercentage] = useState(1);
  const [progressPercentage2, setProgressPercentage2] = useState(100);

  const handleClick = () => setStart(!start);

  useEffect(() => {
    function loop() {
      let per = progressPercentage;
      let per2 = progressPercentage2;

      if (per > 99) {
        per = 1;
      } else {
        per = per + 0.1;
      }

      if (per2 < 1) {
        per2 = 100;
      } else {
        per2 = per2 - 0.1;
      }

      setProgressPercentage(per);
      setProgressPercentage2(per2);
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
          minHeight: "400px",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div>
          {height > 0 && (
            <CircularProgress
              height={200}
              width={200}
              progressPercentage={progressPercentage}
            />
          )}

          {height > 0 && (
            <CircularProgress2
              width={200}
              height={200}
              progressPercentage={progressPercentage2}
            />
          )}
        </div>
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
