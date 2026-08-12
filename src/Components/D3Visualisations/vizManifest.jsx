import BouncingBallContainer from "./BouncingBall/BouncingBallContainer";
import RadialBarsContainer from "./RadialBars/RadialBarsContainer";
import ProgressBarsContainer from "./ProgressBars/ProgressBarsContainer";
import ChartContainer from "./Charts/ChartContainer";
import MapContainer from "./Map/MapContainer";
import ChoroplethMapContainer from "./ChoroplethMap/ChoroplethMapContainer";

/**
 * Single source of truth for the gallery. Each entry carries its own card
 * chrome (eyebrow / title / tag / stats) alongside the component to render,
 * so the layout never has to know what a given visualization is.
 *
 *   wide: true  → full-width chart card (paler plot bg, larger title)
 *   wide: false → half-width toy card
 */
export const sections = [
  {
    id: "toys",
    title: "Toys",
    meta: "Interactive · collision physics, d3-scaleRadial, arc tween",
    layout: "split",
    items: [
      {
        id: "bouncing_ball",
        eyebrow: "Toy 01",
        title: "Bouncing Balls",
        tag: "Collision",
        render: () => <BouncingBallContainer />,
      },
      {
        id: "radial_bars",
        eyebrow: "Toy 02",
        title: "Bitcoin, by Week",
        tag: "Radial bars",
        render: () => <RadialBarsContainer />,
      },
      {
        id: "circular_progress_bar",
        eyebrow: "Toy 03",
        title: "Circular Progress",
        tag: "Arc tween",
        render: () => <ProgressBarsContainer />,
      },
    ],
  },
  {
    id: "charts",
    title: "Charts",
    meta: "Real datasets · drag the range to filter",
    layout: "full",
    items: [
      {
        id: "line",
        eyebrow: "Chart 01 — Line",
        title: "US Prison Populations",
        tag: "Jail Data Initiative",
        wide: true,
        stats: [
          { label: "Mar 2020 low", value: "88,400" },
          { label: "Jul 2023", value: "122,100" },
        ],
        render: () => <ChartContainer type="line" />,
      },
      {
        id: "area",
        eyebrow: "Chart 02 — Area",
        title: "Bitcoin Price, USD",
        tag: "Yahoo Finance",
        wide: true,
        stats: [
          { label: "Peak", value: "$67,500" },
          { label: "Span", value: "2014 — 2023" },
        ],
        render: () => <ChartContainer type="area" />,
      },
      {
        id: "bar",
        eyebrow: "Chart 03 — Bar",
        title: "Widgets Sold",
        tag: "Sample data",
        wide: true,
        render: () => <ChartContainer type="bar" />,
      },
    ],
  },
  {
    id: "maps",
    title: "Maps",
    meta: "Geography · topojson, d3-geo",
    layout: "split",
    items: [
      {
        id: "map_with_geojson",
        eyebrow: "Map 01",
        title: "States, on Hover",
        tag: "GeoJSON",
        render: () => <MapContainer />,
      },
      {
        id: "choropleth_map",
        eyebrow: "Map 02",
        title: "Choropleth",
        tag: "Sequential scale",
        render: () => <ChoroplethMapContainer />,
      },
    ],
  },
];

export default sections;
