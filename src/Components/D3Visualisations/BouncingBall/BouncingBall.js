import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import Defs from "./Defs";

const BouncingBall = ({ width, height, bounceBall, max_h, max_w }) => {
  const svgRef = useRef();
  // use state for Y position
  // use state for vY vertical velocity
  // use an effect to start/stop a timer
  // write loop
  const [yPos, setBall] = useState([
    {
      id: 1,
      y: 60,
      vy: 0.5,
    },
    {
      id: 2,
      y: 75,
      vy: 0.7,
    },
    {
      id: 3,
      y: 75,
      vy: 0.4,
    },
    {
      id: 4,
      y: 72,
      vy: 0.2,
    },
    {
      id: 5,
      y: 77,
      vy: 0.05,
    },
  ]);
  const [startX, setStartX] = useState(false);
  const [xPos, setXPos] = useState([
    {
      id: 1,
      x: 50,
      vx: 0.5,
    },
    {
      id: 2,
      x: 55,
      vx: 0.3,
    },
    {
      id: 3,
      x: 65,
      vx: 0.6,
    },
    {
      id: 4,
      x: 77,
      vx: 0.1,
    },
    {
      id: 5,
      x: 72,
      vx: 0.08,
    },
  ]);

  useEffect(() => {
    function loop() {
      if (bounceBall) {
        if (startX) {
          let newXPos = xPos.map((xPos) => {
            let { id, x, vx } = xPos;
            if (x > max_w) {
              vx = -vx;
            }
            if (x < 10) {
              x = 10.1;
              vx = vx * -1;
            }
            return {
              id,
              x: x + vx,
              vx: vx + 0.01,
            };
          });
          setXPos(newXPos);
        }

        let newYPos = yPos.map((yPos) => {
          let { id, y, vy } = yPos;

          if (y > max_h) {
            vy = -vy;
            if (!startX) {
              setStartX(true);
            }
          }

          if (y < 10) {
            y = 10.1;
            vy = vy * -1;
          }

          return {
            id,
            y: y + vy,
            vy: vy + 0.05,
          };
        });

        setBall(newYPos);
      }
    }

    const t = d3.timer(loop);
    return () => t.stop();
  }, [bounceBall, max_h, max_w, yPos, xPos, startX]);

  useEffect(() => {
    d3.select(svgRef.current).attr("width", width).attr("height", height);
  }, [width, height]);

  const BALLS = [
    { id: 5, fill: "url(#5)", r: 50 },
    { id: 4, fill: "url(#4)", r: 35 },
    { id: 3, fill: "url(#3)", r: 25 },
    { id: 2, fill: "url(#2)", r: 15 },
    { id: 1, fill: "url(#1)", r: 10 },
  ];
  return (
    <svg ref={svgRef}>
      <Defs />
      {BALLS.map((ball) => {
        return (
          <circle
            id={ball.id}
            cy={yPos.filter((yP) => yP.id === ball.id).map((yP) => yP.y)}
            cx={xPos.filter((xP) => xP.id === ball.id).map((xP) => xP.x)}
            r={ball.r}
            fill={ball.fill}
          />
        );
      })}
    </svg>
  );
};

export default BouncingBall;
