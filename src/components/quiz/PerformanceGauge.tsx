"use client";

import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface PerformanceGaugeProps {
  percentage: number;
  score: number;
  totalQuestions: number;
  isPass?: boolean;
  compact?: boolean;
}

export function PerformanceGauge({ percentage, score, totalQuestions, isPass: isPassProp, compact = false }: PerformanceGaugeProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const duration = 1500; // 1.5 seconds reveal protocol

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const currentVal = Math.floor(easedProgress * percentage);
      setDisplayValue(currentVal);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setDisplayValue(percentage);
        setIsFinished(true);
      }
    };

    window.requestAnimationFrame(step);
  }, [percentage]);

  const isMastery = percentage >= 80;
  const passed = isPassProp !== undefined ? isPassProp : percentage >= 50;
  
  const ringColor = isMastery 
    ? "stroke-emerald-500" 
    : passed 
      ? "stroke-amber-500" 
      : "stroke-rose-500";

  const textColor = passed ? "text-emerald-600" : "text-rose-600";

  // Compact size: 100px diameter (r: 45 + stroke: 5)
  // Large size: 160px diameter (r: 80 + stroke: 14)
  const radius = compact ? 44 : 80;
  const strokeWidth = compact ? 8 : 14;
  const viewBoxSize = compact ? 100 : 288;
  const center = viewBoxSize / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (displayValue / 100) * circumference;

  const content = (
    <div className={cn("relative flex items-center justify-center", compact ? "w-28 h-28" : "w-72 h-72")}>
      <div className={cn(
        "absolute inset-0 rounded-full blur-[40px] opacity-10 transition-all duration-1000",
        isMastery ? "bg-emerald-500" : passed ? "bg-amber-500" : "bg-rose-500"
      )} />
      
      <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}>
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-slate-100"
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="transparent"
          className={cn("transition-all duration-150 ease-out drop-shadow-[0_0_8px_rgba(0,0,0,0.05)]", ringColor)}
        />
      </svg>
      <div className={cn(
        "absolute flex flex-col items-center text-center transition-transform duration-500 ease-out",
        isFinished ? "scale-110" : "scale-100"
      )}>
        <span className={cn(
          "font-black tracking-tighter tabular-nums transition-colors duration-700 leading-none",
          compact ? "text-3xl" : "text-8xl",
          isFinished ? textColor : "text-slate-900"
        )}>
          {displayValue}%
        </span>
        {!compact && (
          <span className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 mt-2">Score</span>
        )}
      </div>
    </div>
  );

  if (compact) {
    return content;
  }

  return (
    <Card className="lg:col-span-5 border-none shadow-2xl rounded-[3rem] bg-white border-slate-100 overflow-hidden flex flex-col items-center justify-center p-12 relative group transition-all duration-500">
      {content}
      <div className="mt-12 grid grid-cols-2 gap-10 w-full border-t border-slate-100 pt-12">
        <div className="text-center group/stat">
          <p className="text-4xl font-black text-emerald-600">{score}</p>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 mt-2 border border-emerald-100">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600/80">Correct</span>
          </div>
        </div>
        <div className="text-center border-l border-slate-100 group/stat">
          <p className="text-4xl font-black text-rose-600">{totalQuestions - score}</p>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 mt-2 border border-rose-100">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-rose-600/80">Incorrect</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
