import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import Defs from "./Defs";

const BouncingBall = ({
  width,
  height,
  bounceBall,
  ballCount,
  max_h,
  max_w,
}) => {
  const svgRef = useRef();

  const [balls, setBalls] = useState(null);

  const getRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
  };
  const getFill = () => {
    const num = getRandomNumber(1, 10);
    return `url(#${num})`;
  };

  const getR = () => {
    const num = getRandomNumber(10, 50);
    return num;
  };

  const getYPos = () => {
    const yPos = {
      y: getRandomNumber(45, 300),
      vy: getRandomNumber(1, 15) / 10,
    };
    return yPos;
  };

  const getXPos = () => {
    const xPos = {
      x: getRandomNumber(45, width - 100),
      vx: getRandomNumber(1, 15) / 10,
    };
    return xPos;
  };

  const generateBalls = () => {
    const newBalls = [];

    for (let x = 1; x <= ballCount; x++) {
      let b = {
        id: x,
        fill: getFill(),
        r: getR(),
        yPos: getYPos(),
        xPos: getXPos(),
        startX: false,
      };
      newBalls.push(b);
    }
    setBalls(newBalls);
  };

  const addBall = () => {
    const newBalls = [...balls];

    let b = {
      id: ballCount,
      fill: getFill(),
      r: getR(),
      yPos: getYPos(),
      xPos: getXPos(),
      startX: false,
    };
    newBalls.push(b);
    setBalls(newBalls);
  };
  const removeBall = () => {
    const newBalls = balls.filter((ball) => ball.id !== ballCount + 1);
    setBalls(newBalls);
  };

  useEffect(() => {
    if (ballCount) {
      if (!balls) {
        generateBalls();
      } else {
        if (ballCount > balls.length) {
          addBall();
        } else {
          removeBall();
        }
      }
    }
  }, [ballCount]);

  useEffect(() => {
    function loop() {
      if (bounceBall) {
        const newBalls = balls.map((ball) => {
          if (ball.startX) {
            let { x, vx } = ball.xPos;
            if (x > max_w) {
              vx = -vx;
            }
            if (x < 10) {
              x = 10.1;
              vx = vx * -1;
            }
            ball.xPos.x = x + vx;
            ball.xPos.vx = vx + 0.01;
          }

          let { y, vy } = ball.yPos;
          if (y > max_h) {
            vy = -vy;
            if (!ball.startX) {
              ball.startX = true;
            }
          }

          if (y < 50) {
            y = 50.1;
            vy = vy * -1;
          }

          ball.yPos.y = y + vy;
          ball.yPos.vy = vy + 0.05;
          return ball;
        });

        setBalls(newBalls);
      }
    }

    const t = d3.timer(loop);
    return () => t.stop();
  }, [bounceBall, max_h, max_w, balls]);

  useEffect(() => {
    d3.select(svgRef.current).attr("width", width).attr("height", height);
  }, [width, height]);

  return (
    <svg ref={svgRef}>
      <Defs />
      {balls
        ? balls.map((ball) => {
            return (
              <circle
                key={`ball_${ball.id}`}
                id={ball.id}
                cy={ball.yPos.y}
                cx={ball.xPos.x}
                r={ball.r}
                fill={ball.fill}
              />
            );
          })
        : null}
    </svg>
  );
};

export default BouncingBall;
