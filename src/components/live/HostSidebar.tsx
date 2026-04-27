/**
 * HostSidebar.tsx
 * 
 * Purpose: Displays student connectivity and live standings in the Host Command Terminal.
 */

import React from 'react';
import { Users, Trophy, Loader2 } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { cn } from '@/lib/utils';

interface HostSidebarProps {
  status: 'lobby' | 'active' | 'revealed';
  students: any[];
  leaderboard: any[];
}

export function HostSidebar({ status, students, leaderboard }: HostSidebarProps) {
  return (
    <div className="lg:col-span-3 border-r border-white/5 bg-slate-900/30 flex flex-col">
      <div className="p-8 border-b border-white/5 flex items-center justify-between">
        <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
          {status === 'revealed' ? <Trophy className="w-4 h-4 text-primary" /> : <Users className="w-4 h-4 text-primary" />}
          {status === 'revealed' ? 'Top Performance' : 'Identity Registry'}
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
        {status === 'revealed' ? (
          leaderboard.map((s: any, i) => (
            <div key={s.id} className="p-4 bg-white/5 rounded-2xl flex items-center justify-between animate-in slide-in-from-left-2">
              <div className="flex items-center gap-4">
                <span className="text-xs font-black text-slate-500 w-4">{i + 1}</span>
                <span className="font-bold text-slate-300">{s.name}</span>
              </div>
              <span className="text-sm font-black text-primary">{s.score}</span>
            </div>
          ))
        ) : (
          students?.map((s: any) => (
            <div key={s.id} className="p-4 bg-white/5 rounded-2xl flex items-center justify-between group animate-in slide-in-from-left-2">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center font-black text-primary uppercase text-xs">{s.name.charAt(0)}</div>
                <span className="font-bold text-slate-300">{s.name}</span>
              </div>
              <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest border-emerald-500/20 text-emerald-500 bg-emerald-50/5 px-2">Ready</Badge>
            </div>
          ))
        )}
        {!students?.length && (
          <div className="h-full flex flex-col items-center justify-center text-center p-10 opacity-20">
            <Loader2 className="w-12 h-12 mb-6 animate-spin text-primary" />
            <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed">Awaiting Student Handshake...</p>
          </div>
        )}
      </div>
    </div>
  );
}
