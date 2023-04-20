import React, { useState, useEffect } from "react";
import RGL, { Responsive, WidthProvider } from "react-grid-layout";
import { ChartLookup } from "../Charts/ChartLookup";
import "./Layout.css";
import { SizeMe } from "react-sizeme";
import useWindowSize from "../../Utilities/Hooks/useWindowResize";
const ReactGridLayout = WidthProvider(RGL);
const ResponsiveGridLayout = WidthProvider(Responsive);
const LAYOUT = [
  { i: "1", x: 0, y: 0, w: 6, h: 6 },
  { i: "b", x: 3, y: 0, w: 3, h: 2 },
  { i: "c", x: 6, y: 0, w: 3, h: 2 },
];

const Layout = () => {
  const [layout, setLayout] = useState({});
  const resize = useWindowSize();

  //console.log("resize", resize);
  const rows = [];
  const [W, setW] = useState(4);
  const [gridKey, setGridKey] = useState(1);

  const width = resize ? resize.width : 1000;
  for (const [key, value] of Object.entries(ChartLookup)) {
    //console.log(`${key}: ${value}`);

    rows.push(<div key={key}>{value()}</div>);
  }

  const onLayoutChange = (layout, layouts) => {
    //console.log("layout", layout);
    console.log("layouts ===", layouts);
    setLayout(layouts);
  };

  /*useEffect(() => {
    if (resize && resize.width) {
      if (resize.width < 1200 && resize.width >= 996) {
        setW(10);

        setGridKey(gridKey + 1);
        setLayout([
          { w: 5, h: 8, x: 0, y: 0, i: "1" },

          { w: 5, h: 8, x: 4, y: 8, i: "2" },

          { w: 5, h: 8, x: 5, y: 16, i: "3" },

          { w: 5, h: 8, x: 0, y: 16, i: "4" },

          { w: 5, h: 8, x: 4, y: 24, i: "5" },
        ]);
        console.log("RESIZE EFFF======", resize, gridKey);
      }
    }
  }, [resize]);*/

  return (
    <div>
      <ResponsiveGridLayout
        key={gridKey}
        layout={layout}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        rowHeight={30}
        onLayoutChange={onLayoutChange}
        width={width}
      >
        <div key="1" data-grid={{ w: 4, h: 8, x: 0, y: 0, minW: 2, minH: 3 }}>
          {ChartLookup["a"]()}
        </div>
        <div key="2" data-grid={{ w: 4, h: 8, x: 4, y: 0, minW: 2, minH: 3 }}>
          {ChartLookup["b"]()}
        </div>
        <div key="3" data-grid={{ w: 4, h: 8, x: 8, y: 0, minW: 2, minH: 3 }}>
          {ChartLookup["c"]()}
        </div>
        <div key="4" data-grid={{ w: 4, h: 8, x: 0, y: 8, minW: 2, minH: 3 }}>
          {ChartLookup["d"]()}
        </div>
        <div key="5" data-grid={{ w: 4, h: 8, x: 4, y: 8, minW: 2, minH: 3 }}>
          {ChartLookup["e"]()}
        </div>
      </ResponsiveGridLayout>
    </div>
  );
};

export default Layout;

/*
 <ResponsiveGridLayout
        layout={layout}
        onLayoutChange={onLayoutChange}
        className="layout"
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={30}
        //width={1200}
      >
        <div key="1" data-grid={{ w: 4, h: 8, x: 0, y: 0, minW: 2, minH: 3 }}>
          {ChartLookup["a"]()}
        </div>
        <div key="2" data-grid={{ w: 4, h: 8, x: 4, y: 0, minW: 2, minH: 3 }}>
          {ChartLookup["b"]()}
        </div>
        <div key="3" data-grid={{ w: 4, h: 8, x: 8, y: 0, minW: 2, minH: 3 }}>
          {ChartLookup["c"]()}
        </div>
        <div key="4" data-grid={{ w: 4, h: 8, x: 0, y: 8, minW: 2, minH: 3 }}>
          {ChartLookup["d"]()}
        </div>
        <div key="5" data-grid={{ w: 4, h: 8, x: 4, y: 8, minW: 2, minH: 3 }}>
          {ChartLookup["e"]()}
        </div>
      </ResponsiveGridLayout>
      */
