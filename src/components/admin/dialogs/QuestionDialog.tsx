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
  { value: 'single_choice', label: 'Single Choice', icon: CheckCircle2, desc: 'One correct' },
  { value: 'multiple_choice', label: 'Multiple Choice', icon: Layers, desc: 'Select many' },
  { value: 'true_false', label: 'True/False', icon: CheckCircle2, desc: 'Binary' },
  { value: 'multiple_true_false', label: 'Multi T/F', icon: ListOrdered, desc: 'List of binary' },
  { value: 'matrix_choice', label: 'Matrix', icon: Grid, desc: 'Grid selector' },
  { value: 'short_text', label: 'Short Text', icon: Type, desc: 'Open ended' },
  { value: 'dropdown', label: 'Dropdown', icon: ListOrdered, desc: 'List select' },
  { value: 'ordering', label: 'Ordering', icon: ListOrdered, desc: 'Sequence' },
  { value: 'matching', icon: Link2, label: 'Matching', desc: 'Connect pairs' },
  { value: 'hotspot', icon: ImageIcon, label: 'Hotspot', desc: 'Visual click' },
  { value: 'rating', icon: Star, label: 'Rating', desc: 'Sat. scale' },
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
        
        // Options and Correct Answers are often comma-separated strings from the Sheet
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
      finalCorrect = filteredOptions.join(', '); // The order they were entered is correct
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

  const hotspotZoneCount = React.useMemo(() => {
    try {
      const parsed = JSON.parse(metadata || "[]");
      return Array.isArray(parsed) ? parsed.length : 0;
    } catch (e) { return 0; }
  }, [metadata]);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[850px] rounded-[3rem] max-h-[92vh] overflow-hidden p-0 border-none shadow-2xl bg-white flex flex-col">
          <div className="bg-slate-900 p-10 text-white shrink-0 relative">
            <div className="absolute top-0 right-0 p-8 opacity-5"><Code2 className="w-32 h-32" /></div>
            <div className="flex items-center gap-4">
              <div className="bg-primary p-3 rounded-2xl shadow-xl rotate-3"><HelpCircle className="w-6 h-6 text-white" /></div>
              <div>
                <DialogTitle className="text-3xl font-black uppercase tracking-tight">{editingItem ? 'Edit Protocol' : 'Inject Protocol'}</DialogTitle>
                <DialogDescription className="text-white/40 font-bold uppercase tracking-widest text-[10px]">Registry: {selectedTestId}</DialogDescription>
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-10 space-y-10 scrollbar-hide">
            <div className="space-y-4">
              <Label className="font-black text-[10px] uppercase tracking-widest text-slate-400 ml-1">Logic Module Type</Label>
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
                    <input type="radio" name="question_type" value={type.value} checked={selectedType === type.value} readOnly className="hidden" />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-8">
              <div className="space-y-2">
                <Label className="font-black text-[10px] uppercase tracking-widest text-slate-400 ml-1">Core Intelligence Prompt</Label>
                <Textarea name="question_text" defaultValue={editingItem?.question_text} required className="rounded-[1.5rem] min-h-[100px] text-lg p-6 bg-slate-50 border-none ring-1 ring-slate-100 focus:ring-primary/40" placeholder="Describe the task or question..." />
              </div>

              {selectedType === 'short_text' && (
                <div className="space-y-4 p-8 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
                  <Label className="font-black text-[10px] uppercase tracking-widest text-slate-400">Target Literal (Correct Answer)</Label>
                  <Input 
                    name="correct_answer" 
                    defaultValue={editingItem?.correct_answer} 
                    placeholder="Enter the exact required response..." 
                    className="h-14 rounded-xl bg-white font-bold text-lg"
                  />
                </div>
              )}

              {selectedType === 'hotspot' && (
                <div className="space-y-6 p-8 bg-slate-900 rounded-[2.5rem] text-white overflow-hidden relative">
                  <ImageIcon className="absolute -bottom-4 -right-4 w-32 h-32 text-white/5 rotate-12" />
                  <div className="relative z-10 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/20 rounded-lg"><MapPin className="w-4 h-4 text-primary" /></div>
                      <Label className="font-black text-[10px] uppercase tracking-widest text-slate-400">Visual Asset Registry</Label>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-[9px] font-bold text-slate-500 uppercase ml-1">Image Reference URL</Label>
                      <Input 
                        value={imageUrl} 
                        onChange={(e) => setImageUrl(e.target.value)} 
                        placeholder="https://images.unsplash.com/..." 
                        className="bg-white/5 border-none ring-1 ring-white/10 h-12 rounded-xl text-xs font-mono"
                      />
                    </div>

                    <div className="pt-4 flex items-center justify-between gap-4">
                      <Button 
                        type="button"
                        onClick={() => setMapperOpen(true)}
                        disabled={!imageUrl}
                        className="flex-1 h-14 rounded-xl bg-primary font-black uppercase text-xs tracking-widest gap-2 shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform"
                      >
                        <Target className="w-4 h-4" />
                        Launch Spatial Mapper
                      </Button>
                      <div className="px-6 h-14 bg-white/5 rounded-xl flex flex-col justify-center items-center ring-1 ring-white/10 shrink-0">
                        <span className="text-[10px] font-black text-slate-500 uppercase">Zones</span>
                        <span className="text-lg font-black text-primary leading-none">{hotspotZoneCount}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {(['single_choice', 'multiple_choice', 'dropdown', 'matrix_choice', 'ordering'].includes(selectedType)) && (
                <div className="space-y-4 p-8 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Label className="font-black text-[10px] uppercase tracking-widest text-slate-400">
                        {selectedType === 'ordering' ? 'Sequence Items' : 'Columns / Options'}
                      </Label>
                      {['single_choice', 'multiple_choice', 'dropdown'].includes(selectedType) && (
                        <span className="text-[9px] bg-primary text-white px-2 py-0.5 rounded-full font-black uppercase">Mark Correct</span>
                      )}
                    </div>
                    <Button type="button" size="sm" onClick={() => setOptionsList([...optionsList, `Item ${optionsList.length + 1}`])} className="rounded-full h-8 px-4 font-bold shadow-sm bg-slate-900 text-white"><Plus className="w-3 h-3 mr-2" /> Add</Button>
                  </div>
                  <div className="space-y-2">
                    {optionsList.map((opt, i) => (
                      <div key={i} className="flex gap-2 items-center">
                        {['single_choice', 'multiple_choice', 'dropdown'].includes(selectedType) && (
                          <div className="shrink-0 flex items-center justify-center w-10">
                            {selectedType === 'multiple_choice' ? (
                              <Checkbox 
                                checked={correctAnswers.includes(opt)} 
                                onCheckedChange={() => toggleCorrect(opt)}
                                className="w-5 h-5 rounded-md"
                              />
                            ) : (
                              <button 
                                type="button"
                                onClick={() => toggleCorrect(opt)}
                                className={cn(
                                  "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                                  correctAnswers.includes(opt) ? "border-primary bg-primary" : "border-slate-300"
                                )}
                              >
                                {correctAnswers.includes(opt) && <div className="w-2 h-2 bg-white rounded-full" />}
                              </button>
                            )}
                          </div>
                        )}
                        <Input value={opt} onChange={(e) => { const n = [...optionsList]; n[i] = e.target.value; setOptionsList(n); }} className="rounded-xl h-12 bg-white flex-1" placeholder={selectedType === 'ordering' ? "Sequence step..." : "Option text..."} />
                        <Button type="button" variant="ghost" size="icon" onClick={() => {
                          const newOptions = optionsList.filter((_, idx) => idx !== i);
                          setOptionsList(newOptions);
                          setCorrectAnswers(correctAnswers.filter(c => c !== opt));
                        }} className="h-12 w-12 text-destructive"><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    ))}
                  </div>
                  {selectedType === 'ordering' && (
                    <div className="flex items-center gap-2 p-4 bg-primary/5 rounded-xl text-primary border border-primary/10">
                      <AlertCircle className="w-4 h-4" />
                      <p className="text-[10px] font-black uppercase tracking-widest">Note: Items in this list are assumed to be in their correct final order.</p>
                    </div>
                  )}
                </div>
              )}

              {(['multiple_true_false', 'matrix_choice'].includes(selectedType)) && (
                <div className="space-y-4 p-8 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
                  <div className="flex items-center justify-between">
                    <Label className="font-black text-[10px] uppercase tracking-widest text-slate-400">Rows / Statements (Each needs a correct value)</Label>
                    <Button type="button" size="sm" onClick={() => { setMatrixRows([...matrixRows, `Row ${matrixRows.length + 1}`]); setCorrectAnswers([...correctAnswers, '']); }} className="rounded-full h-8 px-4 font-bold shadow-sm bg-slate-900 text-white"><Plus className="w-3 h-3 mr-2" /> Add Row</Button>
                  </div>
                  <div className="space-y-3">
                    {matrixRows.map((row, i) => (
                      <div key={i} className="flex gap-3 items-center">
                        <Input value={row} onChange={(e) => { const n = [...matrixRows]; n[i] = e.target.value; setMatrixRows(n); }} className="rounded-xl h-12 bg-white flex-1" />
                        <div className="w-48 shrink-0">
                          {selectedType === 'matrix_choice' ? (
                            <select 
                              value={correctAnswers[i] || ''} 
                              onChange={(e) => { const n = [...correctAnswers]; n[i] = e.target.value; setCorrectAnswers(n); }} 
                              className="w-full h-12 px-4 rounded-xl border-none ring-1 ring-slate-200 bg-white text-[10px] font-black uppercase tracking-widest focus:ring-primary/40"
                            >
                              <option value="">Correct Logic</option>
                              {optionsList.map(o => <option key={o} value={o}>{o}</option>)}
                            </select>
                          ) : (
                            <div className="flex bg-white rounded-xl ring-1 ring-slate-200 p-1">
                              {['True', 'False'].map((tf) => (
                                <button
                                  key={tf}
                                  type="button"
                                  onClick={() => { const n = [...correctAnswers]; n[i] = tf; setCorrectAnswers(n); }}
                                  className={cn(
                                    "flex-1 py-2 rounded-lg text-[9px] font-black uppercase transition-all",
                                    correctAnswers[i] === tf ? "bg-primary text-white shadow-sm" : "text-slate-400 hover:bg-slate-50"
                                  )}
                                >
                                  {tf}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        <Button type="button" variant="ghost" onClick={() => { setMatrixRows(matrixRows.filter((_, idx) => idx !== i)); setCorrectAnswers(correctAnswers.filter((_, idx) => idx !== i)); }} className="h-12 w-12 text-destructive"><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedType === 'matching' && (
                <div className="space-y-4 p-8 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
                  <div className="flex items-center justify-between"><Label className="font-black text-[10px] uppercase tracking-widest text-slate-400">Pair Configuration (Correct Mappings)</Label><Button type="button" size="sm" onClick={() => setMatchingPairs([...matchingPairs, { left: '', right: '' }])} className="rounded-full h-8 font-bold bg-slate-900 text-white"><Plus className="w-3 h-3 mr-2" /> New Pair</Button></div>
                  <div className="space-y-2">
                    {matchingPairs.map((pair, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <Input value={pair.left} onChange={(e) => { const n = [...matchingPairs]; n[idx].left = e.target.value; setMatchingPairs(n); }} placeholder="Prompt..." className="rounded-xl h-12 bg-white flex-1" />
                        <Link2 className="w-4 h-4 text-slate-300" />
                        <Input value={pair.right} onChange={(e) => { const n = [...matchingPairs]; n[idx].right = e.target.value; setMatchingPairs(n); }} placeholder="Target..." className="rounded-xl h-12 bg-white flex-1" />
                        <Button type="button" variant="ghost" onClick={() => setMatchingPairs(matchingPairs.filter((_, i) => i !== idx))} className="text-destructive h-12 w-12"><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedType === 'true_false' && (
                <div className="space-y-4 p-8 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
                  <Label className="font-black text-[10px] uppercase tracking-widest text-slate-400 ml-1">Success Protocol (Correct Answer)</Label>
                  <RadioGroup value={correctAnswers[0] || "True"} onValueChange={(val) => setCorrectAnswers([val])} className="flex gap-4">
                    {['True', 'False'].map((val) => (
                      <div key={val} className={cn("flex-1 flex items-center gap-4 p-6 rounded-2xl border-2 cursor-pointer transition-all", correctAnswers[0] === val ? "bg-white border-primary shadow-lg" : "bg-slate-100 border-transparent")} onClick={() => setCorrectAnswers([val])}>
                        <RadioGroupItem value={val} id={`tf-dlg-${val}`} className="w-5 h-5" />
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
                  <Label htmlFor="required" className="text-[10px] font-black uppercase tracking-widest text-slate-500 cursor-pointer">Required Step</Label>
                </div>
                <Button type="submit" className="rounded-full px-12 h-16 font-black text-xl shadow-2xl bg-primary hover:scale-105 transition-transform">
                  <Save className="w-5 h-5 mr-3" /> Commit Registry
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <HotspotMapperDialog 
        open={mapperOpen} 
        onOpenChange={setMapperOpen} 
        imageUrl={imageUrl} 
        initialData={metadata} 
        onSave={(data) => setMetadata(data)} 
      />
    </>
  );
}
