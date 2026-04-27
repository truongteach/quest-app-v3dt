/**
 * live/[roomCode]/page.tsx
 * 
 * Route: /live/[roomCode]
 * Purpose: Student terminal for synchronized live assessments.
 * Updated: v18.9.2 - Updated status handlers to recognize 'active' state.
 */

"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { getPusherClient } from '@/lib/pusher';
import { QuestionRenderer } from '@/components/quiz/QuestionRenderer';
import { AILoader } from '@/components/ui/ai-loader';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Trophy, Clock, CheckCircle2, XCircle, Users, Zap, Loader2, ArrowLeft, Home, AlertTriangle, WifiOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function LiveStudentPage() {
  const { roomCode } = useParams();
  const searchParams = useSearchParams();
  const studentId = searchParams.get('studentId');
  const router = useRouter();
  const { toast } = useToast();

  const [status, setStatus] = useState<'waiting' | 'active' | 'revealed' | 'ended'>('waiting');
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [currentAnswer, setCurrentAnswer] = useState<any>(undefined);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [result, setResult] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  // WATCHDOG PROTOCOL: Track host connectivity
  const [lastHostActivity, setLastHostActivity] = useState(Date.now());
  const [hostConnectivityMs, setHostConnectivityMs] = useState(0);

  const updateHeartbeat = () => setLastHostActivity(Date.now());

  // Sync Protocol: Local Countdown Engine
  useEffect(() => {
    if (status !== 'active' || timeLeft === null || timeLeft <= 0 || currentAnswer !== undefined) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [status, timeLeft, currentAnswer]);

  // Watchdog Engine: Monitor for host disconnection
  useEffect(() => {
    const watchdog = setInterval(() => {
      setHostConnectivityMs(Date.now() - lastHostActivity);
    }, 5000);

    return () => clearInterval(watchdog);
  }, [lastHostActivity]);

  // Terminal Guard: Handle auto-submit on expiry
  useEffect(() => {
    if (status === 'active' && timeLeft === 0 && currentAnswer === undefined) {
      submitAnswer("__expired__");
    }
  }, [timeLeft, status, currentAnswer]);

  useEffect(() => {
    if (!studentId || !roomCode) {
      router.push('/join');
      return;
    }

    // SESSION INTEGRITY PROTOCOL: Verify current room status on mount
    const checkInitialStatus = async () => {
      try {
        const res = await fetch(`/api/live/room-details?code=${roomCode}`);
        if (!res.ok) {
           router.push('/join');
           return;
        }
        const data = await res.json();
        const isMyIdentityPresent = data.students?.some((s: any) => s.id === studentId);

        if (data.status === 'ended') {
          if (isMyIdentityPresent) {
            setLeaderboard(data.students.sort((a: any, b: any) => b.score - a.score));
            setStatus('ended');
          } else {
            router.push('/join?error=session-ended');
          }
          return;
        }

        if (!isMyIdentityPresent) {
           router.push('/join');
           return;
        }
        
        // Initial Heartbeat Sync
        updateHeartbeat();
      } catch (e) {
        console.error('[Session Audit Failed]', e);
      }
    };

    checkInitialStatus();

    const pusher = getPusherClient();
    const channel = pusher.subscribe(`room-${roomCode}`);

    channel.bind('question-start', (data: any) => {
      updateHeartbeat();
      setCurrentQuestion(data.questionData);
      setCurrentAnswer(undefined);
      setResult(null);
      setStatus('active');
      setTimeLeft(data.timeLimit);
    });

    channel.bind('student-answered', (data: any) => {
      updateHeartbeat();
      setAnsweredCount(data.answeredCount);
      setTotalStudents(data.totalStudents);
    });

    channel.bind('answer-reveal', (data: any) => {
      updateHeartbeat();
      const myResult = data.studentResults.find((s: any) => s.id === studentId);
      setResult(myResult);
      setLeaderboard(data.leaderboard);
      setStatus('revealed');
    });

    channel.bind('next-question', () => {
      updateHeartbeat();
      setStatus('waiting');
    });

    channel.bind('session-ended', (data: any) => {
      updateHeartbeat();
      setLeaderboard(data.finalLeaderboard);
      setStatus('ended');
    });

    return () => {
      pusher.unsubscribe(`room-${roomCode}`);
    };
  }, [roomCode, studentId, router]);

  const submitAnswer = async (answer: any) => {
    if (status !== 'active' || currentAnswer !== undefined) return;
    
    const transmissionValue = answer === "__expired__" ? null : answer;
    setCurrentAnswer(answer);

    try {
      await fetch('/api/live/student-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomCode, studentId, answer: transmissionValue })
      });
    } catch (e) {
      toast({ variant: "destructive", title: "Sync Failure", description: "Answer could not be committed to registry." });
    }
  };

  const studentRank = useMemo(() => {
    if (!leaderboard.length) return null;
    const idx = leaderboard.findIndex(s => s.id === studentId);
    return idx === -1 ? null : idx + 1;
  }, [leaderboard, studentId]);

  if (status === 'waiting') {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-8 text-center text-white">
        <div className="max-w-md w-full space-y-12">
          <div className="mx-auto w-24 h-24 bg-primary/20 rounded-[2rem] flex items-center justify-center ring-4 ring-primary/10 animate-pulse">
            <Zap className="w-12 h-12 text-primary fill-current" />
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-black uppercase tracking-tight">Synchronizing...</h1>
            <p className="text-lg font-medium text-slate-400">Connected to room <span className="text-white font-black">{roomCode}</span>. Waiting for host to initialize the next step.</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 bg-white/5 rounded-3xl border border-white/5"><p className="text-[10px] font-black uppercase text-slate-500 mb-1">Status</p><p className="font-bold">Authorized</p></div>
            <div className="p-6 bg-white/5 rounded-3xl border border-white/5"><p className="text-[10px] font-black uppercase text-slate-500 mb-1">Identity</p><p className="font-bold">Verified</p></div>
          </div>
          <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  if (status === 'active' && currentQuestion) {
    const hasTransmitted = currentAnswer !== undefined;
    const isExpired = currentAnswer === "__expired__";

    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        {hostConnectivityMs > 30000 && hostConnectivityMs < 60000 && (
          <div className="bg-amber-500 text-white py-2 px-4 flex items-center justify-center gap-3 animate-in slide-in-from-top duration-300">
            <WifiOff className="w-4 h-4 animate-pulse" />
            <p className="text-[10px] font-black uppercase tracking-widest">Host Connection Lost — Waiting to reconnect...</p>
          </div>
        )}

        <header className="bg-white border-b p-6 flex items-center justify-between sticky top-0 z-50">
          <div className="flex items-center gap-4">
             <div className="p-2 bg-primary/10 rounded-xl"><Clock className="w-4 h-4 text-primary" /></div>
             <span className={cn("text-2xl font-black tabular-nums", timeLeft === 0 && "text-rose-500")}>
               {timeLeft !== null ? `${timeLeft}s` : '---'}
             </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[9px] font-black uppercase text-slate-400">Global Progress</span>
            <span className="text-xs font-bold text-primary">{answeredCount} / {totalStudents} Answered</span>
          </div>
        </header>
        
        <main className="flex-1 p-6 md:p-12 animate-in fade-in duration-500">
          <div className="max-w-3xl mx-auto bg-white rounded-[2.5rem] shadow-xl p-8 md:p-12 border border-slate-100">
            <QuestionRenderer 
              question={currentQuestion} 
              value={isExpired ? null : currentAnswer} 
              onChange={submitAnswer} 
              reviewMode={false} 
            />
            {hasTransmitted && (
              <div className={cn(
                "mt-10 p-8 rounded-3xl border-2 border-dashed text-center animate-in zoom-in-95",
                isExpired ? "bg-rose-50 border-rose-200" : "bg-blue-50 border-blue-200"
              )}>
                <p className={cn("text-lg font-black uppercase tracking-tight", isExpired ? "text-rose-600" : "text-blue-600")}>
                  {isExpired ? 'Time Expired — Answer Transmitted' : 'Answer Transmitted'}
                </p>
                <p className={cn("text-sm font-medium mt-1", isExpired ? "text-rose-400" : "text-blue-400")}>
                  Waiting for terminal reveal protocol...
                </p>
              </div>
            )}
          </div>
        </main>

        {hostConnectivityMs >= 60000 && (
          <div className="fixed inset-0 z-[200] bg-slate-950/90 backdrop-blur-xl flex flex-col items-center justify-center p-8 text-center text-white animate-in fade-in duration-500">
             <AlertTriangle className="w-20 h-20 text-rose-500 mb-8 animate-bounce" />
             <h2 className="text-4xl font-black uppercase tracking-tight mb-4">Session Interrupted</h2>
             <p className="text-xl text-slate-400 max-w-md mb-12">The host has disconnected. Please contact your teacher or return to base.</p>
             <Button onClick={() => router.push('/')} className="h-16 px-12 rounded-full bg-primary text-white font-black uppercase tracking-widest border-none shadow-2xl hover:scale-105 transition-transform">
               <Home className="w-5 h-5 mr-3" /> Return to Base
             </Button>
          </div>
        )}
      </div>
    );
  }

  if (status === 'revealed' && result) {
    const isCorrect = result.correct;
    return (
      <div className={cn("min-h-screen flex flex-col items-center justify-center p-8 text-center text-white", isCorrect ? "bg-emerald-500" : "bg-rose-500")}>
        <div className="max-w-md w-full space-y-10 animate-in zoom-in-95 duration-500">
          <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mx-auto shadow-2xl">
            {isCorrect ? <CheckCircle2 className="w-20 h-20 text-emerald-500" /> : <XCircle className="w-20 h-20 text-rose-500" />}
          </div>
          <div className="space-y-2">
            <h2 className="text-5xl font-black uppercase tracking-tighter">{isCorrect ? 'Correct!' : 'Incorrect'}</h2>
            <p className="text-xl font-bold opacity-80">{isCorrect ? '+100 Intelligence Points' : 'Identity Alignment Error'}</p>
          </div>
          <div className="p-8 bg-white/20 backdrop-blur-md rounded-[2.5rem] border border-white/20">
            <div className="flex justify-between items-center px-4 mb-4 border-b border-white/10 pb-4">
               <div className="text-left">
                  <p className="text-[9px] font-black uppercase tracking-widest opacity-60">Global Rank</p>
                  <p className="text-2xl font-black">#{studentRank || '--'}</p>
               </div>
               <div className="text-right">
                  <p className="text-[9px] font-black uppercase tracking-widest opacity-60">Total Score</p>
                  <p className="text-2xl font-black">{result.score}</p>
               </div>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">Waiting for host to cycle step...</p>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'ended') {
    const myScore = leaderboard.find(s => s.id === studentId)?.score || 0;
    
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center py-20 px-8 text-white">
        <div className="max-w-2xl w-full space-y-12 text-center animate-in fade-in duration-1000">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-rose-500/20 border border-rose-500/30 rounded-full text-rose-400 text-[10px] font-black uppercase tracking-widest mb-4">
               SESSION TERMINATED BY HOST
            </div>
            <Trophy className="w-20 h-20 text-primary mx-auto mb-6 drop-shadow-[0_0_20px_rgba(var(--primary),0.5)]" />
            <h1 className="text-5xl font-black uppercase tracking-tight leading-none">Mission Finalized</h1>
            <p className="text-xl font-medium text-slate-400">Your performance registry has been archived.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="p-8 bg-white/5 rounded-[2rem] border border-white/5">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-2">Final Rank</p>
                <p className="text-4xl font-black text-primary">#{studentRank || '--'}</p>
             </div>
             <div className="p-8 bg-white/5 rounded-[2rem] border border-white/5">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-2">Total Score</p>
                <p className="text-4xl font-black text-primary">{myScore}</p>
             </div>
          </div>

          <Card className="border-none bg-white/5 rounded-[3rem] overflow-hidden">
            <div className="bg-white/5 p-6 border-b border-white/5 flex items-center justify-center gap-3">
              <Users className="w-5 h-5 text-primary" />
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-300">Classroom Standings</h3>
            </div>
            <CardContent className="p-0">
              <div className="divide-y divide-white/5">
                {leaderboard.slice(0, 5).map((s, i) => (
                  <div key={s.id} className={cn(
                    "p-6 flex items-center justify-between",
                    s.id === studentId ? "bg-primary/20" : ""
                  )}>
                    <div className="flex items-center gap-6">
                      <span className="text-2xl font-black text-slate-500 w-8">{i + 1}</span>
                      <div className="flex flex-col text-left">
                        <span className="font-black uppercase tracking-tight text-white">{s.name}</span>
                        {s.id === studentId && <span className="text-[8px] font-black uppercase tracking-widest text-primary">Your Identity</span>}
                      </div>
                    </div>
                    <span className="text-2xl font-black text-primary tabular-nums">{s.score}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Link href="/" className="block w-full">
            <Button className="w-full h-20 rounded-full bg-primary text-white font-black text-2xl uppercase tracking-tight shadow-2xl border-none">
              <Home className="w-6 h-6 mr-3" /> Return to Base
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return <div className="min-h-screen flex items-center justify-center bg-slate-900"><AILoader /></div>;
}
