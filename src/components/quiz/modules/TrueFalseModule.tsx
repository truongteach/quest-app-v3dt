"use client";

import React from 'react';
import { Question } from '@/types/quiz';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { parseRegistryArray } from '@/lib/quiz-utils';

interface Props {
  question: Question;
  value: any;
  onChange: (val: any) => void;
  reviewMode?: boolean;
}

export const TrueFalseModule: React.FC<Props> = ({ question, value, onChange, reviewMode }) => {
  const correctArr = parseRegistryArray(question.correct_answer);

  return (
    <RadioGroup value={value} onValueChange={onChange} disabled={reviewMode} className="flex flex-col space-y-4">
       {['True', 'False'].map((o) => (
         <div key={o} className={cn("flex items-center space-x-3 p-6 rounded-[2rem] border-2 transition-all", value === o ? 'bg-primary/5 border-primary shadow-lg' : 'bg-slate-50/50')}>
          <RadioGroupItem value={o} id={`tf-${question.id}-${o}`} className="w-6 h-6" />
          <Label htmlFor={`tf-${question.id}-${o}`} className="option-text flex-1 cursor-pointer font-medium text-lg">{o}</Label>
          {reviewMode && o === correctArr[0] && <CheckCircle2 className="w-8 h-8 text-green-600" />}
        </div>
       ))}
    </RadioGroup>
  );
};
