import React, { useState, useEffect, useRef } from "react";
import useResizeObserver from "../../../Utilities/Hooks/useResizeObserver";
import RadialBarChart from "./RadialBarChart";

const CANVAS_HEIGHT = 340;

const RadialBarsContainer = () => {
  const containerRef = useRef();
  const dimensions = useResizeObserver(containerRef);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (dimensions) setWidth(dimensions.width);
  }, [dimensions]);

  return (
    <>
      <div className="viz-card__body radial-body" ref={containerRef}>
        {width > 0 && <RadialBarChart width={width} height={CANVAS_HEIGHT} />}
      </div>
      <div className="viz-card__foot">
        <span className="viz-card__note">
          Hover the ring for that week&rsquo;s close · Yahoo Finance
        </span>
      </div>
    </>
  );
};

export default RadialBarsContainer;
