import React, { useState, useEffect, useRef, useCallback } from "react";
import useResizeObserver from "../../../Utilities/Hooks/useResizeObserver";
import BouncingBall from "./BouncingBall";
import Button, { PlayIcon, PauseIcon } from "../../UI/Button";
import Slider from "../../UI/Slider";

const CANVAS_HEIGHT = 340;
const MIN_BALLS = 1;
const MAX_BALLS = 100;

const BouncingBallContainer = () => {
  const containerRef = useRef();
  const dimensions = useResizeObserver(containerRef);
  const [width, setWidth] = useState(0);

  const [running, setRunning] = useState(true);
  const [ballCount, setBallCount] = useState(14);
  const [impacts, setImpacts] = useState(0);

  useEffect(() => {
    if (dimensions) setWidth(dimensions.width);
  }, [dimensions]);

  // Stable identity: the simulation only reads this once, at mount.
  const handleImpact = useCallback((total) => setImpacts(total), []);

  return (
    <>
      <div className="viz-card__body ball-pit" ref={containerRef}>
        {width > 0 && (
          <BouncingBall
            width={width}
            height={CANVAS_HEIGHT}
            running={running}
            ballCount={ballCount}
            onImpact={handleImpact}
          />
        )}
      </div>
      <div className="viz-card__foot">
        <Button
          onClick={() => setRunning((value) => !value)}
          icon={running ? <PauseIcon /> : <PlayIcon />}
          aria-label={running ? "Pause the ball pit" : "Start the ball pit"}
        >
          {running ? "Pause" : "Play"}
        </Button>
        <Slider
          label="Balls"
          min={MIN_BALLS}
          max={MAX_BALLS}
          value={ballCount}
          onChange={setBallCount}
        />
        <span className="viz-card__note ball-pit__count">
          {impacts.toLocaleString()} impacts
        </span>
      </div>
    </>
  );
};

export default BouncingBallContainer;
