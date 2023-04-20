import React from "react";
import ChartA from "./ChartA";
import ChartB from "./ChartB";
import ChartC from "./ChartC";
import ChartD from "./ChartD";
import ChartE from "./ChartE";
import ChartContainer from "./ChartContainer";
export const ChartLookup = {
  a: () => {
    return (
      <ChartContainer>
        <ChartA />
      </ChartContainer>
    );
  },
  b: () => {
    return (
      <ChartContainer>
        <ChartB />
      </ChartContainer>
    );
  },
  c: () => {
    return (
      <ChartContainer>
        <ChartC />
      </ChartContainer>
    );
  },
  d: () => {
    return (
      <ChartContainer>
        <ChartD />
      </ChartContainer>
    );
  },
  e: () => {
    return (
      <ChartContainer>
        <ChartE />
      </ChartContainer>
    );
  },
};
