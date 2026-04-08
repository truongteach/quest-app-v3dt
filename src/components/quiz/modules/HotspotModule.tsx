"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Question, HotspotZone } from '@/types/quiz';
import { cn } from "@/lib/utils";

interface Props {
  question: Question;
  value: any;
  onChange: (val: any) => void;
  reviewMode?: boolean;
}

export const HotspotModule: React.FC<Props> = ({ question, value, onChange, reviewMode }) => {
  const [imgSrc, setImgSrc] = useState<string | undefined>(undefined);
  const [aspectRatio, setAspectRatio] = useState<number>(0.5625);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setImgSrc(question.image_url && question.image_url.trim() !== "" ? question.image_url : 'https://picsum.photos/seed/dntrng-placeholder/800/450');
  }, [question.image_url]);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setContainerSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height
        });
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    setAspectRatio(img.naturalHeight / img.naturalWidth);
  };

  const zones: HotspotZone[] = JSON.parse(question.metadata || "[]").map((z: any) => {
    // Migration Protocol: radius -> rect
    if ('radius' in z && !('width' in z)) {
      const r = z.radius;
      return {
        ...z,
        x: z.x - r,
        y: z.y - r,
        width: r * 2,
        height: r * 2
      };
    }
    return z;
  });

  const handleClick = (e: React.MouseEvent) => {
    if (reviewMode || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    onChange({ x, y });
  };

  const userCoords = value as { x: number; y: number } | null;

  return (
    <div className="space-y-6">
      <div 
        className="relative w-full shadow-2xl rounded-[2.5rem] overflow-hidden bg-slate-900"
        style={{ paddingBottom: `${aspectRatio * 100}%`, height: 0 }}
      >
        <div 
          ref={containerRef}
          className={cn(
            "absolute inset-0 transition-opacity duration-500",
            reviewMode ? "cursor-default" : "cursor-crosshair"
          )}
          onClick={handleClick}
        >
          {imgSrc && (
            <img 
              src={imgSrc} 
              alt="Spatial Module" 
              onLoad={handleImageLoad}
              className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none" 
              draggable={false} 
            />
          )}

          {/* Interaction Layer */}
          <div className="absolute inset-0 pointer-events-none">
            {/* User Interaction Marker */}
            {userCoords && !reviewMode && (
              <div 
                className="absolute w-8 h-8 border-4 border-white rounded-full bg-primary/80 shadow-2xl ring-8 ring-primary/10 -translate-x-1/2 -translate-y-1/2 animate-in zoom-in duration-300"
                style={{ left: `${userCoords.x}%`, top: `${userCoords.y}%` }}
              />
            )}

            {/* Diagnostic Results Overlay */}
            {reviewMode && zones.map((z) => {
              const isHit = userCoords && 
                userCoords.x >= z.x && userCoords.x <= z.x + z.width &&
                userCoords.y >= z.y && userCoords.y <= z.y + z.height;
              
              const isCorrect = z.isCorrect;
              
              // Protocol Logic:
              // - Green: Correct node successfully hit
              // - Red: Incorrect node hit OR Correct node missed
              // - Grey: Correct node (if none hit yet) or standard distractor
              
              let borderColor = "border-slate-300/30";
              let bgColor = "bg-transparent";
              let showStatus = false;

              if (isHit && isCorrect) {
                borderColor = "border-emerald-500";
                bgColor = "bg-emerald-500/20";
                showStatus = true;
              } else if (isHit && !isCorrect) {
                borderColor = "border-rose-500";
                bgColor = "bg-rose-500/20";
                showStatus = true;
              } else if (!isHit && isCorrect) {
                borderColor = "border-rose-500/50";
                bgColor = "bg-rose-500/10";
                showStatus = true;
              }

              return (
                <div 
                  key={z.id} 
                  className={cn(
                    "absolute border-4 transition-all duration-700 flex items-center justify-center rounded-lg",
                    borderColor,
                    bgColor
                  )} 
                  style={{ 
                    left: `${z.x}%`, 
                    top: `${z.y}%`, 
                    width: `${z.width}%`, 
                    height: `${z.height}%` 
                  }}
                >
                  <div className="flex flex-col items-center gap-1">
                    <span className={cn(
                      "option-text text-[9px] font-black text-white px-2 py-0.5 rounded-full border shadow-xl backdrop-blur-md",
                      isCorrect ? "bg-emerald-600 border-emerald-400" : "bg-slate-600 border-slate-400"
                    )}>
                      {z.label}
                    </span>
                    {isHit && (
                      <div className="w-2 h-2 rounded-full bg-white shadow-xl animate-pulse" />
                    )}
                  </div>
                </div>
              );
            })}

            {/* Final Interaction Trace (Review Mode Only) */}
            {reviewMode && userCoords && (
              <div 
                className="absolute w-4 h-4 border-2 border-white rounded-full bg-slate-900 shadow-2xl -translate-x-1/2 -translate-y-1/2 opacity-50"
                style={{ left: `${userCoords.x}%`, top: `${userCoords.y}%` }}
              />
            )}
          </div>
        </div>
      </div>
      
      {!reviewMode && (
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
          {userCoords ? "Position Logged" : "Click to Identify Target Node"}
        </p>
      )}
    </div>
  );
};
