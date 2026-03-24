"use client";

import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { API_URL } from '@/lib/api-config';
import { ActivityTab } from '@/components/admin/ActivityTab';
import { Loader2, History } from 'lucide-react';
import { useLanguage } from '@/context/language-context';

export default function AdminActivityPage() {
  const [loading, setLoading] = useState(false);
  const [activities, setActivities] = useState<any[]>([]);
  const { toast } = useToast();
  const { t } = useLanguage();

  const fetchActivities = async () => {
    if (!API_URL) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}?action=getActivity`);
      const data = await res.json();
      setActivities(Array.isArray(data) ? data : []);
    } catch (err) {
      toast({ variant: "destructive", title: "Sync Error", description: "Could not fetch activity logs." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  if (loading && activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-40">
        <Loader2 className="w-12 h-12 animate-spin text-primary mb-6" />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Syncing System Logs...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tight">{t('systemActivity')}</h1>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-2">{t('monitorAccess')}</p>
        </div>
        <div className="p-4 bg-white rounded-2xl shadow-sm border flex items-center gap-3">
          <History className="w-5 h-5 text-primary" />
          <span className="text-xl font-black text-slate-900">{activities.length}</span>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Events</span>
        </div>
      </div>
      
      <ActivityTab activities={activities} />
    </div>
  );
}
