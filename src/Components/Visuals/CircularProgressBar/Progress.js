import React, { useState } from "react";
import * as d3 from "d3";

const Progress = (props) => {
  const { height, svgWidth, arcWidth, progressPercentage, colorIndicator } =
    props;
  const svgHeight = svgWidth;
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
    <div
      style={{
        height: height,
      }}
    >
      <svg height={svgHeight} width={svgWidth}>
        <g transform={`translate(${svgWidth / 2}, ${svgHeight / 2})`}>
          <path d={progressArc(1)} opacity="0.2" fill="gray" />
        </g>
        <g transform={`translate(${svgWidth / 2}, ${svgHeight / 2})`}>
          <path
            d={progressArc(progressPercentage / 100)}
            fill={colorIndicator}
          />
          <text x="-10" y="5">
            {`${progressPercentage.toFixed(0)}%`}
          </text>
        </g>
      </svg>
    </div>
  );
};

export default Progress;
