import { useState, useEffect } from "react";
/*
  Source: https://usehooks.com/useWindowSize/
*/
export default function useWindowSize() {
  const [windowSize, setWindowSize] = useState(null);
  const getSize = () => {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  };
  useEffect(() => {
    const handleResize = () => {
      setWindowSize(getSize());
    };
    // set initial window size
    setWindowSize(getSize());
    // add event listeners
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
}
