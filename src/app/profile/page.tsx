
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import useSWR from 'swr';
import { useAuth } from '@/context/auth-context';
import { useSettings } from '@/context/settings-context';
import { useRouter } from 'next/navigation';
import { 
  Trophy, 
  Zap, 
  ArrowLeft, 
  LogOut, 
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  CheckCircle2,
  XCircle,
  FileText,
  Star,
  Shield,
  Diamond,
  Check,
  TrendingUp,
  Target,
  Database,
  ArrowRight,
  BookOpen,
  LayoutGrid,
  Clock,
  ListChecks
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { API_URL } from '@/lib/api-config';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { AILoader } from '@/components/ui/ai-loader';
import { useLanguage } from '@/context/language-context';
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { PerformanceGauge } from '@/components/quiz/PerformanceGauge';

type ProfileFilter = 'all' | 'pass' | 'fail' | 'perfect';

export default function ProfilePage() {
  const { user, logout, loading: authLoading } = useAuth();
  const { settings } = useSettings();
  const { t } = useLanguage();
  const router = useRouter();

  const [activeFilter, setActiveFilter] = useState<ProfileFilter>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  const threshold = Number(settings.default_pass_threshold || '70');

  useEffect(() => {
    if (!authLoading && !user) {
      const fullPath = window.location.pathname + window.location.search;
      router.push(`/login?returnTo=${encodeURIComponent(fullPath)}`);
    }
  }, [user, authLoading, router]);

  // SWR Data Fetching: Multi-registry Parallel Sync
  const { data: resultsData, isLoading: resultsLoading } = useSWR(
    user?.email ? `results-${user.email}` : null,
    async () => {
      if (!API_URL) return { responses: [], tests: [] };
      const [respRes, testsRes] = await Promise.all([
        fetch(`${API_URL}?action=getResponses`),
        fetch(`${API_URL}?action=getTests`)
      ]);
      const respData = await respRes.json();
      const testsData = await testsRes.json();
      
      const userEmail = user?.email?.toLowerCase() || '';
      const userResponses = (Array.isArray(respData) ? respData : [])
        .filter(r => (r['User Email'] || '').toLowerCase() === userEmail)
        .sort((a, b) => new Date(b.Timestamp).getTime() - new Date(a.Timestamp).getTime());
      
      return { responses: userResponses, tests: Array.isArray(testsData) ? testsData : [] };
    }
  );

  const responses = resultsData?.responses || [];
  const tests = resultsData?.tests || [];

  const testTitleMap = useMemo(() => {
    const map: Record<string, string> = {};
    tests.forEach(t => { map[t.id] = t.title; });
    return map;
  }, [tests]);

  const stats = useMemo(() => {
    if (responses.length === 0) return { avg: 0, total: 0, highest: 0, perfectCount: 0 };
    
    let totalScore = 0;
    let totalPossible = 0;
    let highest = 0;
    let perfectCount = 0;
    
    responses.forEach(r => {
      const score = Number(r.Score) || 0;
      const total = Number(r.Total) || 1;
      const pct = Math.round((score / total) * 100);
      
      totalScore += score;
      totalPossible += total;
      if (pct > highest) highest = pct;
      if (pct === 100) perfectCount++;
    });

    return {
      total: responses.length,
      avg: Math.round((totalScore / (totalPossible || 1)) * 100),
      highest,
      perfectCount
    };
  }, [responses]);

  const chartData = useMemo(() => {
    return [...responses]
      .reverse()
      .slice(-10)
      .map((r, i) => ({
        index: i + 1,
        score: Math.round((Number(r.Score) / (Number(r.Total) || 1)) * 100),
        test: testTitleMap[r['Test ID']] || r['Test ID']
      }));
  }, [responses, testTitleMap]);

  const suggestions = useMemo(() => {
    if (resultsLoading) return [];
    if (stats.total === 0) {
      return tests.filter(t => 
        String(t.difficulty || "").toLowerCase() === 'beginner' || 
        String(t.difficulty || "").toLowerCase() === 'easy'
      ).slice(0, 3);
    } else {
      const takenIds = new Set(responses.map(r => String(r['Test ID'])));
      const failedIds = new Set(responses.filter(r => {
        const pct = (Number(r.Score) / (Number(r.Total) || 1)) * 100;
        return pct < threshold;
      }).map(r => String(r['Test ID'])));
      
      const toRetry = tests.filter(t => failedIds.has(String(t.id)));
      const notTaken = tests.filter(t => !takenIds.has(String(t.id)));
      return [...toRetry, ...notTaken].slice(0, 3);
    }
  }, [tests, responses, stats.total, threshold, resultsLoading]);

  const filteredResponses = useMemo(() => {
    return responses.filter(r => {
      const pct = Math.round((Number(r.Score) / (Number(r.Total) || 1)) * 100);
      if (activeFilter === 'pass') return pct >= threshold;
      if (activeFilter === 'fail') return pct < threshold;
      if (activeFilter === 'perfect') return pct === 100;
      return true;
    });
  }, [responses, activeFilter, threshold]);

  const paginatedResponses = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredResponses.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredResponses, currentPage]);

  const totalPages = Math.ceil(filteredResponses.length / ITEMS_PER_PAGE);

  if (authLoading || resultsLoading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><AILoader /></div>;

  const hasNoData = stats.total === 0;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6 md:px-12">
      <div className="max-w-3xl mx-auto space-y-6">
        <Link href="/tests"><Button variant="ghost" size="sm" className="rounded-full font-bold text-slate-400 mb-2 hover:bg-white"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Library</Button></Link>
        <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-white">
          <div className="p-8 border-b border-slate-100 bg-[#f9fafb] relative">
            <div className="absolute left-0 top-8 bottom-8 w-1 bg-[#3B5BDB] rounded-r" />
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-6">
                <div className="w-[64px] h-[64px] rounded-[12px] bg-[#1a2340] flex items-center justify-center text-white text-2xl font-bold shadow-xl">{user?.displayName?.charAt(0).toUpperCase()}</div>
                <div className="space-y-1.5">
                  <h1 className="text-[18px] font-bold text-[#1a2340] uppercase tracking-tight leading-none">{user?.displayName}</h1>
                  <p className="text-[12px] font-medium text-slate-400">{user?.email}</p>
                </div>
              </div>
              <Button onClick={logout} variant="ghost" size="icon" className="rounded-full text-slate-300"><LogOut className="w-5 h-5" /></Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 border-b border-slate-100 bg-white">
            <div className="lg:col-span-8 p-8 border-r border-slate-100 bg-[#f9fafb]/30">
              <div className="flex items-center justify-between mb-6">
                <div className="space-y-1">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Score History</h3>
                </div>
              </div>
              <div className="h-[200px] w-full">
                {hasNoData ? (
                   <div className="h-full flex flex-col items-center justify-center text-center px-10"><TrendingUp className="w-10 h-10 text-slate-200 mb-3" /><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Start a test to initialize trend registry</p></div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs><linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#1a2340" stopOpacity={0.15}/><stop offset="95%" stopColor="#1a2340" stopOpacity={0}/></linearGradient></defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="index" hide={true} /><YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: '#cbd5e1', fontSize: 10, fontWeight: 700 }} ticks={[0, 25, 50, 75, 100]} />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: 'bold' }} labelClassName="hidden" />
                      <Area type="monotone" dataKey="score" stroke="#1a2340" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" dot={{ r: 3, fill: '#1a2340' }} activeDot={{ r: 6, fill: '#3B5BDB' }} />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
            
            <div className="lg:col-span-4 p-8 flex flex-col justify-between bg-white">
              <div className="flex flex-col items-center text-center">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6">Mastery Level</h3>
                <PerformanceGauge percentage={stats.avg} score={stats.avg} totalQuestions={100} compact={true} hasData={!hasNoData} />
              </div>
              <div className="grid grid-cols-3 gap-2 mt-8 pt-6 border-t border-slate-50">
                <div className="text-center"><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Tests taken</p><p className="text-sm font-black text-[#1a2340]">{stats.total}</p></div>
                <div className="text-center border-x border-slate-50"><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Best score</p><p className="text-sm font-black text-[#1a2340]">{hasNoData ? "--" : `${stats.highest}%`}</p></div>
                <div className="text-center"><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Perfect</p><p className="text-sm font-black text-[#f59e0b]">{stats.perfectCount}</p></div>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-6">
            <div className="flex items-center gap-2">
              {(['all', 'pass', 'fail', 'perfect'] as ProfileFilter[]).map(f => (
                <button key={f} onClick={() => { setActiveFilter(f); setCurrentPage(1); }} className={cn("px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all", activeFilter === f ? "bg-[#1a2340] text-white shadow-lg" : "bg-white border border-slate-200 text-slate-500")}>{f}</button>
              ))}
            </div>

            <div className="space-y-3">
              {paginatedResponses.map((r, i) => {
                const pct = Math.round((Number(r.Score) / (Number(r.Total) || 1)) * 100);
                return (
                  <div key={i} className="group flex items-center gap-4 p-3 bg-white border border-slate-100 rounded-[1.5rem] hover:shadow-lg transition-all">
                    <div className={cn("w-[46px] h-[46px] shrink-0 rounded-[12px] flex items-center justify-center font-black text-white text-xs", pct >= 90 ? "bg-emerald-500" : pct >= threshold ? "bg-amber-500" : "bg-rose-500")}>{pct}%</div>
                    <div className="flex-1 min-w-0"><h4 className="text-sm font-black text-slate-900 truncate uppercase tracking-tight">{testTitleMap[r['Test ID']] || r['Test ID']}</h4><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{new Date(r.Timestamp).toLocaleDateString()} • {r.Score}/{r.Total} Points</p></div>
                    <Link href={`/quiz?id=${r['Test ID']}`}><Button variant="outline" className="h-8 px-3 rounded-lg text-[9px] font-black uppercase tracking-widest">Retake <ChevronRight className="w-2.5 h-2.5 ml-1" /></Button></Link>
                  </div>
                );
              })}
              {filteredResponses.length === 0 && (
                <div className="py-20 text-center"><h4 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">No results matched</h4><Link href="/tests"><Button className="mt-8 h-12 px-8 rounded-full bg-slate-900 text-white font-black uppercase text-[10px] tracking-widest">Browse Tests <ArrowRight className="w-4 h-4 ml-2" /></Button></Link></div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
