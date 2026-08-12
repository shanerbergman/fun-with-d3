import React, { useState } from "react";
import CircularProgress from "./CircularProgress";
import AnimationFrame from "./AnimationFrame";
import Button, { PlayIcon, PauseIcon } from "../../UI/Button";

/** 25s sweep at 250ms per percentage point. */
const CYCLE_MS = 25000;
const MS_PER_PERCENT = 250;

const ProgressBarsContainer = () => {
  const [start, setStart] = useState(false);

  const handleClick = () => setStart((running) => !running);

  return (
    <>
      <div className="viz-card__body progress-body">
        <AnimationFrame autostart={start}>
          {({ time }) => (
            <CircularProgress
              progressPercentage={time.fromStart / MS_PER_PERCENT}
              gradientId="progress-up"
              caption="Filling"
            >
              <linearGradient id="progress-up" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="var(--accent)" />
                <stop offset="100%" stopColor="var(--accent-ember)" />
              </linearGradient>
            </CircularProgress>
          )}
        </AnimationFrame>

        <AnimationFrame autostart={start}>
          {({ time }) => (
            <CircularProgress
              progressPercentage={(CYCLE_MS - time.fromStart) / MS_PER_PERCENT}
              gradientId="progress-down"
              caption="Draining"
            >
              <linearGradient
                id="progress-down"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="var(--accent)" />
                <stop offset="50%" stopColor="var(--accent-sand)" />
                <stop offset="100%" stopColor="var(--accent-green)" />
              </linearGradient>
            </CircularProgress>
          )}
        </AnimationFrame>
      </div>
      <div className="viz-card__foot">
        <Button
          onClick={handleClick}
          icon={start ? <PauseIcon /> : <PlayIcon />}
          aria-label={start ? "Pause progress" : "Start progress"}
        >
          {start ? "Pause" : "Run"}
        </Button>
        <span className="viz-card__note">
          Stroke hue interpolates red → green across the sweep
        </span>
      </div>
    </>
  );
};

export default ProgressBarsContainer;
