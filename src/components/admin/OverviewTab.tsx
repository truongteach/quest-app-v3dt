"use client";

import React, { useMemo, useState, useEffect } from 'react';
import { 
  LayoutGrid, 
  Users as UsersIcon, 
  TrendingUp, 
  Activity, 
  Plus, 
  Zap, 
  RefreshCcw,
  Database,
  Code2,
  Clock,
  Check,
  AlertCircle
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { cn } from "@/lib/utils";
import { AdminTab } from '@/components/admin/AdminSidebar';
import { useRouter } from 'next/navigation';
import { GAS_CODE } from '@/lib/gas/latest';
import { useLanguage } from '@/context/language-context';
import { AccessKeyPanel } from './AccessKeyPanel';
import { useToast } from '@/hooks/use-toast';

interface OverviewTabProps {
  data: { tests: any[], users: any[], responses: any[] };
  lastSync: Date | null;
  settings: Record<string, string>;
  onNewTest: () => void;
  onManageContent: () => void;
  onSync: () => void;
  onSeed: () => void;
  onSaveSetting: (key: string, value: string) => void;
  setActiveTab: (tab: AdminTab) => void;
  loading?: boolean;
}

export function OverviewTab({ data, lastSync, settings, onNewTest, onManageContent, onSync, onSeed, onSaveSetting, setActiveTab, loading }: OverviewTabProps) {
  const router = useRouter();
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [isCopying, setIsCopying] = useState(false);
  const [showSeedConfirm, setShowSeedConfirm] = useState(false);
  
  const avgScoreValue = useMemo(() => {
    if (data.responses.length === 0) return 0;
    const totalPossible = data.responses.reduce((acc, r) => acc + (Number(r.Total) || 1), 0);
    const totalEarned = data.responses.reduce((acc, r) => acc + (Number(r.Score) || 0), 0);
    return Math.round((totalEarned / totalPossible) * 100);
  }, [data.responses]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(GAS_CODE);
    setIsCopying(true);
    toast({ 
      title: "Success", 
      description: "GAS code copied to clipboard — paste it into Google Apps Script" 
    });
    setTimeout(() => setIsCopying(false), 1500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" aria-hidden="true"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary" aria-hidden="true"></span>
            </span>
            <span className="text-xs font-black uppercase tracking-widest text-slate-400">{t('statusActive')}</span>
          </div>
          {lastSync && (
            <div className="flex items-center gap-2 px-3 py-1 bg-white rounded-full border shadow-sm">
              <Clock className="w-3 h-3 text-primary" aria-hidden="true" />
              <span className="text-[10px] font-black text-slate-500 uppercase">
                {t('lastSync')}: {lastSync.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          )}
        </div>

        <AccessKeyPanel settings={settings} lastSync={lastSync} onSaveSetting={onSaveSetting} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={LayoutGrid} label={t('totalTests')} value={data.tests.length} color="blue" />
        <StatCard icon={UsersIcon} label={t('totalStudents')} value={data.users.length} color="green" />
        <StatCard icon={TrendingUp} label={t('testResults')} value={data.responses.length} color="purple" />
        <StatCard icon={Activity} label={t('avgScore')} value={`${avgScoreValue}%`} color="orange" trend={<TrendingUp className="w-3 h-3 text-emerald-500 ml-1" />} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <QuickActionCard 
          title={t('createTest')} 
          subtitle="Add a new quiz or assessment"
          icon={Plus} 
          onClick={() => router.push('/admin/tests/new')} 
          theme="primary" 
          disabled={loading} 
        />
        <QuickActionCard 
          title={t('manageTests')} 
          subtitle="View, edit and organize all tests"
          icon={Zap} 
          onClick={onManageContent} 
          theme="dark" 
          disabled={loading} 
        />
        <QuickActionCard 
          title={t('gsCode')} 
          subtitle="Copy backend script to clipboard"
          icon={isCopying ? Check : Code2} 
          onClick={handleCopyCode} 
          theme="accent" 
          disabled={loading} 
        />
        <QuickActionCard 
          title={t('syncData')} 
          subtitle="Refresh all data from Google Sheets"
          icon={RefreshCcw} 
          onClick={onSync} 
          theme="light" 
          disabled={loading} 
          loading={loading} 
        />
        <QuickActionCard 
          title={t('seedData')} 
          subtitle="Load sample demo questions"
          icon={Database} 
          onClick={() => setShowSeedConfirm(true)} 
          theme="warning" 
          disabled={loading} 
        />
      </div>

      <AlertDialog open={showSeedConfirm} onOpenChange={setShowSeedConfirm}>
        <AlertDialogContent className="rounded-[2.5rem] border-none shadow-2xl">
          <AlertDialogHeader>
            <div className="mx-auto w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-orange-500" />
            </div>
            <AlertDialogTitle className="text-2xl font-black uppercase tracking-tight text-center">Confirm Seeding</AlertDialogTitle>
            <AlertDialogDescription className="text-center font-medium text-slate-500 px-6">
              This will add sample demo questions to your library. Existing data will not be affected. Continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-8 flex flex-col sm:flex-row gap-3">
            <AlertDialogCancel asChild>
              <Button variant="ghost" className="rounded-full font-bold uppercase text-[10px] tracking-widest flex-1 h-12">Cancel</Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button 
                onClick={() => { onSeed(); setShowSeedConfirm(false); }} 
                className="rounded-full bg-orange-500 hover:bg-orange-600 text-white font-black uppercase text-[10px] tracking-widest px-8 flex-1 h-12 border-none shadow-xl shadow-orange-500/20"
              >
                Yes, seed it
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

const StatCard = React.memo(({ icon: Icon, label, value, color, trend }: any) => {
  const colors: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
    orange: "bg-orange-50 text-orange-600"
  };
  return (
    <Card className="border-none shadow-sm hover:shadow-md transition-shadow bg-white" aria-label={`${label}: ${value}`}>
      <CardContent className="pt-6 flex items-center gap-4">
        <div className={cn("p-4 rounded-2xl", colors[color])} aria-hidden="true"><Icon className="w-6 h-6" /></div>
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase">{label}</p>
          <p className="text-3xl font-black text-slate-900">{value}{trend}</p>
        </div>
      </CardContent>
    </Card>
  );
});
StatCard.displayName = 'StatCard';

const QuickActionCard = React.memo(({ title, subtitle, icon: Icon, onClick, theme, disabled, loading }: any) => {
  const themes: Record<string, string> = {
    primary: "bg-primary text-white",
    dark: "bg-slate-900 text-white",
    accent: "bg-accent text-white",
    light: "bg-white border-2 border-slate-100 text-slate-900",
    warning: "bg-orange-500 text-white"
  };
  
  return (
    <Card 
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick?.(); }}
      className={cn(
        "border-none shadow-sm cursor-pointer transition-all min-h-[72px] flex items-center", 
        themes[theme],
        disabled ? "opacity-50 cursor-not-allowed" : "hover:scale-[1.02]"
      )} 
      onClick={!disabled ? onClick : undefined}
    >
      <CardContent className="py-4 px-5 flex items-center gap-4 w-full">
        <div className={cn("p-3 rounded-xl shrink-0", theme === 'light' ? 'bg-slate-100' : 'bg-white/20')} aria-hidden="true">
          <Icon className={cn("w-5 h-5", loading && "animate-spin")} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-black text-sm leading-tight truncate">{title}</p>
          {subtitle && (
            <p className="text-[11px] font-normal opacity-65 mt-[2px] truncate block">
              {subtitle}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
});
QuickActionCard.displayName = 'QuickActionCard';
