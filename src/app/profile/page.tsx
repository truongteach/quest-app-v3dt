"use client";

import React, { useState, useEffect, useMemo } from 'react';
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

  const [responses, setResponses] = useState<any[]>([]);
  const [tests, setTests] = useState<any[]>([]);
  const [loadingStats, setLoadingStats] = useState(false);
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

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    if (!API_URL) return;
    setLoadingStats(true);
    try {
      const [respRes, testsRes] = await Promise.all([
        fetch(`${API_URL}?action=getResponses`),
        fetch(`${API_URL}?action=getTests`)
      ]);
      const respData = await respRes.json();
      const testsData = await testsRes.json();
      
      if (Array.isArray(respData)) {
        const userEmail = user?.email?.toLowerCase() || '';
        const userResponses = respData
          .filter(r => (r['User Email'] || '').toLowerCase() === userEmail)
          .sort((a, b) => new Date(b.Timestamp).getTime() - new Date(a.Timestamp).getTime());
        setResponses(userResponses);
      }
      
      if (Array.isArray(testsData)) {
        setTests(testsData);
      }
    } catch (err) {
      console.error("Failed to fetch profile registry", err);
    } finally {
      setLoadingStats(false);
    }
  };

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
      .reverse() // Chronological
      .slice(-10) // Last 10 attempts
      .map((r, i) => ({
        index: i + 1,
        score: Math.round((Number(r.Score) / (Number(r.Total) || 1)) * 100),
        test: testTitleMap[r['Test ID']] || r['Test ID']
      }));
  }, [responses, testTitleMap]);

  const suggestions = useMemo(() => {
    if (loadingStats) return [];
    
    if (stats.total === 0) {
      // Beginner tests for new users
      return tests
        .filter(t => 
          String(t.difficulty || "").toLowerCase() === 'beginner' || 
          String(t.difficulty || "").toLowerCase() === 'easy' ||
          String(t.category || "").toLowerCase().includes('lv1')
        )
        .slice(0, 3);
    } else {
      // Continue learning: not taken or previously failed
      const takenIds = new Set(responses.map(r => String(r['Test ID'])));
      
      const notTaken = tests.filter(t => !takenIds.has(String(t.id)));
      
      const failedIds = new Set(responses.filter(r => {
        const pct = (Number(r.Score) / (Number(r.Total) || 1)) * 100;
        return pct < threshold;
      }).map(r => String(r['Test ID'])));
      
      const toRetry = tests.filter(t => failedIds.has(String(t.id)));
      
      const combined = [...toRetry, ...notTaken];
      const unique = Array.from(new Map(combined.map(t => [t.id, t])).values());
      
      return unique.slice(0, 3);
    }
  }, [tests, responses, stats.total, threshold, loadingStats]);

  const filteredResponses = useMemo(() => {
    const filtered = responses.filter(r => {
      const pct = Math.round((Number(r.Score) / (Number(r.Total) || 1)) * 100);
      if (activeFilter === 'pass') return pct >= threshold;
      if (activeFilter === 'fail') return pct < threshold;
      if (activeFilter === 'perfect') return pct === 100;
      return true;
    });
    return filtered;
  }, [responses, activeFilter, threshold]);

  const paginatedResponses = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredResponses.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredResponses, currentPage]);

  const totalPages = Math.ceil(filteredResponses.length / ITEMS_PER_PAGE);

  const handleFilterChange = (filter: ProfileFilter) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  };

  const CustomChartDot = (props: any) => {
    const { cx, cy, payload } = props;
    if (payload.score === 100) {
      return (
        <circle cx={cx} cy={cy} r={5} fill="#f59e0b" stroke="#fff" strokeWidth={2} />
      );
    }
    return <circle cx={cx} cy={cy} r={3} fill="#1a2340" stroke="#fff" strokeWidth={1} />;
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <AILoader />
      </div>
    );
  }

  const hasNoData = stats.total === 0;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6 md:px-12 selection:bg-primary selection:text-white">
      <div className="max-w-3xl mx-auto space-y-6">
        
        <Link href="/tests">
          <Button variant="ghost" size="sm" className="rounded-full font-bold text-slate-400 mb-2 hover:bg-white">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Library
          </Button>
        </Link>

        <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-white">
          
          {/* Top Section: Identity Mark */}
          <div className="p-8 border-b border-slate-100 bg-[#f9fafb] relative">
            <div className="absolute left-0 top-8 bottom-8 w-1 bg-[#3B5BDB] rounded-r" />
            
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-6">
                <div className="w-[64px] h-[64px] shrink-0 rounded-[12px] bg-[#1a2340] flex items-center justify-center text-white text-2xl font-bold shadow-xl">
                  {user.displayName?.charAt(0).toUpperCase()}
                </div>
                <div className="space-y-1.5">
                  <h1 className="text-[18px] font-bold text-[#1a2340] uppercase tracking-tight leading-none">
                    {user.displayName}
                  </h1>
                  <div className="flex items-center gap-2">
                    <p className="text-[12px] font-medium text-slate-400">
                      {user.email}
                    </p>
                    {user.role === 'admin' && (
                      <Badge className="bg-[#3B5BDB] text-white text-[9px] font-bold px-2 py-0.5 rounded-full border-none shadow-sm h-4">
                        ADMIN
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-3">
                    {stats.highest === 100 && (
                      <div className="flex items-center gap-1.5 bg-[#fef9c3] text-[#854f0b] border border-[#854f0b]/30 px-3 py-1 rounded-full text-[11px] font-medium shadow-sm">
                        <Star className="w-3 h-3 fill-current" />
                        Top Scorer
                      </div>
                    )}
                    {user.role === 'admin' && (
                      <div className="flex items-center gap-1.5 bg-[#dbeafe] text-[#1d4ed8] border border-[#1d4ed8]/30 px-3 py-1 rounded-full text-[11px] font-medium shadow-sm">
                        <Shield className="w-3 h-3" />
                        Admin
                      </div>
                    )}
                    {stats.perfectCount > 0 && (
                      <div className="flex items-center gap-1.5 bg-[#f3e8ff] text-[#7c3aed] border border-[#7c3aed]/30 px-3 py-1 rounded-full text-[11px] font-medium shadow-sm">
                        <Diamond className="w-3 h-3 fill-current" />
                        Perfect x{stats.perfectCount}
                      </div>
                    )}
                    {stats.total >= 10 && (
                      <div className="flex items-center gap-1.5 bg-[#dcfce7] text-[#15803d] border border-[#15803d]/30 px-3 py-1 rounded-full text-[11px] font-medium shadow-sm">
                        <Check className="w-3 h-3" />
                        Consistent
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <Button onClick={logout} variant="ghost" size="icon" className="rounded-full text-slate-300 hover:text-slate-600 hover:bg-slate-200/50 transition-colors">
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Visual Analytics Dashboard */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border-b border-slate-100 bg-white">
            {/* Performance Trend Chart */}
            <div className="lg:col-span-8 p-8 border-r border-slate-100 bg-[#f9fafb]/30">
              <div className="flex items-center justify-between mb-6">
                <div className="space-y-1">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Score History</h3>
                  <p className="text-xs font-bold text-slate-500">Last 10 Tests</p>
                </div>
                {!hasNoData && (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#f59e0b]" />
                    <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">100% Record</span>
                  </div>
                )}
              </div>
              <div className="h-[200px] w-full">
                {hasNoData ? (
                   <div className="h-full flex flex-col items-center justify-center text-center px-10">
                     <TrendingUp className="w-10 h-10 text-slate-200 mb-3" />
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Start a test to initialize trend registry</p>
                   </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#1a2340" stopOpacity={0.15}/>
                          <stop offset="95%" stopColor="#1a2340" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis 
                        dataKey="index" 
                        hide={true}
                      />
                      <YAxis 
                        domain={[0, 100]} 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#cbd5e1', fontSize: 10, fontWeight: 700 }}
                        ticks={[0, 25, 50, 75, 100]}
                      />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: 'bold' }}
                        labelClassName="hidden"
                        formatter={(value: any, name: any, props: any) => [`${value}% Accuracy`, props.payload.test]}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="score" 
                        stroke="#1a2340" 
                        strokeWidth={3} 
                        fillOpacity={1} 
                        fill="url(#colorScore)" 
                        dot={<CustomChartDot />}
                        activeDot={{ r: 6, fill: '#3B5BDB', stroke: '#fff', strokeWidth: 2 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
            
            {/* Mastery Gauge & Micro Stats */}
            <div className="lg:col-span-4 p-8 flex flex-col justify-between bg-white">
              <div className="flex flex-col items-center text-center">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6">Mastery Level</h3>
                <PerformanceGauge 
                  percentage={stats.avg} 
                  score={stats.avg} 
                  totalQuestions={100} 
                  compact={true} 
                  hasData={!hasNoData}
                />
                <p className="text-[9px] font-black uppercase text-primary tracking-widest mt-4">Average Score</p>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-8 pt-6 border-t border-slate-50">
                <div className="text-center">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Tests taken</p>
                  <p className="text-sm font-black text-[#1a2340]">{stats.total}</p>
                </div>
                <div className="text-center border-x border-slate-50">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Best score</p>
                  <p className="text-sm font-black text-[#1a2340]">{hasNoData ? "--" : `${stats.highest}%`}</p>
                </div>
                <div className="text-center">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Perfect scores</p>
                  <p className="text-sm font-black text-[#f59e0b]">{stats.perfectCount}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Suggestions Section: Next Mission Pathway */}
          {suggestions.length > 0 && (
            <div className="p-8 border-b border-slate-100 bg-white">
               <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6">
                 {hasNoData ? "Start your first test" : "Try these next"}
               </h3>
               <div className="space-y-3">
                 {suggestions.map((s) => (
                   <Link key={s.id} href={`/quiz?id=${s.id}`} className="group block">
                     <div className="flex items-center gap-4 p-4 bg-slate-50/50 border border-slate-100 rounded-[1.5rem] hover:bg-white hover:shadow-lg hover:border-primary/20 transition-all duration-300">
                       <div className={cn(
                         "w-2.5 h-2.5 rounded-full shrink-0",
                         String(s.difficulty).toLowerCase() === 'hard' ? "bg-rose-500" : String(s.difficulty).toLowerCase() === 'medium' ? "bg-amber-500" : "bg-emerald-500"
                       )} />
                       <div className="flex-1 min-w-0">
                         <h4 className="text-sm font-black text-slate-700 truncate uppercase tracking-tight group-hover:text-primary transition-colors">{s.title}</h4>
                         <div className="flex items-center gap-3 mt-0.5">
                           <span className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                             <ListChecks className="w-3 h-3" /> {s.questions_count || 10} Items
                           </span>
                           <span className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                             <Clock className="w-3 h-3" /> {s.duration || '15m'}
                           </span>
                         </div>
                       </div>
                       <Button variant="ghost" size="sm" className="rounded-full h-8 px-4 text-[9px] font-black uppercase tracking-widest border-2 border-slate-200 group-hover:border-primary/40 group-hover:text-primary bg-white">
                         Start <ArrowRight className="w-3 h-3 ml-1.5" />
                       </Button>
                     </div>
                   </Link>
                 ))}
               </div>
            </div>
          )}

          {/* History Section: Registry Audit */}
          <div className="p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FilterPill label="All" active={activeFilter === 'all'} onClick={() => handleFilterChange('all')} />
                <FilterPill label="Pass" active={activeFilter === 'pass'} onClick={() => handleFilterChange('pass')} />
                <FilterPill label="Fail" active={activeFilter === 'fail'} onClick={() => handleFilterChange('fail')} />
                <FilterPill label="Perfect" active={activeFilter === 'perfect'} onClick={() => handleFilterChange('perfect')} />
              </div>
              {loadingStats && <Zap className="w-4 h-4 text-primary animate-pulse" />}
            </div>

            <div className="space-y-3">
              {paginatedResponses.map((r, i) => {
                const pct = Math.round((Number(r.Score) / (Number(r.Total) || 1)) * 100);
                const isPerfect = pct === 100;
                const isPass = pct >= threshold;
                const testTitle = testTitleMap[r['Test ID']] || r['Test ID'];

                return (
                  <div key={i} className="group flex items-center gap-4 p-3 bg-white border border-slate-100 rounded-[1.5rem] hover:shadow-lg hover:border-primary/10 transition-all">
                    {/* Score Badge */}
                    <div className={cn(
                      "w-[46px] h-[46px] shrink-0 rounded-[12px] flex items-center justify-center font-black text-white text-xs",
                      pct >= 90 ? "bg-emerald-500" : pct >= 50 ? "bg-amber-500" : "bg-rose-500"
                    )}>
                      {pct}%
                    </div>

                    {/* Test Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-black text-slate-900 truncate uppercase tracking-tight">
                        {testTitle}
                      </h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                        {new Date(r.Timestamp).toLocaleDateString()} • {r.Score}/{r.Total} Points
                      </p>
                    </div>

                    {/* Status & Actions */}
                    <div className="flex items-center gap-3">
                      <div className="hidden sm:block">
                        {isPerfect ? (
                          <StatusBadge label="Perfect" color="gold" />
                        ) : isPass ? (
                          <StatusBadge label="Pass" color="green" />
                        ) : (
                          <StatusBadge label="Fail" color="red" />
                        )}
                      </div>
                      
                      <div className="flex items-center gap-1.5">
                        <Link href={`/quiz?id=${r['Test ID']}`}>
                          <Button variant="outline" className="h-8 px-3 rounded-lg border-slate-200 text-[9px] font-black uppercase tracking-widest hover:text-primary hover:border-primary/40 group-hover:bg-primary/5">
                            Retake <ChevronRight className="w-2.5 h-2.5 ml-1" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}

              {filteredResponses.length === 0 && !loadingStats && (
                <div className="py-20 text-center bg-white dark:bg-slate-900 rounded-[3rem] border-4 border-dashed border-slate-100 dark:border-slate-800">
                  <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <BookOpen className="w-8 h-8 text-slate-200" />
                  </div>
                  <h4 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                    {hasNoData ? "No tests taken yet" : "No results for this filter"}
                  </h4>
                  <p className="text-slate-500 dark:text-slate-400 font-medium mt-2 max-w-xs mx-auto">
                    {hasNoData 
                      ? "Start a test from the library to initialize your personal achievement registry."
                      : "We couldn't find any sessions matching your current filter parameters."}
                  </p>
                  <Link href="/tests">
                    <Button className="mt-8 h-12 px-8 rounded-full bg-slate-900 dark:bg-primary font-black uppercase text-[10px] tracking-widest shadow-xl border-none">
                      Browse Tests <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Pagination Layer */}
            {totalPages > 1 && (
              <div className="pt-6 flex items-center justify-between border-t border-slate-50">
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="w-8 h-8 rounded-lg border-slate-200"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }).map((_, idx) => (
                      <button 
                        key={idx}
                        onClick={() => setCurrentPage(idx + 1)}
                        className={cn(
                          "w-8 h-8 rounded-lg text-[10px] font-black transition-all",
                          currentPage === idx + 1 ? "bg-primary text-white" : "text-slate-400 hover:bg-slate-100"
                        )}
                      >
                        {idx + 1}
                      </button>
                    ))}
                  </div>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="w-8 h-8 rounded-lg border-slate-200"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {filteredResponses.length} total results
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-center">
           <Link href="/">
            <Button variant="ghost" className="rounded-full text-slate-400 font-bold hover:text-primary">
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function FilterPill({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all",
        active 
          ? "bg-[#1a2340] text-white shadow-lg" 
          : "bg-white border border-slate-200 text-slate-500 hover:border-slate-300"
      )}
    >
      {label}
    </button>
  );
}

function StatusBadge({ label, color }: { label: string, color: 'gold' | 'green' | 'red' }) {
  const styles = {
    gold: "bg-amber-100 text-amber-600",
    green: "bg-emerald-100 text-emerald-600",
    red: "bg-rose-100 text-rose-600"
  };
  return (
    <span className={cn(
      "px-2.5 py-1 rounded-md text-[8px] font-black uppercase tracking-widest whitespace-nowrap",
      styles[color]
    )}>
      {label}
    </span>
  );
}
