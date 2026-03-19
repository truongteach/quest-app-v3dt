"use client";

import React, { useState, useEffect } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Save, Code2 } from "lucide-react";
import { Question } from '@/types/quiz';

interface BulkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTestId: string;
  questions: Question[];
  onSave: (json: string) => void;
}

export function BulkDialog({ open, onOpenChange, selectedTestId, questions, onSave }: BulkDialogProps) {
  const [json, setJson] = useState("");

  useEffect(() => {
    if (open) setJson(JSON.stringify(questions, null, 2));
  }, [open, questions]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[850px] h-[85vh] flex flex-col rounded-[3rem] p-0 overflow-hidden border-none shadow-2xl bg-slate-900">
        <div className="bg-slate-950 p-10 text-white flex items-center justify-between border-b border-white/5">
          <div>
            <DialogTitle className="text-3xl font-black uppercase tracking-tight">Direct Intelligence Push</DialogTitle>
            <DialogDescription className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mt-1">Registry: {selectedTestId}</DialogDescription>
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => onOpenChange(false)} className="rounded-full text-white hover:bg-white/10 font-bold">Discard</Button>
            <Button onClick={() => onSave(json)} className="rounded-full bg-primary text-white font-black px-8 h-12 shadow-2xl shadow-primary/20 hover:scale-[1.05] transition-transform">
              <Save className="w-4 h-4 mr-2" /> Commit JSON
            </Button>
          </div>
        </div>
        <div className="flex-1 p-8 bg-slate-900">
          <textarea 
            className="w-full h-full font-mono text-xs p-10 bg-slate-950 text-blue-400 border border-white/5 rounded-[2rem] focus:outline-none focus:ring-2 focus:ring-primary/40 leading-relaxed resize-none scrollbar-hide" 
            value={json} 
            onChange={(e) => setJson(e.target.value)} 
            spellCheck={false}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}