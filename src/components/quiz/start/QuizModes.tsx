
/**
 * QuizModes.tsx
 * 
 * Purpose: Final step before assessment start to select the protocol mode.
 * Used by: src/components/quiz/QuizStart.tsx
 * Props:
 *   - selectedMode: QuizMode — training/test/race
 *   - setSelectedMode: (mode: QuizMode) => void — dispatcher
 *   - onStart: (mode: QuizMode) => void — trigger mission
 */

import React from 'react';
import { Button } from "@/components/ui/button";
import { Gamepad2, Target, Flame, Play } from 'lucide-react';
import { QuizMode } from '@/types/quiz';
import { cn } from "@/lib/utils";

interface QuizModesProps {
  selectedMode: QuizMode;
  setSelectedMode: (mode: QuizMode) => void;
  onStart: (mode: QuizMode) => void;
}

export function QuizModes({ selectedMode, setSelectedMode, onStart }: QuizModesProps) {
  const modes = [
    { id: 'training' as QuizMode, title: 'Practice', icon: Gamepad2, desc: 'Fixed sequence, take your time', color: 'bg-green-500', text: 'text-green-600' },
    { id: 'test' as QuizMode, title: 'Test', icon: Target, desc: 'Timed, shuffled, results at the end', color: 'bg-primary', text: 'text-primary' },
    { id: 'race' as QuizMode, title: 'Race', icon: Flame, desc: 'Speed & accuracy, one attempt', color: 'bg-orange-500', text: 'text-orange-600' }
  ];

  const current = modes.find(m => m.id === selectedMode);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-slate-100/50 p-2 rounded-full flex items-center justify-between border">
        {modes.map((m) => (
          <button
            key={m.id}
            onClick={() => setSelectedMode(m.id)}
            className={cn(
              "flex-1 flex items-center justify-center gap-3 py-4 rounded-full transition-all",
              selectedMode === m.id ? `${m.color} text-white shadow-xl` : "text-slate-400 hover:bg-slate-200"
            )}
          >
            <m.icon className="w-5 h-5" />
            <span className="text-sm font-black uppercase">{m.title}</span>
          </button>
        ))}
      </div>
      <div className="text-center min-h-[30px]"><p className={cn("text-lg font-bold italic", current?.text)}>{current?.desc}</p></div>
      <Button onClick={() => onStart(selectedMode)} className={cn("w-full h-20 rounded-full font-black text-2xl text-white uppercase tracking-tighter shadow-2xl", current?.color)}>
        Start Mission <Play className="w-6 h-6 ml-3 fill-current" />
      </Button>
    </div>
  );
}
