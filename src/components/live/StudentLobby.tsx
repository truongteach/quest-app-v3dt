/**
 * StudentLobby.tsx
 * 
 * Purpose: Renders the waiting/synchronization state for students in Live Mode.
 * Used by: src/app/live/[roomCode]/page.tsx
 */

import React from 'react';
import { Zap, Loader2 } from 'lucide-react';

interface StudentLobbyProps {
  roomCode: string;
}

export function StudentLobby({ roomCode }: StudentLobbyProps) {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-8 text-center text-white">
      <div className="max-w-md w-full space-y-12">
        <div className="mx-auto w-24 h-24 bg-primary/20 rounded-[2rem] flex items-center justify-center ring-4 ring-primary/10 animate-pulse">
          <Zap className="w-12 h-12 text-primary fill-current" />
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl font-black uppercase tracking-tight">Synchronizing...</h1>
          <p className="text-lg font-medium text-slate-400">
            Connected to room <span className="text-white font-black">{roomCode}</span>. 
            Waiting for host to initialize the assessment sequence.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
            <p className="text-[10px] font-black uppercase text-slate-500 mb-1">Status</p>
            <p className="font-bold">Authorized</p>
          </div>
          <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
            <p className="text-[10px] font-black uppercase text-slate-500 mb-1">Identity</p>
            <p className="font-bold">Verified</p>
          </div>
        </div>
        <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto" />
      </div>
    </div>
  );
}
