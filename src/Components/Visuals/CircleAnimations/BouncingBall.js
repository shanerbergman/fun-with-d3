import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";

const BouncingBall = ({ bounceBall, max_h }) => {
  // use state for Y position
  // use state for vY vertical velocity
  // use an effect to start/stop a timer
  // write loop
  const [ball, setBall] = useState({
    y: 60,
    vy: 0.5,
  });
  const [startX, setStartX] = useState(false);
  const [xPos, setXPos] = useState({
    x: 50,
    vx: 0.5,
  });
  //console.log("ball", ball);
  useEffect(() => {
    function loop() {
      if (bounceBall) {
        if (startX) {
          setXPos((xPos) => {
            let { x, vx } = xPos;

            if (x > 300) {
              vx = -vx;
            }
            return {
              x: x + vx,
              vx: vx + 0.01,
            };
          });
        }
        setBall((ball) => {
          let { y, vy } = ball;

          if (y > max_h) {
            vy = -vy;
            if (!startX) {
              setStartX(true);
            }
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
  }, [bounceBall, max_h, startX]);
  // transform={`translate(20, 0)`}
  console.log(xPos);
  return <circle cy={ball.y} cx={xPos.x} r={10} />;
};

export default BouncingBall;

/*
    svg
      .selectAll("circle")
      .data(data)
      .join(
        (enter) =>
          enter.append("circle").attr("class", "new").attr("stroke", "red"),
        (update) => update.attr("class", "updated").attr("class", "new"),
        (exit) => exit.remove()
      )
      .attr("r", (value) => value.r)
      .attr("cx", (value) => {
        if (value.id === "5") {
          console.log("cx:5", value.r + counter);
          if (value.r + counter > 100) {
            const newOperation = operation;
            newOperation["5"] = "minus";
            setOperation(newOperation);
          }
          if (operation["5"] === "plus") {
            return value.r + counter;
          } else {
            return value.r - counter;
          }
        }
        if (value.id === "4") {
          return value.r + counter + 10;
        }

        return value.r;
      })
      .attr("cy", (value) => {
        if (value.id === "5") {
          return value.r + counter;
        }
        //if (value.id === 4) {
        //  return value.r + counter + 10;
        //}
        return value.r;
      }); */
