import React, { useState, useEffect, useRef } from "react";
import { Tooltip, Button } from "antd";
import { CaretRightOutlined, PauseOutlined } from "@ant-design/icons";
import * as d3 from "d3";
import useResizeObserver from "../../../Utilities/Hooks/useResizeObserver";

import CircularProgress from "./CircularProgress";
import CircularProgress2 from "./CircularProgress2";
import ControlContainer from "../Controls/ControlContainer";
import AnimationFrame from "./AnimationFrame";

const ProgressBarsContainer = () => {
  const containerRef = useRef();
  const dimensions = useResizeObserver(containerRef);
  const [width, setWidth] = useState(0);

  const [start, setStart] = useState(false);
  const [progressPercentage, setProgressPercentage] = useState(1);
  const [progressPercentage2, setProgressPercentage2] = useState(100);

  const handleClick = () => setStart(!start);

  function loop() {
    let per = progressPercentage;
    let per2 = progressPercentage2;
    console.log("loop", per, per2);

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

  useEffect(() => {
    if (dimensions) {
      const { width } = dimensions;
      setWidth(width);
    }
  }, [dimensions]);

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
          {width > 0 && (
            <AnimationFrame autostart={start}>
              {({ time }) => {
                const t = time.fromStart / 250;

                return (
                  <CircularProgress
                    height={200}
                    width={200}
                    progressPercentage={t}
                  />
                );
              }}
            </AnimationFrame>
          )}

          {width > 0 && (
            <AnimationFrame autostart={start}>
              {({ time }) => {
                const t = (25000 - time.fromStart) / 250;

                return (
                  <CircularProgress2
                    width={200}
                    height={200}
                    progressPercentage={t}
                  />
                );
              }}
            </AnimationFrame>
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

/*
<Plot
                  functions={[(x) => Math.sin(3 * x) * Math.sin(t / 2), (x) => Math.sin(2 * x) * Math.sin(t / 3)]}
                  range={{ x: [0, Math.PI], y: [-1, 1] }}
                  height={200}
                  strokeWidth={4}
                  hideXAxis={true}
              />*/
