import { useState, useRef, useEffect } from "react";

export default function useFrame(callback, autostart = false) {
  const requestRef = useRef();
  const previousTimeRef = useRef();
  const startTimeRef = useRef();
  const stopTimeRef = useRef(0);
  const maxTimeRef = useRef();
  const [isRunning, setIsRunning] = useState(autostart);

  const animate = (time) => {
    if (!startTimeRef.current) {
      startTimeRef.current = time;
    }
    if (previousTimeRef.current != undefined) {
      const delta = time - previousTimeRef.current;
      const fromStart = time - startTimeRef.current;
      if (maxTimeRef.current && fromStart >= maxTimeRef.current) {
        startTimeRef.current = 0;
        callback({
          time,
          delta: 0,
          fromStart: 0,
          //fromFirstStart: 0,
          progress: 0,
        });
      } else {
        callback({
          time,
          delta,
          fromStart,
          //fromFirstStart: fromStart + stopTimeRef.current,
          //stopTime: stopTimeRef.current,
          progress: maxTimeRef.current ? fromStart / maxTimeRef.current : 0,
        });
      }
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  };

  function start(maxTime) {
    if (isRunning) {
      stop();
    }
    if (maxTime) {
      maxTimeRef.current = maxTime;
    }
    requestRef.current = requestAnimationFrame(animate);
    setIsRunning(true);
  }

  function stop() {
    if (previousTimeRef.current && startTimeRef.current) {
      stopTimeRef.current =
        previousTimeRef.current - startTimeRef.current + stopTimeRef.current;
    }

    cancelAnimationFrame(requestRef.current);
    startTimeRef.current = 0;
    requestRef.current = null;
    setIsRunning(false);
  }
  function toggle() {
    if (!requestRef.current) {
      start(25000);
    } else {
      stop();
    }
  }

  useEffect(() => {
    autostart && start(25000);
    return () => stop();
  }, [autostart]); // Make sure the effect runs only once
  return { start, stop, toggle, isRunning };
}
