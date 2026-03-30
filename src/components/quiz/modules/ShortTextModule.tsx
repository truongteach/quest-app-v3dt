"use client";

import React from 'react';
import { Question } from '@/types/quiz';
import { Input } from "@/components/ui/input";
import { parseRegistryArray } from '@/lib/quiz-utils';

interface Props {
  question: Question;
  value: any;
  onChange: (val: any) => void;
  reviewMode?: boolean;
}

export const ShortTextModule: React.FC<Props> = ({ question, value, onChange, reviewMode }) => {
  const correctArr = parseRegistryArray(question.correct_answer);

  return (
    <div className="space-y-4">
      <Input 
        value={value || ""} 
        onChange={(e) => onChange(e.target.value)} 
        placeholder="Answer..." 
        disabled={reviewMode} 
        className="option-text h-16 text-base font-normal border-2 rounded-2xl px-6" 
      />
      {reviewMode && (
        <div className="option-text p-4 bg-green-50 rounded-2xl border-2 border-green-100 font-bold text-green-900">
          Correct: {correctArr[0]}
        </div>
      )}
    </div>
  );
};
