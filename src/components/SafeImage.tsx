"use client";

import React, { useState } from 'react';
import { ImageIcon, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackClassName?: string;
}

/**
 * DNTRNG™ SAFE IMAGE COMPONENT
 * 
 * Prevents UI crashes from empty or broken image URLs.
 * Handles error states with a standardized structural placeholder.
 */
export function SafeImage({ src, alt, className, fallbackClassName, ...props }: SafeImageProps) {
  const [error, setError] = useState(false);

  if (!src || src.trim() === "") return null;

  if (error) {
    return (
      <div className={cn(
        "bg-slate-100 flex flex-col items-center justify-center text-slate-300 p-4 rounded-xl border-2 border-dashed border-slate-200", 
        className, 
        fallbackClassName
      )}>
        <AlertCircle className="w-1/3 h-1/3 opacity-20 mb-2" />
        <span className="text-[8px] font-black uppercase tracking-tighter opacity-40">Asset Unreachable</span>
      </div>
    );
  }

  return (
    <img 
      src={src} 
      alt={alt || "Asset"} 
      onError={() => setError(true)} 
      className={className} 
      {...props} 
    />
  );
}
