import React, { useState } from "react";
import { Tooltip, Button } from "antd";
import { CaretRightOutlined, PauseOutlined } from "@ant-design/icons";
import { useDimensions } from "../../../Utilities/Hooks/useDimensions";
import BouncingBall from "./BouncingBall";
import { HEIGHT_CONSTANT } from "../Constants";
import ControlContainer from "../Controls/ControlContainer";

const BouncingBallContainer = () => {
  const [{ height, width }, containerRef] = useDimensions();
  const [bounceBall, setBounceBall] = useState(false);

  const handleClick = () => {
    setBounceBall(!bounceBall);
  };

  return (
    <>
      <div
        ref={containerRef}
        style={{
          minHeight: "200px",
          width: "100%",
        }}
      >
        <BouncingBall
          bounceBall={bounceBall}
          width={width}
          height={height - HEIGHT_CONSTANT}
          max_h={height - 30}
          max_w={width - 30}
        />
      </div>
      <ControlContainer>
        <Tooltip title={bounceBall ? "Pause Bouncing" : "Start Bouncing"}>
          <Button
            onClick={handleClick}
            shape="circle"
            icon={bounceBall ? <PauseOutlined /> : <CaretRightOutlined />}
          />
        </Tooltip>
      </ControlContainer>
    </>
  );
};

export default BouncingBallContainer;
