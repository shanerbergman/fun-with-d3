import React, { useState, useEffect } from "react";
import { VisualsLookupObject } from "../D3Visualisations/VisualsLookupObject";
import { Card } from "antd";

const GridItem = ({ id, title, backgroundImage }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  return (
    <div>
      <Card
        loading={loading}
        title={title}
        headStyle={{
          backgroundImage: backgroundImage,
          color: "#ffffff",
        }}
      >
        {VisualsLookupObject[id] ? (
          VisualsLookupObject[id]()
        ) : (
          <span className="item-excerpt">{`content`}</span>
        )}
      </Card>
    </div>
  );
};

export default GridItem;

/*
<div className="grid-item">
      <div className="grid-item-wrapper">
        <div ref={containerRef} className="grid-item-container">
          <div className={`grid-banner-top ${id}`}>
            <span className="centered project-image-bg rex-ray-image"></span>
          </div>
          <div className="grid-item-content">
            <span className="item-title">{`${id}`}</span>
            <span className="item-category">Category</span>

            {VisualsLookupObject[id] ? (
              VisualsLookupObject[id](width, height, maxH, maxW)
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
    </div>*/
