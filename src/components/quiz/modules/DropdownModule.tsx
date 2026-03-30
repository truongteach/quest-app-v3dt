"use client";

import React, { useMemo } from 'react';
import { Question } from '@/types/quiz';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { parseRegistryArray, shuffleArray } from '@/lib/quiz-utils';

interface Props {
  question: Question;
  value: any;
  onChange: (val: any) => void;
  reviewMode?: boolean;
}

export const DropdownModule: React.FC<Props> = ({ question, value, onChange, reviewMode }) => {
  const options = useMemo(() => {
    const rawOptions = parseRegistryArray(question.options);
    return reviewMode ? rawOptions : shuffleArray(rawOptions);
  }, [question.id, question.options, reviewMode]);

  const correctArr = useMemo(() => parseRegistryArray(question.correct_answer), [question.correct_answer]);

  return (
    <div className="space-y-4">
      <Select onValueChange={onChange} value={value} disabled={reviewMode}>
        <SelectTrigger className="option-text h-16 text-base font-normal border-2 rounded-2xl px-6">
          <SelectValue placeholder="Choose..." />
        </SelectTrigger>
        <SelectContent className="rounded-2xl">
          {options.map((o, i) => <SelectItem key={i} value={o} className="option-text">{o}</SelectItem>)}
        </SelectContent>
      </Select>
      {reviewMode && (
        <div className="option-text p-4 bg-green-50 rounded-2xl border-2 border-green-100 font-bold text-green-900">
          Correct: {correctArr[0]}
        </div>
      )}
    </div>
  );
};
