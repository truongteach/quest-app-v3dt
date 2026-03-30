"use client";

import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    setImgSrc(question.image_url && question.image_url.trim() !== "" ? question.image_url : 'https://picsum.photos/seed/dntrng-placeholder/800/450');
  }, [question.image_url]);

  const coords = (value as { x: number; y: number } | null);
  const zones: HotspotZone[] = JSON.parse(question.metadata || "[]");

  return (
    <div className="space-y-4">
      <div 
        className="hotspot-container relative w-full aspect-video border-4 border-white rounded-[2rem] overflow-hidden cursor-crosshair shadow-2xl bg-muted"
        onClick={(e) => {
          if (reviewMode) return;
          const rect = e.currentTarget.getBoundingClientRect();
          onChange({ x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 });
        }}
      >
        {imgSrc && (
          <img 
            src={imgSrc} 
            alt="Question" 
            className="w-full h-full object-cover select-none" 
            draggable={false} 
          />
        )}
        {coords && (
          <div className="absolute w-10 h-10 border-4 border-white rounded-full -translate-x-1/2 -translate-y-1/2 shadow-2xl ring-8 bg-primary/80 ring-primary/10" style={{ left: `${coords.x}%`, top: `${coords.y}%` }} />
        )}
        {reviewMode && zones.map((z: HotspotZone) => (
          <div key={z.id} className={cn("absolute border-4 border-dashed rounded-full -translate-x-1/2 -translate-y-1/2 flex items-center justify-center", z.isCorrect ? "border-green-500 bg-green-500/10" : "border-slate-400 bg-slate-400/10")} style={{ left: `${z.x}%`, top: `${z.y}%`, width: `${z.radius * 2}%`, height: `${z.radius * 2}%` }}>
            <span className={cn("option-text text-[10px] font-black text-white px-2 py-0.5 rounded-full border shadow-md", z.isCorrect ? "bg-green-600 border-green-400" : "bg-slate-600 border-slate-400")}>{z.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
