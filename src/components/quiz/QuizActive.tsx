"use client";

import React, { useState, useEffect } from 'react';
import { QuizState } from '@/types/quiz';
import { QuestionRenderer } from '@/components/quiz/QuestionRenderer';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ChevronRight, 
  ChevronLeft, 
  Send, 
  ListOrdered,
  RotateCcw,
  Flag,
  Save,
  Type,
  AlertTriangle,
  X,
  ClipboardCheck
} from "lucide-react";
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
import { ScrollArea } from "@/components/ui/scroll-area";

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
  onToggleFlag: (id: string) => void;
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
  onJump,
  onToggleFlag
}: QuizActiveProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [textSize, setTextSize] = useState<'normal' | 'large' | 'small'>('normal');

  useEffect(() => {
    const saved = localStorage.getItem('dntrng_text_size') as 'normal' | 'large' | 'small';
    if (saved && ['normal', 'large', 'small'].includes(saved)) {
      setTextSize(saved);
    }
  }, []);

  const toggleTextSize = () => {
    const modes: ('normal' | 'large' | 'small')[] = ['normal', 'large', 'small'];
    const currentIndex = modes.indexOf(textSize);
    const nextIndex = (currentIndex + 1) % modes.length;
    const nextSize = modes[nextIndex];
    setTextSize(nextSize);
    localStorage.setItem('dntrng_text_size', nextSize);
  };
  
  const currentQuestion = quiz.questions[quiz.currentQuestionIndex];
  const progress = quiz.questions.length > 0 ? ((quiz.currentQuestionIndex + 1) / quiz.questions.length) * 100 : 0;

  const currentResponse = quiz.responses.find(r => r.questionId === currentQuestion?.id)?.answer;
  const isFlagged = quiz.flaggedQuestionIds?.includes(currentQuestion?.id);

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
  const isComplete = answeredCount === totalCount;

  const handleCommitAttempt = () => {
    setIsConfirmOpen(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const truncateText = (text: string, length: number) => {
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
  };

  // Circular timer calculation
  const totalSessionTime = 900; // Assuming 15m as base for visual progress
  const dashArray = 2 * Math.PI * 18;
  const dashOffset = dashArray - (dashArray * (timeLeft / totalSessionTime));

  return (
    <div className="min-h-screen bg-white flex flex-col items-center transition-colors duration-300">
      {/* Precision Header */}
      <header className="w-full bg-white border-b border-slate-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto h-20 px-4 md:px-8 flex items-center justify-between">
          
          {/* Left Controls */}
          <div className="flex items-center gap-2 md:gap-6">
            <Button 
              variant="ghost" 
              onClick={onPrev}
              disabled={quiz.currentQuestionIndex === 0 || quiz.mode === 'race'}
              className="rounded-xl h-12 px-2 md:px-4 text-slate-400 font-bold hover:bg-slate-50 disabled:opacity-30"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              <span className="hidden sm:inline">Trước</span>
            </Button>

            <Button 
              variant="secondary" 
              onClick={() => onResponseChange(null)}
              className="bg-[#E8EEF5] text-primary font-bold h-12 rounded-xl px-4 gap-2 border-none hidden md:flex"
            >
              <RotateCcw className="w-4 h-4" />
              Đặt lại
            </Button>

            <div className="h-6 w-px bg-slate-100 hidden md:block" />

            <div className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-2">
              <span className="text-sm md:text-base font-black text-primary">
                {quiz.currentQuestionIndex + 1}/{quiz.questions.length}
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden sm:inline">
                (ID: {currentQuestion?.id})
              </span>
            </div>
          </div>

          {/* Center/Right Utilities */}
          <div className="flex items-center gap-2 md:gap-8">
            <div className="flex items-center gap-1 md:gap-4 text-slate-400">
              <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 hover:bg-slate-50"><Save className="w-5 h-5" /></Button>
              <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 hover:bg-slate-50"><ListOrdered className="w-5 h-5" /></Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[320px] sm:w-[450px] p-0 flex flex-col bg-white border-l border-slate-100">
                  <SheetHeader className="p-8 border-b shrink-0">
                    <div className="flex items-center justify-between">
                      <SheetTitle className="text-2xl font-black tracking-tighter uppercase text-slate-900">Questions</SheetTitle>
                    </div>
                    
                    {/* Status Legend */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-slate-200" />
                        <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Unread</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Answered</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-orange-500" />
                        <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Marked</span>
                      </div>
                    </div>
                  </SheetHeader>

                  <ScrollArea className="flex-1">
                    <div className="p-2 pb-24">
                      {quiz.questions.map((q, idx) => {
                        const answered = isAnswered(q.id);
                        const flagged = quiz.flaggedQuestionIds?.includes(q.id);
                        const active = quiz.currentQuestionIndex === idx;

                        return (
                          <button
                            key={q.id}
                            onClick={() => { onJump(idx); setIsSidebarOpen(false); }}
                            className={cn(
                              "w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all group mb-1",
                              active 
                                ? "bg-primary/5 ring-1 ring-primary/20" 
                                : "hover:bg-slate-50"
                            )}
                          >
                            <span className={cn(
                              "text-xs font-black w-7 text-right shrink-0",
                              active ? "text-primary" : "text-slate-300"
                            )}>
                              {idx + 1}
                            </span>
                            
                            <div className="flex-1 min-w-0">
                              <p className={cn(
                                "text-[13px] font-medium truncate",
                                active ? "text-slate-900" : "text-slate-500"
                              )}>
                                {truncateText(q.question_text, 45)}
                              </p>
                            </div>

                            <div className={cn(
                              "w-2.5 h-2.5 rounded-full shrink-0 transition-all",
                              flagged ? "bg-orange-500" : (answered ? "bg-green-500" : "bg-slate-200")
                            )} />
                          </button>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </SheetContent>
              </Sheet>
              
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleTextSize}
                className="rounded-full h-10 w-10 hidden sm:flex hover:bg-slate-50 flex-col gap-0 items-center justify-center pt-1"
              >
                <Type className={cn(
                  "transition-all",
                  textSize === 'small' ? "w-4 h-4" : textSize === 'large' ? "w-6 h-6" : "w-5 h-5"
                )} />
                <span className="text-[7px] font-black uppercase tracking-tighter leading-none -mt-0.5">
                  {textSize === 'small' ? 'A-' : textSize === 'large' ? 'A+' : 'A'}
                </span>
              </Button>
            </div>

            {/* Circular Timer */}
            <div className="relative flex items-center justify-center w-14 h-14 shrink-0">
              <svg className="w-full h-full -rotate-90">
                <circle
                  cx="28"
                  cy="28"
                  r="18"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="transparent"
                  className="text-slate-100"
                />
                <circle
                  cx="28"
                  cy="28"
                  r="18"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="transparent"
                  strokeDasharray={dashArray}
                  strokeDashoffset={dashOffset}
                  className={cn("text-primary transition-all duration-1000", timeLeft < 60 && "text-destructive")}
                />
              </svg>
              <span className={cn(
                "absolute text-[10px] font-black tracking-tighter",
                timeLeft < 60 ? "text-destructive" : "text-slate-900"
              )}>
                {formatTime(timeLeft)}
              </span>
            </div>

            <div className="h-6 w-px bg-slate-100 hidden md:block" />

            <Button 
              variant="ghost" 
              onClick={() => currentQuestion && onToggleFlag(currentQuestion.id)}
              className={cn(
                "rounded-xl h-12 gap-2 font-bold border-none hidden lg:flex transition-all",
                isFlagged 
                  ? "bg-orange-500 text-white hover:bg-orange-600" 
                  : "text-slate-500 bg-[#F1F5F9] hover:bg-slate-200"
              )}
            >
              <Flag className={cn("w-4 h-4", isFlagged && "fill-current")} />
              {isFlagged ? 'Flagged' : 'Mark for Later'}
            </Button>

            {quiz.currentQuestionIndex === quiz.questions.length - 1 ? (
              <Button 
                onClick={handleCommitAttempt}
                className="bg-primary hover:bg-primary/90 text-white rounded-xl h-12 px-8 font-black shadow-xl shadow-primary/20 transition-all hover:scale-105 border-none"
              >
                COMMIT
              </Button>
            ) : (
              <Button 
                onClick={onNext}
                className="bg-[#366DC7] hover:bg-[#2D5AB0] text-white rounded-xl h-12 px-4 md:px-8 font-black gap-3 transition-all border-none"
              >
                Tiếp
                <ChevronRight className="w-5 h-5" />
              </Button>
            )}
          </div>
        </div>
        {/* Dynamic Progress Rail */}
        <div className="w-full h-1.5 bg-slate-100 relative overflow-hidden">
          <div 
            className="absolute top-0 left-0 h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      {/* Main Assessment Workspace */}
      <main className="flex-1 w-full max-w-5xl py-12 md:py-24 px-6 md:px-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {quiz.mode === 'training' && (
          <div className="mb-12 p-6 bg-blue-50/50 border-2 border-blue-100 rounded-[2.5rem] flex items-center gap-6">
            <div className="bg-white p-3 rounded-2xl shadow-sm"><RotateCcw className="w-6 h-6 text-primary" /></div>
            <div>
              <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight">Practice Registry Active</h4>
              <p className="text-sm font-medium text-slate-500">Real-time validation is enabled for this session.</p>
            </div>
          </div>
        )}

        {isWrongInRace && (
          <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-md flex items-center justify-center">
            <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl border-4 border-destructive flex flex-col items-center gap-6 animate-in zoom-in-95">
              <RotateCcw className="w-20 h-20 text-destructive animate-spin-slow" />
              <h3 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Protocol Terminated</h3>
              <p className="text-xl font-bold text-slate-400 uppercase tracking-widest">Restarting Identity Streak...</p>
            </div>
          </div>
        )}

        <div className="max-w-4xl mx-auto" data-textsize={textSize}>
          {currentQuestion && (
            <QuestionRenderer 
              question={currentQuestion} 
              value={currentResponse} 
              onChange={onResponseChange}
              reviewMode={quiz.mode === 'training' && isAnswered(currentQuestion.id)}
            />
          )}
        </div>
      </main>

      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent className="rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden bg-white max-w-md">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsConfirmOpen(false)}
            className="absolute right-4 top-4 rounded-full text-slate-400 hover:text-slate-900 z-10"
          >
            <X className="w-4 h-4" />
          </Button>

          <div className="p-10 pt-12 text-center space-y-6">
            <div className="mx-auto w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mb-2">
              <ClipboardCheck className="w-10 h-10 text-primary" />
            </div>
            
            <div className="space-y-2">
              <AlertDialogTitle className="text-3xl font-black uppercase tracking-tight text-slate-900">
                Submit Test?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-base font-medium text-slate-500 leading-relaxed px-4">
                {isComplete 
                  ? `You've answered all ${totalCount} questions. Ready to submit?`
                  : `You have ${unansweredCount} unanswered questions out of ${totalCount}. You can go back and review, or submit now.`
                }
              </AlertDialogDescription>
            </div>

            <div className="space-y-3 px-4">
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                <span>Progress</span>
                <span className="text-primary">{answeredCount} / {totalCount} Answered</span>
              </div>
              <Progress value={(answeredCount / totalCount) * 100} className="h-2 rounded-full" />
            </div>
          </div>

          <AlertDialogFooter className="flex flex-col sm:flex-row gap-3 p-8 pt-0 mt-0">
            <AlertDialogCancel asChild>
              <Button className="h-14 rounded-full bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-xs flex-1 shadow-xl shadow-primary/20 border-none order-2 sm:order-1">
                Review Answers
              </Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button 
                variant="ghost" 
                onClick={onSubmit} 
                className="h-14 rounded-full font-black uppercase tracking-widest text-xs flex-1 text-slate-400 hover:text-slate-900 hover:bg-slate-50 order-1 sm:order-2"
              >
                Submit Now
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
