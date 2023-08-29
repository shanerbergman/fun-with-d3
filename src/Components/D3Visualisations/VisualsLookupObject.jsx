import BouncingBallContainer from "./BouncingBall/BouncingBallContainer";
import ProgressBarsContainer from "./ProgressBars/ProgressBarsContainer";
import ChartContainer from "./Charts/ChartContainer";
import MapContainer from "./Map/MapContainer";
import ChoroplethMapContainer from "./ChoroplethMap/ChoroplethMapContainer";
export const VisualsLookupObject = {
  bouncing_ball: () => <BouncingBallContainer />,
  circular_progress_bar: () => <ProgressBarsContainer />,
  line: () => <ChartContainer type={"line"} source={"Jail Data Initiative"} />,
  bar: () => <ChartContainer type={"bar"} />,
  area: () => <ChartContainer type={"area"} source={"Yahoo Finance"} />,
  map_with_geojson: () => <MapContainer />,
  choropleth_map: () => <ChoroplethMapContainer />,
};
