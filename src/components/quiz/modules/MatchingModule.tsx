"use client";

import React, { useState, useMemo } from 'react';
import { Question } from '@/types/quiz';
import { Info, X, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { parseRegistryArray, shuffleArray } from '@/lib/quiz-utils';

interface Props {
  question: Question;
  value: any;
  onChange: (val: any) => void;
  reviewMode?: boolean;
}

/**
 * Visual Asset Component for Matching Module
 */
const MatchingAnswerContent = ({ value }: { value: string }) => {
  const [error, setError] = useState(false);

  const isImage = useMemo(() => {
    if (!value) return false;
    const val = String(value).trim();
    // Rule: starts with http(s) and has image extension OR starts with https://
    return (val.startsWith('http') && /\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i.test(val)) || val.startsWith('https://');
  }, [value]);

  if (!isImage) {
    return <span className="option-text font-black text-xs break-words whitespace-normal leading-tight text-center">{value}</span>;
  }

  if (error) {
    return (
      <div className="w-[140px] h-[100px] bg-slate-100 rounded-[12px] flex flex-col items-center justify-center border-2 border-dashed border-slate-200 gap-1">
        <AlertCircle className="w-4 h-4 text-slate-300" />
        <span className="text-[8px] font-black text-slate-300 uppercase tracking-tighter">Broken Asset</span>
      </div>
    );
  }

  return (
    <img 
      src={value} 
      alt="Answer Option" 
      onError={() => setError(true)}
      className="w-[140px] h-[100px] object-contain rounded-[12px] border bg-white shadow-sm transition-transform group-hover:scale-105"
    />
  );
};

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
          <p className="text-xs font-medium text-primary">Drag and drop responses from the pool into the designated target clusters.</p>
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
                    "p-3 rounded-[16px] border-2 transition-all grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4 items-center",
                    reviewMode 
                      ? (isCorrect ? "bg-green-50 border-green-100" : "bg-red-50 border-red-100") 
                      : "bg-slate-50/50 border-slate-100"
                  )}>
                    <div className="min-w-0 pr-2 flex flex-col justify-center">
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-1">Prompt</span>
                      <p className="option-text font-medium text-slate-700 text-base leading-tight break-words whitespace-normal">{prompt}</p>
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
                        "w-full sm:w-[160px] min-h-[116px] h-auto rounded-[12px] border-2 border-dashed flex items-center justify-center transition-all p-2 relative group",
                        userVal ? "border-primary bg-white shadow-md" : "border-slate-300 bg-white/50"
                      )}
                    >
                      {userVal ? (
                        <div className="flex flex-col items-center gap-3 w-full">
                          <div className="flex-1 flex items-center justify-center">
                            <MatchingAnswerContent value={userVal} />
                          </div>
                          {!reviewMode && (
                            <button 
                              onClick={() => handleClear(prompt)}
                              className="absolute top-1 right-1 p-1 bg-white shadow-sm border rounded-full hover:bg-rose-50 hover:text-rose-500 transition-colors z-10"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      ) : (
                        <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest italic">Drop Module</span>
                      )}
                    </div>
                  </div>
                  {reviewMode && !isCorrect && (
                    <div className="px-4 py-3 bg-emerald-50/30 rounded-[12px] border border-dashed border-emerald-200 flex items-center gap-4 animate-in slide-in-from-top-1 duration-300">
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest leading-none mb-2">Correct Registry</span>
                        <MatchingAnswerContent value={correctAnswer || ""} />
                      </div>
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
              <div className="p-8 bg-slate-100/50 rounded-[3rem] border-4 border-dashed border-slate-200 min-h-[400px] flex flex-wrap gap-4 items-start content-start justify-center overflow-y-auto max-h-[70vh] custom-scrollbar">
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
                      "group relative p-2 bg-white border-2 border-slate-100 rounded-[12px] shadow-sm cursor-grab active:cursor-grabbing hover:border-primary/40 hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center min-w-[140px] max-w-full",
                      draggingItem === ans && "opacity-20 scale-95 grayscale"
                    )}
                  >
                    <MatchingAnswerContent value={ans} />
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
