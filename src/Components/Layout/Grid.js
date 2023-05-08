import React, { useState } from "react";
import GridItem from "./GridItem";
import { List } from "antd";

const data = [
  {
    title: "Bouncing Ball",
    id: "bouncing_ball",
    backgroundImage: "linear-gradient(#007db8, #00447c)",
  },
  {
    title: "Circular Progress Bar",
    id: "circular_progress_bar",
    backgroundImage: "linear-gradient(#952f4c, #3e1a51)",
  },
  {
    title: "Bar Chart",
    id: "bar_chart",
    backgroundImage: "linear-gradient(#2db89a, #00793d)",
  },
  {
    title: "4 Example",
    id: "circle_plot",
    backgroundImage: "linear-gradient(#e3dd1f, #eae659)",
  },
  {
    title: "5 Example",
    id: "circle_plot",
    backgroundImage: "linear-gradient(#9d7865, #c7b5ac)",
  },
  {
    title: "6 Example",
    id: "circle_plot",
    backgroundImage: "linear-gradient(#da1414, #ffc000)",
  },
];

const Grid = () => {
  const [fullScreen, setFullScreen] = useState(null);

  const toggleFullScreen = (id) => {
    if (id === fullScreen) {
      setFullScreen(null);
    } else {
      setFullScreen(id);
    }
  };
  return (
    <div
      style={{
        padding: "10px",
      }}
    >
      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 1,
          md: 2,
          lg: 2,
          xl: 3,
          xxl: 3,
        }}
        dataSource={data}
        renderItem={(item) => (
          <List.Item>
            <GridItem
              id={item.id}
              title={item.title}
              backgroundImage={item.backgroundImage}
            ></GridItem>
          </List.Item>
        )}
      />
    </div>
  );
};

export default Grid;
