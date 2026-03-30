"use client";

import React, { useState, useMemo } from 'react';
import { Question } from '@/types/quiz';
import { Info, X, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { parseRegistryArray, shuffleArray } from '@/lib/quiz-utils';

interface Props {
  question: Question;
  value: any;
  onChange: (val: any) => void;
  reviewMode?: boolean;
}

export const MatchingModule: React.FC<Props> = ({ question, value, onChange, reviewMode }) => {
  const [draggingItem, setDraggingItem] = useState<string | null>(null);

  const matchingPairs = useMemo(() => {
    const pairsArr = parseRegistryArray(question.order_group);
    return pairsArr.map(p => {
      const [left, right] = p.split('|');
      return { left: (left || "").trim(), right: (right || "").trim() };
    });
  }, [question.order_group]);

  const shuffledItemsPool = useMemo(() => {
    return shuffleArray(matchingPairs.map(p => p.right));
  }, [matchingPairs]);

  const responses = (value as Record<string, string>) || {};
  const prompts = matchingPairs.map(p => p.left);
  const assignedAnswers = Object.values(responses);
  const availableAnswers = shuffledItemsPool.filter(ans => !assignedAnswers.includes(ans));

  const handleDrop = (prompt: string, answer: string) => {
    if (reviewMode) return;
    onChange({ ...responses, [prompt]: answer });
  };

  const handleClear = (prompt: string) => {
    if (reviewMode) return;
    const newResponses = { ...responses };
    delete newResponses[prompt];
    onChange(newResponses);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {!reviewMode && (
        <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 flex items-center gap-3">
          <Info className="w-5 h-5 text-primary" />
          <p className="text-xs font-medium text-primary">Drag answers from the pool into the correct target slots.</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2">Protocol Targets</h3>
          <div className="space-y-3">
            {prompts.map((prompt, i) => {
              const userVal = responses[prompt];
              const pair = matchingPairs.find(p => p.left === prompt);
              const correctAnswer = pair?.right;
              const isCorrect = reviewMode && userVal === correctAnswer;

              return (
                <div key={i} className="space-y-2">
                  <div className={cn(
                    "p-5 rounded-[2rem] border-2 transition-all grid grid-cols-1 sm:grid-cols-[1fr_200px] gap-6 items-start",
                    reviewMode 
                      ? (isCorrect ? "bg-green-50 border-green-100" : "bg-red-50 border-red-100") 
                      : "bg-slate-50/50 border-slate-100"
                  )}>
                    <div className="min-w-0">
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-1">Prompt</span>
                      <p className="option-text font-medium text-slate-700 text-base leading-relaxed break-words whitespace-normal">{prompt}</p>
                    </div>

                    <div 
                      onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('ring-4', 'ring-primary/20', 'border-primary'); }}
                      onDragLeave={(e) => { e.currentTarget.classList.remove('ring-4', 'ring-primary/20', 'border-primary'); }}
                      onDrop={(e) => {
                        e.preventDefault();
                        e.currentTarget.classList.remove('ring-4', 'ring-primary/20', 'border-primary');
                        const data = e.dataTransfer.getData("text/plain");
                        if (data) handleDrop(prompt, data);
                      }}
                      className={cn(
                        "w-full min-h-[48px] h-auto rounded-2xl border-2 border-dashed flex items-center justify-center transition-all p-3 relative group",
                        userVal ? "border-primary bg-white shadow-xl" : "border-slate-300 bg-white/50"
                      )}
                    >
                      {userVal ? (
                        <div className="flex items-center justify-between w-full gap-2">
                          <span className="option-text font-black text-xs text-primary break-words whitespace-normal leading-tight">{userVal}</span>
                          {!reviewMode && (
                            <button 
                              onClick={() => handleClear(prompt)}
                              className="p-1 hover:bg-slate-100 rounded-full transition-colors shrink-0"
                            >
                              <X className="w-3 h-3 text-slate-400" />
                            </button>
                          )}
                        </div>
                      ) : (
                        <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest italic">Drop Module</span>
                      )}
                    </div>
                  </div>
                  {reviewMode && !isCorrect && (
                    <div className="px-6 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      <p className="option-text text-[10px] font-black text-green-600 uppercase tracking-widest break-words whitespace-normal">Correct Registry: {correctAnswer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {!reviewMode && (
          <div className="lg:col-span-5">
            <div className="sticky top-24 space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2">Answer Pool</h3>
              <div className="p-8 bg-slate-100/50 rounded-[3rem] border-4 border-dashed border-slate-200 min-h-[400px] flex flex-col gap-3 items-stretch">
                {availableAnswers.map((ans, i) => (
                  <div
                    key={i}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData("text/plain", ans);
                      setDraggingItem(ans);
                    }}
                    onDragEnd={() => setDraggingItem(null)}
                    className={cn(
                      "option-text w-full px-6 py-4 bg-white border-2 border-slate-100 rounded-2xl shadow-sm cursor-grab active:cursor-grabbing hover:border-primary/40 hover:shadow-xl hover:-translate-y-1 transition-all font-black text-sm text-slate-600 break-words whitespace-normal leading-tight",
                      draggingItem === ans && "opacity-20 scale-95 grayscale"
                    )}
                  >
                    {ans}
                  </div>
                ))}
                {availableAnswers.length === 0 && (
                  <div className="w-full h-64 flex flex-col items-center justify-center text-slate-300 text-center gap-4">
                    <CheckCircle2 className="w-12 h-12 opacity-10" />
                    <p className="text-[10px] font-black uppercase tracking-widest">Registry Fully Allocated</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
