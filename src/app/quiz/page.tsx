
"use client";

import React, { useState, useEffect, Suspense, useCallback } from 'react';
import useSWR, { mutate as globalMutate } from 'swr';
import { QuizState, QuizMode, Question } from '@/types/quiz';
import { QuizStart } from '@/components/quiz/QuizStart';
import { QuizResults } from '@/components/quiz/QuizResults';
import { QuizActive } from '@/components/quiz/QuizActive';
import { useToast } from '@/hooks/use-toast';
import { useSearchParams, useRouter } from 'next/navigation';
import { DEMO_QUESTIONS, AVAILABLE_TESTS } from '@/app/lib/demo-data';
import { API_URL } from '@/lib/api-config';
import { useAuth } from '@/context/auth-context';
import { calculateTotalScore, calculateScoreForQuestion } from '@/lib/quiz-utils';
import { AILoader } from '@/components/ui/ai-loader';
import { AlertCircle, ArrowLeft, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSettings } from '@/context/settings-context';
import Link from 'next/link';

function QuizContent() {
  const searchParams = useSearchParams();
  const testId = searchParams.get('id');
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const { settings } = useSettings();
  
  const [isStarted, setIsStarted] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [timeLeft, setTimeLeft] = useState(900); 
  const [isWrongInRace, setIsWrongInRace] = useState(false);
  const [generatedCertificateId, setGeneratedCertificateId] = useState<string | null>(null);
  
  const [quiz, setQuiz] = useState<QuizState>({
    questions: [],
    currentQuestionIndex: 0,
    responses: [],
    isSubmitted: false,
    score: 0,
    startTime: Date.now(),
    mode: 'test',
    highestStepReached: 0,
    flaggedQuestionIds: []
  });

  // SWR Caching: Questions Registry
  const { data: questionsData, isLoading: qLoading } = useSWR(
    testId ? `questions-${testId}` : null,
    async () => {
      if (!API_URL) return DEMO_QUESTIONS;
      const res = await fetch(`${API_URL}?action=getQuestions&id=${testId}`);
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    }
  );

  // SWR Caching: Test Metadata & Global Config
  const { data: globalData, isLoading: configLoading } = useSWR(
    'quiz-config',
    async () => {
      if (!API_URL) return { tests: AVAILABLE_TESTS, salt: "", protection: true, guest: true, maintenance: false };
      const [sRes, tRes] = await Promise.all([
        fetch(`${API_URL}?action=getSettings`),
        fetch(`${API_URL}?action=getTests`)
      ]);
      const sData = await sRes.json();
      const tData = await tRes.json();
      return {
        tests: Array.isArray(tData) ? tData : [],
        salt: sData.daily_key_salt || "",
        protection: String(sData.access_key_protection_enabled ?? "true") !== "false",
        guest: String(sData.guest_access_allowed ?? "true") !== "false",
        maintenance: String(sData.maintenance_mode ?? "false") === "true",
        globalTimer: sData.global_timer_limit || "15"
      };
    }
  );

  const testMetadata = globalData?.tests.find(t => String(t.id) === String(testId));
  const notFound = !qLoading && (!questionsData || (testId && !testMetadata));

  const loadPersistedState = useCallback((tid: string) => {
    const saved = sessionStorage.getItem(`quiz_session_${tid}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setQuiz(prev => ({
          ...prev,
          responses: parsed.responses || [],
          currentQuestionIndex: parsed.currentQuestionIndex || 0,
          highestStepReached: parsed.highestStepReached || 0,
          startTime: parsed.startTime || Date.now(),
          mode: parsed.mode || 'test'
        }));
        setIsStarted(true);
      } catch (e) {
        sessionStorage.removeItem(`quiz_session_${tid}`);
      }
    }
  }, []);

  useEffect(() => {
    if (isStarted && !quiz.isSubmitted && testId) {
      const stateToSave = {
        responses: quiz.responses,
        currentQuestionIndex: quiz.currentQuestionIndex,
        highestStepReached: quiz.highestStepReached,
        startTime: quiz.startTime,
        mode: quiz.mode
      };
      sessionStorage.setItem(`quiz_session_${testId}`, JSON.stringify(stateToSave));
    }
  }, [quiz.responses, quiz.currentQuestionIndex, quiz.highestStepReached, isStarted, quiz.isSubmitted, testId, quiz.startTime, quiz.mode]);

  useEffect(() => {
    if (testId && questionsData) {
      setQuiz(prev => ({ ...prev, questions: questionsData }));
      loadPersistedState(testId);
      
      const seconds = parseDurationToSeconds(testMetadata?.duration, globalData?.globalTimer);
      setTimeLeft(seconds);
    }
  }, [testId, questionsData, testMetadata, globalData, loadPersistedState]);

  useEffect(() => {
    if (quiz.isSubmitted || qLoading || !isStarted || quiz.mode === 'training') return;
    
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          submit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [quiz.isSubmitted, qLoading, isStarted, quiz.mode]);

  const parseDurationToSeconds = (dur: string | number | undefined, fallback: string | number = "15"): number => {
    const raw = dur || fallback;
    const num = parseInt(String(raw).replace(/[^0-9]/g, ''));
    return isNaN(num) ? 900 : num * 60;
  };

  const handleResponseChange = (val: any) => {
    const currentQuestion = quiz.questions[quiz.currentQuestionIndex];
    const updatedResponses = [...quiz.responses];
    const index = updatedResponses.findIndex(r => r.questionId === currentQuestion.id);
    const isCorrect = calculateScoreForQuestion(currentQuestion, val);
    
    if (index > -1) {
      updatedResponses[index].answer = val;
      updatedResponses[index].isCorrect = isCorrect;
    } else {
      updatedResponses.push({ questionId: currentQuestion.id, answer: val, isCorrect });
    }
    setQuiz({ ...quiz, responses: updatedResponses });
  };

  const handleNext = () => {
    const currentQuestion = quiz.questions[quiz.currentQuestionIndex];
    if (quiz.mode === 'race') {
      const resp = quiz.responses.find(r => r.questionId === currentQuestion.id);
      if (!resp || !resp.isCorrect) {
        setIsWrongInRace(true);
        toast({ 
          variant: "destructive", 
          title: "Protocol Violation", 
          description: "Incorrect response. Sequence terminated. Resetting to Step 1." 
        });
        setTimeout(() => {
          setQuiz(prev => ({ 
            ...prev, 
            currentQuestionIndex: 0, 
            responses: [],
            flaggedQuestionIds: [],
            highestStepReached: Math.max(prev.highestStepReached, prev.currentQuestionIndex + 1)
          }));
          setIsWrongInRace(false);
        }, 1500);
        return;
      }
    }

    if (quiz.currentQuestionIndex < quiz.questions.length - 1) {
      setQuiz({ 
        ...quiz, 
        currentQuestionIndex: quiz.currentQuestionIndex + 1,
        highestStepReached: Math.max(quiz.highestStepReached, quiz.currentQuestionIndex + 1)
      });
    }
  };

  const handlePrev = () => {
    if (quiz.mode === 'race') return;
    if (quiz.currentQuestionIndex > 0) {
      setQuiz({ ...quiz, currentQuestionIndex: quiz.currentQuestionIndex - 1 });
    }
  };

  const handleToggleFlag = (id: string) => {
    setQuiz(prev => {
      const current = prev.flaggedQuestionIds || [];
      const updated = current.includes(id) 
        ? current.filter(fid => fid !== id) 
        : [...current, id];
      return { ...prev, flaggedQuestionIds: updated };
    });
  };

  const submit = async () => {
    const finalScore = calculateTotalScore(quiz.questions, quiz.responses);
    const finalName = (user?.displayName || guestName?.trim() || 'Guest User');
    const finalEmail = (user?.email || 'Anonymous');
    const timestamp = Date.now();
    const finalPercentage = Math.round((finalScore / (quiz.questions.length || 1)) * 100);
    
    let certId = "";
    const globalThreshold = Number(settings.default_pass_threshold || 70);
    const threshold = Number(testMetadata?.passing_threshold ?? globalThreshold);
    const certEnabled = String(testMetadata?.certificate_enabled || "").toUpperCase() === "TRUE";
    
    if (certEnabled && finalPercentage >= threshold) {
      const cleanEmail = finalEmail.replace(/[^a-zA-Z0-9]/g, '').slice(0, 8);
      certId = `CRT-${cleanEmail}-${testId}-${timestamp.toString().slice(-6)}`.toUpperCase();
      setGeneratedCertificateId(certId);
    }
    
    if (testId) sessionStorage.removeItem(`quiz_session_${testId}`);
    setQuiz({ ...quiz, isSubmitted: true, score: finalScore, endTime: timestamp });

    // Invalidate profile results cache on submission
    if (user?.email) globalMutate(`results-${user.email}`);

    if (API_URL) {
      try {
        await fetch(API_URL, {
          method: 'POST',
          mode: 'no-cors',
          body: JSON.stringify({
            action: 'submitResponse',
            testId: testId || 'Unknown',
            userName: finalName,
            userEmail: finalEmail,
            score: finalScore,
            total: quiz.questions.length,
            duration: timestamp - quiz.startTime,
            responses: quiz.responses,
            mode: quiz.mode,
            certificateId: certId
          })
        });
      } catch (e) {}
    }
  };

  const shuffleQuestions = (arr: Question[]) => {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const restart = () => {
    if (testId) sessionStorage.removeItem(`quiz_session_${testId}`);
    setIsStarted(false);
    setQuiz({
      ...quiz,
      currentQuestionIndex: 0,
      responses: [],
      isSubmitted: false,
      score: 0,
      startTime: Date.now(),
      mode: 'test',
      highestStepReached: 0,
      flaggedQuestionIds: []
    });
    setGeneratedCertificateId(null);
  };

  const jumpToQuestion = (index: number) => {
    if (quiz.mode === 'race') return;
    setQuiz(prev => ({ ...prev, currentQuestionIndex: index }));
  };

  const handleStart = (mode: QuizMode) => {
    setIsStarted(true);
    let q = [...(questionsData || [])];
    if (mode === 'test') {
      q = shuffleQuestions(q);
    }
    setQuiz(prev => ({ 
      ...prev, 
      questions: q, 
      startTime: Date.now(),
      mode: mode,
      flaggedQuestionIds: []
    }));
  };

  if (qLoading || configLoading) return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950">
      <AILoader />
    </div>
  );

  if (notFound) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-white rounded-[3rem] shadow-2xl p-12 border border-slate-100 animate-in zoom-in-95 duration-500">
          <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-rose-500/10">
            <AlertCircle className="w-10 h-10 text-rose-500" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-4">Module Not Found</h2>
          <p className="text-slate-500 font-medium leading-relaxed mb-10">This assessment module doesn't exist in the registry.</p>
          <div className="grid grid-cols-1 gap-4">
            <Link href="/tests"><Button className="w-full h-14 rounded-full bg-slate-900 font-black uppercase text-xs tracking-widest gap-2 shadow-xl border-none"><Search className="w-4 h-4" /> Browse Library</Button></Link>
          </div>
        </div>
      </div>
    );
  }

  if (globalData?.maintenance && user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center transition-colors duration-500">
        <div className="w-24 h-24 bg-amber-50 dark:bg-amber-900/20 rounded-[2.5rem] flex items-center justify-center mb-8 shadow-2xl ring-8 ring-white dark:ring-slate-900">
          <AlertCircle className="w-12 h-12 text-amber-500" />
        </div>
        <h2 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-4">System Maintenance</h2>
        <p className="text-slate-500 dark:text-slate-400 font-medium max-w-md mx-auto mb-10 leading-relaxed text-lg">This assessment node is currently offline.</p>
        <Link href="/"><Button className="h-14 rounded-full px-10 bg-slate-900 dark:bg-primary font-black uppercase text-xs tracking-widest shadow-xl border-none">Return Home</Button></Link>
      </div>
    );
  }

  if (!isStarted) {
    return (
      <QuizStart 
        title={testMetadata?.title || 'Assessment'}
        description={testMetadata?.description}
        questionsCount={quiz.questions.length}
        duration={testMetadata?.duration}
        user={user}
        guestName={guestName}
        setGuestName={setGuestName}
        protocolSalt={globalData?.salt}
        isProtectionEnabled={globalData?.protection}
        guestAccessAllowed={globalData?.guest}
        onStart={handleStart}
      />
    );
  }

  if (quiz.isSubmitted) {
    return (
      <QuizResults 
        title={testMetadata?.title || 'Assessment'}
        testId={testId || undefined}
        score={quiz.score}
        totalQuestions={quiz.questions.length}
        questions={quiz.questions}
        responses={quiz.responses}
        userName={user?.displayName || guestName || 'Guest User'}
        onRestart={restart}
        startTime={quiz.startTime}
        endTime={quiz.endTime}
        testMetadata={testMetadata}
        allTests={globalData?.tests}
        certificateId={generatedCertificateId || undefined}
      />
    );
  }

  return (
    <QuizActive 
      quiz={quiz}
      quizTitle={testMetadata?.title || 'Assessment'}
      timeLeft={timeLeft}
      isWrongInRace={isWrongInRace}
      onResponseChange={handleResponseChange}
      onNext={handleNext}
      onPrev={handlePrev}
      onSubmit={submit}
      onJump={jumpToQuestion}
      onToggleFlag={handleToggleFlag}
    />
  );
}

export default function QuizPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950"><AILoader /></div>}>
      <QuizContent />
    </Suspense>
  );
}
