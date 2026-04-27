/**
 * StudentFinalScore.tsx
 * 
 * Purpose: Displays the terminal performance registry for students after a session ends.
 * Used by: src/app/live/[roomCode]/page.tsx
 */

import React from 'react';
import Link from 'next/link';
import { Trophy, Home, Users } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from '@/lib/utils';

interface StudentFinalScoreProps {
  leaderboard: any[];
  studentId: string | null;
  studentRank: number | null;
}

export function StudentFinalScore({ leaderboard, studentId, studentRank }: StudentFinalScoreProps) {
  const myScore = leaderboard.find(s => s.id === studentId)?.score || 0;
  
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center py-20 px-8 text-white">
      <div className="max-w-2xl w-full space-y-12 text-center animate-in fade-in duration-1000">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-rose-500/20 border border-rose-500/30 rounded-full text-rose-400 text-[10px] font-black uppercase tracking-widest mb-4">
             SESSION TERMINATED BY HOST
          </div>
          <Trophy className="w-20 h-20 text-primary mx-auto mb-6 drop-shadow-[0_0_20px_rgba(var(--primary),0.5)]" />
          <h1 className="text-5xl font-black uppercase tracking-tight leading-none">Mission Finalized</h1>
          <p className="text-xl font-medium text-slate-400">Your performance registry has been archived.</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
           <div className="p-8 bg-white/5 rounded-[2rem] border border-white/5">
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-2">Final Rank</p>
              <p className="text-4xl font-black text-primary">#{studentRank || '--'}</p>
           </div>
           <div className="p-8 bg-white/5 rounded-[2rem] border border-white/5">
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-2">Total Score</p>
              <p className="text-4xl font-black text-primary">{myScore}</p>
           </div>
        </div>

        <Card className="border-none bg-white/5 rounded-[3rem] overflow-hidden">
          <div className="bg-white/5 p-6 border-b border-white/5 flex items-center justify-center gap-3">
            <Users className="w-5 h-5 text-primary" />
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-300">Classroom Standings</h3>
          </div>
          <CardContent className="p-0">
            <div className="divide-y divide-white/5">
              {leaderboard.slice(0, 5).map((s, i) => (
                <div key={s.id} className={cn(
                  "p-6 flex items-center justify-between",
                  s.id === studentId ? "bg-primary/20" : ""
                )}>
                  <div className="flex items-center gap-6">
                    <span className="text-2xl font-black text-slate-500 w-8">{i + 1}</span>
                    <div className="flex flex-col text-left">
                      <span className="font-black uppercase tracking-tight text-white">{s.name}</span>
                      {s.id === studentId && <span className="text-[8px] font-black uppercase tracking-widest text-primary">Your Identity</span>}
                    </div>
                  </div>
                  <span className="text-2xl font-black text-primary tabular-nums">{s.score}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Link href="/" className="block w-full">
          <Button className="w-full h-20 rounded-full bg-primary text-white font-black text-2xl uppercase tracking-tight shadow-2xl border-none">
            <Home className="w-6 h-6 mr-3" /> Return to Base
          </Button>
        </Link>
      </div>
    </div>
  );
}
