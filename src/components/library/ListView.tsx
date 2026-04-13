
"use client";

import React from 'react';
import Link from 'next/link';
import { Clock, ListChecks, FileText, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ListViewProps {
  tests: any[];
}

export function ListView({ tests }: ListViewProps) {
  const getCategoryGradient = (category: string) => {
    const cat = String(category || "").toUpperCase();
    if (cat.includes("LV1")) return "from-[#059669] to-[#34d399]";
    if (cat.includes("LV2")) return "from-[#1d4ed8] to-[#60a5fa]";
    if (cat.includes("LV3")) return "from-[#7c3aed] to-[#c084fc]";
    return "from-[#1a2340] to-[#3B5BDB]";
  };

  const getDifficultyClasses = (diff: string) => {
    const d = String(diff || "").toLowerCase();
    if (d === 'beginner' || d === 'easy') return 'bg-emerald-500 text-emerald-500 border-emerald-500/20';
    if (d === 'medium') return 'bg-amber-500 text-amber-500 border-amber-500/20';
    if (d === 'hard') return 'bg-red-500 text-red-500 border-red-500/20';
    return 'bg-slate-400 text-slate-400 border-slate-400/20';
  };

  const getDifficultyPill = (diff: string) => {
    const d = String(diff || "").toLowerCase();
    if (d === 'beginner' || d === 'easy') return 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400';
    if (d === 'medium') return 'bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400';
    if (d === 'hard') return 'bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400';
    return 'bg-slate-50 text-slate-600 dark:bg-slate-900 dark:text-slate-400';
  };

  return (
    <>
      {tests.map((test, i) => (
        <Link key={i} href={`/quiz?id=${test.id}`} className="group block">
          <div className="relative bg-white dark:bg-slate-900 rounded-[12px] border-[0.5px] border-slate-200 dark:border-slate-800 overflow-hidden hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all flex h-auto min-h-[100px]">
            {/* Left Accent Strip */}
            <div className={cn("w-[5px] shrink-0", getDifficultyClasses(test.difficulty).split(' ')[0])} />
            
            {/* Thumbnail (80px) */}
            <div className={cn("w-[80px] shrink-0 flex items-center justify-center bg-gradient-to-br relative", getCategoryGradient(test.category))}>
              <div className="w-7 h-7 rounded-md bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <FileText className="w-4 h-4 text-white" />
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-[12px_14px] flex flex-col justify-between">
              <div className="flex items-center justify-between gap-4 mb-1">
                <div className="flex gap-2">
                  <Badge variant="outline" className="font-bold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full border-slate-200 text-slate-400">
                    {test.category || "General"}
                  </Badge>
                </div>
                <Badge className={cn("border-none font-black text-[9px] uppercase tracking-widest px-2.5 py-0.5 rounded-full", getDifficultyPill(test.difficulty))}>
                  {test.difficulty || 'Easy'}
                </Badge>
              </div>

              <h3 className="text-[13px] font-medium text-slate-900 dark:text-white truncate group-hover:text-primary transition-colors">
                {test.title}
              </h3>

              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 dark:text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <ListChecks className="w-3.5 h-3.5 opacity-60" />
                    {test.questions_count ?? "0"} Items
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 opacity-60" />
                    {test.duration || '15m'}
                  </span>
                </div>

                <Button 
                  variant="outline" 
                  className="h-7 px-3 rounded-[6px] border-slate-200 dark:border-slate-700 bg-transparent text-slate-500 font-bold text-[10px] uppercase tracking-tight hover:bg-primary hover:text-white hover:border-primary transition-all group/btn"
                >
                  Start <ChevronRight className="w-3 h-3 ml-1 transition-transform group-hover/btn:translate-x-0.5" />
                </Button>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </>
  );
}
