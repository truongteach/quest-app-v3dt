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
 * Renders checkboxes for many-to-many response mapping.
 */
export const MultipleChoiceModule: React.FC<Props> = ({ question, value, onChange, reviewMode }) => {
  const options = useMemo(() => {
    const rawOptions = parseRegistryArray(question.options);
    return reviewMode ? rawOptions : shuffleArray(rawOptions);
  }, [question.id, question.options, reviewMode]);

  const selected = Array.isArray(value) ? value : [];
  const correctArr = useMemo(() => parseRegistryArray(question.correct_answer), [question.correct_answer]);

  const toggle = (opt: string) => {
    if (reviewMode) return;
    const next = selected.includes(opt) ? selected.filter(s => s !== opt) : [...selected, opt];
    onChange(next);
  };

  return (
    <div className="flex flex-col gap-[10px]">
      {options.map((option, idx) => {
        const isSelected = selected.includes(option);
        
        return (
          <div 
            key={idx} 
            onClick={() => toggle(option)}
            className={cn(
              "flex items-center space-x-3 px-[18px] py-[14px] rounded-[12px] border transition-all cursor-pointer",
              isSelected 
                ? "bg-[#EFF6FF] border-[#2563EB] shadow-sm" 
                : "bg-white border-[#E5E7EB] hover:bg-[#EFF6FF] hover:border-[#2563EB]"
            )}
          >
            <Checkbox 
              id={`q-${question.id}-${idx}`} 
              checked={isSelected} 
              onCheckedChange={() => {}} // Controlled by parent div click event
              disabled={reviewMode}
              className="pointer-events-none"
            />
            <Label 
              htmlFor={`q-${question.id}-${idx}`} 
              className="option-text flex-1 cursor-pointer font-normal text-base text-slate-700"
              onClick={(e) => e.preventDefault()} // Prevent bubbling from label clicks
            >
              {option}
            </Label>
            {reviewMode && correctArr.includes(option) && <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" />}
          </div>
        );
      })}
    </div>
  );
};