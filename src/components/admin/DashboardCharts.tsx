"use client";

import React, { useMemo } from 'react';
import { 
  Area, 
  AreaChart, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis,
  CartesianGrid
} from "recharts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { History, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from '@/context/language-context';
import { ErrorBoundary } from '@/components/ErrorBoundary';

interface DashboardChartsProps {
  responses: any[];
  onSeeAll: () => void;
}

export function DashboardCharts(props: DashboardChartsProps) {
  return (
    <ErrorBoundary>
      <DashboardChartsContent {...props} />
    </ErrorBoundary>
  );
}

function DashboardChartsContent({ responses, onSeeAll }: DashboardChartsProps) {
  const { t } = useLanguage();

  const chartData = useMemo(() => {
    if (!responses || !responses.length) return [];
    const counts: Record<string, number> = {};
    responses.forEach(r => {
      try {
        const date = new Date(r.Timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
        counts[date] = (counts[date] || 0) + 1;
      } catch (e) {
        // Skip invalid timestamps
      }
    });
    return Object.entries(counts).map(([date, count]) => ({ date, count })).reverse().slice(-7);
  }, [responses]);

  const getScoreBadgeStyles = (score: number, total: number) => {
    const p = (score / (total || 1)) * 100;
    if (p <= 40) return "bg-red-100 text-red-700";
    if (p <= 70) return "bg-orange-100 text-orange-700";
    return "bg-green-100 text-green-700";
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <Card className="lg:col-span-8 border-none shadow-sm overflow-hidden bg-white">
        <CardHeader className="border-b bg-slate-50/50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-black text-slate-900">{t('activityTrend')}</CardTitle>
              <CardDescription>Tests completed this week</CardDescription>
            </div>
            <Badge variant="secondary" className="px-3 py-1 font-bold">LIVE</Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-10 h-[350px]">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} />
                <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                <Area type="monotone" dataKey="count" stroke="hsl(var(--primary))" strokeWidth={4} fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-4">
              <History className="w-12 h-12 opacity-20" />
              <p className="font-bold">No results found yet</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="lg:col-span-4 border-none shadow-sm flex flex-col bg-white">
        <CardHeader className="border-b bg-slate-50/50">
          <CardTitle className="text-lg font-black text-slate-900">{t('recentResults')}</CardTitle>
          <CardDescription>{t('recentSubmissions')}</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto p-0 max-h-[350px]">
          <div className="divide-y">
            {(responses || []).slice(0, 6).map((resp, i) => (
              <div key={i} className="p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-black text-[10px]", getScoreBadgeStyles(Number(resp.Score), Number(resp.Total)))}>
                  {resp.Score}/{resp.Total}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm truncate">{resp['Test ID']}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{resp['User Name'] || 'Guest'} · {new Date(resp.Timestamp).toLocaleDateString()}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300" />
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="border-t p-4">
          <Button variant="ghost" className="w-full font-bold text-xs rounded-xl" onClick={onSeeAll}>{t('seeAllResults')}</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
