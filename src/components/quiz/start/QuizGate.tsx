
/**
 * QuizGate.tsx
 * 
 * Purpose: Security protocol step for password-protected assessment modules.
 * Used by: src/components/quiz/QuizStart.tsx
 * Props:
 *   - password: string — current input
 *   - setPassword: (val: string) => void — state dispatcher
 *   - onVerify: () => void — check daily key
 */

import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShieldCheck, Lock } from 'lucide-react';

interface QuizGateProps {
  password: string;
  setPassword: (val: string) => void;
  onVerify: () => void;
}

export function QuizGate({ password, setPassword, onVerify }: QuizGateProps) {
  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
      <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white relative overflow-hidden shadow-2xl">
        <ShieldCheck className="absolute top-0 right-0 w-32 h-32 text-white/5 -mr-8 -mt-8" />
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <Lock className="w-5 h-5 text-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Secure Entry Required</span>
          </div>
          <p className="text-sm font-medium text-slate-400">This module is protected by a daily access key. Provide the key from your supervisor to initialize.</p>
          <div className="pt-4">
            <Input 
              type="text"
              placeholder="ENTER DAILY ACCESS KEY"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-16 text-center text-2xl font-black tracking-[0.2em] bg-white/5 border-white/10 rounded-2xl text-primary"
              onKeyDown={(e) => e.key === 'Enter' && onVerify()}
            />
          </div>
        </div>
      </div>
      <Button 
        onClick={onVerify}
        disabled={!password.trim()}
        className="w-full h-20 rounded-full text-xl font-black bg-primary uppercase tracking-tighter shadow-2xl"
      >
        Authenticate Node <ShieldCheck className="w-6 h-6 ml-2" />
      </Button>
    </div>
  );
}
