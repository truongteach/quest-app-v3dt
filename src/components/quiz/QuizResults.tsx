"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  RotateCcw, 
  ArrowRight,
  User,
  Activity,
  History,
  Target,
  Clock,
  Zap,
  Trophy,
  AlertCircle,
  XCircle,
  FileBadge,
  Download,
  CheckCircle2,
  ChevronRight,
  ListChecks
} from "lucide-react";
import Link from 'next/link';
import { cn } from "@/lib/utils";
import { Question, UserResponse } from '@/types/quiz';
import { getVerdictData } from '@/lib/quiz-config';
import { useSettings } from '@/context/settings-context';
import { PerformanceGauge } from './PerformanceGauge';
import { BenchmarkingSection } from './BenchmarkingSection';
import { StepAnalytics } from './StepAnalytics';
import { generateCertificatePDF } from '@/lib/certificate-utils';
import confetti from 'canvas-confetti';

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
  testMetadata?: any;
  allTests?: any[];
  certificateId?: string;
}

function normalizeString(str: string) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function getSeriesInfo(title: string) {
  const normalized = normalizeString(title);
  const match = normalized.match(/^(.*?)\s*(\d*)$/);
  return {
    prefix: match ? match[1].trim() : normalized,
    number: (match && match[2]) ? parseInt(match[2]) : null
  };
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
  endTime,
  testMetadata,
  allTests = [],
  certificateId
}: QuizResultsProps) {
  const { settings } = useSettings();
  const [textSize, setTextSize] = useState<'normal' | 'large' | 'small'>('normal');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('dntrng_text_size') as 'normal' | 'large' | 'small';
    if (saved && ['normal', 'large', 'small'].includes(saved)) {
      setTextSize(saved);
    }
  }, []);

  const percentage = Math.round((score / (totalQuestions || 1)) * 100);
  const globalThreshold = Number(settings.default_pass_threshold || '70');
  const testThreshold = Number(testMetadata?.passing_threshold || globalThreshold);
  
  const isPass = percentage >= testThreshold;
  const verdict = getVerdictData(percentage);

  const suggestions = useMemo(() => {
    if (!allTests || allTests.length === 0 || !testMetadata) return [];
    const currentTitle = testMetadata.title || "";
    const currentSeries = getSeriesInfo(currentTitle);
    
    const related = allTests.filter(t => {
      if (t.id === testId) return false;
      const tSeries = getSeriesInfo(t.title || "");
      return tSeries.prefix === currentSeries.prefix;
    }).map(t => ({
      ...t,
      seriesInfo: getSeriesInfo(t.title || "")
    }));

    let result = [];
    if (isPass) {
      const higher = related
        .filter(t => (t.seriesInfo.number || 0) > (currentSeries.number || 0))
        .sort((a, b) => (a.seriesInfo.number || 0) - (b.seriesInfo.number || 0));
      result = higher;
      if (result.length < 3) {
        const nextLevelMatch = currentTitle.match(/(Level|LV)\s*(\d+)/i);
        if (nextLevelMatch) {
          const nextLevelNum = parseInt(nextLevelMatch[2]) + 1;
          const nextLevelPattern = new RegExp(`(Level|LV)\\s*${nextLevelNum}`, 'i');
          const nextLevelTests = allTests.filter(t => t.id !== testId && t.title?.match(nextLevelPattern) && !result.find(r => r.id === t.id));
          result = [...result, ...nextLevelTests];
        }
      }
    } else {
      const lower = related
        .filter(t => (t.seriesInfo.number || 0) < (currentSeries.number || 0))
        .sort((a, b) => (b.seriesInfo.number || 0) - (a.seriesInfo.number || 0));
      result = lower;
    }
    return result.slice(0, 3);
  }, [allTests, testMetadata, isPass, testId]);

  useEffect(() => {
    if (isPass) {
      const attemptKey = `confetti_shown_${testId || 'unknown'}_${endTime || Date.now()}`;
      const shown = sessionStorage.getItem(attemptKey);
      if (!shown) {
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const colors = ['#0F172A', '#3B5BDB', '#FFFFFF'];
        const frame = () => {
          confetti({ particleCount: 2, angle: 60, spread: 55, origin: { x: 0, y: 0 }, colors: colors });
          confetti({ particleCount: 2, angle: 120, spread: 55, origin: { x: 1, y: 0 }, colors: colors });
          if (Date.now() < animationEnd) requestAnimationFrame(frame);
        };
        frame();
        sessionStorage.setItem(attemptKey, 'true');
      }
    }
  }, [isPass, testId, endTime]);

  const handleDownloadCertificate = async () => {
    if (!certificateId) return;
    setIsGenerating(true);
    try {
      await generateCertificatePDF({
        studentName: userName,
        testName: title,
        score,
        total: totalQuestions,
        date: new Date(),
        certificateId: certificateId,
        platformName: String(settings.platform_name || "DNTRNG")
      });
    } catch (error) {} finally {
      setIsGenerating(false);
    }
  };

  const durationMs = (endTime && startTime) ? endTime - startTime : 0;
  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes > 0) return `${minutes}m ${remainingSeconds}s`;
    return `${remainingSeconds}s`;
  };

  const getDifficultyColor = (diff: string) => {
    const d = String(diff || "").toLowerCase();
    if (d === 'beginner' || d === 'easy') return 'bg-emerald-500';
    if (d === 'medium') return 'bg-amber-500';
    if (d === 'hard') return 'bg-red-500';
    return 'bg-slate-300';
  };

  const IconMap = { Trophy, CheckCircle2, Target, XCircle };
  const VerdictIcon = (IconMap as any)[verdict.iconName] || AlertCircle;
  const isBenchmarkingEnabled = String(settings.enable_benchmarking ?? 'true') !== 'false';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center py-12 px-4 md:px-8 selection:bg-primary selection:text-white pb-32 transition-colors duration-500">
      <div className="w-full max-w-5xl space-y-8 animate-in fade-in duration-700">
        
        {/* Header: Identity Bar */}
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="inline-flex items-center gap-4 px-10 py-5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl">
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-primary to-blue-400 flex items-center justify-center shadow-lg shadow-primary/20">
              <User className="w-7 h-7 text-white fill-white/20" />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 leading-none mb-1.5">Assessment Operator</p>
              <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white uppercase">{userName}</h1>
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-black text-slate-400 uppercase tracking-[0.5em]">{title}</h2>
          </div>
        </div>

        {/* 1. TOP ROW: Summary Diagnostic */}
        <Card className="p-8 md:p-10 border-none shadow-2xl rounded-[3rem] bg-white dark:bg-slate-900 overflow-hidden flex flex-col md:flex-row items-center gap-10">
          <div className="shrink-0">
            <PerformanceGauge 
              percentage={percentage} 
              score={score} 
              totalQuestions={totalQuestions} 
              isPass={isPass}
              compact={true}
            />
          </div>
          
          <div className="flex flex-row md:flex-col lg:flex-row gap-8 items-center border-x md:border-x-0 lg:border-x border-slate-100 dark:border-slate-800 px-10">
            <div className="text-center">
              <p className="text-3xl font-black text-emerald-600">{score}</p>
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Correct</p>
            </div>
            <div className="h-10 w-px bg-slate-100 dark:bg-slate-800 hidden md:block lg:hidden" />
            <div className="text-center">
              <p className="text-3xl font-black text-rose-600">{totalQuestions - score}</p>
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Incorrect</p>
            </div>
          </div>

          <div className={cn(
            "flex-1 p-8 rounded-[2rem] border-l-[6px] transition-all duration-500",
            verdict.border,
            verdict.bg
          )}>
            <div className="flex items-center gap-3 mb-3">
              <VerdictIcon className={cn("w-4 h-4", verdict.color)} />
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Verdict</h4>
            </div>
            <h3 className={cn("text-2xl font-black uppercase tracking-tight mb-2", verdict.color)}>
              {verdict.title}
            </h3>
            <p className="text-slate-600 dark:text-slate-300 font-medium text-sm leading-relaxed">
              {verdict.message}
            </p>
          </div>
        </Card>

        {/* 2. MIDDLE ROW: Benchmarking */}
        {isBenchmarkingEnabled && (
          <div className="w-full">
            <BenchmarkingSection testId={testId} percentage={percentage} enabled={true} />
          </div>
        )}

        {/* 3. CERTIFICATE ROW */}
        {certificateId && isPass && (
          <div className="p-8 rounded-[2.5rem] bg-slate-900 text-white relative overflow-hidden group shadow-2xl animate-in zoom-in-95 duration-500 w-full">
            <div className="absolute top-0 right-0 p-6 opacity-10 rotate-12 group-hover:rotate-45 transition-transform duration-700">
              <FileBadge className="w-32 h-32" />
            </div>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h4 className="text-primary font-black uppercase text-[10px] tracking-[0.4em] mb-2">Credential Issued</h4>
                <p className="text-xl font-bold leading-tight">Your certification is ready for official download.</p>
              </div>
              <Button 
                onClick={handleDownloadCertificate}
                disabled={isGenerating}
                className="h-14 rounded-full px-10 bg-primary hover:bg-primary/90 font-black uppercase text-xs tracking-widest gap-3 shadow-xl transition-all hover:scale-[1.02] border-none"
              >
                {isGenerating ? <Zap className="w-4 h-4 animate-pulse" /> : <Download className="w-4 h-4" />}
                {isGenerating ? 'Generating...' : 'Download Certificate'}
              </Button>
            </div>
          </div>
        )}

        {/* 4. BUTTONS ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
          <Button onClick={onRestart} variant="outline" className="h-16 rounded-full font-black border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 text-xs uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
            <RotateCcw className="w-5 h-5 mr-3" />
            Try Again
          </Button>
          <Link href="/tests" className="w-full">
            <Button className="w-full h-16 rounded-full font-black shadow-2xl bg-primary hover:scale-[1.02] transition-all text-xs uppercase tracking-widest text-white border-none">
              Back to Tests
              <ArrowRight className="w-5 h-5 ml-3" />
            </Button>
          </Link>
        </div>

        {/* 5. SUGGESTIONS ROW */}
        {suggestions.length > 0 && (
          <div className="w-full p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
            <div className="flex items-center gap-3 mb-6">
              <Zap className={cn("w-5 h-5", isPass ? "text-emerald-500" : "text-slate-400")} />
              <h3 className={cn("text-sm font-black uppercase tracking-widest", isPass ? "text-emerald-600" : "text-slate-400")}>
                {isPass ? "Recommended Path" : "Suggested Practice"}
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {suggestions.map((s) => (
                <Link key={s.id} href={`/quiz?id=${s.id}`} className="group">
                  <div className="h-full p-5 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-2xl hover:bg-white dark:hover:bg-slate-700 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className={cn("w-2 h-2 rounded-full", getDifficultyColor(s.difficulty))} />
                      <Badge variant="outline" className="text-[8px] font-black uppercase tracking-tighter opacity-50 px-2 rounded-md">#{s.id}</Badge>
                    </div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate mb-4 group-hover:text-primary transition-colors">{s.title}</p>
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                        <span className="flex items-center gap-1"><ListChecks className="w-3 h-3" /> {s.questions_count || 10}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {s.duration || '15m'}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* 6. STATS ROW: 4 Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
          <StatMetric icon={History} label="Attempts" value="01" />
          <StatMetric icon={Target} label="Accuracy" value={percentage >= 80 ? "High" : isPass ? "Med" : "Low"} />
          <StatMetric icon={Clock} label="Time Taken" value={formatDuration(durationMs)} />
          <StatMetric icon={Activity} label="Status" value="Verified" />
        </div>

        {/* 7. QUESTION REVIEW */}
        <StepAnalytics 
          questions={questions} 
          responses={responses} 
          textSize={textSize} 
        />

        {/* Bottom Navigation */}
        <div className="flex justify-center pt-12">
          <Link href="/">
            <Button variant="ghost" className="rounded-full font-black text-slate-400 hover:text-slate-900 transition-all uppercase tracking-[0.6em] text-[11px] h-14 px-12 group">
              <Home className="w-5 h-5 mr-4" />
              Terminate Session
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatMetric({ icon: Icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="p-6 rounded-[2rem] border bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center text-center gap-2 group transition-all hover:shadow-md hover:-translate-y-1">
      <Icon className="w-4 h-4 text-primary opacity-40 group-hover:opacity-100 transition-opacity" />
      <div className="space-y-0.5">
        <p className="text-lg font-black text-slate-900 dark:text-white leading-none tracking-tight">{value}</p>
        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">{label}</p>
      </div>
    </div>
  );
}
