import React from "react";

const GridItem = ({ id }) => {
  return (
    <div className="grid-item">
      <div className="grid-item-wrapper">
        <div className="grid-item-container">
          <div className={`grid-image-top ${id}`}>
            <span className="centered project-image-bg rex-ray-image"></span>
          </div>
          <div className="grid-item-content">
            <span className="item-title">{`${id}`}</span>
            <span className="item-category">Category</span>
            <span className="item-excerpt">{`${id}`}</span>
            <span className="more-info">
              View Project <i className="fas fa-long-arrow-alt-right"></i>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GridItem;
