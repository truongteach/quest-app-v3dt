"use client";

import React, { useMemo } from 'react';
import { Question } from '@/types/quiz';
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { parseRegistryArray, shuffleArray } from '@/lib/quiz-utils';

interface Props {
  question: Question;
  value: any;
  onChange: (val: any) => void;
  reviewMode?: boolean;
}

export const MultipleTrueFalseModule: React.FC<Props> = ({ question, value, onChange, reviewMode }) => {
  const shuffledRows = useMemo(() => {
    const rawRows = parseRegistryArray(question.order_group);
    return reviewMode ? rawRows : shuffleArray(rawRows);
  }, [question.id, question.order_group, reviewMode]);

  const statements = shuffledRows;
  const correctAnswersArr = useMemo(() => parseRegistryArray(question.correct_answer), [question.correct_answer]);
  const originalStatements = useMemo(() => parseRegistryArray(question.order_group), [question.order_group]);
  const responses = (value as Record<string, string>) || {};

  const handleUpdate = (statement: string, val: string) => {
    if (reviewMode) return;
    onChange({ ...responses, [statement]: val });
  };

  return (
    <div className="space-y-6">
      {statements.map((s, i) => {
        const userVal = responses[s];
        const originalIdx = originalStatements.indexOf(s);
        const isCorrect = reviewMode && userVal === correctAnswersArr[originalIdx];
        
        return (
          <div key={i} className={cn(
            "p-6 rounded-[2rem] border-2 transition-all",
            reviewMode ? (isCorrect ? "bg-green-50 border-green-100" : "bg-red-50 border-red-100") : "bg-white border-slate-100 shadow-sm"
          )}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <p className="option-text font-medium text-base text-slate-700 flex-1">{s}</p>
              <div className="flex gap-3 shrink-0">
                {['True', 'False'].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleUpdate(s, opt)}
                    disabled={reviewMode}
                    className={cn(
                      "h-12 px-8 rounded-full font-black text-xs uppercase tracking-widest transition-all",
                      userVal === opt 
                        ? "bg-primary text-white shadow-lg shadow-primary/20" 
                        : "bg-slate-50 text-slate-400 hover:bg-slate-100"
                    )}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
            {reviewMode && !isCorrect && (
              <div className="mt-4 flex items-center gap-2 text-[10px] font-black text-green-600 uppercase tracking-widest">
                <CheckCircle2 className="w-3 h-3" /> Correct: {correctAnswersArr[originalIdx]}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
