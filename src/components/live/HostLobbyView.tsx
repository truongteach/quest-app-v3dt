/**
 * HostLobbyView.tsx
 * 
 * Purpose: Initial lobby display for teachers before assessment sequence starts.
 */

import React from 'react';
import { Play, Users, ListChecks } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';

interface HostLobbyViewProps {
  testName: string;
  studentCount: number;
  questionCount: number;
  canStart: boolean;
  onStart: () => void;
}

export function HostLobbyView({ testName, studentCount, questionCount, canStart, onStart }: HostLobbyViewProps) {
  return (
    <div className="max-w-2xl w-full space-y-12 text-center animate-in zoom-in-95 duration-700 relative z-10">
       <div className="space-y-6">
          <h3 className="text-5xl font-black uppercase tracking-tight leading-none text-white">Lobby Operational</h3>
          <p className="text-xl font-medium text-slate-400 max-w-lg mx-auto leading-relaxed">
            Real-time protocol established. Initialize the assessment sequence when all student nodes are connected.
          </p>
       </div>
       <div className="p-10 rounded-[3rem] bg-white/5 border-4 border-dashed border-white/10 flex flex-col items-center gap-8 relative z-20">
          <div className="flex flex-col gap-4">
            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Join Gateway</p>
              <p className="text-2xl font-bold text-white tracking-tight">quest-dntrng.vercel.app/join</p>
            </div>
            <div className="flex items-center justify-center gap-6 py-4 border-t border-white/10 mt-2">
              <div className="flex items-center gap-2">
                <Users className={cn("w-3.5 h-3.5", studentCount > 0 ? "text-emerald-500" : "text-slate-500")} />
                <span className={cn("text-[9px] font-black uppercase tracking-widest", studentCount > 0 ? "text-emerald-500" : "text-slate-500")}>
                  {studentCount} Participants
                </span>
              </div>
              <div className="flex items-center gap-2">
                <ListChecks className={cn("w-3.5 h-3.5", questionCount > 0 ? "text-emerald-500" : "text-rose-500")} />
                <span className={cn("text-[9px] font-black uppercase tracking-widest", questionCount > 0 ? "text-emerald-500" : "text-rose-500")}>
                  {questionCount} Intelligence Nodes
                </span>
              </div>
            </div>
          </div>
          <Button 
            onClick={onStart} 
            disabled={!canStart} 
            className={cn(
              "h-20 px-12 rounded-full font-black text-2xl uppercase tracking-tighter shadow-2xl transition-all border-none relative z-30", 
              !canStart ? "bg-slate-800 text-slate-500" : "bg-primary hover:bg-primary/90 text-white hover:scale-[1.05] shadow-primary/30"
            )}
          >
            <Play className="w-6 h-6 mr-3 fill-current" /> Start Assessment
          </Button>
       </div>
    </div>
  );
}
