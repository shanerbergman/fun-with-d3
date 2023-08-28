import React from "react";
import GridItem from "./GridItem";
import { List } from "antd";

const dataTop = [
  {
    title: "Bouncing Balls",
    id: "bouncing_ball",
    backgroundImage: "linear-gradient(#007db8, #00447c)",
  },
  {
    title: "Circular Progress Bar",
    id: "circular_progress_bar",
    backgroundImage: "linear-gradient(#952f4c, #3e1a51)",
  },
];

const dataMiddle = [
  {
    title: "Charts - Area",
    id: "area",
    backgroundImage: "linear-gradient(#2db89a, #00793d)",
  },
  {
    title: "Charts - Line",
    id: "line",
    backgroundImage: "linear-gradient(#2db89a, #00793d)",
  },
  {
    title: "Charts - Bar",
    id: "bar",
    backgroundImage: "linear-gradient(#2db89a, #00793d)",
  },
];

const dataBottom = [
  {
    title: "Simple Map with Hover Over",
    id: "map_with_geojson",
    backgroundImage: "linear-gradient(#e3dd1f, #eae659)",
  },
  {
    title: "Choropleth Map",
    id: "choropleth_map",
    backgroundImage: "linear-gradient(#da1414, #ffc000)",
  },
];

const Grid = () => {
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
          md: 1,
          lg: 2,
          xl: 2,
          xxl: 2,
        }}
        dataSource={dataTop}
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
      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 1,
          md: 1,
          lg: 1,
          xl: 1,
          xxl: 1,
        }}
        dataSource={dataMiddle}
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
      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 1,
          md: 1,
          lg: 2,
          xl: 2,
          xxl: 2,
        }}
        dataSource={dataBottom}
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
