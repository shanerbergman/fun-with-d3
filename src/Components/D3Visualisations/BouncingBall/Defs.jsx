import React from "react";

/**
 * Ball fills, drawn from the site palette rather than the old neon set.
 * Each pair is [from, to] for a left-to-right linear gradient; the trailing
 * stop fades so overlapping balls read as translucent glass.
 */
const RAMPS = [
  ["#b33a21", "#e0703f"], // accent → ember
  ["#3e6ea8", "#8fb0d4"], // cool
  ["#8c5a7a", "#c9a4b8"], // plum
  ["#4e8a5c", "#a8c9a4"], // green
  ["#c4b49b", "#ede4d2"], // sand
  ["#6f675d", "#b9b1a6"], // stone
  ["#e0703f", "#f0c9a0"], // ember → clay
  ["#171412", "#6f675d"], // ink
  ["#b33a21", "#8c5a7a"], // accent → plum
  ["#3e6ea8", "#4e8a5c"], // cool → green
];

const Defs = () => (
  <defs>
    {RAMPS.map(([from, to], index) => (
      <linearGradient
        key={index}
        id={`${index + 1}`}
        x1="0%"
        y1="0%"
        x2="100%"
        y2="100%"
      >
        <stop offset="0%" stopColor={from} stopOpacity={0.85} />
        <stop offset="100%" stopColor={to} stopOpacity={0.55} />
      </linearGradient>
    ))}
  </defs>
);

export default Defs;
