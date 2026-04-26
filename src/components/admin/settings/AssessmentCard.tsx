
/**
 * AssessmentCard.tsx
 * 
 * Purpose: Calibrates global assessment logic, passing thresholds, and timers.
 * Used by: src/app/admin/settings/page.tsx
 * Props:
 *   - formData: Record<string, string> — current settings state
 *   - setFormData: (data: Record<string, string>) => void — state dispatcher
 *   - t: (key: string) => string — localization function
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Target, Clock } from 'lucide-react';

interface AssessmentCardProps {
  formData: Record<string, string>;
  setFormData: (data: Record<string, string>) => void;
  t: (key: string) => string;
}

export function AssessmentCard({ formData, setFormData, t }: AssessmentCardProps) {
  return (
    <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden border dark:border-slate-800">
      <CardHeader className="bg-slate-50/50 dark:bg-slate-800/50 border-b p-8">
        <h2 className="text-xl font-black flex items-center gap-3">
          <Target className="w-5 h-5 text-primary" aria-hidden="true" /> {t('assessmentConfig')}
        </h2>
        <CardDescription>Global evaluation and analysis settings</CardDescription>
      </CardHeader>
      <CardContent className="p-8 space-y-8">
        <div className="space-y-2">
          <Label htmlFor="pass-threshold" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{t('passThreshold')}</Label>
          <div className="relative">
            <Target className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" aria-hidden="true" />
            <Input 
              id="pass-threshold"
              type="number"
              value={formData.default_pass_threshold}
              onChange={(e) => setFormData({ ...formData, default_pass_threshold: e.target.value })}
              className="h-12 pl-11 rounded-xl bg-slate-50 dark:bg-slate-800 border-none ring-1 ring-slate-200 dark:ring-slate-700 font-black text-sm"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="timer-limit" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{t('globalTimerLimit')}</Label>
          <div className="relative">
            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" aria-hidden="true" />
            <Input 
              id="timer-limit"
              type="number"
              value={formData.global_timer_limit}
              onChange={(e) => setFormData({ ...formData, global_timer_limit: e.target.value })}
              className="h-12 pl-11 rounded-xl bg-slate-50 dark:bg-slate-800 border-none ring-1 ring-slate-200 dark:ring-slate-700 font-black text-sm"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="benchmark-toggle" className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight block cursor-pointer">{t('enableBenchmarking')}</Label>
              <p className="text-[10px] text-slate-500 font-medium">Show comparative results to students</p>
            </div>
            <Switch 
              id="benchmark-toggle"
              checked={formData.enable_benchmarking === 'true'} 
              onCheckedChange={(val) => setFormData({ ...formData, enable_benchmarking: String(val) })} 
            />
          </div>

          <div className="h-px bg-slate-100 dark:bg-slate-800" aria-hidden="true" />

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="maintenance-toggle" className="text-sm font-black text-red-600 uppercase tracking-tight block cursor-pointer">{t('maintenanceMode')}</Label>
              <p className="text-[10px] text-slate-500 font-medium">Prevent all new assessment sessions</p>
            </div>
            <Switch 
              id="maintenance-toggle"
              checked={formData.maintenance_mode === 'true'} 
              onCheckedChange={(val) => setFormData({ ...formData, maintenance_mode: String(val) })} 
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
