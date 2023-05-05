import React, { useState, useEffect } from "react";
import { VisualsLookupObject } from "../Visuals/VisualsLookupObject";
import { useDimensions } from "../../Utilities/Hooks/useDimensions";
import useWindowResize from "../../Utilities/Hooks/useWindowResize";
const FullScreen = ({ id, toggleFullScreen }) => {
  const handleClick = () => toggleFullScreen(id);
  const size = useWindowResize();
  const [{ height, width }, containerRef] = useDimensions();
  console.log("FULL SCREEN HEIGHT", height);
  return (
    <div
      style={{
        display: "flex",
        marginTop: "35px",
        height: size ? size.height : "100px",
      }}
    >
      <div className="grid-item-wrapper">
        <div ref={containerRef} className="grid-item-container">
          <div className={`grid-banner-top ${id}`}></div>

          <div>
            {VisualsLookupObject[id] ? (
              VisualsLookupObject[id](width, height - 300)
            ) : (
              <div>{id}</div>
            )}
            <div onClick={handleClick}>
              Close Full Screen <i className="fas fa-long-arrow-alt-right"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullScreen;
