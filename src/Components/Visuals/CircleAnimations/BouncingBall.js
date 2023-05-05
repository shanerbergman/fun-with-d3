import React, { useState, useEffect } from "react";
import * as d3 from "d3";

const BouncingBall = ({ bounceBall, max_h, max_w }) => {
  // use state for Y position
  // use state for vY vertical velocity
  // use an effect to start/stop a timer
  // write loop
  const [yPos, setBall] = useState({
    y: 60,
    vy: 0.5,
  });
  const [startX, setStartX] = useState(false);
  const [xPos, setXPos] = useState({
    x: 50,
    vx: 0.5,
  });

  useEffect(() => {
    function loop() {
      if (bounceBall) {
        if (startX) {
          setXPos((xPos) => {
            let { x, vx } = xPos;

            if (x > max_w) {
              vx = -vx;
            }
            return {
              x: x + vx,
              vx: vx + 0.01,
            };
          });
        }
        setBall((yPos) => {
          let { y, vy } = yPos;

          if (y > max_h) {
            vy = -vy;
            if (!startX) {
              setStartX(true);
            }
          }

          if (y < 2) {
            vy = -vy;
          }

          return {
            y: y + vy,
            vy: vy + 0.05,
          };
        });
      }
    }

    const t = d3.timer(loop);
    return () => t.stop();
  }, [bounceBall, max_h, max_w, startX]);

  return <circle cy={yPos.y} cx={xPos.x} r={10} />;
};

export default BouncingBall;
