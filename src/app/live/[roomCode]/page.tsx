/**
 * live/[roomCode]/page.tsx
 * 
 * Route: /live/[roomCode]
 * Purpose: Student terminal for synchronized live assessments.
 * Refactored: v18.9.5 - Extracted UI modules for cleaner lifecycle management.
 */

"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { getPusherClient } from '@/lib/pusher';
import { AILoader } from '@/components/ui/ai-loader';
import { AlertTriangle, Home } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import { parseRegistryArray } from '@/lib/quiz-utils';

// Refactored Sub-components
import { StudentLobby } from '@/components/live/StudentLobby';
import { StudentQuestionView } from '@/components/live/StudentQuestionView';
import { StudentFinalScore } from '@/components/live/StudentFinalScore';

export default function LiveStudentPage() {
  const { roomCode } = useParams();
  const searchParams = useSearchParams();
  const studentId = searchParams.get('studentId');
  const router = useRouter();
  const { toast } = useToast();

  const [status, setStatus] = useState<'waiting' | 'active' | 'revealed' | 'ended'>('waiting');
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [stagedAnswer, setStagedAnswer] = useState<any>(undefined);
  const [currentAnswer, setCurrentAnswer] = useState<any>(undefined);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [result, setResult] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [lastHostActivity, setLastHostActivity] = useState(Date.now());
  const [hostConnectivityMs, setHostConnectivityMs] = useState(0);

  const updateHeartbeat = () => setLastHostActivity(Date.now());

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

  useEffect(() => {
    const watchdog = setInterval(() => {
      setHostConnectivityMs(Date.now() - lastHostActivity);
    }, 5000);
    return () => clearInterval(watchdog);
  }, [lastHostActivity]);

  useEffect(() => {
    if (status === 'active' && timeLeft === 0 && currentAnswer === undefined) {
      submitAnswer(stagedAnswer !== undefined ? stagedAnswer : "__expired__");
    }
  }, [timeLeft, status, currentAnswer, stagedAnswer]);

  useEffect(() => {
    if (!studentId || !roomCode) {
      router.push('/join');
      return;
    }

    const checkInitialStatus = async () => {
      try {
        const res = await fetch(`/api/live/room-details?code=${roomCode}`);
        if (!res.ok) { router.push('/join'); return; }
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

        if (!isMyIdentityPresent) { router.push('/join'); return; }
        updateHeartbeat();
      } catch (e) {}
    };

    checkInitialStatus();

    const pusher = getPusherClient();
    const channel = pusher.subscribe(`room-${roomCode}`);

    channel.bind('question-start', (data: any) => {
      updateHeartbeat();
      setCurrentQuestion(data.questionData);
      setCurrentAnswer(undefined);
      setStagedAnswer(undefined);
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

    return () => { pusher.unsubscribe(`room-${roomCode}`); };
  }, [roomCode, studentId, router]);

  const normalizedType = useMemo(() => {
    if (!currentQuestion) return '';
    return String(currentQuestion.question_type || '').toLowerCase().replace(/[\s_]/g, '');
  }, [currentQuestion]);

  const isComplexType = useMemo(() => {
    return ['multiplechoice', 'manyanswers', 'multipletruefalse', 'matrixchoice', 'ordering', 'matching', 'shorttext', 'hotspot'].includes(normalizedType);
  }, [normalizedType]);

  const handleModuleChange = (val: any) => {
    if (status !== 'active' || currentAnswer !== undefined) return;
    if (isComplexType) setStagedAnswer(val);
    else submitAnswer(val);
  };

  const isStagedAnswerComplete = useMemo(() => {
    if (!currentQuestion || stagedAnswer === undefined) return false;
    const val = stagedAnswer;
    if (normalizedType === 'multiplechoice' || normalizedType === 'manyanswers') return Array.isArray(val) && val.length > 0;
    if (normalizedType === 'multipletruefalse') {
      const statements = parseRegistryArray(currentQuestion.order_group);
      return val && typeof val === 'object' && Object.keys(val).length === statements.length;
    }
    if (normalizedType === 'matrixchoice') {
      const rows = parseRegistryArray(currentQuestion.order_group);
      return val && typeof val === 'object' && Object.keys(val).length === rows.length;
    }
    if (normalizedType === 'matching') {
      const pairs = parseRegistryArray(currentQuestion.order_group);
      return val && typeof val === 'object' && Object.keys(val).length === pairs.length;
    }
    if (normalizedType === 'shorttext') return typeof val === 'string' && val.trim().length > 0;
    if (normalizedType === 'ordering') {
      const options = parseRegistryArray(currentQuestion.options || currentQuestion.order_group);
      return Array.isArray(val) && val.length === options.length;
    }
    if (normalizedType === 'hotspot') return Array.isArray(val) && val.length > 0;
    return val !== undefined && val !== null;
  }, [currentQuestion, stagedAnswer, normalizedType]);

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
      toast({ variant: "destructive", title: "Sync Failure" });
    }
  };

  const studentRank = useMemo(() => {
    if (!leaderboard.length) return null;
    const idx = leaderboard.findIndex(s => s.id === studentId);
    return idx === -1 ? null : idx + 1;
  }, [leaderboard, studentId]);

  if (status === 'waiting') return <StudentLobby roomCode={String(roomCode)} />;

  if ((status === 'active' || status === 'revealed') && currentQuestion) {
    return (
      <>
        <StudentQuestionView 
          status={status}
          timeLeft={timeLeft}
          answeredCount={answeredCount}
          totalStudents={totalStudents}
          result={result}
          studentRank={studentRank}
          currentQuestion={currentQuestion}
          currentAnswer={currentAnswer}
          stagedAnswer={stagedAnswer}
          isComplexType={isComplexType}
          isStagedAnswerComplete={isStagedAnswerComplete}
          hostConnectivityMs={hostConnectivityMs}
          handleModuleChange={handleModuleChange}
          submitAnswer={submitAnswer}
        />
        {hostConnectivityMs >= 60000 && (
          <div className="fixed inset-0 z-[200] bg-slate-950/90 backdrop-blur-xl flex flex-col items-center justify-center p-8 text-center text-white">
             <AlertTriangle className="w-20 h-20 text-rose-500 mb-8 animate-bounce" />
             <h2 className="text-4xl font-black uppercase tracking-tight mb-4">Mission Interrupted</h2>
             <p className="text-xl text-slate-400 max-w-md mb-12">The host has disconnected. Please contact your teacher or return to base.</p>
             <Button onClick={() => router.push('/')} className="h-16 px-12 rounded-full bg-primary text-white font-black uppercase tracking-widest border-none shadow-2xl hover:scale-105 transition-transform">
               <Home className="w-5 h-5 mr-3" /> Return to Base
             </Button>
          </div>
        )}
      </>
    );
  }

  if (status === 'ended') return <StudentFinalScore leaderboard={leaderboard} studentId={studentId} studentRank={studentRank} />;

  return <div className="min-h-screen flex items-center justify-center bg-slate-900"><AILoader /></div>;
}
