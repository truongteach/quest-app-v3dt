
"use client";

import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function TextField({ correct }: { correct: string }) {
  return (
    <div className="space-y-4 p-8 bg-slate-50 rounded-[2rem] border">
      <Label className="text-[10px] font-black uppercase text-slate-400">Target Answer</Label>
      <Input name="correct_answer" defaultValue={correct} placeholder="Exact correct response..." className="h-14 rounded-xl bg-white font-bold" />
    </div>
  );
}
