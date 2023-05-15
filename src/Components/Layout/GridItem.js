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
