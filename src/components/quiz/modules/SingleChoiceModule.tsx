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
      className="space-y-3"
    >
      {options.map((option, idx) => (
        <div key={idx} className={cn(
          "flex items-center space-x-3 p-4 rounded-xl border-2 transition-all",
          value === option ? 'bg-primary/5 border-primary shadow-sm' : 'hover:bg-muted border-transparent bg-muted/30'
        )}>
          <RadioGroupItem value={option} id={`q-${question.id}-${idx}`} />
          <Label htmlFor={`q-${question.id}-${idx}`} className="option-text flex-1 cursor-pointer font-normal text-base">{option}</Label>
          {reviewMode && option === correctAnswer && <CheckCircle2 className="w-6 h-6 text-green-500" />}
        </div>
      ))}
    </RadioGroup>
  );
};
