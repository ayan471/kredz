"use client";

import { useEffect, useRef } from "react";

export function APRChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Dynamically import Chart.js to avoid SSR issues
    import("chart.js/auto").then(({ default: Chart }) => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const gridColor = "rgba(148,163,184,0.2)";
      const tickColor = "#94a3b8";

      const chart = new Chart(ctx, {
        type: "line",
        data: {
          labels: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ],
          datasets: [
            {
              label: "Avg APR",
              data: [
                10.4, 10.2, 10.1, 9.9, 9.7, 9.6, 9.5, 9.4, 9.3, 9.2, 9.2, 9.1,
              ],
              borderColor: "rgba(59,130,246,0.9)",
              backgroundColor: "rgba(59,130,246,0.15)",
              pointBackgroundColor: "rgba(59,130,246,1)",
              pointBorderColor: "rgba(255,255,255,0.8)",
              pointRadius: 2,
              pointHoverRadius: 4,
              pointHitRadius: 10,
              tension: 0.35,
              fill: true,
              borderWidth: 2,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: { mode: "nearest", intersect: false },
          layout: { padding: 0 },
          plugins: {
            legend: { display: false },
            tooltip: {
              mode: "index",
              intersect: false,
              backgroundColor: "rgba(15,23,42,0.9)",
              titleColor: "#e2e8f0",
              bodyColor: "#e2e8f0",
              borderColor: "rgba(148,163,184,0.3)",
              borderWidth: 1,
              padding: 10,
              displayColors: false,
            },
          },
          scales: {
            x: {
              grid: { color: gridColor, drawBorder: false },
              ticks: {
                color: tickColor,
                font: { family: "Inter" },
                maxTicksLimit: 6,
                autoSkip: true,
              },
            },
            y: {
              grid: { color: gridColor, drawBorder: false },
              ticks: {
                color: tickColor,
                font: { family: "Inter" },
                maxTicksLimit: 5,
                callback: (value) => `${value}%`,
              },
            },
          },
        },
      });

      return () => {
        try {
          chart.destroy();
        } catch {
          // no-op
        }
      };
    });
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden">
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
