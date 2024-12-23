"use client";

import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";

export const useCountUp = (end: number, duration: number = 2000) => {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    if (inView) {
      let start = 0;
      const increment = end / (duration / 16);
      const timer = setInterval(() => {
        start += increment;
        setCount(Math.min(start, end));
        if (start >= end) clearInterval(timer);
      }, 16);

      return () => clearInterval(timer);
    }
  }, [end, duration, inView]);

  return { count, ref };
};
