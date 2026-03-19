
"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle, AlertCircle, RotateCcw, Home } from "lucide-react";
import Link from 'next/link';
import { cn } from "@/lib/utils";
import { Question, UserResponse } from '@/types/quiz';
import { QuestionRenderer } from './QuestionRenderer';
import { calculateScoreForQuestion } from '@/lib/quiz-utils';

interface QuizResultsProps {
  title: string;
  score: number;
  totalQuestions: number;
  questions: Question[];
  responses: UserResponse[];
  onRestart: () => void;
}

export function QuizResults({
  title,
  score,
  totalQuestions,
  questions,
  responses,
  onRestart
}: QuizResultsProps) {
  const hasCorrectAnswers = questions.some(q => q.correct_answer);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <Card className="text-center py-8 shadow-2xl border-none">
          <CardHeader>
            <div className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-14 h-14 text-green-600" />
            </div>
            <CardTitle className="text-4xl font-extrabold tracking-tight">Quiz Complete!</CardTitle>
            <p className="text-2xl font-bold text-primary mt-2">{title}</p>
          </CardHeader>
          <CardContent>
            {hasCorrectAnswers && (
              <div className="mb-8 p-6 bg-slate-50 rounded-2xl border">
                <p className="text-6xl font-black text-primary">{score} <span className="text-3xl text-muted-foreground font-normal">/ {totalQuestions}</span></p>
                <p className="text-muted-foreground font-semibold uppercase tracking-widest text-xs mt-3">Final Score</p>
              </div>
            )}
            <p className="text-lg text-muted-foreground">Review your performance details below.</p>
          </CardContent>
          <CardFooter className="justify-center gap-4 pt-4">
            <Button onClick={onRestart} variant="outline" className="rounded-full px-8 h-12 font-bold">
              <RotateCcw className="w-5 h-5 mr-2" /> Retake
            </Button>
            <Link href="/">
              <Button className="rounded-full px-8 h-12 font-bold shadow-lg">
                <Home className="w-5 h-5 mr-2" /> Home
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <div className="pt-12 pb-6">
          <h3 className="text-3xl font-black tracking-tight mb-2">Detailed Review</h3>
          <p className="text-muted-foreground">Analyze your results by question.</p>
        </div>
        
        <div className="space-y-6 pb-20">
          {questions.map((q) => {
            const userResp = responses.find(r => r.questionId === q.id)?.answer;
            const isCorrect = calculateScoreForQuestion(q, userResp);
            return (
              <Card key={q.id} className={cn("border-l-8 overflow-hidden", isCorrect ? "border-l-green-500" : "border-l-red-500")}>
                <CardContent className="pt-8 px-6 md:px-10">
                  <div className="flex items-start gap-6">
                    <div className="shrink-0 mt-1">
                      {q.correct_answer ? (
                        isCorrect ? 
                        <div className="bg-green-100 p-2 rounded-full"><CheckCircle2 className="w-6 h-6 text-green-600" /></div> : 
                        <div className="bg-red-100 p-2 rounded-full"><XCircle className="w-6 h-6 text-red-600" /></div>
                      ) : (
                        <div className="bg-slate-100 p-2 rounded-full"><AlertCircle className="w-6 h-6 text-slate-400" /></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <QuestionRenderer 
                        question={q} 
                        value={userResp} 
                        onChange={() => {}} 
                        reviewMode={true} 
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
