"use client";

import React, { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  Legend
} from "recharts";
import { cn } from "@/lib/utils";
import { 
  Trophy, 
  Users, 
  Target, 
  TrendingUp, 
  FileText,
  AlertCircle,
  Search,
  ChevronUp,
  ChevronDown,
  ArrowUpDown,
  Trash2,
  Download,
  RefreshCcw,
  Eye,
  BarChart3
} from "lucide-react";
import Link from 'next/link';
import { useLanguage } from '@/context/language-context';
import { useSettings } from '@/context/settings-context';
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
import { Button } from "@/components/ui/button";
import { Pagination } from './Pagination';
import { useRegistryFilter } from '@/hooks/useRegistryFilter';
import { calculateResponseStats } from '@/lib/analytics-utils';
import { ErrorBoundary } from '@/components/ErrorBoundary';

interface ResponsesTabProps {
  responses: any[];
  tests: any[];
  loading?: boolean;
  onRefresh: () => void;
  onDelete: (timestamp: string, email: string) => void;
}

export function ResponsesTab(props: ResponsesTabProps) {
  return (
    <ErrorBoundary>
      <ResponsesTabContent {...props} />
    </ErrorBoundary>
  );
}

function ResponsesTabContent({ responses, tests, loading, onRefresh, onDelete }: ResponsesTabProps) {
  const { t } = useLanguage();
  const { settings } = useSettings();
  const [deleteConfirm, setDeleteConfirm] = React.useState<{ timestamp: string, email: string } | null>(null);

  const threshold = Number(settings.default_pass_threshold || '70');
  const stats = useMemo(() => calculateResponseStats(responses || [], tests || [], threshold), [responses, tests, threshold]);

  const {
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    paginatedData,
    totalItems,
    pageSize
  } = useRegistryFilter({
    data: responses || [],
    searchFields: (r) => [String(r['User Name'] || ''), String(r['User Email'] || ''), String(r['Test ID'] || '')],
    initialSort: { key: 'Timestamp', direction: 'desc' }
  });

  const truncate = (str: string, max: number = 15) => {
    return str.length > max ? str.substring(0, max) + "..." : str;
  };

  const getEfficiencyColor = (name: string) => {
    const n = name.toUpperCase();
    if (n.includes("LV1")) return "#22C55E";
    if (n.includes("LV2")) return "#3B5BDB";
    if (n.includes("LV3")) return "#7C3AED";
    return "#1a2340";
  };

  if (!stats) return (
    <div className="flex flex-col items-center justify-center py-32 bg-slate-50 dark:bg-slate-900 rounded-[3rem] border-4 border-dashed border-slate-100 dark:border-slate-800">
      <AlertCircle className="w-16 h-16 text-slate-200 dark:text-slate-700 mb-6" />
      <h3 className="text-2xl font-black text-slate-400 uppercase tracking-widest">{t('noResults')}</h3>
      <p className="text-slate-400 text-sm font-medium mt-2">{t('waitingFirst')}</p>
      <Button variant="outline" onClick={onRefresh} className="mt-8 rounded-full font-black uppercase text-[10px] tracking-widest gap-2">
        <RefreshCcw className={cn("w-4 h-4", loading && "animate-spin")} /> Force Registry Sync
      </Button>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-24">
      {/* Top Stats Layer */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AnalysisCard icon={Users} label="Global Sessions" value={stats.total} color="blue" />
        <AnalysisCard icon={Target} label={t('avgScore')} value={`${stats.avgScore}%`} color="green" />
        <AnalysisCard icon={Trophy} label={t('passRate')} value={`${stats.passRate}%`} color="purple" />
      </div>

      {/* Analytics Visualization Layer */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart 1: Performance Distribution */}
        <Card className="border-none shadow-sm bg-white dark:bg-slate-900 overflow-hidden rounded-[2.5rem] border dark:border-slate-800">
          <CardHeader className="bg-slate-50/50 dark:bg-slate-800/50 border-b p-8">
            <CardTitle className="text-xl font-black flex items-center gap-3 text-slate-900 dark:text-white uppercase tracking-tight">
              <TrendingUp className="w-5 h-5 text-primary" /> Grade Distribution
            </CardTitle>
            <CardDescription className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Frequency of results per tier</CardDescription>
          </CardHeader>
          <CardContent className="pt-10 h-[350px]">
            <ErrorBoundary>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.gradeData} layout="vertical" margin={{ left: 20, right: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    width={140} 
                    tick={{ fontSize: 11, fontWeight: 800, fill: '#64748b' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip 
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="value" radius={[0, 12, 12, 0]} barSize={40}>
                    {stats.gradeData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ErrorBoundary>
          </CardContent>
        </Card>

        {/* Chart 2: Module Efficiency */}
        <Card className="border-none shadow-sm bg-white dark:bg-slate-900 overflow-hidden rounded-[2.5rem] border dark:border-slate-800">
          <CardHeader className="bg-slate-50/50 dark:bg-slate-800/50 border-b p-8">
            <CardTitle className="text-xl font-black flex items-center gap-3 text-slate-900 dark:text-white uppercase tracking-tight">
              <BarChart3 className="w-5 h-5 text-primary" /> Module Precision
            </CardTitle>
            <CardDescription className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Average score per assessment module</CardDescription>
          </CardHeader>
          <CardContent className="pt-10 h-[350px]">
            <ErrorBoundary>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.testPerformanceData} margin={{ bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    tickFormatter={(val) => truncate(val, 12)}
                    tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    domain={[0, 100]}
                    tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip 
                    formatter={(val) => [`${val}%`, 'Mean Score']}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="avg" radius={[12, 12, 0, 0]} barSize={32}>
                    {stats.testPerformanceData.map((entry, i) => (
                      <Cell key={i} fill={getEfficiencyColor(entry.name)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ErrorBoundary>
          </CardContent>
        </Card>
      </div>

      {/* Chronological History Layer */}
      <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-[3rem] overflow-hidden border dark:border-slate-800">
        <CardHeader className="bg-slate-50/50 dark:bg-slate-800/50 border-b p-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <CardTitle className="font-black text-3xl text-slate-900 dark:text-white uppercase tracking-tight">Mission History</CardTitle>
            <CardDescription className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-1">Audit trail of all assessment submissions</CardDescription>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="Filter by student or test..." 
                className="h-12 pl-12 rounded-full border-none ring-1 ring-slate-200 dark:ring-slate-700 bg-white dark:bg-slate-800 focus:ring-primary/40 text-sm font-bold shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon" onClick={onRefresh} className="rounded-full h-12 w-12 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
              <RefreshCcw className={cn("w-4 h-4 text-slate-400", loading && "animate-spin text-primary")} />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/30 dark:bg-slate-800/20 hover:bg-transparent border-none">
                <TableHead className="px-10 py-5 font-black uppercase text-[10px] tracking-widest text-slate-400">Timestamp</TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-widest text-slate-400">Student Identity</TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-widest text-slate-400">Assessment Module</TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-widest text-slate-400">Precision</TableHead>
                <TableHead className="px-10 text-right font-black uppercase text-[10px] tracking-widest text-slate-400">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((r, i) => (
                <TableRow key={i} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors border-b border-slate-50 dark:border-slate-800 last:border-none">
                  <TableCell className="px-10 py-6 text-[11px] font-bold text-slate-400 tabular-nums">
                    {new Date(r.Timestamp).toLocaleDateString()} {new Date(r.Timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </TableCell>
                  <TableCell>
                    <Link href={`/admin/users/detail?email=${encodeURIComponent(r['User Email'])}`} className="font-black uppercase text-slate-700 dark:text-slate-300 hover:text-primary transition-colors flex items-center gap-2 group/link">
                      {r['User Name']}
                      <Eye className="w-3 h-3 text-slate-300 opacity-0 group-hover:opacity-100 group-hover/link:text-primary transition-all" />
                    </Link>
                  </TableCell>
                  <TableCell className="font-bold text-slate-500 dark:text-slate-400">{r['Test ID']}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-black text-slate-900 dark:text-white">{r.Score} / {r.Total}</span>
                      <span className={cn(
                        "text-[9px] font-black uppercase tracking-widest",
                        (Number(r.Score) / (Number(r.Total) || 1)) >= threshold/100 ? "text-emerald-500" : "text-rose-500"
                      )}>
                        {Math.round((Number(r.Score) / (Number(r.Total) || 1)) * 100)}% Accuracy
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-10 text-right">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="opacity-0 group-hover:opacity-100 h-9 w-9 rounded-xl text-destructive hover:bg-rose-50 hover:text-rose-600 transition-all" 
                      onClick={() => setDeleteConfirm({ timestamp: r.Timestamp, email: r['User Email'] })}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {totalItems === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="py-24 text-center bg-slate-50/20">
                    <div className="flex flex-col items-center gap-4 opacity-20">
                      <FileText className="w-12 h-12" />
                      <p className="font-black uppercase tracking-[0.3em] text-xs">No entries match your search registry</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <Pagination currentPage={currentPage} totalItems={totalItems} pageSize={pageSize} onPageChange={setCurrentPage} />
        </CardContent>
      </Card>

      {/* Verification Overlay */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
        <AlertDialogContent className="rounded-[3rem] p-10 border-none shadow-2xl dark:bg-slate-900">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-3xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
              {t('confirmDeleteTitle')}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-lg font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
              {t('confirmDeleteDesc')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-8 flex flex-col sm:flex-row gap-4">
            <AlertDialogCancel className="h-14 rounded-full border-2 font-black uppercase text-xs tracking-widest flex-1 dark:border-slate-700 dark:text-slate-400">
              {t('cancel')}
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => { if(deleteConfirm) onDelete(deleteConfirm.timestamp, deleteConfirm.email); setDeleteConfirm(null); }}
              className="h-14 rounded-full bg-destructive hover:bg-destructive/90 text-white font-black uppercase text-xs tracking-widest flex-1 shadow-xl shadow-destructive/20 border-none"
            >
              {t('delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function AnalysisCard({ icon: Icon, label, value, color }: any) {
  const colors: Record<string, string> = {
    blue: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900",
    green: "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-100 dark:border-green-900",
    purple: "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-900"
  };
  return (
    <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-[2.5rem] border dark:border-slate-800 transition-all hover:shadow-md">
      <CardContent className="pt-8 flex items-center gap-8 px-8">
        <div className={cn("p-6 rounded-[2rem] border-2", colors[color])}><Icon className="w-8 h-8" /></div>
        <div>
          <p className="text-[10px] font-black uppercase text-muted-foreground dark:text-slate-500 tracking-[0.3em] mb-1">{label}</p>
          <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter tabular-nums">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
