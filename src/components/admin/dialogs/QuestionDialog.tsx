"use client";

import React, { useState, useEffect } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Save, 
  CheckCircle2, 
  Image as ImageIcon, 
  Layers, 
  ListOrdered, 
  Type, 
  Star, 
  Link2,
  Code2,
  Target,
  Grid,
  ChevronRight
} from "lucide-react";
import { QuestionType } from '@/types/quiz';
import { cn } from "@/lib/utils";
import { getRegistryValue, parseRegistryArray } from '@/lib/quiz-utils';
import { ChoiceFields } from './question-forms/ChoiceFields';
import { TextField } from './question-forms/TextField';
import { BooleanFields } from './question-forms/BooleanFields';
import { MatrixFields } from './question-forms/MatrixFields';
import { MatchingFields } from './question-forms/MatchingFields';
import { HotspotMapperDialog } from './HotspotMapperDialog';
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

interface QuestionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingItem: any;
  selectedTestId: string;
  onSave: (data: any, isRequired: boolean) => void;
}

const QUESTION_TYPES = [
  { value: 'single_choice', label: 'Single Choice', icon: CheckCircle2 },
  { value: 'multiple_choice', label: 'Multiple Choice', icon: Layers },
  { value: 'true_false', label: 'True/False', icon: CheckCircle2 },
  { value: 'multiple_true_false', label: 'Multiple T/F', icon: ListOrdered },
  { value: 'matrix_choice', label: 'Matrix Choice', icon: Grid },
  { value: 'short_text', label: 'Short Text', icon: Type },
  { value: 'dropdown', label: 'Dropdown', icon: ListOrdered },
  { value: 'ordering', label: 'Ordering', icon: ListOrdered },
  { value: 'matching', icon: Link2, label: 'Matching' },
  { value: 'hotspot', icon: ImageIcon, label: 'Hotspot' },
  { value: 'rating', icon: Star, label: 'Rating' },
];

export function QuestionDialog({ open, onOpenChange, editingItem, selectedTestId, onSave }: QuestionDialogProps) {
  const [selectedType, setSelectedType] = useState<QuestionType>('single_choice');
  const [questionText, setQuestionText] = useState('');
  const [isRequired, setIsRequired] = useState(false);
  const [optionsList, setOptionsList] = useState<string[]>([]);
  const [correctAnswers, setCorrectAnswers] = useState<string[]>([]);
  const [matchingPairs, setMatchingPairs] = useState<{left: string, right: string}[]>([]);
  const [matrixRows, setMatrixRows] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState('');
  const [metadata, setMetadata] = useState('');
  const [mapperOpen, setMapperOpen] = useState(false);
  
  // Dirty Tracking Protocol
  const [initialSnapshot, setInitialSnapshot] = useState<string | null>(null);
  const [showDiscardWarning, setShowDiscardWarning] = useState(false);

  useEffect(() => {
    if (open) {
      const qType = (getRegistryValue(editingItem, ['question_type']) || 'single_choice') as QuestionType;
      const qTextVal = getRegistryValue(editingItem, ['question_text']) || '';
      const isReqVal = String(getRegistryValue(editingItem, ['required'])).toUpperCase() === "TRUE";
      const opts = parseRegistryArray(getRegistryValue(editingItem, ['options']));
      const ans = parseRegistryArray(getRegistryValue(editingItem, ['correct_answer']));
      const rows = parseRegistryArray(getRegistryValue(editingItem, ['order_group']));
      const pairs = rows.map(p => { const [l, r] = p.split('|'); return { left: (l || "").trim(), right: (r || "").trim() }; });
      const img = getRegistryValue(editingItem, ['image_url']) || '';
      const meta = getRegistryValue(editingItem, ['metadata']) || '';

      setSelectedType(qType);
      setQuestionText(qTextVal);
      setIsRequired(isReqVal);
      setOptionsList(opts);
      setCorrectAnswers(ans);
      setMatrixRows(rows);
      setMatchingPairs(pairs);
      setImageUrl(img);
      setMetadata(meta);

      // Capture initial state for unsaved changes detection
      setInitialSnapshot(JSON.stringify({
        type: qType,
        text: qTextVal,
        required: isReqVal,
        options: opts,
        correct: ans,
        rows: rows,
        pairs: pairs,
        image: img,
        metadata: meta
      }));
    } else {
      setShowDiscardWarning(false);
    }
  }, [open, editingItem]);

  const currentSnapshot = JSON.stringify({
    type: selectedType,
    text: questionText,
    required: isRequired,
    options: optionsList,
    correct: correctAnswers,
    rows: matrixRows,
    pairs: matchingPairs,
    image: imageUrl,
    metadata: metadata
  });

  const isDirty = initialSnapshot !== null && initialSnapshot !== currentSnapshot;

  const handleDialogChange = (newOpen: boolean) => {
    if (!newOpen && isDirty) {
      setShowDiscardWarning(true);
    } else {
      onOpenChange(newOpen);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let finalOptions = optionsList;
    let finalCorrect = correctAnswers;
    let finalOrder = matrixRows;

    if (selectedType === 'matching') {
      const pairs = matchingPairs.map(p => `${p.left.trim()}|${p.right.trim()}`);
      finalOrder = pairs;
      finalCorrect = pairs;
    }
    
    onSave({
      question_text: questionText,
      id: editingItem?.id || `q_${Date.now()}`,
      options: JSON.stringify(finalOptions),
      correct_answer: JSON.stringify(finalCorrect),
      order_group: JSON.stringify(finalOrder),
      image_url: imageUrl,
      metadata: metadata,
      question_type: selectedType
    }, isRequired);
    
    // Bypass warning on successful submit
    setInitialSnapshot(null);
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleDialogChange}>
        <DialogContent className="sm:max-w-[85vw] h-[90vh] rounded-[3rem] overflow-hidden p-0 border-none shadow-2xl bg-white flex flex-row">
          <div className="w-[280px] bg-slate-50 border-r p-4 overflow-y-auto">
            {QUESTION_TYPES.map((type) => (
              <button 
                key={type.value} 
                type="button"
                onClick={() => setSelectedType(type.value as QuestionType)} 
                className={cn(
                  "w-full flex items-center gap-4 p-4 rounded-2xl transition-all mb-1", 
                  selectedType === type.value ? "bg-primary text-white shadow-xl" : "hover:bg-white text-slate-500"
                )}
              >
                <type.icon className="w-5 h-5" />
                <span className="text-xs font-black uppercase">{type.label}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex-1 flex flex-col bg-white">
            <div className="p-8 border-b flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Code2 className="w-5 h-5 text-primary" />
                <div><DialogTitle className="text-2xl font-black uppercase">Edit Step</DialogTitle></div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-10 space-y-10">
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase text-slate-400">Question Prompt</Label>
                <Textarea 
                  name="question_text" 
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  required 
                  className="rounded-2xl min-h-[100px] text-xl bg-slate-50 border-none ring-1 ring-slate-100" 
                />
              </div>

              <div className="p-8 bg-slate-50/50 rounded-[2.5rem] border-2 border-dashed space-y-4">
                <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="Image URL..." className="rounded-xl h-12 bg-white ring-1 ring-slate-200" />
                {selectedType === 'hotspot' && <Button type="button" onClick={() => setMapperOpen(true)} className="w-full h-12 bg-slate-900 text-white font-black uppercase text-[10px]"><Target className="w-4 h-4 mr-2" /> Open Mapper</Button>}
              </div>

              <div className="space-y-6">
                {['single_choice', 'multiple_choice', 'dropdown', 'ordering'].includes(selectedType) && <ChoiceFields type={selectedType} options={optionsList} setOptions={setOptionsList} correct={correctAnswers} setCorrect={setCorrectAnswers} />}
                {selectedType === 'short_text' && <TextField value={correctAnswers[0] || ""} onChange={(v) => setCorrectAnswers([v])} />}
                {['true_false', 'multiple_true_false'].includes(selectedType) && <BooleanFields type={selectedType} rows={matrixRows} setRows={setMatrixRows} correct={correctAnswers} setCorrect={setCorrectAnswers} />}
                {selectedType === 'matrix_choice' && <MatrixFields rows={matrixRows} setRows={setMatrixRows} cols={optionsList} setCols={setOptionsList} correct={correctAnswers} setCorrect={setCorrectAnswers} />}
                {selectedType === 'matching' && <MatchingFields pairs={matchingPairs} setPairs={setMatchingPairs} />}
              </div>
            </div>

            <div className="p-8 border-t flex items-center justify-between bg-white/80">
              <div className="flex items-center gap-4 px-6 py-3.5 bg-slate-50 rounded-2xl">
                <Checkbox 
                  id="required" 
                  checked={isRequired}
                  onCheckedChange={(checked) => setIsRequired(!!checked)}
                />
                <Label htmlFor="required" className="text-[10px] font-black uppercase tracking-widest">Required Step</Label>
              </div>
              <Button type="submit" className="rounded-full px-12 h-16 font-black text-lg bg-primary shadow-2xl"><Save className="w-5 h-5 mr-3" /> Commit Registry</Button>
            </div>
          </form>
        </DialogContent>
        <HotspotMapperDialog open={mapperOpen} onOpenChange={setMapperOpen} imageUrl={imageUrl} initialData={metadata} onSave={setMetadata} />
      </Dialog>

      <AlertDialog open={showDiscardWarning} onOpenChange={setShowDiscardWarning}>
        <AlertDialogContent className="rounded-[2.5rem] border-none shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-black uppercase tracking-tight">Unsaved Changes</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500 font-medium">
              You have made modifications to this assessment step. Are you sure you want to exit without committing to the registry?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6 flex flex-col sm:flex-row gap-3">
            <AlertDialogCancel asChild>
              <Button variant="ghost" className="rounded-full font-bold uppercase text-[10px] tracking-widest flex-1">Keep Editing</Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button 
                onClick={() => {
                  setInitialSnapshot(null);
                  onOpenChange(false);
                }} 
                className="rounded-full bg-destructive text-white font-black uppercase text-[10px] tracking-widest px-8 flex-1"
              >
                Discard Changes
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
