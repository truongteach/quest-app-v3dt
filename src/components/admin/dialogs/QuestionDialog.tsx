"use client";

import React, { useState, useEffect } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Save, 
  HelpCircle, 
  CheckCircle2, 
  Image as ImageIcon, 
  Layers, 
  ListOrdered, 
  Type, 
  Star, 
  Plus, 
  Trash2,
  Check,
  Circle,
  Link2,
  Code2,
  AlertCircle,
  Target,
  Grid,
  MapPin,
  CheckSquare,
  Dot
} from "lucide-react";
import { Question, QuestionType } from '@/types/quiz';
import { cn } from "@/lib/utils";
import { HotspotMapperDialog } from './HotspotMapperDialog';

interface QuestionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingItem: any;
  selectedTestId: string;
  onSave: (data: any, isRequired: boolean) => void;
}

const QUESTION_TYPES = [
  { value: 'single_choice', label: 'One Answer', icon: CheckCircle2, desc: 'Multiple choice (1 correct)' },
  { value: 'multiple_choice', label: 'Many Answers', icon: Layers, desc: 'Multiple choice (select all)' },
  { value: 'true_false', label: 'True/False', icon: CheckCircle2, desc: 'Yes or No' },
  { value: 'multiple_true_false', label: 'Multi T/F', icon: ListOrdered, desc: 'List of T/F' },
  { value: 'matrix_choice', label: 'Grid Select', icon: Grid, desc: 'Matrix selection' },
  { value: 'short_text', label: 'Text Input', icon: Type, desc: 'Student types answer' },
  { value: 'dropdown', label: 'Dropdown', icon: ListOrdered, desc: 'Pick from list' },
  { value: 'ordering', label: 'Sorting', icon: ListOrdered, desc: 'Put in order' },
  { value: 'matching', icon: Link2, label: 'Matching', desc: 'Match pairs' },
  { value: 'hotspot', icon: ImageIcon, label: 'Point Map', desc: 'Click on image' },
  { value: 'rating', icon: Star, label: 'Rating', desc: '1 to 5 stars' },
];

export function QuestionDialog({ open, onOpenChange, editingItem, selectedTestId, onSave }: QuestionDialogProps) {
  const [selectedType, setSelectedType] = useState<QuestionType>('single_choice');
  const [optionsList, setOptionsList] = useState<string[]>([]);
  const [correctAnswers, setCorrectAnswers] = useState<string[]>([]);
  const [matchingPairs, setMatchingPairs] = useState<{left: string, right: string}[]>([]);
  const [matrixRows, setMatrixRows] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState('');
  const [metadata, setMetadata] = useState('');
  const [mapperOpen, setMapperOpen] = useState(false);

  useEffect(() => {
    if (open) {
      if (editingItem) {
        const qType = editingItem.question_type as QuestionType;
        setSelectedType(qType);
        
        const rawOptions = String(editingItem.options || "");
        const rawCorrect = String(editingItem.correct_answer || "");
        const rawOrderGroup = String(editingItem.order_group || "");

        if (qType === 'ordering') {
          setOptionsList(rawOrderGroup ? rawOrderGroup.split(',').map(o => o.trim()) : []);
        } else {
          setOptionsList(rawOptions ? rawOptions.split(',').map(o => o.trim()) : []);
        }
        
        setCorrectAnswers(rawCorrect ? rawCorrect.split(',').map(c => c.trim()) : []);
        setImageUrl(String(editingItem.image_url || ''));
        setMetadata(String(editingItem.metadata || ''));
        
        if (qType === 'multiple_true_false' || qType === 'matrix_choice') {
          setMatrixRows(rawOrderGroup ? rawOrderGroup.split(',').map(r => r.trim()) : []);
        }

        if (qType === 'matching') {
          const pairs = rawOrderGroup?.split(',').map(p => {
            const [l, r] = p.split('|');
            return { left: (l || "").trim(), right: (r || "").trim() };
          }) || [{ left: '', right: '' }];
          setMatchingPairs(pairs);
        }
      } else {
        setSelectedType('single_choice');
        setOptionsList(['Option 1', 'Option 2']);
        setCorrectAnswers([]);
        setMatchingPairs([{ left: '', right: '' }]);
        setMatrixRows(['Row 1']);
        setImageUrl('');
        setMetadata('');
      }
    }
  }, [open, editingItem]);

  const toggleCorrect = (val: string) => {
    if (selectedType === 'multiple_choice') {
      setCorrectAnswers(prev => 
        prev.includes(val) ? prev.filter(c => c !== val) : [...prev, val]
      );
    } else {
      setCorrectAnswers([val]);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    let finalOptions = "";
    let finalCorrect = "";
    let finalOrderGroup = "";

    const filteredOptions = optionsList.filter(o => o.trim());

    if (['single_choice', 'multiple_choice', 'dropdown'].includes(selectedType)) {
      finalOptions = filteredOptions.join(', ');
      finalCorrect = correctAnswers.filter(c => c.trim()).join(', ');
    } else if (selectedType === 'true_false') {
      finalOptions = "True, False";
      finalCorrect = correctAnswers[0] || "True";
    } else if (selectedType === 'ordering') {
      finalOrderGroup = filteredOptions.join(', ');
      finalCorrect = filteredOptions.join(', ');
    } else if (selectedType === 'matching') {
      const validPairs = matchingPairs.filter(p => p.left.trim() && p.right.trim());
      const pairsStr = validPairs.map(p => `${p.left.trim()}|${p.right.trim()}`).join(', ');
      finalOrderGroup = pairsStr;
      finalCorrect = pairsStr;
    } else if (selectedType === 'multiple_true_false' || selectedType === 'matrix_choice') {
      finalOrderGroup = matrixRows.filter(r => r.trim()).join(', ');
      finalOptions = filteredOptions.join(', ');
      finalCorrect = correctAnswers.filter(c => c.trim()).join(', ');
    } else if (selectedType === 'short_text') {
      finalCorrect = String(data.correct_answer || "");
    }

    onSave({
      ...data,
      id: editingItem?.id || `q_${Date.now()}`,
      options: finalOptions,
      correct_answer: finalCorrect,
      order_group: finalOrderGroup,
      image_url: imageUrl,
      metadata: metadata,
      question_type: selectedType
    }, formData.get('required') === 'on');

    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[850px] rounded-[3rem] max-h-[92vh] overflow-hidden p-0 border-none shadow-2xl bg-white flex flex-col">
          <div className="bg-slate-900 p-10 text-white shrink-0 relative">
            <div className="absolute top-0 right-0 p-8 opacity-5"><Code2 className="w-32 h-32" /></div>
            <div className="flex items-center gap-4">
              <div className="bg-primary p-3 rounded-2xl shadow-xl rotate-3"><HelpCircle className="w-6 h-6 text-white" /></div>
              <div>
                <DialogTitle className="text-3xl font-black uppercase tracking-tight">{editingItem ? 'Edit Question' : 'Add Question'}</DialogTitle>
                <DialogDescription className="text-white/40 font-bold uppercase tracking-widest text-[10px]">Test ID: {selectedTestId}</DialogDescription>
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-10 space-y-10 scrollbar-hide">
            <div className="space-y-4">
              <Label className="font-black text-[10px] uppercase tracking-widest text-slate-400 ml-1">Choose Question Type</Label>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
                {QUESTION_TYPES.map((type) => (
                  <button 
                    key={type.value} 
                    type="button" 
                    onClick={() => setSelectedType(type.value as QuestionType)} 
                    className={cn(
                      "flex flex-col items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all group aspect-square", 
                      selectedType === type.value ? "bg-primary/5 border-primary" : "bg-slate-50 border-slate-100 hover:border-slate-300"
                    )}
                  >
                    <type.icon className={cn("w-5 h-5", selectedType === type.value ? "text-primary" : "text-slate-400")} />
                    <span className={cn("text-[8px] font-black uppercase tracking-tight text-center leading-tight", selectedType === type.value ? "text-primary" : "text-slate-500")}>{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-8">
              <div className="space-y-2">
                <Label className="font-black text-[10px] uppercase tracking-widest text-slate-400 ml-1">Write your question</Label>
                <Textarea name="question_text" defaultValue={editingItem?.question_text} required className="rounded-[1.5rem] min-h-[100px] text-lg p-6 bg-slate-50 border-none ring-1 ring-slate-100 focus:ring-primary/40" placeholder="Type the question here..." />
              </div>

              {selectedType === 'short_text' && (
                <div className="space-y-4 p-8 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
                  <Label className="font-black text-[10px] uppercase tracking-widest text-slate-400">Correct Answer (Text)</Label>
                  <Input name="correct_answer" defaultValue={editingItem?.correct_answer} placeholder="Type the exact correct answer..." className="h-14 rounded-xl bg-white font-bold text-lg" />
                </div>
              )}

              {selectedType === 'hotspot' && (
                <div className="space-y-6 p-8 bg-slate-900 rounded-[2.5rem] text-white overflow-hidden relative">
                  <ImageIcon className="absolute -bottom-4 -right-4 w-32 h-32 text-white/5 rotate-12" />
                  <div className="relative z-10 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/20 rounded-lg"><MapPin className="w-4 h-4 text-primary" /></div>
                      <Label className="font-black text-[10px] uppercase tracking-widest text-slate-400">Image Setup</Label>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-[9px] font-bold text-slate-500 uppercase ml-1">Image URL</Label>
                      <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." className="bg-white/5 border-none ring-1 ring-white/10 h-12 rounded-xl text-xs font-mono" />
                    </div>

                    <Button type="button" onClick={() => setMapperOpen(true)} disabled={!imageUrl} className="w-full h-14 rounded-xl bg-primary font-black uppercase text-xs tracking-widest gap-2">
                      <Target className="w-4 h-4" /> Edit Points on Image
                    </Button>
                  </div>
                </div>
              )}

              {(['single_choice', 'multiple_choice', 'dropdown', 'matrix_choice', 'ordering'].includes(selectedType)) && (
                <div className="space-y-4 p-8 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
                  <div className="flex items-center justify-between">
                    <Label className="font-black text-[10px] uppercase tracking-widest text-slate-400">Answer Options</Label>
                    <Button type="button" size="sm" onClick={() => setOptionsList([...optionsList, `Option ${optionsList.length + 1}`])} className="rounded-full h-8 px-4 font-bold shadow-sm bg-slate-900 text-white"><Plus className="w-3 h-3 mr-2" /> Add</Button>
                  </div>
                  <div className="space-y-2">
                    {optionsList.map((opt, i) => (
                      <div key={i} className="flex gap-2 items-center">
                        {['single_choice', 'multiple_choice', 'dropdown'].includes(selectedType) && (
                          <div className="shrink-0 flex items-center justify-center w-10">
                            {selectedType === 'multiple_choice' ? (
                              <Checkbox checked={correctAnswers.includes(opt)} onCheckedChange={() => toggleCorrect(opt)} />
                            ) : (
                              <button type="button" onClick={() => toggleCorrect(opt)} className={cn("w-5 h-5 rounded-full border-2", correctAnswers.includes(opt) ? "bg-primary" : "border-slate-300")} />
                            )}
                          </div>
                        )}
                        <Input value={opt} onChange={(e) => { const n = [...optionsList]; n[i] = e.target.value; setOptionsList(n); }} className="rounded-xl h-12 bg-white flex-1" />
                        <Button type="button" variant="ghost" size="icon" onClick={() => setOptionsList(optionsList.filter((_, idx) => idx !== i))} className="h-12 w-12 text-destructive"><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedType === 'matching' && (
                <div className="space-y-4 p-8 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
                  <div className="flex items-center justify-between"><Label className="font-black text-[10px] uppercase tracking-widest text-slate-400">Match Pairs</Label><Button type="button" size="sm" onClick={() => setMatchingPairs([...matchingPairs, { left: '', right: '' }])} className="rounded-full h-8 font-bold bg-slate-900 text-white"><Plus className="w-3 h-3 mr-2" /> New Pair</Button></div>
                  <div className="space-y-2">
                    {matchingPairs.map((pair, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <Input value={pair.left} onChange={(e) => { const n = [...matchingPairs]; n[idx].left = e.target.value; setMatchingPairs(n); }} placeholder="Left..." className="rounded-xl h-12 bg-white flex-1" />
                        <Link2 className="w-4 h-4 text-slate-300" />
                        <Input value={pair.right} onChange={(e) => { const n = [...matchingPairs]; n[idx].right = e.target.value; setMatchingPairs(n); }} placeholder="Right..." className="rounded-xl h-12 bg-white flex-1" />
                        <Button type="button" variant="ghost" onClick={() => setMatchingPairs(matchingPairs.filter((_, i) => i !== idx))} className="text-destructive h-12 w-12"><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedType === 'true_false' && (
                <div className="space-y-4 p-8 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
                  <Label className="font-black text-[10px] uppercase tracking-widest text-slate-400 ml-1">Correct Answer</Label>
                  <RadioGroup value={correctAnswers[0] || "True"} onValueChange={(val) => setCorrectAnswers([val])} className="flex gap-4">
                    {['True', 'False'].map((val) => (
                      <div key={val} className={cn("flex-1 flex items-center gap-4 p-6 rounded-2xl border-2 cursor-pointer transition-all", correctAnswers[0] === val ? "bg-white border-primary" : "bg-slate-100 border-transparent")} onClick={() => setCorrectAnswers([val])}>
                        <RadioGroupItem value={val} id={`tf-dlg-${val}`} />
                        <Label htmlFor={`tf-dlg-${val}`} className="font-black uppercase tracking-widest text-sm cursor-pointer">{val}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )}
            </div>

            <DialogFooter className="pt-10 border-t border-slate-100 sticky bottom-0 bg-white/90 backdrop-blur-xl pb-4">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3 px-6 py-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <Checkbox id="required" name="required" defaultChecked={editingItem?.required === "TRUE" || editingItem?.required === true} />
                  <Label htmlFor="required" className="text-[10px] font-black uppercase tracking-widest text-slate-500 cursor-pointer">Required</Label>
                </div>
                <Button type="submit" className="rounded-full px-12 h-16 font-black text-xl shadow-2xl bg-primary">
                  <Save className="w-5 h-5 mr-3" /> Save Question
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <HotspotMapperDialog open={mapperOpen} onOpenChange={setMapperOpen} imageUrl={imageUrl} initialData={metadata} onSave={(data) => setMetadata(data)} />
    </>
  );
}