"use client";

import React, { useMemo } from 'react';
import { Question } from '@/types/quiz';
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { parseRegistryArray, shuffleArray } from '@/lib/quiz-utils';

interface Props {
  question: Question;
  value: any;
  onChange: (val: any) => void;
  reviewMode?: boolean;
}

export const MatrixChoiceModule: React.FC<Props> = ({ question, value, onChange, reviewMode }) => {
  const shuffledRows = useMemo(() => {
    const rawRows = parseRegistryArray(question.order_group);
    return reviewMode ? rawRows : shuffleArray(rawRows);
  }, [question.id, question.order_group, reviewMode]);

  const options = useMemo(() => {
    const rawOptions = parseRegistryArray(question.options);
    return reviewMode ? rawOptions : shuffleArray(rawOptions);
  }, [question.id, question.options, reviewMode]);

  const rows = shuffledRows;
  const columns = options;
  const correctAnswersArr = useMemo(() => parseRegistryArray(question.correct_answer), [question.correct_answer]);
  const originalRows = useMemo(() => parseRegistryArray(question.order_group), [question.order_group]);
  const responses = (value as Record<string, string>) || {};

  const handleUpdate = (row: string, col: string) => {
    if (reviewMode) return;
    onChange({ ...responses, [row]: col });
  };

  return (
    <div className="overflow-x-auto pb-4">
      <table className="w-full border-separate border-spacing-y-3">
        <thead>
          <tr>
            <th className="text-left px-6 py-4 font-black uppercase text-[10px] text-slate-400 tracking-[0.2em]">Parameter</th>
            {columns.map((col, i) => (
              <th key={i} className="option-text px-4 py-4 font-black uppercase text-[10px] text-slate-400 tracking-[0.2em] text-center">{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            const userVal = responses[row];
            const originalIdx = originalRows.indexOf(row);
            const isCorrectRow = reviewMode && userVal === correctAnswersArr[originalIdx];

            return (
              <tr key={i} className={cn(
                "group transition-all",
                reviewMode ? (isCorrectRow ? "opacity-100" : "opacity-80") : ""
              )}>
                <td className={cn(
                  "option-text p-6 rounded-l-[2rem] border-y-2 border-l-2 font-medium text-base text-slate-700",
                  reviewMode && !isCorrectRow ? "bg-red-50 border-red-100" : "bg-slate-50 border-slate-100"
                )}>
                  {row}
                </td>
                {columns.map((col, j) => (
                  <td 
                    key={j} 
                    className={cn(
                      "p-4 border-y-2 text-center transition-all cursor-pointer last:border-r-2 last:rounded-r-[2rem]",
                      userVal === col ? "bg-primary/5 border-primary/20" : "bg-white border-slate-100",
                      reviewMode && userVal === col && col === correctAnswersArr[originalIdx] && "bg-green-50 border-green-200",
                      reviewMode && userVal === col && col !== correctAnswersArr[originalIdx] && "bg-red-50 border-red-200"
                    )}
                    onClick={() => handleUpdate(row, col)}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-full border-2 mx-auto flex items-center justify-center transition-all",
                      userVal === col 
                        ? "bg-primary border-primary shadow-lg shadow-primary/20" 
                        : "bg-white border-slate-200 group-hover:border-primary/40"
                    )}>
                      {userVal === col && <Check className="w-4 h-4 text-white" />}
                    </div>
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
