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

export const MultipleChoiceModule: React.FC<Props> = ({ question, value, onChange, reviewMode }) => {
  const options = useMemo(() => {
    const rawOptions = parseRegistryArray(question.options);
    return reviewMode ? rawOptions : shuffleArray(rawOptions);
  }, [question.id, question.options, reviewMode]);

  const selected = (value as string[]) || [];
  const correctArr = useMemo(() => parseRegistryArray(question.correct_answer), [question.correct_answer]);

  const toggle = (opt: string) => {
    if (reviewMode) return;
    const next = selected.includes(opt) ? selected.filter(s => s !== opt) : [...selected, opt];
    onChange(next);
  };

  return (
    <div className="space-y-3">
      {options.map((option, idx) => (
        <div key={idx} className={cn(
          "flex items-center space-x-3 p-4 rounded-xl border-2 transition-all",
          selected.includes(option) ? 'bg-primary/5 border-primary shadow-sm' : 'hover:bg-muted border-transparent bg-muted/30'
        )}>
          <Checkbox 
            id={`q-${question.id}-${idx}`} 
            checked={selected.includes(option)} 
            onCheckedChange={() => toggle(option)}
            disabled={reviewMode}
          />
          <Label htmlFor={`q-${question.id}-${idx}`} className="option-text flex-1 cursor-pointer font-normal text-base">{option}</Label>
          {reviewMode && correctArr.includes(option) && <CheckCircle2 className="w-6 h-6 text-green-500" />}
        </div>
      ))}
    </div>
  );
};
