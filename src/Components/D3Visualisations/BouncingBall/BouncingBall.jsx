import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import Defs from "./Defs";
import { createWorld, setCount, resize, step } from "./simulation";

/**
 * Renders the ball pit with d3 data joins driven by a d3.timer.
 *
 * The simulation lives in a ref, not React state. The previous version called
 * setState on every frame, which meant a full reconcile per ball per frame —
 * fine at 10 balls, unusable at 100. React now owns the <svg> and nothing else;
 * the timer writes attributes straight to the DOM.
 */
const BouncingBall = ({ width, height, running, ballCount, onImpact }) => {
  const svgRef = useRef();
  const worldRef = useRef(null);
  const runningRef = useRef(running);

  // Read `running` from a ref inside the timer so toggling play/pause never
  // tears down and restarts the simulation.
  runningRef.current = running;

  // --- set up once ---
  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const ballLayer = svg.select(".balls");
    const sparkLayer = svg.select(".sparks");

    const world = createWorld({ width, height, count: ballCount });
    worldRef.current = world;

    let lastElapsed = 0;
    let lastReport = 0;

    const draw = () => {
      ballLayer
        .selectAll("circle")
        .data(world.balls, (d) => d.id)
        .join((enter) =>
          enter
            .append("circle")
            .attr("fill", (d) => d.fill)
            .attr("opacity", 0)
        )
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y)
        .attr("r", (d) => d.r)
        // Fade in over ~12 frames so added balls arrive instead of popping.
        .attr("opacity", (d) => Math.min(1, d.age / 12));

      sparkLayer
        .selectAll("line")
        .data(world.sparks)
        .join("line")
        .attr("x1", (d) => d.x)
        .attr("y1", (d) => d.y)
        // Trail points back along the direction of travel.
        .attr("x2", (d) => d.x - d.vx * 2.4)
        .attr("y2", (d) => d.y - d.vy * 2.4)
        .attr("stroke", (d) => d.color)
        .attr("stroke-width", (d) => 0.6 + 1.6 * (d.life / d.maxLife))
        .attr("stroke-linecap", "round")
        .attr("opacity", (d) => Math.pow(d.life / d.maxLife, 0.7));
    };

    const timer = d3.timer((elapsed) => {
      // dt in 60fps frames, clamped so a stalled tab doesn't teleport balls.
      const dt = Math.min((elapsed - lastElapsed) / 16.667, 3);
      lastElapsed = elapsed;

      if (runningRef.current) {
        step(world, dt);
      } else {
        // Paused: still age balls so a fade-in can finish, but freeze physics.
        for (const b of world.balls) b.age += dt;
      }

      draw();

      // Throttle the impact readout; it's a React state write.
      if (onImpact && elapsed - lastReport > 200) {
        lastReport = elapsed;
        onImpact(world.impacts);
      }
    });

    return () => timer.stop();
    // Intentionally mount-only: count and size changes are handled below so
    // the pit survives them instead of being rebuilt.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- react to control changes ---
  useEffect(() => {
    if (worldRef.current) setCount(worldRef.current, ballCount);
  }, [ballCount]);

  useEffect(() => {
    if (worldRef.current) resize(worldRef.current, width, height);
  }, [width, height]);

  return (
    <svg ref={svgRef} width={width} height={height} role="presentation">
      <Defs />
      <g className="balls" />
      <g className="sparks" />
    </svg>
  );
};

export default BouncingBall;
