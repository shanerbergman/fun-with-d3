import { useEffect, useState } from "react";

export function useColorIndication(progressPercentage) {
  const [colorIndicator, setColorIndicator] = useState("red");
  useEffect(() => {
    if (progressPercentage <= 25) {
      setColorIndicator("yellow");
    }
    if (progressPercentage > 25 && progressPercentage <= 50) {
      setColorIndicator("red");
    }
    if (progressPercentage > 50) {
      setColorIndicator("green");
    }
  }, [progressPercentage]);
  return colorIndicator;
}
