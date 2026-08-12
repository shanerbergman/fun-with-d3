import React, { useState, useEffect, useRef } from "react";
import useResizeObserver from "../../../Utilities/Hooks/useResizeObserver";
import BouncingBall from "./BouncingBall";
import Button, { PlayIcon, PauseIcon } from "../../UI/Button";
import Slider from "../../UI/Slider";

const CANVAS_HEIGHT = 340;

const BouncingBallContainer = () => {
  const containerRef = useRef();
  const dimensions = useResizeObserver(containerRef);
  const [width, setWidth] = useState(0);

  const [bounceBall, setBounceBall] = useState(false);
  const [ballCount, setBallCount] = useState(12);

  const handleClick = () => setBounceBall((running) => !running);

  const handleCountChange = (value) => {
    setBounceBall(false);
    setBallCount(value);
  };

  useEffect(() => {
    if (dimensions) setWidth(dimensions.width);
  }, [dimensions]);

  return (
    <>
      <div className="viz-card__body" ref={containerRef}>
        {width > 0 && (
          <BouncingBall
            bounceBall={bounceBall}
            width={width}
            height={CANVAS_HEIGHT}
            ballCount={ballCount}
            max_h={CANVAS_HEIGHT - 40}
            max_w={width - 30}
          />
        )}
      </div>
      <div className="viz-card__foot">
        <Button
          onClick={handleClick}
          icon={bounceBall ? <PauseIcon /> : <PlayIcon />}
          aria-label={bounceBall ? "Pause bouncing" : "Start bouncing"}
        >
          {bounceBall ? "Pause" : "Play"}
        </Button>
        <Slider
          label="Balls"
          min={3}
          max={40}
          value={ballCount}
          onChange={handleCountChange}
        />
      </div>
    </>
  );
};

export default BouncingBallContainer;
