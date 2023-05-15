import React from "react";
import * as d3 from "d3";

const CircularProgress = ({ width, height, progressPercentage }) => {
  const svgWidth = 150;
  const arcWidth = 12;

  const arcOuterRadius = svgWidth / 2;
  const arcInnerRadius = svgWidth / 2 - arcWidth;

  const arcGenerator = d3
    .arc()
    .innerRadius(arcInnerRadius)
    .outerRadius(arcOuterRadius)
    .startAngle(0)
    .cornerRadius(5);

  const progressArc = (value) =>
    arcGenerator({
      endAngle: 2 * Math.PI * value,
    });

  return (
    <>
      <svg width={width} height={height}>
        <defs>
          <linearGradient id="line1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop
              offset="0%"
              style={{ stopColor: "#952f4c", stopOpacity: 1 }}
            />
            <stop
              offset="25%"
              style={{ stopColor: "#952f4c", stopOpacity: 0.75 }}
            />
            <stop
              offset="50%"
              style={{ stopColor: "#952f4c", stopOpacity: 0.5 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: "#3e1a51", stopOpacity: 0.25 }}
            />
          </linearGradient>
        </defs>
        <circle
          cx="0"
          cy="0"
          r="90"
          transform={`translate(${width / 2}, ${height / 2})`}
          fill="white"
          stroke="gray"
          strokeWidth="1"
        />
        <g transform={`translate(${width / 2}, ${height / 2})`}>
          <path d={progressArc(1)} opacity="0.2" fill="gray" />
        </g>
        <g transform={`translate(${width / 2}, ${height / 2})`}>
          <path
            d={progressArc(progressPercentage / 100)}
            fill={`url(#line1)`}
          />
          <text x="-10" y="5">
            {`${progressPercentage.toFixed(0)}%`}
          </text>
        </g>
      </svg>
    </>
  );
};

export default CircularProgress;
