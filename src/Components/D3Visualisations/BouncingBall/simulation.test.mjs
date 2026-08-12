/**
 * Headless checks for the ball pit. The simulation is deliberately free of
 * React and DOM, so it can be stepped thousands of frames in node.
 *
 *   npm run test:sim
 */
import {
  createWorld,
  setCount,
  resize,
  step,
  baseRadius,
  constants,
} from "./simulation.js";

let failures = 0;
const ok = (name, cond, extra = "") => {
  console.log(`${cond ? "  pass" : "  FAIL"}  ${name}${extra ? `  ← ${extra}` : ""}`);
  if (!cond) failures++;
};

const W = 620;
const H = 340;

// --- 1. count sync -------------------------------------------------------
// Regression: the old add/remove path mutated one ball per change and filtered
// on a stale id, so dragging the slider left stranded balls on screen.
console.log("\n1. ball count tracks the slider exactly");
{
  const world = createWorld({ width: W, height: H, count: 14 });
  ok("starts at 14", world.balls.length === 14, `got ${world.balls.length}`);
  for (let f = 0; f < 400; f++) step(world, 1);

  for (const n of [40, 12, 7, 3, 1, 25, 100, 60, 100, 1]) {
    setCount(world, n);
    for (let f = 0; f < 30; f++) step(world, 1);
    ok(`slider → ${n}`, world.balls.length === n, `got ${world.balls.length}`);
  }

  setCount(world, 50);
  ok("ids stay unique", new Set(world.balls.map((b) => b.id)).size === 50);
}

// --- 2. containment and numeric health ----------------------------------
console.log("\n2. 100 balls, 6000 frames: nothing escapes or goes NaN");
{
  const world = createWorld({ width: W, height: H, count: 100 });
  let escaped = 0;
  let nan = 0;
  let worstOverlap = 0;
  let peakSparks = 0;

  for (let f = 0; f < 6000; f++) {
    step(world, 1);
    peakSparks = Math.max(peakSparks, world.sparks.length);

    for (const b of world.balls) {
      if (!Number.isFinite(b.x) || !Number.isFinite(b.y) || !Number.isFinite(b.vx)) {
        nan++;
      }
      if (
        b.x - b.r < -0.5 ||
        b.x + b.r > W + 0.5 ||
        b.y - b.r < -0.5 ||
        b.y + b.r > H + 0.5
      ) {
        escaped++;
      }
    }

    if (f % 500 === 0) {
      for (let i = 0; i < world.balls.length; i++) {
        for (let j = i + 1; j < world.balls.length; j++) {
          const a = world.balls[i];
          const b = world.balls[j];
          const pen = a.r + b.r - Math.hypot(b.x - a.x, b.y - a.y);
          if (pen > worstOverlap) worstOverlap = pen;
        }
      }
    }
  }

  const meanR =
    world.balls.reduce((sum, b) => sum + b.r, 0) / world.balls.length;

  ok("no NaN positions", nan === 0, `${nan} bad`);
  ok("no ball leaves the pit", escaped === 0, `${escaped} out-of-bounds`);
  // An impulse solver always penetrates somewhat under a stack; hold it to a
  // third of a radius, which reads as depth on translucent balls.
  ok(
    "overlap under 1/3 radius",
    worstOverlap < meanR * 0.35,
    `worst ${worstOverlap.toFixed(2)}px vs mean radius ${meanR.toFixed(1)}`
  );
  ok(
    "spark pool respects its cap",
    peakSparks <= constants.MAX_SPARKS,
    `peak ${peakSparks}`
  );
  ok("collisions throw sparks", world.impacts > 100, `${world.impacts} impacts`);
}

// --- 3. sparks expire ----------------------------------------------------
console.log("\n3. sparks decay instead of accumulating");
{
  const world = createWorld({ width: W, height: H, count: 2 });
  for (let f = 0; f < 800; f++) step(world, 1);
  const before = world.sparks.length;

  for (let f = 0; f < 200; f++) {
    for (const b of world.balls) {
      b.vx = 0;
      b.vy = 0;
    }
    step(world, 1);
  }
  ok(
    "pool drains once impacts stop",
    world.sparks.length < Math.max(before, 1),
    `${before} → ${world.sparks.length}`
  );
}

// --- 4. the pit never goes still ----------------------------------------
console.log("\n4. energy floor keeps it moving");
{
  const world = createWorld({ width: W, height: H, count: 8 });
  for (let f = 0; f < 3000; f++) step(world, 1);
  const mean =
    world.balls.reduce((sum, b) => sum + Math.hypot(b.vx, b.vy), 0) /
    world.balls.length;
  ok("still moving after 3000 frames", mean > 0.8, `mean speed ${mean.toFixed(2)}`);
}

// --- 5. radii scale with count ------------------------------------------
console.log("\n5. balls shrink as the count climbs");
{
  for (const n of [1, 10, 50, 100]) {
    const r = baseRadius(W, H, n);
    const coverage = ((n * Math.PI * r * r) / (W * H)) * 100;
    console.log(
      `       n=${String(n).padStart(3)}  r=${r.toFixed(1).padStart(5)}  coverage=${coverage.toFixed(0)}%`
    );
  }
  const r100 = baseRadius(W, H, 100);
  ok(
    "100 balls still fit the pit",
    (100 * Math.PI * r100 * r100) / (W * H) < 0.5,
    `${((100 * Math.PI * r100 * r100) / (W * H) * 100).toFixed(0)}% coverage`
  );
}

// --- 6. resize -----------------------------------------------------------
console.log("\n6. shrinking the card keeps every ball inside");
{
  const world = createWorld({ width: W, height: H, count: 30 });
  for (let f = 0; f < 200; f++) step(world, 1);
  resize(world, 300, 200);
  for (let f = 0; f < 60; f++) step(world, 1);

  ok(
    "all inside after shrink",
    world.balls.every(
      (b) =>
        b.x - b.r >= -0.5 &&
        b.x + b.r <= 300.5 &&
        b.y - b.r >= -0.5 &&
        b.y + b.r <= 200.5
    )
  );
  ok("count survives resize", world.balls.length === 30, `got ${world.balls.length}`);
}

console.log(`\n${failures === 0 ? "all pass" : `${failures} failure(s)`}\n`);
process.exit(failures ? 1 : 0);
