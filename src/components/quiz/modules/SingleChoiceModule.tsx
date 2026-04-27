"use client";

import React, { useMemo } from 'react';
import { Question } from '@/types/quiz';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
 * Single Choice Interaction Module
 * 
 * Renders high-fidelity radio cards for one-to-one response mapping.
 * Uses circular (rounded-full) radio icons to distinguish from multi-select checkboxes.
 */
export const SingleChoiceModule: React.FC<Props> = ({ question, value, onChange, reviewMode }) => {
  const options = useMemo(() => {
    const rawOptions = parseRegistryArray(question.options);
    return reviewMode ? rawOptions : shuffleArray(rawOptions);
  }, [question.id, question.options, reviewMode]);

  const correctAnswer = useMemo(() => parseRegistryArray(question.correct_answer)[0], [question.correct_answer]);

  return (
    <RadioGroup 
      value={value || ""} 
      onValueChange={onChange}
      disabled={reviewMode}
      className="flex flex-col gap-[10px]"
    >
      {options.map((option, idx) => {
        const isSelected = value === option;
        const inputId = `q-${question.id}-${idx}`;
        
        return (
          <div 
            key={idx} 
            onClick={() => !reviewMode && onChange(option)}
            className={cn(
              "flex items-center space-x-4 px-[18px] py-[16px] rounded-[16px] border-2 transition-all cursor-pointer group",
              isSelected 
                ? "bg-[#EFF6FF] border-[#2563EB] shadow-sm" 
                : "bg-white border-slate-100 hover:bg-[#EFF6FF] hover:border-[#2563EB]"
            )}
          >
            <RadioGroupItem 
              value={option} 
              id={inputId} 
              className={cn(
                "h-5 w-5 border-2 rounded-full pointer-events-none transition-transform group-active:scale-95",
                isSelected ? "bg-[#2563EB] border-[#2563EB] text-white" : "border-slate-300"
              )}
            />
            <Label 
              htmlFor={inputId} 
              className="option-text flex-1 cursor-pointer font-normal text-base text-slate-700 select-none leading-tight"
              onClick={(e) => e.preventDefault()}
            >
              {option}
            </Label>
            {/* CORRECT INDICATOR: Strictly gated behind reviewMode to prevent premature leaks */}
            {reviewMode && option === correctAnswer && (
              <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0 animate-in fade-in zoom-in duration-300" />
            )}
          </div>
        );
      })}
    </RadioGroup>
  );
};
