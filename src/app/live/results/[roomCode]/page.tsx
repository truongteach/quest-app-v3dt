/**
 * live/results/[roomCode]/page.tsx
 * 
 * Route: /live/results/[roomCode]
 * Purpose: Teacher-facing dashboard for finalized live session results.
 * Auth: Admin only (Host).
 */

"use client";

import React, { useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import useSWR from 'swr';
import { API_URL } from '@/lib/api-config';
import { AILoader } from '@/components/ui/ai-loader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Trophy, 
  Users, 
  Target, 
  Clock, 
  ArrowLeft, 
  Download, 
  CheckCircle2, 
  BarChart3,
  ListChecks
} from 'lucide-react';
import { calculateScoreForQuestion } from '@/lib/quiz-utils';
import { cn } from '@/lib/utils';

export default function LiveResultsDashboard() {
  const { roomCode } = useParams();
  const router = useRouter();

  const { data: roomData, isLoading: roomLoading } = useSWR(
    roomCode ? `/api/live/room-details?code=${roomCode}` : null
  );

  const { data: questions, isLoading: questionsLoading } = useSWR(
    roomData?.testId && API_URL ? `${API_URL}?action=getQuestions&id=${roomData.testId}` : null
  );

  const loading = roomLoading || (roomData?.testId && questionsLoading);

  const stats = useMemo(() => {
    if (!roomData || !questions) return null;

    const students = [...roomData.students].sort((a, b) => (b.score || 0) - (a.score || 0));
    const questionSummary = questions.map((q: any, qIdx: number) => {
      let correct = 0;
      let incorrect = 0;
      roomData.students.forEach((s: any) => {
        // Defensive Registry Check: Fallback to empty object if answers are missing
        const studentAnswers = s.answers || {};
        const isCorrect = calculateScoreForQuestion(q, studentAnswers[qIdx]);
        if (isCorrect) correct++;
        else incorrect++;
      });
      return { question: q.question_text, correct, incorrect, total: roomData.students.length };
    });

    const avgScore = roomData.students.length > 0 
      ? Math.round(roomData.students.reduce((acc: number, s: any) => acc + (s.score || 0), 0) / roomData.students.length)
      : 0;

    return { students, questionSummary, avgScore };
  }, [roomData, questions]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><AILoader /></div>;

  if (!roomData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-slate-50 text-center">
        <div className="w-16 h-16 text-rose-500 mb-6">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        </div>
        <h2 className="text-3xl font-black uppercase tracking-tight text-slate-900">Session Registry Lost</h2>
        <p className="text-slate-500 mt-2 mb-8">The requested live room could not be located in the terminal memory.</p>
        <Button onClick={() => router.push('/admin')} className="rounded-full px-8">Return to Base</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8 pb-32">
      <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
             <Button variant="ghost" onClick={() => router.push('/admin')} className="rounded-full h-12 w-12 p-0 hover:bg-white shadow-sm border border-slate-100">
               <ArrowLeft className="w-6 h-6 text-slate-900" />
             </Button>
             <div>
               <div className="flex items-center gap-2 mb-1">
                 <div className="w-2 h-2 rounded-full bg-rose-500" />
                 <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Live Session Finalized</span>
               </div>
               <h1 className="text-4xl font-black uppercase tracking-tight text-slate-900">{roomData.testName}</h1>
             </div>
          </div>
          <div className="flex items-center gap-4">
             <Button variant="outline" className="rounded-full h-12 px-6 font-black uppercase text-[10px] tracking-widest gap-2 bg-white shadow-sm opacity-50 cursor-not-allowed">
               <Download className="w-4 h-4" /> Export Report (Soon)
             </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <AnalysisStat icon={Users} label="Participants" value={roomData.studentCount} color="blue" />
           <AnalysisStat icon={Target} label="Mean Score" value={stats?.avgScore || 0} color="green" />
           <AnalysisStat icon={Clock} label="Session Code" value={roomCode} color="purple" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           <div className="lg:col-span-7">
              <Card className="border-none shadow-2xl rounded-[3rem] overflow-hidden bg-white">
                <CardHeader className="p-10 border-b bg-slate-50/50">
                   <div className="flex items-center gap-4">
                      <div className="p-3 bg-primary/10 rounded-2xl"><Trophy className="w-6 h-6 text-primary" /></div>
                      <CardTitle className="text-2xl font-black uppercase tracking-tight">Final Leaderboard</CardTitle>
                   </div>
                </CardHeader>
                <CardContent className="p-0">
                   <div className="divide-y">
                      {stats?.students.map((s, i) => {
                        const totalQuestions = questions?.length || 0;
                        const correctCount = (s.score || 0) / 100;
                        return (
                          <div key={s.id} className="p-8 flex items-center justify-between group hover:bg-slate-50 transition-colors">
                             <div className="flex items-center gap-6">
                                <span className="text-3xl font-black text-slate-300 w-10">{(i + 1).toString().padStart(2, '0')}</span>
                                <div className="flex flex-col">
                                   <span className="text-lg font-black uppercase text-slate-900">{s.name}</span>
                                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{correctCount} / {totalQuestions} Nodes Cleared</span>
                                </div>
                             </div>
                             <div className="flex items-center gap-8">
                                <div className="hidden sm:flex items-center gap-1.5 px-4 py-2 bg-emerald-50 rounded-2xl border border-emerald-100">
                                   <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                   <span className="text-[10px] font-black text-emerald-600">{Math.round((correctCount / totalQuestions) * 100)}%</span>
                                </div>
                                <span className="text-3xl font-black text-primary tabular-nums">{s.score || 0}</span>
                             </div>
                          </div>
                        );
                      })}
                   </div>
                </CardContent>
              </Card>
           </div>

           <div className="lg:col-span-5 space-y-8">
              <Card className="border-none shadow-xl rounded-[3rem] overflow-hidden bg-white">
                 <CardHeader className="p-10 border-b bg-slate-50/50">
                    <div className="flex items-center gap-4">
                       <div className="p-3 bg-primary/10 rounded-2xl"><BarChart3 className="w-6 h-6 text-primary" /></div>
                       <CardTitle className="text-xl font-black uppercase tracking-tight">Intelligence Audit</CardTitle>
                    </div>
                 </CardHeader>
                 <CardContent className="p-8 space-y-6">
                    {stats?.questionSummary.map((item, i) => (
                      <div key={i} className="space-y-3">
                         <div className="flex justify-between items-start gap-4">
                            <p className="text-sm font-bold text-slate-700 leading-tight flex-1 line-clamp-2">{item.question}</p>
                            <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[10px]">
                               {Math.round((item.correct / item.total) * 100)}%
                            </Badge>
                         </div>
                         <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden flex">
                            <div className="h-full bg-emerald-500" style={{ width: `${(item.correct / item.total) * 100}%` }} />
                            <div className="h-full bg-rose-200" style={{ width: `${(item.incorrect / item.total) * 100}%` }} />
                         </div>
                      </div>
                    ))}
                 </CardContent>
              </Card>

              <Card className="border-none shadow-xl rounded-[2.5rem] bg-slate-900 text-white p-10 relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-6 opacity-10"><ListChecks className="w-24 h-24" /></div>
                 <div className="relative z-10 space-y-4">
                    <h3 className="text-xl font-black uppercase tracking-tight">Data Persistence</h3>
                    <p className="text-slate-400 text-sm font-medium leading-relaxed">
                       All performance metrics from this session have been automatically synchronized with the central Google Sheets registry.
                    </p>
                    <div className="pt-4">
                       <Button onClick={() => router.push('/admin/responses')} className="w-full h-14 rounded-full bg-white text-slate-900 font-black uppercase text-xs tracking-widest border-none">View Main Registry</Button>
                    </div>
                 </div>
              </Card>
           </div>
        </div>
      </div>
    </div>
  );
}

function AnalysisStat({ icon: Icon, label, value, color }: any) {
  const colors: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    green: "bg-emerald-50 text-emerald-600 border-emerald-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100"
  };
  return (
    <Card className="border-none shadow-sm bg-white p-8 rounded-[2.5rem] border border-slate-100 flex items-center gap-6">
      <div className={cn("p-5 rounded-2xl border-2", colors[color])}><Icon className="w-7 h-7" /></div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-1">{label}</p>
        <p className="text-4xl font-black text-slate-900 tracking-tighter tabular-nums">{value}</p>
      </div>
    </Card>
  );
}
