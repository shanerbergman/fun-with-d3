import React from "react";
import RGL, { WidthProvider } from "react-grid-layout";
import Charts from "../Charts/Charts";

const ReactGridLayout = WidthProvider(RGL);

const Layout = ({ children }) => {
  const layout = [
    { i: "a", x: 0, y: 0, w: 1, h: 2, static: true },
    { i: "b", x: 1, y: 0, w: 3, h: 2, minW: 2, maxW: 4 },
    { i: "c", x: 4, y: 0, w: 1, h: 2 },
  ];
  console.log("child", children);
  return (
    <div>
      <ReactGridLayout
        layout={layout}
        //onLayoutChange={this.onLayoutChange}
        className="layout"
        cols={12}
        rowHeight={30}
        width={1200}
      >
        {children}
      </ReactGridLayout>
      <Charts />
    </div>
  );
};

export default Layout;
