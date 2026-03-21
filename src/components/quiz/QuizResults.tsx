"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  RotateCcw, 
  Home, 
  Zap,
  Trophy,
  ArrowRight,
  User,
  Activity
} from "lucide-react";
import Link from 'next/link';
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

interface QuizResultsProps {
  title: string;
  score: number;
  totalQuestions: number;
  questions: Question[];
  responses: UserResponse[];
  userName: string;
  onRestart: () => void;
}

export function QuizResults({
  title,
  score,
  totalQuestions,
  questions,
  responses,
  userName,
  onRestart
}: QuizResultsProps) {
  const percentage = Math.round((score / totalQuestions) * 100);
  const isPassing = percentage >= 70;

  const getCompliment = (pct: number) => {
    if (pct >= 95) return "Exceptional mastery! Absolute precision detected.";
    if (pct >= 85) return "Outstanding! Peak cognitive synchronization.";
    if (pct >= 70) return "Success! Core requirements fully met.";
    if (pct >= 50) return "Completed. Optimization recommended.";
    return "Alignment incomplete. Re-engagement advised.";
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col items-center py-12 px-4 md:px-8 selection:bg-primary selection:text-white">
      <div className="w-full max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
        
        {/* Main Result Card */}
        <Card className="border-none shadow-[0_40px_80px_-15px_rgba(0,0,0,0.15)] rounded-[3.5rem] overflow-hidden bg-white">
          <div className={cn("h-4", isPassing ? "bg-green-500" : "bg-primary")} />
          
          <CardHeader className="text-center pt-16 pb-6 px-10">
            <div className="flex justify-center mb-8">
              <div className={cn(
                "w-24 h-24 rounded-[2rem] flex items-center justify-center shadow-2xl rotate-3 transition-transform hover:rotate-0",
                isPassing ? "bg-green-100 text-green-600" : "bg-primary/10 text-primary"
              )}>
                {isPassing ? <Trophy className="w-12 h-12" /> : <Zap className="w-12 h-12 fill-current" />}
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2.5 px-6 py-2 rounded-full bg-slate-900 text-white shadow-xl ring-8 ring-slate-100">
                <User className="w-4 h-4 text-primary fill-primary" />
                <span className="text-sm font-black uppercase tracking-widest">{userName}</span>
              </div>
              
              <div className="pt-2">
                <CardTitle className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 uppercase leading-none">
                  {isPassing ? 'Assessment Cleared' : 'Protocol Complete'}
                </CardTitle>
                <p className="text-[10px] font-black text-slate-400 mt-4 uppercase tracking-[0.4em]">{title}</p>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="px-10 pb-12">
            <div className="grid md:grid-cols-2 gap-8 items-stretch">
              {/* Score Display */}
              <div className="bg-slate-50 p-12 rounded-[3rem] border-2 border-slate-100 text-center relative overflow-hidden flex flex-col items-center justify-center group">
                <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none">
                  <Zap className="w-48 h-48 fill-slate-900" />
                </div>
                
                <div className="relative z-10">
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-2">Final Intelligence Set</p>
                  <p className="text-9xl font-black text-slate-900 tracking-tighter leading-none flex items-baseline justify-center">
                    {score}<span className="text-4xl text-slate-300 ml-2">/ {totalQuestions}</span>
                  </p>
                  <div className="mt-8 flex justify-center">
                    <div className={cn(
                      "px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest shadow-lg flex items-center gap-2",
                      isPassing ? "bg-green-500 text-white shadow-green-500/20" : "bg-primary text-white shadow-primary/20"
                    )}>
                      <Activity className="w-3 h-3" />
                      {percentage}% Accuracy
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions & Feedback */}
              <div className="flex flex-col justify-between py-2">
                <div className="space-y-6">
                  <div className="p-8 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-primary mb-3">Diagnostic Feedback</h4>
                    <p className="text-slate-700 font-black text-2xl leading-tight tracking-tight">
                      "{getCompliment(percentage)}"
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col gap-4 mt-8">
                  <Button onClick={onRestart} variant="outline" className="h-16 rounded-full font-black border-2 text-xs uppercase tracking-widest hover:bg-slate-50 transition-all group">
                    <RotateCcw className="w-4 h-4 mr-2 transition-transform group-hover:-rotate-45" />
                    Re-Initialize
                  </Button>
                  <Link href="/tests" className="w-full">
                    <Button className="w-full h-16 rounded-full font-black shadow-2xl bg-slate-900 hover:bg-slate-800 transition-all text-xs uppercase tracking-widest">
                      Library Access
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Review Section */}
        <div className="space-y-6 pt-8">
          <div className="flex items-center justify-between px-8">
            <div>
              <h3 className="text-2xl font-black tracking-tight text-slate-900 uppercase">Step Analytics</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Structural Response Audit</p>
            </div>
          </div>

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
                    "border-none rounded-[2.5rem] overflow-hidden bg-white shadow-sm transition-all hover:shadow-xl",
                    isCorrect ? "ring-2 ring-green-100" : (hasAnswered ? "ring-2 ring-destructive/10" : "ring-2 ring-slate-100")
                  )}
                >
                  <AccordionTrigger className="px-10 py-8 hover:no-underline group">
                    <div className="flex items-center gap-8 text-left">
                      <div className={cn(
                        "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border-2",
                        !q.correct_answer ? "bg-slate-50 border-slate-100 text-slate-400" : 
                        (isCorrect ? "bg-green-50 border-green-100 text-green-600" : "bg-destructive/5 border-destructive/10 text-destructive")
                      )}>
                        {!q.correct_answer ? <AlertCircle className="w-6 h-6" /> : (isCorrect ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 mb-1">Step {idx + 1} Audit</span>
                        <h4 className="font-bold text-slate-800 text-xl leading-tight line-clamp-1 group-hover:text-primary transition-colors">
                          {q.question_text}
                        </h4>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-10 pb-10 pt-0">
                    <div className="h-px w-full bg-slate-50 mb-10" />
                    <div className="max-w-3xl mx-auto">
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

        {/* Bottom Navigation */}
        <div className="flex justify-center pt-12 pb-24">
          <Link href="/">
            <Button variant="ghost" className="rounded-full font-black text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-[0.4em] text-[9px]">
              <Home className="w-3 h-3 mr-2" />
              Terminate Session
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
