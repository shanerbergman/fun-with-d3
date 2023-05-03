import React from "react";
import { VisualsLookupObject } from "../Visuals/VisualsLookupObject";

const GridItem = ({ id, toggleFullScreen }) => {
  const handleClick = () => toggleFullScreen(id);

  const width = 300;
  const height = 280;
  const max_h = 250;
  return (
    <div className="grid-item">
      <div className="grid-item-wrapper">
        <div className="grid-item-container">
          <div className={`grid-banner-top ${id}`}>
            <span className="centered project-image-bg rex-ray-image"></span>
          </div>
          <div className="grid-item-content">
            <span className="item-title">{`${id}`}</span>
            <span className="item-category">Category</span>

            {VisualsLookupObject[id] ? (
              VisualsLookupObject[id](width, height, max_h)
            ) : (
              <span className="item-excerpt">{`${id}`}</span>
            )}
            <span className="more-info">
              <div onClick={handleClick}>
                View Project <i className="fas fa-long-arrow-alt-right"></i>
              </div>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GridItem;
