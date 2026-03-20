"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  RotateCcw, 
  Home, 
  ChevronDown,
  Zap,
  Trophy,
  ArrowRight,
  User
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
    if (pct >= 95) return "Absolutely Exceptional! You've mastered this intelligence module with total precision.";
    if (pct >= 85) return "Outstanding performance! Your cognitive synchronization is operating at peak levels.";
    if (pct >= 70) return "Great job! You've successfully cleared the core requirements of this protocol.";
    if (pct >= 50) return "Protocol completed. Solid effort, though further optimization is possible.";
    return "Initialization incomplete. We recommend re-engaging with the material for better structural alignment.";
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col items-center py-12 px-4 md:px-8">
      <div className="w-full max-w-4xl space-y-10">
        
        {/* Main Result Card */}
        <Card className="border-none shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] rounded-[3rem] overflow-hidden bg-white">
          <div className={cn("h-4", isPassing ? "bg-green-500" : "bg-primary")} />
          <CardHeader className="text-center pt-16 pb-10">
            <div className="flex justify-center mb-8">
              <div className={cn(
                "w-24 h-24 rounded-[2rem] flex items-center justify-center shadow-2xl rotate-3 transition-transform hover:rotate-0",
                isPassing ? "bg-green-100 text-green-600" : "bg-primary/10 text-primary"
              )}>
                {isPassing ? <Trophy className="w-12 h-12" /> : <Zap className="w-12 h-12 fill-current" />}
              </div>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                <User className="w-3 h-3" />
                Operator: {userName}
              </div>
              <CardTitle className="text-5xl font-black tracking-tighter text-slate-900 uppercase">
                Assessment {isPassing ? 'Cleared' : 'Complete'}
              </CardTitle>
            </div>
            <p className="text-lg font-bold text-slate-400 mt-2 uppercase tracking-[0.2em]">{title}</p>
          </CardHeader>
          
          <CardContent className="px-10 pb-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="bg-slate-50 p-10 rounded-[2.5rem] border-2 border-slate-100 text-center relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                  <Zap className="w-32 h-32 fill-slate-900" />
                </div>
                <p className="text-8xl font-black text-slate-900 tracking-tighter leading-none">
                  {score}<span className="text-3xl text-slate-300 ml-2">/ {totalQuestions}</span>
                </p>
                <div className="mt-6 flex flex-col items-center">
                  <span className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-2">Efficiency Rating</span>
                  <div className="px-4 py-1.5 bg-white rounded-full shadow-sm border border-slate-200 text-primary font-black text-sm">
                    {percentage}% Accurate
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="p-6 bg-primary/5 rounded-3xl border border-primary/10">
                    <h4 className="text-xs font-black uppercase tracking-widest text-primary mb-2">Performance Summary</h4>
                    <p className="text-slate-700 font-bold text-lg leading-tight italic">
                      "{getCompliment(percentage)}"
                    </p>
                  </div>
                  <p className="text-slate-500 font-medium leading-relaxed px-2">
                    {userName}, your intelligence data has been committed to the DNTRNG core. You can now review individual steps or return to the module library.
                  </p>
                </div>
                <div className="flex flex-col gap-3">
                  <Button onClick={onRestart} variant="outline" className="h-14 rounded-full font-black border-2 hover:bg-slate-50 transition-all group">
                    <RotateCcw className="w-4 h-4 mr-2 transition-transform group-hover:-rotate-45" />
                    RE-INITIALIZE
                  </Button>
                  <Link href="/tests" className="w-full">
                    <Button className="w-full h-14 rounded-full font-black shadow-xl bg-slate-900 hover:bg-slate-800 transition-all">
                      LIBRARY ACCESS
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Review Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-4">
            <div>
              <h3 className="text-2xl font-black tracking-tight text-slate-900 uppercase">Step Analytics</h3>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Detailed Response Review</p>
            </div>
            <div className="h-px flex-1 mx-8 bg-slate-200 hidden md:block" />
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
                    "border-none rounded-[2rem] overflow-hidden bg-white shadow-sm transition-all hover:shadow-md",
                    isCorrect ? "ring-1 ring-green-100" : (hasAnswered ? "ring-1 ring-destructive/10" : "ring-1 ring-slate-100")
                  )}
                >
                  <AccordionTrigger className="px-8 py-6 hover:no-underline group">
                    <div className="flex items-center gap-6 text-left">
                      <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm",
                        !q.correct_answer ? "bg-slate-100 text-slate-400" : (isCorrect ? "bg-green-100 text-green-600" : "bg-destructive/10 text-destructive")
                      )}>
                        {!q.correct_answer ? <AlertCircle className="w-6 h-6" /> : (isCorrect ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Step {idx + 1}</span>
                        <h4 className="font-bold text-slate-700 text-lg leading-tight line-clamp-1 group-hover:text-primary transition-colors">
                          {q.question_text}
                        </h4>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-8 pb-8 pt-0">
                    <div className="h-px w-full bg-slate-100 mb-8" />
                    <div className="px-4 sm:px-8">
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
        <div className="flex justify-center pt-8 pb-20">
          <Link href="/">
            <Button variant="ghost" className="rounded-full font-black text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-[0.3em] text-[10px]">
              <Home className="w-3 h-3 mr-2" />
              Terminate Console Session
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
