/**
 * Ball pit physics — pure state, no React and no DOM, so it can be stepped
 * headlessly in a test as easily as in a d3.timer.
 *
 * Units are pixels and "frames at 60fps": step(dt) takes dt as a multiple of a
 * 16.67ms frame, so a slow frame advances the world proportionally instead of
 * stuttering.
 */

const GRAVITY = 0.42; // px per frame², downward
const WALL_RESTITUTION = 0.86; // energy kept on a wall bounce
const BALL_RESTITUTION = 0.94; // energy kept ball-on-ball
const DRAG = 0.9992; // per-frame velocity decay
const FLOOR_FRICTION = 0.988; // horizontal scrub on floor contact
const MAX_SPEED = 26; // clamp so a bad frame can't fling a ball
// Overlap relaxation passes per frame. 5 keeps worst-case penetration at 100
// balls under ~1/3 of a radius for ~0.18ms/frame; more passes buy very little.
// Some residual penetration is unavoidable for an impulse solver under a
// stack, and reads as depth given the balls are translucent.
const SOLVER_ITERATIONS = 5;

/** Below this mean speed the pit looks dead, so we nudge it. */
const ENERGY_FLOOR = 1.15;
const ENERGY_KICK = 1.06;

/** Minimum closing speed that throws sparks. */
const SPARK_THRESHOLD = 3.4;
const SPARK_LIFE = 26; // frames
const MAX_SPARKS = 420; // hard ceiling; oldest are recycled

const SPARK_COLORS = ["#b33a21", "#e0703f", "#c4b49b", "#171412"];

/** Balls cover roughly this fraction of the pit, however many there are. */
const PACKING = 0.34;
const R_MIN = 5;
const R_MAX = 34;

/** Deterministic PRNG (mulberry32) so a given seed always lays out the same. */
export function makeRng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), 1 | t);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v);

/**
 * Radius that keeps total ball area near PACKING of the pit, so 6 balls are
 * chunky and 100 balls are pebbles instead of an unresolvable jam.
 */
export function baseRadius(width, height, count) {
  const perBall = (width * height * PACKING) / Math.max(count, 1);
  return clamp(Math.sqrt(perBall / Math.PI), R_MIN, R_MAX);
}

export function createWorld({ width, height, count = 12, seed = 1987 }) {
  const world = {
    width,
    height,
    balls: [],
    sparks: [],
    impacts: 0, // cumulative, for the readout
    _rng: makeRng(seed),
    _nextId: 1,
    _sparkCursor: 0,
  };

  setCount(world, count);
  return world;
}

function spawnBall(world) {
  const rng = world._rng;
  const base = baseRadius(world.width, world.height, world.balls.length + 1);
  // `scale` is the ball's permanent size relative to the pack; the actual
  // radius is re-derived from it whenever the count or the pit changes.
  const scale = 0.62 + rng() * 0.76;
  const r = clamp(base * scale, R_MIN, R_MAX);

  // Rejection-sample a clear spot; if the pit is packed, drop it in anyway and
  // let the overlap solver push it out over the next few frames.
  let x = 0;
  let y = 0;
  for (let attempt = 0; attempt < 24; attempt++) {
    x = r + rng() * (world.width - 2 * r);
    y = r + rng() * (world.height * 0.6 - 2 * r);
    if (!world.balls.some((b) => Math.hypot(b.x - x, b.y - y) < b.r + r + 2)) {
      break;
    }
  }

  world.balls.push({
    id: world._nextId++,
    x,
    y,
    vx: (rng() - 0.5) * 7,
    vy: (rng() - 0.5) * 4,
    r,
    scale,
    m: r * r, // area-proportional mass
    fill: `url(#${1 + Math.floor(rng() * 10)})`,
    age: 0, // drives the fade-in
  });
}

/**
 * Sync the pool to exactly `count`. The old implementation added or dropped a
 * single ball per change and filtered on a stale id, so dragging the slider
 * left stranded balls on screen — this just truncates.
 */
export function setCount(world, count) {
  const target = Math.max(0, Math.round(count));

  if (target < world.balls.length) {
    world.balls.length = target;
  } else {
    while (world.balls.length < target) spawnBall(world);
  }

  resize(world, world.width, world.height);
  return world;
}

/** Rescale radii to the current pit and count, and pull strays back in bounds. */
export function resize(world, width, height) {
  world.width = width;
  world.height = height;

  const base = baseRadius(width, height, world.balls.length);
  for (const b of world.balls) {
    // Keep each ball's relative size but re-fit the whole set to the new pack.
    b.r = clamp(base * b.scale, R_MIN, R_MAX);
    b.m = b.r * b.r;
    b.x = clamp(b.x, b.r, Math.max(b.r, width - b.r));
    b.y = clamp(b.y, b.r, Math.max(b.r, height - b.r));
  }
  contain(world);
  return world;
}

function emitSparks(world, x, y, nx, ny, impact) {
  const rng = world._rng;
  const n = Math.min(12, 2 + Math.round(impact * 0.7));
  // Sparks fly along the contact tangent, not back down the normal.
  const tangent = Math.atan2(-nx, ny);
  const speed = clamp(impact * 0.34, 1.1, 5.5);

  for (let i = 0; i < n; i++) {
    const dir = tangent + (rng() < 0.5 ? 0 : Math.PI);
    const angle = dir + (rng() - 0.5) * 1.5;
    const v = speed * (0.45 + rng() * 0.9);
    const life = SPARK_LIFE * (0.5 + rng() * 0.7);

    const spark = {
      x,
      y,
      vx: Math.cos(angle) * v + nx * 0.4,
      vy: Math.sin(angle) * v + ny * 0.4,
      life,
      maxLife: life,
      color: SPARK_COLORS[Math.floor(rng() * SPARK_COLORS.length)],
    };

    if (world.sparks.length < MAX_SPARKS) {
      world.sparks.push(spark);
    } else {
      // Ring buffer: overwrite the oldest rather than growing without bound.
      world.sparks[world._sparkCursor] = spark;
      world._sparkCursor = (world._sparkCursor + 1) % MAX_SPARKS;
    }
  }

  world.impacts++;
}

/**
 * Positional-only containment. Called after each solver pass to undo any
 * ball that a neighbour just shoved through a wall. Velocity is left alone —
 * genuine wall bounces are handled in the integration step — except that we
 * kill any outward component so the ball doesn't keep grinding into the edge.
 */
function contain(world) {
  const { width, height } = world;
  for (const b of world.balls) {
    if (b.x < b.r) {
      b.x = b.r;
      if (b.vx < 0) b.vx = -b.vx * WALL_RESTITUTION;
    } else if (b.x > width - b.r) {
      b.x = width - b.r;
      if (b.vx > 0) b.vx = -b.vx * WALL_RESTITUTION;
    }
    if (b.y < b.r) {
      b.y = b.r;
      if (b.vy < 0) b.vy = -b.vy * WALL_RESTITUTION;
    } else if (b.y > height - b.r) {
      b.y = height - b.r;
      if (b.vy > 0) b.vy = -b.vy * WALL_RESTITUTION;
    }
  }
}

export function step(world, dt = 1) {
  const { width, height, balls } = world;

  // --- integrate + walls ---
  for (const b of balls) {
    b.age += dt;
    b.vy += GRAVITY * dt;
    b.vx *= Math.pow(DRAG, dt);
    b.vy *= Math.pow(DRAG, dt);

    const speed = Math.hypot(b.vx, b.vy);
    if (speed > MAX_SPEED) {
      b.vx = (b.vx / speed) * MAX_SPEED;
      b.vy = (b.vy / speed) * MAX_SPEED;
    }

    b.x += b.vx * dt;
    b.y += b.vy * dt;

    if (b.x - b.r < 0) {
      b.x = b.r;
      const impact = Math.abs(b.vx);
      b.vx = impact * WALL_RESTITUTION;
      if (impact > SPARK_THRESHOLD) emitSparks(world, b.r, b.y, 1, 0, impact);
    } else if (b.x + b.r > width) {
      b.x = width - b.r;
      const impact = Math.abs(b.vx);
      b.vx = -impact * WALL_RESTITUTION;
      if (impact > SPARK_THRESHOLD) {
        emitSparks(world, width - b.r, b.y, -1, 0, impact);
      }
    }

    if (b.y - b.r < 0) {
      b.y = b.r;
      const impact = Math.abs(b.vy);
      b.vy = impact * WALL_RESTITUTION;
      if (impact > SPARK_THRESHOLD) emitSparks(world, b.x, b.r, 0, 1, impact);
    } else if (b.y + b.r > height) {
      b.y = height - b.r;
      const impact = Math.abs(b.vy);
      b.vy = -impact * WALL_RESTITUTION;
      b.vx *= FLOOR_FRICTION;
      if (impact > SPARK_THRESHOLD) {
        emitSparks(world, b.x, height - b.r, 0, -1, impact);
      }
    }
  }

  // --- ball vs ball ---
  // A single correction pass isn't enough at high packing: resolving one pair
  // can shove a ball into another, or straight through a wall. So relax the
  // overlaps over a few iterations and re-clamp to the pit each time. Impulses
  // are applied on the first pass only — repeating them would pump in energy.
  for (let iter = 0; iter < SOLVER_ITERATIONS; iter++) {
    const applyImpulse = iter === 0;

    for (let i = 0; i < balls.length; i++) {
      const a = balls[i];
      for (let j = i + 1; j < balls.length; j++) {
        const b = balls[j];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const minD = a.r + b.r;
        if (Math.abs(dx) > minD || Math.abs(dy) > minD) continue;

        const dist = Math.hypot(dx, dy);
        if (dist >= minD || dist === 0) continue;

        const nx = dx / dist;
        const ny = dy / dist;
        const totalM = a.m + b.m;
        const overlap = minD - dist;

        // Split by mass so a pebble doesn't shove a boulder.
        a.x -= nx * overlap * (b.m / totalM);
        a.y -= ny * overlap * (b.m / totalM);
        b.x += nx * overlap * (a.m / totalM);
        b.y += ny * overlap * (a.m / totalM);

        if (!applyImpulse) continue;

        const rvn = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
        if (rvn >= 0) continue; // already separating

        const impulse = (-(1 + BALL_RESTITUTION) * rvn) / (1 / a.m + 1 / b.m);
        a.vx -= (impulse * nx) / a.m;
        a.vy -= (impulse * ny) / a.m;
        b.vx += (impulse * nx) / b.m;
        b.vy += (impulse * ny) / b.m;

        if (-rvn > SPARK_THRESHOLD) {
          emitSparks(world, a.x + nx * a.r, a.y + ny * a.r, nx, ny, -rvn);
        }
      }
    }

    contain(world);
  }

  // --- sparks ---
  for (let i = world.sparks.length - 1; i >= 0; i--) {
    const s = world.sparks[i];
    s.life -= dt;
    if (s.life <= 0) {
      world.sparks.splice(i, 1);
      if (world._sparkCursor > i) world._sparkCursor--;
      continue;
    }
    s.vy += GRAVITY * 0.35 * dt;
    s.vx *= Math.pow(0.93, dt);
    s.vy *= Math.pow(0.93, dt);
    s.x += s.vx * dt;
    s.y += s.vy * dt;
  }

  // --- keep the pit alive ---
  if (balls.length) {
    let sum = 0;
    for (const b of balls) sum += Math.hypot(b.vx, b.vy);
    if (sum / balls.length < ENERGY_FLOOR) {
      for (const b of balls) {
        b.vx *= ENERGY_KICK;
        b.vy = b.vy * ENERGY_KICK - 0.6;
      }
    }
  }

  return world;
}

export const constants = { SPARK_THRESHOLD, MAX_SPARKS, R_MIN, R_MAX };
