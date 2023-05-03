import React, { useState, useEffect } from "react";
import { VisualsLookupObject } from "../Visuals/VisualsLookupObject";
import useWindowSize from "../../Utilities/Hooks/useWindowResize";
const FullScreen = ({ id, toggleFullScreen }) => {
  const size = useWindowSize();
  const [width, setWidth] = useState(null);
  const [height, setHeight] = useState(null);
  const [svgHeight, setSVGHeight] = useState(null);
  const [maxHeight, setSMaxHeight] = useState(null);
  //const width = 800;
  //const height = 600;
  const handleClick = () => toggleFullScreen(id);

  useEffect(() => {
    if (size) {
      setWidth(size.width);
      setHeight(size.height);
      setSVGHeight(size.height - 450);
      setSMaxHeight(size.height - 500);
    }
  }, [size]);

  console.log("height", height);
  console.log("svgHeight", svgHeight);
  return (
    <div
      style={{
        display: "flex",
        marginTop: "35px",
      }}
    >
      <div
        style={{
          width: width,
          height: height - 200,
        }}
      >
        <div className="grid-item-wrapper">
          <div className="grid-item-container">
            <div className={`grid-banner-top ${id}`}></div>
            {size ? (
              <div>
                {VisualsLookupObject[id] ? (
                  VisualsLookupObject[id](800, svgHeight, maxHeight)
                ) : (
                  <div>{id}</div>
                )}
                <div onClick={handleClick}>
                  Close Full Screen{" "}
                  <i className="fas fa-long-arrow-alt-right"></i>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullScreen;
