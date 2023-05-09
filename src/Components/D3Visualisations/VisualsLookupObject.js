import BouncingBallContainer from "./BouncingBall/BouncingBallContainer";
import ProgressBarsContainer from "./ProgressBars/ProgressBarsContainer";
import BarChartContainer from "./BarChart/BarChartContainer";
import MapContainer from "./Map/MapContainer";

export const VisualsLookupObject = {
  bouncing_ball: () => <BouncingBallContainer />,
  circular_progress_bar: () => <ProgressBarsContainer />,
  bar_chart: () => <BarChartContainer />,
  map_with_geojson: () => <MapContainer />,
};
