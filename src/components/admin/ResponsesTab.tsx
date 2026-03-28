
"use client";

import React, { useMemo, useState } from 'react';
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
  PieChart, 
  Pie,
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
  Trash2
} from "lucide-react";
import { useLanguage } from '@/context/language-context';
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

interface ResponsesTabProps {
  responses: any[];
  onDelete: (timestamp: string, email: string) => void;
}

type SortConfig = {
  key: string;
  direction: 'asc' | 'desc' | null;
};

export function ResponsesTab({ responses, onDelete }: ResponsesTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'Timestamp', direction: 'desc' });
  const [deleteConfirm, setDeleteConfirm] = useState<{ timestamp: string, email: string } | null>(null);
  const { t } = useLanguage();

  // --- DATA ANALYSIS LOGIC ---
  
  const stats = useMemo(() => {
    if (!responses || responses.length === 0) return null;

    const total = responses.length;
    let totalScorePct = 0;
    let passes = 0;

    const gradeCounts = {
      Excellent: 0,
      Pass: 0,
      Fail: 0
    };

    const testStats: Record<string, { count: number; totalScore: number }> = {};

    responses.forEach(r => {
      const score = Number(r.Score) || 0;
      const totalQ = Number(r.Total) || 1;
      const pct = (score / totalQ) * 100;
      
      totalScorePct += pct;
      
      if (pct >= 50) passes++;
      
      if (pct >= 80) gradeCounts.Excellent++;
      else if (pct >= 50) gradeCounts.Pass++;
      else gradeCounts.Fail++;

      // Per test stats
      const testId = String(r['Test ID'] || 'Unknown');
      if (!testStats[testId]) testStats[testId] = { count: 0, totalScore: 0 };
      testStats[testId].count++;
      testStats[testId].totalScore += pct;
    });

    const gradeData = [
      { name: 'Excellent (80%+)', value: gradeCounts.Excellent, color: '#22c55e' },
      { name: 'Pass (50-79%)', value: gradeCounts.Pass, color: '#f59e0b' },
      { name: 'Fail (<50%)', value: gradeCounts.Fail, color: '#ef4444' }
    ];

    const testPerformanceData = Object.entries(testStats).map(([name, data]) => ({
      name,
      avg: Math.round(data.totalScore / data.count),
      submissions: data.count
    })).sort((a, b) => b.avg - a.avg);

    return {
      total,
      avgScore: Math.round(totalScorePct / total),
      passRate: Math.round((passes / total) * 100),
      gradeData,
      testPerformanceData
    };
  }, [responses]);

  // --- TABLE LOGIC (SEARCH & SORT) ---

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const processedResponses = useMemo(() => {
    if (!responses) return [];
    let result = [...responses];

    // Search Filtering
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(r => 
        String(r['User Name'] || '').toLowerCase().includes(term) ||
        String(r['User Email'] || '').toLowerCase().includes(term) ||
        String(r['Test ID'] || '').toLowerCase().includes(term)
      );
    }

    // Sorting
    if (sortConfig.key && sortConfig.direction) {
      result.sort((a, b) => {
        let valA = a[sortConfig.key];
        let valB = b[sortConfig.key];

        // Custom handling for scores/numeric strings
        if (sortConfig.key === 'Score' || sortConfig.key === 'Total') {
          valA = Number(valA) || 0;
          valB = Number(valB) || 0;
        }

        // Custom handling for Percentage/Grade
        if (sortConfig.key === 'Grade') {
          valA = (Number(a.Score) / (Number(a.Total) || 1)) * 100;
          valB = (Number(b.Score) / (Number(b.Total) || 1)) * 100;
        }

        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [responses, searchTerm, sortConfig]);

  const SortIcon = ({ column }: { column: string }) => {
    if (sortConfig.key !== column) return <ArrowUpDown className="ml-2 h-3 w-3 opacity-30" />;
    return sortConfig.direction === 'asc' 
      ? <ChevronUp className="ml-2 h-4 w-4 text-primary" /> 
      : <ChevronDown className="ml-2 h-4 w-4 text-primary" />;
  };

  const handleDelete = () => {
    if (deleteConfirm) {
      onDelete(deleteConfirm.timestamp, deleteConfirm.email);
      setDeleteConfirm(null);
    }
  };

  if (!stats) {
    return (
      <div className="flex flex-col items-center justify-center py-24 bg-white dark:bg-slate-900 rounded-[2rem] border-2 border-dashed border-slate-100 dark:border-slate-800">
        <AlertCircle className="w-12 h-12 text-slate-200 dark:text-slate-700 mb-4" />
        <h3 className="text-xl font-black text-slate-400 dark:text-slate-600">{t('noResults')}</h3>
        <p className="text-slate-400 dark:text-slate-600 text-sm">{t('waitingFirst')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AnalysisCard 
          icon={Users} 
          label="Total Results" 
          value={stats.total} 
          subValue="All tests"
          color="blue"
        />
        <AnalysisCard 
          icon={Target} 
          label={t('avgScore')} 
          value={`${stats.avgScore}%`} 
          subValue="Global average"
          color="green"
        />
        <AnalysisCard 
          icon={Trophy} 
          label={t('passRate')} 
          value={`${stats.passRate}%`} 
          subValue="Students above 50%"
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Grade Distribution */}
        <Card className="border-none shadow-sm bg-white dark:bg-slate-900 overflow-hidden border dark:border-slate-800">
          <CardHeader className="bg-slate-50/50 dark:bg-slate-800/50 border-b dark:border-slate-800">
            <CardTitle className="text-lg font-black flex items-center gap-2 text-slate-900 dark:text-white">
              <TrendingUp className="w-5 h-5 text-primary" />
              Score Range
            </CardTitle>
            <CardDescription className="dark:text-slate-400">Breakdown of student performance</CardDescription>
          </CardHeader>
          <CardContent className="pt-8 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.gradeData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="hsl(var(--muted))" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={120} style={{ fontSize: '12px', fontWeight: 600, fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip 
                  cursor={{ fill: 'hsl(var(--muted) / 0.2)' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', backgroundColor: 'hsl(var(--card))', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={40}>
                  {stats.gradeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Test Popularity & Performance */}
        <Card className="border-none shadow-sm bg-white dark:bg-slate-900 overflow-hidden border dark:border-slate-800">
          <CardHeader className="bg-slate-50/50 dark:bg-slate-800/50 border-b dark:border-slate-800">
            <CardTitle className="text-lg font-black flex items-center gap-2 text-slate-900 dark:text-white">
              <FileText className="w-5 h-5 text-primary" />
              Best Scores by Test
            </CardTitle>
            <CardDescription className="dark:text-slate-400">Average score per test ID</CardDescription>
          </CardHeader>
          <CardContent className="pt-8 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.testPerformanceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="avg"
                  nameKey="name"
                  label={({ name, avg }) => `${name}: ${avg}%`}
                >
                  {stats.testPerformanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`hsl(var(--primary), ${1 - (index * 0.2)})`} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', backgroundColor: 'hsl(var(--card))' }} />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Log Table */}
      <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden border dark:border-slate-800">
        <CardHeader className="bg-slate-50/50 dark:bg-slate-800/50 border-b dark:border-slate-800 p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <CardTitle className="font-black text-2xl text-slate-900 dark:text-white uppercase tracking-tight">{t('fullResultHistory')}</CardTitle>
              <CardDescription className="font-medium dark:text-slate-400">Every test attempt recorded in the system</CardDescription>
            </div>
            
            <div className="relative w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="Find student or test..." 
                className="h-12 pl-12 rounded-full bg-white dark:bg-slate-900 border-none ring-1 ring-slate-100 dark:ring-slate-800 focus:ring-primary/40 text-sm font-bold shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50 dark:bg-slate-800/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 border-none">
                <TableHead 
                  className="font-black uppercase text-[10px] tracking-widest px-8 py-5 cursor-pointer hover:text-primary transition-colors text-slate-400"
                  onClick={() => handleSort('Timestamp')}
                >
                  <div className="flex items-center">{t('date')} <SortIcon column="Timestamp" /></div>
                </TableHead>
                <TableHead 
                  className="font-black uppercase text-[10px] tracking-widest px-4 cursor-pointer hover:text-primary transition-colors text-slate-400"
                  onClick={() => handleSort('User Name')}
                >
                  <div className="flex items-center">{t('student')} <SortIcon column="User Name" /></div>
                </TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-widest px-4 text-slate-400">{t('email')}</TableHead>
                <TableHead 
                  className="font-black uppercase text-[10px] tracking-widest px-4 cursor-pointer hover:text-primary transition-colors text-slate-400"
                  onClick={() => handleSort('Test ID')}
                >
                  <div className="flex items-center">Test ID <SortIcon column="Test ID" /></div>
                </TableHead>
                <TableHead 
                  className="font-black uppercase text-[10px] tracking-widest px-4 cursor-pointer hover:text-primary transition-colors text-slate-400"
                  onClick={() => handleSort('Score')}
                >
                  <div className="flex items-center">{t('score')} <SortIcon column="Score" /></div>
                </TableHead>
                <TableHead 
                  className="font-black uppercase text-[10px] tracking-widest px-4 text-center text-slate-400"
                >
                  {t('result')}
                </TableHead>
                <TableHead className="px-8 text-right font-black uppercase text-[10px] tracking-widest text-slate-400">{t('actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {processedResponses.map((r, i) => {
                const score = Number(r.Score) || 0;
                const total = Number(r.Total) || 1;
                const pct = (score / total) * 100;
                return (
                  <TableRow key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 group border-b border-slate-50 dark:border-slate-800 last:border-none">
                    <TableCell className="px-8 py-5 text-[10px] font-medium text-slate-400">
                      {new Date(r.Timestamp).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="px-4 font-black text-slate-900 dark:text-white truncate max-w-[150px]">{String(r['User Name'] || 'Guest')}</TableCell>
                    <TableCell className="px-4 font-medium text-slate-500 truncate max-w-[150px]">{String(r['User Email'] || 'N/A')}</TableCell>
                    <TableCell className="px-4 font-bold text-slate-700 dark:text-slate-300">
                      <Badge variant="outline" className="font-mono text-[10px] rounded-md bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                        {String(r['Test ID'])}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 font-black text-slate-700 dark:text-slate-300">{score} / {total}</TableCell>
                    <TableCell className="px-4 text-center">
                      <Badge className={cn(
                        "font-black px-4 py-1.5 rounded-full border-none shadow-sm text-[9px] uppercase tracking-widest",
                        pct >= 80 ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : pct >= 50 ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      )}>
                        {pct >= 80 ? t('excellent') : pct >= 50 ? t('pass') : t('fail')}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-8 text-right">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="rounded-full h-10 w-10 text-destructive hover:bg-destructive/5 transition-all"
                        onClick={() => setDeleteConfirm({ timestamp: r.Timestamp, email: r['User Email'] })}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
              {processedResponses.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-24 bg-slate-50/20 dark:bg-slate-900/20">
                    <div className="flex flex-col items-center gap-2 opacity-30">
                      <Search className="w-10 h-10" />
                      <p className="font-black uppercase tracking-widest text-xs">No matching results found</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteConfirm} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
        <AlertDialogContent className="rounded-[3rem] p-10 border-none shadow-2xl dark:bg-slate-900">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-3xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
              Purge Result Entry?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-lg font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
              This will permanently remove this assessment log from the registry. This action cannot be reversed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-8 flex flex-col sm:flex-row gap-4">
            <AlertDialogCancel className="h-14 rounded-full border-2 font-black uppercase text-xs tracking-widest flex-1 dark:border-slate-700 dark:text-slate-400">
              {t('cancel')}
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="h-14 rounded-full bg-destructive hover:bg-destructive/90 text-white font-black uppercase text-xs tracking-widest flex-1 shadow-xl shadow-destructive/20 border-none"
            >
              Confirm Purge
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function AnalysisCard({ icon: Icon, label, value, subValue, color }: any) {
  const colors: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/30",
    green: "bg-green-50 text-green-600 border-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/30",
    purple: "bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-900/30"
  };
  
  return (
    <Card className="border-none shadow-sm bg-white dark:bg-slate-900 overflow-hidden group hover:shadow-xl transition-all rounded-[2rem] border dark:border-slate-800">
      <CardContent className="pt-6 flex items-center gap-6">
        <div className={cn("p-5 rounded-[1.5rem] border-2 transition-transform group-hover:scale-110", colors[color])}>
          <Icon className="w-8 h-8" />
        </div>
        <div>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-1">{label}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{value}</p>
          </div>
          <p className="text-xs font-medium text-muted-foreground/60 dark:text-slate-500">{subValue}</p>
        </div>
      </CardContent>
    </Card>
  );
}
