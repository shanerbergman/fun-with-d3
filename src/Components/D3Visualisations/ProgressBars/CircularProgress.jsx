import React from "react";
import * as d3 from "d3";

/**
 * Shared ring. `gradientId` selects which <linearGradient> paints the sweep;
 * the caller owns the def so two rings can sit side by side with
 * different ramps.
 */
const CircularProgress = ({
  width = 220,
  height = 260,
  progressPercentage,
  gradientId,
  caption,
  children,
}) => {
  const ringWidth = 170;
  const arcWidth = 16;

  const arcGenerator = d3
    .arc()
    .innerRadius(ringWidth / 2 - arcWidth)
    .outerRadius(ringWidth / 2)
    .startAngle(0)
    .cornerRadius(8);

  const progressArc = (value) => arcGenerator({ endAngle: 2 * Math.PI * value });

  const clamped = Math.max(0, Math.min(100, progressPercentage));
  const cx = width / 2;
  const cy = height / 2 - 8;

  return (
    <svg width={width} height={height} role="img">
      <defs>{children}</defs>
      <g transform={`translate(${cx}, ${cy})`}>
        <path d={progressArc(1)} fill="var(--track)" />
        <path d={progressArc(clamped / 100)} fill={`url(#${gradientId})`} />
        <text
          textAnchor="middle"
          dy="0.34em"
          fontFamily="var(--font-serif)"
          fontSize="42"
          fill="var(--ink)"
        >
          {`${clamped.toFixed(0)}%`}
        </text>
      </g>
      {caption && (
        <text
          x={cx}
          y={height - 8}
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize="10"
          letterSpacing="0.12em"
          fill="var(--muted-2)"
        >
          {caption.toUpperCase()}
        </text>
      )}
    </svg>
  );
};

export default CircularProgress;
