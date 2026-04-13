"use client";

import React, { useState, useEffect } from 'react';
import { History, CheckCircle2, X, AlertCircle, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Question, UserResponse } from '@/types/quiz';
import { QuestionRenderer } from './QuestionRenderer';
import { calculateScoreForQuestion } from '@/lib/quiz-utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface StepAnalyticsProps {
  questions: Question[];
  responses: UserResponse[];
  textSize: 'normal' | 'large' | 'small';
}

/**
 * STEP ANALYTICS COMPONENT
 * 
 * Provides an itemized audit of the assessment session.
 * Features a master collapse toggle with session-based state persistence.
 */
export function StepAnalytics({ questions, responses, textSize }: StepAnalyticsProps) {
  const [isCollapsed, setIsCollapsed] = useState(true);

  // Persistence Protocol: Initialize state from sessionStorage
  useEffect(() => {
    const saved = sessionStorage.getItem('dntrng_review_collapsed');
    if (saved !== null) {
      setIsCollapsed(saved === 'true');
    }
  }, []);

  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    sessionStorage.setItem('dntrng_review_collapsed', String(newState));
  };

  return (
    <div className="pt-16 border-t border-slate-200">
      {/* Master Toggle Header */}
      <div 
        onClick={toggleCollapse}
        className="flex items-center justify-between px-4 cursor-pointer group/header select-none hover:bg-slate-50 dark:hover:bg-slate-900/50 py-6 rounded-[2.5rem] transition-all duration-300"
      >
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 bg-primary/5 rounded-[1.5rem] flex items-center justify-center border border-primary/10 transition-transform group-hover/header:scale-105 group-hover/header:rotate-3 shadow-sm">
            <History className="w-7 h-7 text-primary" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-4">
              <h3 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white uppercase leading-none">
                Question Review
              </h3>
              <div className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm transition-all group-hover/header:border-primary/30">
                <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest whitespace-nowrap">
                  {questions.length} questions
                </span>
              </div>
            </div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.4em]">Detailed performance audit</p>
          </div>
        </div>
        
        <div className={cn(
          "p-4 rounded-full border transition-all duration-500",
          isCollapsed 
            ? "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-300" 
            : "bg-primary text-white border-primary shadow-lg shadow-primary/20"
        )}>
          <ChevronDown className={cn(
            "w-6 h-6 transition-transform duration-500 ease-out",
            !isCollapsed && "rotate-180"
          )} />
        </div>
      </div>

      {/* Content Area with High-Fidelity Transition */}
      <div className={cn(
        "transition-all duration-500 ease-in-out overflow-hidden",
        isCollapsed ? "max-h-0 opacity-0 pointer-events-none" : "max-h-[10000px] opacity-100 mt-10"
      )}>
        <Accordion type="single" collapsible className="space-y-4">
          {questions.map((q, idx) => {
            const userResp = responses.find(r => r.questionId === q.id)?.answer;
            const isCorrect = calculateScoreForQuestion(q, userResp);
            const hasAnswered = userResp !== undefined && userResp !== null;

            return (
              <AccordionItem 
                key={q.id} 
                value={`item-${idx}`}
                className={cn(
                  "border-none rounded-[2rem] overflow-hidden bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 transition-all hover:bg-slate-50/50 dark:hover:bg-slate-800/50 group/acc shadow-sm",
                  isCorrect ? "border-l-[6px] border-l-emerald-500" : (hasAnswered ? "border-l-[6px] border-l-rose-500" : "border-l-[6px] border-l-slate-300")
                )}
              >
                <AccordionTrigger className="px-10 py-8 hover:no-underline group">
                  <div className="flex items-center gap-10 text-left w-full">
                    <div className={cn(
                      "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border-2 transition-all",
                      !q.correct_answer ? "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400" : 
                      (isCorrect ? "bg-emerald-500 border-emerald-400 text-white" : "bg-rose-500 border-rose-400 text-white shadow-lg shadow-rose-500/10")
                    )}>
                      {!q.correct_answer ? <AlertCircle className="w-6 h-6" /> : (isCorrect ? <CheckCircle2 className="w-6 h-6" /> : <X className="w-6 h-6" />)}
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Step {idx + 1}</span>
                        <div className={cn(
                          "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                          isCorrect ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"
                        )}>
                          {isCorrect ? "Correct" : "Incorrect"}
                        </div>
                      </div>
                      <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-xl tracking-tight line-clamp-1 group-hover:text-primary transition-colors">
                        {q.question_text}
                      </h4>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-10 pb-10 pt-0">
                  <div className="h-px w-full bg-slate-100 dark:bg-slate-800 mb-8" />
                  <div className="max-w-4xl mx-auto rounded-[2rem] bg-slate-50 dark:bg-slate-950 p-8 border border-slate-100 dark:border-slate-800 shadow-inner" data-textsize={textSize}>
                    <QuestionRenderer 
                      question={q} 
                      value={userResp} 
                      onChange={() => {}} 
                      reviewMode={true} 
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </div>
  );
}
