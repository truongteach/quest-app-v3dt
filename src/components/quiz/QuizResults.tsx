
"use client";

import React, { useState, useEffect } from 'react';
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
  Activity,
  History,
  Target,
  Clock,
  TrendingUp,
  Loader2,
  Sparkles
} from "lucide-react";
import Link from 'next/link';
import { cn } from "@/lib/utils";
import { Question, UserResponse } from '@/types/quiz';
import { QuestionRenderer } from './QuestionRenderer';
import { calculateScoreForQuestion } from '@/lib/quiz-utils';
import { API_URL } from '@/lib/api-config';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";

interface QuizResultsProps {
  title: string;
  testId?: string;
  score: number;
  totalQuestions: number;
  questions: Question[];
  responses: UserResponse[];
  userName: string;
  onRestart: () => void;
  startTime?: number;
  endTime?: number;
}

export function QuizResults({
  title,
  testId,
  score,
  totalQuestions,
  questions,
  responses,
  userName,
  onRestart,
  startTime,
  endTime
}: QuizResultsProps) {
  const [percentile, setPercentile] = useState<number | null>(null);
  const [comparativeLoading, setComparativeLoading] = useState(false);

  const percentage = Math.round((score / (totalQuestions || 1)) * 100);
  
  // Performance Thresholds
  const isMastery = percentage >= 80;
  const isPass = percentage >= 50;
  
  const statusColor = isMastery 
    ? "text-emerald-400" 
    : isPass 
      ? "text-amber-400" 
      : "text-rose-400";

  const ringColor = isMastery 
    ? "stroke-emerald-500" 
    : isPass 
      ? "stroke-amber-500" 
      : "stroke-rose-500";

  useEffect(() => {
    if (!testId || !API_URL) return;
    
    const fetchComparison = async () => {
      setComparativeLoading(true);
      try {
        const res = await fetch(`${API_URL}?action=getResponses`);
        const data = await res.json();
        if (Array.isArray(data)) {
          const testResponses = data.filter(r => String(r['Test ID']) === String(testId));
          if (testResponses.length > 0) {
            const currentScorePct = percentage;
            const scores = testResponses.map(r => (Number(r.Score) / (Number(r.Total) || 1)) * 100);
            const lowerScores = scores.filter(s => s < currentScorePct).length;
            const calculatedPercentile = Math.round((lowerScores / scores.length) * 100);
            setPercentile(calculatedPercentile);
          } else {
            setPercentile(100);
          }
        }
      } catch (e) {
        console.error("Comparison fetch failed", e);
      } finally {
        setComparativeLoading(false);
      }
    };

    fetchComparison();
  }, [testId, percentage]);

  const getCompliment = (pct: number) => {
    if (pct >= 95) return "Exceptional mastery! Absolute precision detected.";
    if (pct >= 80) return "Outstanding! Peak cognitive synchronization.";
    if (pct >= 70) return "Success! Core requirements fully met.";
    if (pct >= 50) return "Completed. Optimization recommended.";
    return "Alignment incomplete. Re-engagement advised.";
  };

  const durationMs = (endTime && startTime) ? endTime - startTime : 0;
  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes > 0) return `${minutes}m ${remainingSeconds}s`;
    return `${remainingSeconds}s`;
  };
  const formattedDuration = formatDuration(durationMs);

  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-primary/5 flex flex-col items-center py-12 px-4 md:px-8 selection:bg-primary selection:text-white pb-32 transition-all duration-1000">
      <div className="w-full max-w-6xl space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        
        {/* Header: Identity Bar */}
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="inline-flex items-center gap-4 px-10 py-5 rounded-[3rem] bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl ring-1 ring-white/5">
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-primary to-blue-400 flex items-center justify-center shadow-lg shadow-primary/20">
              <User className="w-7 h-7 text-white fill-white/20" />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 leading-none mb-1.5">Assessment Operator</p>
              <h1 className="text-3xl font-black tracking-tight text-white uppercase">{userName}</h1>
            </div>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-xl font-black text-slate-400 uppercase tracking-[0.5em]">{title}</h2>
            <div className="h-1 w-32 bg-gradient-to-r from-transparent via-primary/40 to-transparent mx-auto rounded-full" />
          </div>
        </div>

        {/* Main Performance Hub */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left: Animated Radial Gauge */}
          <Card className="lg:col-span-5 border-none shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] rounded-[4rem] bg-slate-900/40 backdrop-blur-3xl border border-white/5 overflow-hidden flex flex-col items-center justify-center p-12 relative group">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/10 to-transparent pointer-events-none opacity-50" />
            
            <div className="relative w-72 h-72 flex items-center justify-center">
              {/* Outer Glow Circle */}
              <div className={cn(
                "absolute inset-0 rounded-full blur-[40px] opacity-20 transition-all duration-1000",
                isMastery ? "bg-emerald-500" : isPass ? "bg-amber-500" : "bg-rose-500"
              )} />
              
              <svg className="w-full h-full -rotate-90">
                <circle
                  cx="144"
                  cy="144"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="14"
                  fill="transparent"
                  className="text-white/5"
                />
                <circle
                  cx="144"
                  cy="144"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="14"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  strokeLinecap="round"
                  fill="transparent"
                  className={cn("transition-all duration-1000 ease-out drop-shadow-[0_0_12px_rgba(255,255,255,0.3)]", ringColor)}
                />
              </svg>
              <div className="absolute flex flex-col items-center text-center">
                <span className="text-8xl font-black text-white tracking-tighter tabular-nums">{percentage}%</span>
                <span className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-500">Alignment</span>
              </div>
            </div>

            <div className="mt-12 grid grid-cols-2 gap-10 w-full border-t border-white/5 pt-12">
              <div className="text-center group/stat">
                <p className="text-4xl font-black text-emerald-400 transition-transform group-hover/stat:scale-110 duration-300">{score}</p>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 mt-2 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500/80">Correct</span>
                </div>
              </div>
              <div className="text-center border-l border-white/5 group/stat">
                <p className="text-4xl font-black text-rose-400 transition-transform group-hover/stat:scale-110 duration-300">{totalQuestions - score}</p>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 mt-2 border border-rose-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-rose-500/80">Errors</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Right: Glassmorphism Analysis */}
          <div className="lg:col-span-7 space-y-8 flex flex-col">
            <Card className="flex-1 border-none shadow-2xl rounded-[4rem] bg-white/[0.03] backdrop-blur-2xl border border-white/10 p-12 flex flex-col justify-center relative overflow-hidden">
              <div className="absolute top-0 right-0 p-10 opacity-[0.03] rotate-12 pointer-events-none">
                <Sparkles className="w-64 h-64 text-white" />
              </div>
              
              <div className={cn(
                "p-10 rounded-[3rem] border-2 border-dashed mb-10 transition-colors duration-500",
                isMastery ? "bg-emerald-500/5 border-emerald-500/20" : isPass ? "bg-amber-500/5 border-amber-500/20" : "bg-rose-500/5 border-rose-500/20"
              )}>
                <div className="flex items-center gap-3 mb-6">
                  {isMastery ? <Trophy className="w-6 h-6 text-emerald-400" /> : <Zap className="w-6 h-6 text-primary" />}
                  <h4 className={cn("text-[11px] font-black uppercase tracking-[0.3em]", statusColor)}>Protocol Assessment</h4>
                </div>
                <p className="text-white font-black text-4xl leading-[1.15] tracking-tight">
                  "{getCompliment(percentage)}"
                </p>
              </div>

              {/* Enhanced Percentile Comparison */}
              {percentile !== null && !comparativeLoading && (
                <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/10 flex flex-col gap-6 mb-10 group/bench">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center shadow-lg">
                        <TrendingUp className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-0.5">Global Benchmarking</p>
                        <p className="text-xl font-bold text-slate-200">System Percentile: <span className="text-primary">{percentile}%</span></p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center px-1">
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Entry</span>
                      <span className="text-[9px] font-black text-primary uppercase tracking-widest">Mastery</span>
                    </div>
                    <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden p-0.5 border border-white/5">
                      <div 
                        className="h-full bg-gradient-to-r from-primary/40 to-primary rounded-full transition-all duration-1500 ease-out shadow-[0_0_15px_rgba(59,91,219,0.5)]" 
                        style={{ width: `${percentile}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {comparativeLoading && (
                <div className="h-24 flex items-center justify-center mb-10 bg-white/5 rounded-[2.5rem] border-2 border-dashed border-white/5">
                  <Loader2 className="w-6 h-6 animate-spin text-primary mr-4" />
                  <span className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-500">Synchronizing Benchmark Registry...</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Button onClick={onRestart} variant="outline" className="h-18 rounded-full font-black border-2 border-white/10 bg-transparent text-white text-xs uppercase tracking-widest hover:bg-white/10 hover:border-white/20 transition-all group py-8">
                  <RotateCcw className="w-5 h-5 mr-3 transition-transform group-hover:-rotate-90 duration-500" />
                  Restart Module
                </Button>
                <Link href="/tests" className="w-full">
                  <Button className="w-full h-18 rounded-full font-black shadow-2xl bg-primary hover:scale-[1.03] hover:shadow-primary/30 transition-all text-xs uppercase tracking-widest text-white border-none py-8 group/btn">
                    Enter Library
                    <ArrowRight className="w-5 h-5 ml-3 transition-transform group-hover/btn:translate-x-2 duration-300" />
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Redesigned Metric Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              <StatMetric icon={History} label="Attempts" value="01" color="blue" />
              <StatMetric icon={Target} label="Precision" value={isMastery ? "High" : isPass ? "Med" : "Low"} color={isMastery ? "green" : isPass ? "amber" : "rose"} />
              <StatMetric icon={Clock} label="Session" value={formattedDuration} color="purple" />
              <StatMetric icon={Activity} label="Telemetry" value="Live" color="cyan" />
            </div>
          </div>
        </div>

        {/* Step Analytics Section */}
        <div className="space-y-10 pt-16 border-t border-white/5">
          <div className="flex items-center justify-between px-4">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center shadow-inner ring-1 ring-primary/20">
                <History className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h3 className="text-4xl font-black tracking-tight text-white uppercase leading-none">Step Analytics</h3>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.4em] mt-3">Registry Calibration Audit</p>
              </div>
            </div>
          </div>

          <Accordion type="single" collapsible className="space-y-5">
            {questions.map((q, idx) => {
              const userResp = responses.find(r => r.questionId === q.id)?.answer;
              const isCorrect = calculateScoreForQuestion(q, userResp);
              const hasAnswered = userResp !== undefined && userResp !== null;

              return (
                <AccordionItem 
                  key={q.id} 
                  value={`item-${idx}`}
                  className={cn(
                    "border-none rounded-[3.5rem] overflow-hidden bg-white/[0.02] backdrop-blur-md border border-white/5 transition-all hover:bg-white/[0.04] group/acc shadow-xl",
                    isCorrect ? "border-l-[8px] border-l-emerald-500/50" : (hasAnswered ? "border-l-[8px] border-l-rose-500/50" : "border-l-[8px] border-l-slate-700")
                  )}
                >
                  <AccordionTrigger className="px-10 py-10 hover:no-underline group">
                    <div className="flex items-center gap-10 text-left w-full">
                      <div className={cn(
                        "w-18 h-18 rounded-[2rem] flex items-center justify-center shrink-0 shadow-2xl border-2 transition-all duration-500 group-data-[state=open]:scale-110",
                        !q.correct_answer ? "bg-slate-800 border-white/10 text-slate-500" : 
                        (isCorrect ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-rose-500/10 border-rose-500/30 text-rose-400")
                      )}>
                        {!q.correct_answer ? <AlertCircle className="w-8 h-8" /> : (isCorrect ? <CheckCircle2 className="w-8 h-8" /> : <XCircle className="w-8 h-8" />)}
                      </div>
                      <div className="flex flex-col min-w-0 flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Step {idx + 1}</span>
                          <div className={cn(
                            "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                            isCorrect ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "bg-rose-500/10 text-rose-500 border border-rose-500/20"
                          )}>
                            {isCorrect ? "Correct Alignment" : "Alignment Gap"}
                          </div>
                        </div>
                        <h4 className="font-black text-slate-200 text-2xl tracking-tight line-clamp-1 group-hover:text-primary transition-colors duration-300">
                          {q.question_text}
                        </h4>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-14 pb-14 pt-0">
                    <div className="h-px w-full bg-white/5 mb-14" />
                    <div className="max-w-4xl mx-auto rounded-[2.5rem] bg-black/20 p-10 ring-1 ring-white/5">
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
        <div className="flex justify-center pt-20">
          <Link href="/">
            <Button variant="ghost" className="rounded-full font-black text-slate-500 hover:text-white hover:bg-white/5 transition-all uppercase tracking-[0.6em] text-[11px] h-14 px-12 group">
              <Home className="w-5 h-5 mr-4 transition-transform group-hover:-translate-y-1 duration-300" />
              Terminate Session
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatMetric({ icon: Icon, label, value, color }: { icon: any, label: string, value: string, color: string }) {
  const colorMap: Record<string, string> = {
    blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    green: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    rose: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    cyan: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  };

  return (
    <div className={cn(
      "p-8 rounded-[2.5rem] border shadow-2xl backdrop-blur-xl flex flex-col items-center text-center gap-3 group transition-all hover:-translate-y-2 hover:bg-white/[0.05]",
      colorMap[color] || "bg-white/5 text-slate-400 border-white/5"
    )}>
      <Icon className="w-5 h-5 opacity-60 group-hover:scale-110 transition-transform duration-500" />
      <div className="space-y-1">
        <p className="text-xl font-black text-white leading-none tracking-tight">{value}</p>
        <p className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40">{label}</p>
      </div>
    </div>
  );
}
