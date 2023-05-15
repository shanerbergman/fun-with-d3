import React, { useState, useEffect, useRef } from "react";
import { Tooltip, Button, InputNumber } from "antd";
import { CaretRightOutlined, PauseOutlined } from "@ant-design/icons";
import useResizeObserver from "../../../Utilities/Hooks/useResizeObserver";
import BouncingBall from "./BouncingBall";
import ControlContainer from "../Controls/ControlContainer";

const BouncingBallContainer = () => {
  const containerRef = useRef();
  const dimensions = useResizeObserver(containerRef);
  const [width, setWidth] = useState(0);

  const [bounceBall, setBounceBall] = useState(false);
  const [ballCount, setBallCount] = useState(10);
  const handleClick = () => {
    setBounceBall(!bounceBall);
  };

  const handleCountChange = (e) => setBallCount(e);

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
          minHeight: "200px",
          width: "100%",
        }}
      >
        {width > 0 && (
          <BouncingBall
            bounceBall={bounceBall}
            width={width}
            height={400 - 5}
            ballCount={ballCount}
            max_h={400 - 100}
            max_w={width - 30}
          />
        )}
      </div>
      <ControlContainer>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "175px",
          }}
        >
          <Tooltip title={bounceBall ? "Pause Bouncing" : "Start Bouncing"}>
            <Button
              onClick={handleClick}
              shape="circle"
              icon={bounceBall ? <PauseOutlined /> : <CaretRightOutlined />}
            />
          </Tooltip>
          <Tooltip title={"Change Ball Count"}>
            <InputNumber
              onChange={handleCountChange}
              min={1}
              max={50}
              value={ballCount}
              onKeyDown={(event) => {
                event.preventDefault();
              }}
            />
          </Tooltip>
        </div>
      </ControlContainer>
    </>
  );
};

export default BouncingBallContainer;
