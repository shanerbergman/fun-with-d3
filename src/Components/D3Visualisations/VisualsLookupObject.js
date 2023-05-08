import BouncingBallContainer from "./BouncingBall/BouncingBallContainer";
import ProgressBarsContainer from "./ProgressBars/ProgressBarsContainer";
import BarChartContainer from "./BarChart/BarChartContainer";

export const VisualsLookupObject = {
  bouncing_ball: () => <BouncingBallContainer />,
  circular_progress_bar: () => <ProgressBarsContainer />,
  bar_chart: () => <BarChartContainer />,
};
