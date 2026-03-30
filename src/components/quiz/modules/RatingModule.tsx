"use client";

import React from 'react';
import { Question } from '@/types/quiz';
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  question: Question;
  value: any;
  onChange: (val: any) => void;
  reviewMode?: boolean;
}

export const RatingModule: React.FC<Props> = ({ question, value, onChange, reviewMode }) => {
  const ratingValue = parseInt(value || "0");
  const max = 5;

  return (
    <div className="flex items-center justify-center space-x-2 py-8">
      {Array.from({ length: max }).map((_, i) => (
        <button
          key={i}
          type="button"
          disabled={reviewMode}
          onClick={() => onChange((i + 1).toString())}
          className={cn("p-2 transition-transform hover:scale-125", reviewMode ? 'cursor-default' : 'cursor-pointer')}
        >
          <Star 
            className={cn("w-12 h-12 transition-colors", i < ratingValue ? 'fill-accent text-accent' : 'text-slate-200')} 
          />
        </button>
      ))}
    </div>
  );
};
