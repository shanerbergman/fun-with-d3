import { useEffect, useState } from "react";

export function useColorIndication(progressPercentage) {
  const [colorIndicator, setColorIndicator] = useState("red");
  useEffect(() => {
    progressPercentage > 50
      ? setColorIndicator("green")
      : setColorIndicator("red");
  }, [progressPercentage]);
  return colorIndicator;
}
