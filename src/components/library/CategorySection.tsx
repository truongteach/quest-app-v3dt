"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { CardView } from './CardView';
import { ListView } from './ListView';

interface CategorySectionProps {
  name: string;
  tests: any[];
  viewMode: 'card' | 'list';
  isDefaultExpanded: boolean;
  isSearching: boolean;
}

export function CategorySection({ 
  name, 
  tests, 
  viewMode, 
  isDefaultExpanded,
  isSearching 
}: CategorySectionProps) {
  const [isExpanded, setIsExpanded] = useState(isDefaultExpanded);
  
  // Persistent expansion protocol
  const storageKey = `dntrng_cat_expanded_${name}`;

  useEffect(() => {
    if (isSearching) {
      setIsExpanded(true);
      return;
    }
    const saved = localStorage.getItem(storageKey);
    if (saved !== null) {
      setIsExpanded(saved === 'true');
    } else {
      setIsExpanded(isDefaultExpanded);
    }
  }, [isDefaultExpanded, isSearching, storageKey]);

  const toggle = () => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    localStorage.setItem(storageKey, String(newState));
  };

  const getTierColor = (catName: string) => {
    const n = catName.toUpperCase();
    if (n.includes("LV1") || n.includes("1")) return "#22C55E";
    if (n.includes("LV2") || n.includes("2")) return "#3B5BDB";
    if (n.includes("LV3") || n.includes("3")) return "#7C3AED";
    if (n.includes("LV4") || n.includes("4")) return "#F59E0B";
    return "#6B7280";
  };

  const color = getTierColor(name);

  const diffMix = useMemo(() => {
    const mix = { easy: false, medium: false, hard: false };
    tests.forEach(t => {
      const d = String(t.difficulty).toLowerCase();
      if (d === 'easy' || d === 'beginner') mix.easy = true;
      if (d === 'medium') mix.medium = true;
      if (d === 'hard') mix.hard = true;
    });
    return mix;
  }, [tests]);

  return (
    <div className="animate-in fade-in duration-500">
      <button 
        onClick={toggle}
        className={cn(
          "w-full flex items-center justify-between h-12 px-2 transition-all duration-150 group cursor-pointer border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:rounded-lg"
        )}
      >
        <div className="flex items-center gap-3">
          {/* Colored Indicator */}
          <div 
            className="w-2.5 h-2.5 rounded-full shrink-0" 
            style={{ backgroundColor: color }} 
          />
          
          {/* Category Name */}
          <h3 
            className="text-[14px] font-semibold tracking-tight leading-none"
            style={{ color: color }}
          >
            {name}
          </h3>

          {/* Test Count Pill */}
          <div className="px-2 py-0.5 border border-slate-200 dark:border-slate-700 rounded-full">
            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500">
              {tests.length} {tests.length === 1 ? 'test' : 'tests'}
            </span>
          </div>

          {/* Difficulty Dots */}
          <div className="flex items-center gap-[3px] ml-1">
            {diffMix.easy && <div className="w-[7px] h-[7px] rounded-full bg-emerald-500" title="Easy" />}
            {diffMix.medium && <div className="w-[7px] h-[7px] rounded-full bg-amber-500" title="Medium" />}
            {diffMix.hard && <div className="w-[7px] h-[7px] rounded-full bg-rose-500" title="Hard" />}
          </div>
        </div>

        <div className="flex items-center text-slate-400">
          <ChevronDown 
            className={cn(
              "w-5 h-5 transition-transform duration-200",
              isExpanded ? "rotate-0" : "-rotate-90"
            )} 
          />
        </div>
      </button>

      <div className={cn(
        "transition-all duration-500 overflow-hidden",
        isExpanded ? "max-h-[10000px] opacity-100 mt-3 pb-8" : "max-h-0 opacity-0 pointer-events-none"
      )}>
        {viewMode === 'card' ? (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
            <CardView tests={tests} />
          </div>
        ) : (
          <div className="flex flex-col gap-[10px]">
            <ListView tests={tests} />
          </div>
        )}
      </div>
    </div>
  );
}
