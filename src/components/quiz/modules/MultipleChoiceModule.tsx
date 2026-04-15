"use client";

import React, { useMemo } from 'react';
import { Question } from '@/types/quiz';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { parseRegistryArray, shuffleArray } from '@/lib/quiz-utils';

interface Props {
  question: Question;
  value: any;
  onChange: (val: any) => void;
  reviewMode?: boolean;
}

/**
 * Multiple Choice Interaction Module
 * 
 * Renders high-fidelity checkbox cards for multi-select responses.
 * Uses square (rounded) checkbox icons to distinguish from single-select radios.
 */
export const MultipleChoiceModule: React.FC<Props> = ({ question, value, onChange, reviewMode }) => {
  const options = useMemo(() => {
    const rawOptions = parseRegistryArray(question.options);
    return reviewMode ? rawOptions : shuffleArray(rawOptions);
  }, [question.id, question.options, reviewMode]);

  const selected = useMemo(() => parseRegistryArray(value), [value]);
  const correctArr = useMemo(() => parseRegistryArray(question.correct_answer), [question.correct_answer]);

  const toggle = (opt: string) => {
    if (reviewMode) return;
    const next = selected.includes(opt) 
      ? selected.filter(s => s !== opt) 
      : [...selected, opt];
    onChange(next);
  };

  return (
    <div className="flex flex-col gap-[10px]">
      {options.map((option, idx) => {
        const isSelected = selected.includes(option);
        const inputId = `q-${question.id}-${idx}`;
        
        return (
          <div 
            key={idx} 
            onClick={() => toggle(option)}
            className={cn(
              "flex items-center space-x-4 px-[18px] py-[16px] rounded-[16px] border-2 transition-all cursor-pointer group",
              isSelected 
                ? "bg-[#EFF6FF] border-[#2563EB] shadow-sm" 
                : "bg-white border-slate-100 hover:bg-[#EFF6FF] hover:border-[#2563EB]"
            )}
          >
            <Checkbox 
              id={inputId} 
              checked={isSelected} 
              onCheckedChange={() => toggle(option)}
              disabled={reviewMode}
              className={cn(
                "h-5 w-5 rounded border-2 transition-transform group-active:scale-95",
                isSelected ? "bg-[#2563EB] border-[#2563EB] text-white" : "border-slate-300"
              )}
              onClick={(e) => e.stopPropagation()} 
            />
            <Label 
              htmlFor={inputId} 
              className="option-text flex-1 cursor-pointer font-normal text-base text-slate-700 select-none leading-tight"
              onClick={(e) => e.preventDefault()}
            >
              {option}
            </Label>
            {reviewMode && correctArr.includes(option) && (
              <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" />
            )}
          </div>
        );
      })}
    </div>
  );
};
