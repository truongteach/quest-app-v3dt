"use client";

import React, { useMemo } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { BarChart3, Target, AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import { calculateQuestionStats } from '@/lib/analytics-utils';
import { cn } from "@/lib/utils";

interface QuestionAnalyticsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  test: any;
  questions: any[];
  responses: any[];
}

export function QuestionAnalyticsDialog({ 
  open, 
  onOpenChange, 
  test, 
  questions, 
  responses 
}: QuestionAnalyticsDialogProps) {
  const stats = useMemo(() => {
    if (!test || !open) return [];
    return calculateQuestionStats(test.id, questions, responses);
  }, [test, questions, responses, open]);

  const getRateColor = (rate: number) => {
    if (rate >= 70) return "text-emerald-500";
    if (rate >= 40) return "text-amber-500";
    return "text-rose-500";
  };

  const getProgressColor = (rate: number) => {
    if (rate >= 70) return "bg-emerald-500";
    if (rate >= 40) return "bg-amber-500";
    return "bg-rose-500";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[1000px] rounded-[3rem] p-0 overflow-hidden border-none shadow-2xl bg-white flex flex-col h-[85vh]">
        <DialogHeader className="p-10 bg-slate-900 text-white shrink-0">
          <div className="flex items-center gap-4">
            <div className="bg-primary p-3 rounded-2xl shadow-xl rotate-3">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-3xl font-black uppercase tracking-tight">Question Analytics</DialogTitle>
              <DialogDescription className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-1">
                Module: {test?.title || test?.id} • Total Sessions: {stats.reduce((acc, s) => Math.max(acc, s.attempts), 0)}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 hover:bg-slate-50 border-none sticky top-0 z-10 shadow-sm">
                <TableHead className="px-10 py-5 font-black uppercase text-[10px] tracking-widest text-slate-400 w-1/2">Intelligence Node</TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-widest text-slate-400 text-center">Attempts</TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-widest text-slate-400 text-center">Correct</TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-widest text-slate-400 text-center">Incorrect</TableHead>
                <TableHead className="px-10 font-black uppercase text-[10px] tracking-widest text-slate-400 text-right">Success Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats.map((s, i) => (
                <TableRow key={s.id} className="group hover:bg-slate-50/50 transition-colors border-b border-slate-50 last:border-none">
                  <TableCell className="px-10 py-6">
                    <div className="space-y-1">
                      <p className="font-bold text-slate-700 text-sm line-clamp-2 leading-relaxed">{s.text}</p>
                      <p className="text-[9px] font-mono text-slate-300 uppercase tracking-tighter">Node ID: {s.id}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-center font-black text-slate-400">{s.attempts}</TableCell>
                  <TableCell className="text-center">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 font-black text-xs">
                      <CheckCircle2 className="w-3 h-3" /> {s.correct}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-600 font-black text-xs">
                      <XCircle className="w-3 h-3" /> {s.incorrect}
                    </div>
                  </TableCell>
                  <TableCell className="px-10 text-right min-w-[200px]">
                    <div className="space-y-2">
                      <div className="flex items-center justify-end gap-3">
                        <span className={cn("text-lg font-black tracking-tighter", getRateColor(s.successRate))}>
                          {s.successRate}%
                        </span>
                        {s.successRate < 40 && <AlertCircle className="w-4 h-4 text-rose-500 animate-pulse" />}
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={cn("h-full transition-all duration-1000", getProgressColor(s.successRate))}
                          style={{ width: `${s.successRate}%` }}
                        />
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {stats.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="py-32 text-center text-slate-300">
                    <Target className="w-12 h-12 mx-auto mb-4 opacity-10" />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em]">No session data for this module</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
