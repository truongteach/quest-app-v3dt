
"use client";

import React, { useState } from 'react';
import { QuizState } from '@/types/quiz';
import { QuestionRenderer } from '@/components/quiz/QuestionRenderer';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronRight, 
  ChevronLeft, 
  Send, 
  ListOrdered,
  Check,
  Timer,
  Zap,
  RotateCcw,
  Gamepad2,
  AlertTriangle
} from "lucide-react";
import Link from 'next/link';
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface QuizActiveProps {
  quiz: QuizState;
  quizTitle: string;
  timeLeft: number;
  isWrongInRace: boolean;
  onResponseChange: (val: any) => void;
  onNext: () => void;
  onPrev: () => void;
  onSubmit: () => void;
  onJump: (idx: number) => void;
}

export function QuizActive({
  quiz,
  quizTitle,
  timeLeft,
  isWrongInRace,
  onResponseChange,
  onNext,
  onPrev,
  onSubmit,
  onJump
}: QuizActiveProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  
  const currentQuestion = quiz.questions[quiz.currentQuestionIndex];
  const progress = quiz.questions.length > 0 ? ((quiz.currentQuestionIndex + 1) / quiz.questions.length) * 100 : 0;

  const currentResponse = quiz.responses.find(r => r.questionId === currentQuestion?.id)?.answer;

  const isAnswered = (questionId: string) => {
    const resp = quiz.responses.find(r => r.questionId === questionId)?.answer;
    if (resp === undefined || resp === null) return false;
    if (typeof resp === 'string') return resp.trim().length > 0;
    if (Array.isArray(resp)) return resp.length > 0;
    if (typeof resp === 'object') return Object.keys(resp).length > 0;
    return true;
  };

  const answeredCount = quiz.questions.filter(q => isAnswered(q.id)).length;
  const totalCount = quiz.questions.length;
  const unansweredCount = totalCount - answeredCount;

  const handleCommitAttempt = () => {
    if (unansweredCount > 0) {
      setIsConfirmOpen(true);
    } else {
      onSubmit();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col items-center p-4 md:p-8">
      <div className="w-full max-w-5xl flex-1 flex flex-col gap-6">
        <header className="space-y-6 mb-4">
          <div className="flex items-center justify-between">
            <Link href="/tests">
              <Button variant="ghost" size="sm" className="rounded-full font-bold">
                <ChevronLeft className="w-4 h-4 mr-1" /> Terminate
              </Button>
            </Link>
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-3">
                <Zap className="w-6 h-6 text-primary fill-current" />
                <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tighter uppercase line-clamp-1">{quizTitle}</h1>
              </div>
              <Badge variant="outline" className={cn(
                "mt-1 rounded-full font-black text-[9px] uppercase tracking-widest px-3 py-0.5 border-none",
                quiz.mode === 'training' ? "bg-blue-100 text-blue-600" :
                quiz.mode === 'race' ? "bg-orange-100 text-orange-600 animate-pulse" : "bg-primary/10 text-primary"
              )}>
                {quiz.mode} protocol
              </Badge>
            </div>
            <div className="w-[100px]" /> 
          </div>

          <div className="space-y-3 px-2">
            <div className="flex justify-between items-end">
              <div className="space-y-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Progress Monitor</span>
                <span className="text-sm font-bold text-slate-900">Step {quiz.currentQuestionIndex + 1} of {quiz.questions.length}</span>
              </div>
              <div className="flex items-center gap-4">
                {quiz.mode === 'race' && (
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-900 rounded-full text-white">
                    <Zap className="w-3 h-3 text-primary fill-current" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Streak: {quiz.currentQuestionIndex}</span>
                  </div>
                )}
                <span className="text-xs font-black text-primary bg-primary/10 px-3 py-1 rounded-full">{Math.round(progress)}%</span>
              </div>
            </div>
            <Progress value={progress} className="h-2 rounded-full bg-slate-200" />
          </div>
        </header>

        <Card className={cn(
          "flex-1 shadow-2xl border-none overflow-hidden rounded-[3rem] bg-white flex flex-col transition-all duration-500",
          isWrongInRace && "shake-horizontal ring-4 ring-destructive"
        )}>
          <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
            <div className="flex justify-between items-center px-6 md:px-12 py-8 border-b bg-white/50 backdrop-blur-sm sticky top-0 z-10">
              <Button 
                variant="outline" 
                onClick={onPrev} 
                disabled={quiz.currentQuestionIndex === 0 || quiz.mode === 'race'}
                className="rounded-full px-6 h-14 bg-white border-2 font-black shrink-0 hover:bg-slate-50 transition-all"
              >
                <ChevronLeft className="w-5 h-5 md:mr-2" />
                <span className="hidden md:inline uppercase text-xs">Previous</span>
              </Button>
              
              <div className="flex items-center gap-3">
                {quiz.mode !== 'race' && (
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full h-14 w-14 shrink-0 hover:bg-primary/10 transition-colors">
                      <ListOrdered className="w-6 h-6 text-primary" />
                    </Button>
                  </SheetTrigger>
                )}

                <div className={cn(
                  "flex items-center gap-3 px-6 py-3 rounded-full font-black text-sm shrink-0 ring-4 ring-white shadow-inner",
                  quiz.mode === 'training' ? "bg-slate-50 text-slate-400" : "bg-slate-100 text-slate-900"
                )}>
                  <Timer className={cn("w-5 h-5", timeLeft < 60 && quiz.mode !== 'training' ? "text-destructive animate-pulse" : "text-primary")} />
                  {quiz.mode === 'training' ? '∞:∞' : formatTime(timeLeft)}
                </div>
              </div>

              <div className="flex gap-3 shrink-0">
                {quiz.currentQuestionIndex === quiz.questions.length - 1 ? (
                  <Button 
                    onClick={handleCommitAttempt} 
                    disabled={isWrongInRace}
                    className="rounded-full px-12 h-14 bg-primary hover:bg-primary/90 shadow-2xl font-black transition-all hover:scale-105"
                  >
                    <span className="hidden md:inline uppercase text-xs tracking-widest">Commit</span>
                    <Send className="w-4 h-4 md:ml-3" />
                  </Button>
                ) : (
                  <Button 
                    onClick={onNext} 
                    disabled={isWrongInRace}
                    className="rounded-full px-12 h-14 bg-slate-900 text-white shadow-2xl font-black transition-all hover:scale-105"
                  >
                    <span className="hidden md:inline uppercase text-xs tracking-widest">Forward</span>
                    <ChevronRight className="w-5 h-5 md:ml-2" />
                  </Button>
                )}
              </div>
            </div>

            <SheetContent side="right" className="w-[300px] sm:w-[450px] rounded-l-[3rem]">
              <SheetHeader className="mb-10 pt-10 px-4">
                <SheetTitle className="text-3xl font-black tracking-tighter uppercase">Assessment Flow</SheetTitle>
              </SheetHeader>
              <div className="grid grid-cols-4 gap-4 px-4">
                {quiz.questions.map((q, idx) => {
                  const isCurrent = quiz.currentQuestionIndex === idx;
                  const answered = isAnswered(q.id);
                  return (
                    <Button
                      key={q.id}
                      variant={isCurrent ? "default" : "outline"}
                      disabled={quiz.mode === 'race'}
                      className={cn(
                        "h-16 w-full rounded-[1.5rem] font-black transition-all border-2 relative text-lg",
                        !isCurrent && answered && "bg-slate-50 border-primary/20 text-primary",
                        isCurrent && "border-primary shadow-xl scale-110 z-10",
                      )}
                      onClick={() => {
                        onJump(idx);
                        setIsSidebarOpen(false);
                      }}
                    >
                      {idx + 1}
                      {answered && !isCurrent && (
                        <Check className="w-4 h-4 absolute -top-1 -right-1 bg-primary text-white rounded-full p-1 shadow-lg" />
                      )}
                    </Button>
                  );
                })}
              </div>
            </SheetContent>
          </Sheet>

          <CardContent className="pt-16 px-6 md:px-24 pb-24 flex-1 overflow-y-auto relative">
            {quiz.mode === 'training' && (
              <div className="max-w-4xl mx-auto mb-10 p-6 bg-blue-50 rounded-[2rem] border-2 border-blue-100 flex items-center gap-6">
                <div className="p-4 bg-white rounded-2xl shadow-sm">
                  <Gamepad2 className="w-8 h-8 text-blue-500" />
                </div>
                <div>
                  <h4 className="text-xl font-black text-blue-900 uppercase tracking-tighter">Practice Engine Active</h4>
                  <p className="text-sm font-medium text-blue-600">You are in Training mode. Detailed feedback is enabled for every response.</p>
                </div>
              </div>
            )}

            {isWrongInRace && (
              <div className="absolute inset-0 z-50 bg-destructive/10 backdrop-blur-[2px] flex items-center justify-center animate-in fade-in duration-200">
                <div className="bg-white p-12 rounded-[3rem] shadow-2xl border-4 border-destructive flex flex-col items-center gap-6 scale-up-center">
                  <RotateCcw className="w-20 h-20 text-destructive animate-spin-slow" />
                  <h3 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Chain Broken</h3>
                  <p className="text-xl font-bold text-slate-500 uppercase tracking-widest">Restarting Protocol...</p>
                </div>
              </div>
            )}

            <div className="max-w-4xl mx-auto">
              <QuestionRenderer 
                question={currentQuestion} 
                value={currentResponse} 
                onChange={onResponseChange}
                reviewMode={quiz.mode === 'training' && isAnswered(currentQuestion.id)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent className="rounded-[2.5rem] border-none shadow-2xl bg-white p-10">
          <AlertDialogHeader>
            <div className="mx-auto w-20 h-20 bg-orange-50 rounded-[1.5rem] flex items-center justify-center mb-6">
              <AlertTriangle className="w-10 h-10 text-orange-500" />
            </div>
            <AlertDialogTitle className="text-3xl font-black tracking-tight text-center uppercase">Intelligence Gap Detected</AlertDialogTitle>
            <AlertDialogDescription className="text-center text-lg font-medium text-slate-500 leading-relaxed pt-2">
              You have <span className="text-orange-600 font-black">{unansweredCount} unanswered</span> {unansweredCount === 1 ? 'step' : 'steps'} in this protocol. Submitting now will finalize your score based on partial data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-col sm:flex-row gap-4 mt-8">
            <AlertDialogCancel className="h-14 rounded-full border-2 font-black uppercase tracking-widest text-xs flex-1">
              Go Back & Review
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={onSubmit}
              className="h-14 rounded-full bg-slate-900 font-black uppercase tracking-widest text-xs flex-1"
            >
              Commit Anyway
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
