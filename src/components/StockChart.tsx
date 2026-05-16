"use client";

import { useEffect, useRef } from "react";
import { createChart, ColorType, IChartApi, ISeriesApi, AreaSeries, LineSeries } from "lightweight-charts";

interface StockChartProps {
  history: number[]; // Weekly prices
  isUp: boolean;
}

export default function StockChart({ history, isUp }: StockChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Area"> | null>(null);
  const ma5Ref = useRef<ISeriesApi<"Line"> | null>(null);
  const ma20Ref = useRef<ISeriesApi<"Line"> | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Create Chart
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "rgba(255, 255, 255, 0.4)",
      },
      grid: {
        vertLines: { color: "rgba(255, 255, 255, 0.05)" },
        horzLines: { color: "rgba(255, 255, 255, 0.05)" },
      },
      rightPriceScale: {
        borderVisible: false,
      },
      timeScale: {
        borderVisible: false,
        timeVisible: false, // It's just abstract "weeks"
      },
      crosshair: {
        horzLine: {
          color: "rgba(255, 255, 255, 0.2)",
          labelBackgroundColor: "#333",
        },
        vertLine: {
          color: "rgba(255, 255, 255, 0.2)",
          labelBackgroundColor: "#333",
        },
      },
    });

    chartRef.current = chart;

    // Area Series (Price)
    const lineColor = isUp ? "#ef4444" : "#3b82f6";
    const topColor = isUp ? "rgba(239, 68, 68, 0.3)" : "rgba(59, 130, 246, 0.3)";
    const bottomColor = isUp ? "rgba(239, 68, 68, 0.0)" : "rgba(59, 130, 246, 0.0)";

    const areaSeries = chart.addSeries(AreaSeries, {
      lineColor,
      topColor,
      bottomColor,
      lineWidth: 2,
      priceFormat: {
        type: 'price',
        precision: 0,
        minMove: 1,
      },
    });
    seriesRef.current = areaSeries;

    // Moving Averages
    const ma5Series = chart.addSeries(LineSeries, {
      color: "#fbbf24", // Yellow for short term
      lineWidth: 1,
      crosshairMarkerVisible: false,
      lastValueVisible: false,
      priceLineVisible: false,
    });
    ma5Ref.current = ma5Series;

    const ma20Series = chart.addSeries(LineSeries, {
      color: "#a78bfa", // Purple for long term
      lineWidth: 1,
      crosshairMarkerVisible: false,
      lastValueVisible: false,
      priceLineVisible: false,
    });
    ma20Ref.current = ma20Series;

    // Prepare Data
    // history is just an array of numbers. We need `{ time, value }`.
    // Since we don't have real dates, we'll use an integer sequence for time.
    // However, lightweight charts requires time to be either a string 'yyyy-mm-dd', or unix timestamp.
    // We'll use a dummy timestamp starting from 2015-01-01 + weeks.
    
    let baseTime = new Date(2015, 0, 1).getTime() / 1000;
    
    const priceData = history.map((price, idx) => ({
      time: (baseTime + idx * 7 * 24 * 3600) as any,
      value: price,
    }));

    areaSeries.setData(priceData);

    // Calculate MA5
    const ma5Data = [];
    for (let i = 0; i < history.length; i++) {
      if (i < 4) continue;
      let sum = 0;
      for (let j = 0; j < 5; j++) sum += history[i - j];
      ma5Data.push({
        time: priceData[i].time,
        value: sum / 5,
      });
    }
    ma5Series.setData(ma5Data);

    // Calculate MA20
    const ma20Data = [];
    for (let i = 0; i < history.length; i++) {
      if (i < 19) continue;
      let sum = 0;
      for (let j = 0; j < 20; j++) sum += history[i - j];
      ma20Data.push({
        time: priceData[i].time,
        value: sum / 20,
      });
    }
    ma20Series.setData(ma20Data);

    chart.timeScale().fitContent();

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [history, isUp]);

  return (
    <div className="w-full relative">
      {/* Legend / Info */}
      <div className="absolute top-2 left-2 z-10 flex space-x-3 text-[9px] font-bold">
        <span className="text-white/60">
          <span className="w-2 h-2 inline-block rounded-full bg-[#ef4444] mr-1 opacity-80" /> 가격
        </span>
        <span className="text-yellow-400">
          <span className="w-2 h-2 inline-block rounded-full bg-[#fbbf24] mr-1 opacity-80" /> 5주선
        </span>
        <span className="text-purple-400">
          <span className="w-2 h-2 inline-block rounded-full bg-[#a78bfa] mr-1 opacity-80" /> 20주선
        </span>
      </div>
      
      {/* Chart Container */}
      <div ref={chartContainerRef} className="w-full h-[220px]" />
    </div>
  );
}
