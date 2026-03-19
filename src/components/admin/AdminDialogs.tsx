
"use client";

import React, { useState, useEffect } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  Circle
} from "lucide-react";
import { Question, QuestionType } from '@/types/quiz';
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface AdminDialogsProps {
  dialogs: {
    test: boolean;
    user: boolean;
    question: boolean;
    bulk: boolean;
  };
  setDialogs: (dialogs: any) => void;
  editingItem: any;
  selectedTestId: string;
  questions: Question[];
  onSaveTest: (data: any) => void;
  onSaveUser: (data: any) => void;
  onSaveQuestion: (data: any, isRequired: boolean) => void;
  onSaveBulk: (json: string) => void;
}

export function AdminDialogs({ 
  dialogs, 
  setDialogs, 
  editingItem, 
  selectedTestId, 
  questions,
  onSaveTest, 
  onSaveUser, 
  onSaveQuestion, 
  onSaveBulk 
}: AdminDialogsProps) {
  const [questionJson, setQuestionJson] = useState("");
  const [selectedType, setSelectedType] = useState<QuestionType>('single_choice');
  
  // Dynamic Options State
  const [optionsList, setOptionsList] = useState<string[]>([]);
  const [correctAnswers, setCorrectAnswers] = useState<string[]>([]);

  useEffect(() => {
    if (dialogs.bulk) {
      setQuestionJson(JSON.stringify(questions, null, 2));
    }
  }, [dialogs.bulk, questions]);

  useEffect(() => {
    if (dialogs.question) {
      if (editingItem) {
        setSelectedType(editingItem.question_type as QuestionType);
        const opts = editingItem.options ? editingItem.options.split(',').map((o: string) => o.trim()) : [];
        setOptionsList(opts);
        const corrects = editingItem.correct_answer ? editingItem.correct_answer.split(',').map((c: string) => c.trim()) : [];
        setCorrectAnswers(corrects);
      } else {
        setSelectedType('single_choice');
        setOptionsList(['Option 1', 'Option 2']);
        setCorrectAnswers([]);
      }
    }
  }, [dialogs.question, editingItem]);

  const addOption = () => setOptionsList([...optionsList, `Option ${optionsList.length + 1}`]);
  
  const removeOption = (index: number) => {
    const optionValue = optionsList[index];
    const newList = optionsList.filter((_, i) => i !== index);
    setOptionsList(newList);
    setCorrectAnswers(correctAnswers.filter(c => c !== optionValue));
  };

  const updateOptionValue = (index: number, value: string) => {
    const oldVal = optionsList[index];
    const newList = [...optionsList];
    newList[index] = value;
    setOptionsList(newList);
    
    // Update correct answers if this was selected
    if (correctAnswers.includes(oldVal)) {
      setCorrectAnswers(correctAnswers.map(c => c === oldVal ? value : c));
    }
  };

  const toggleCorrect = (value: string) => {
    if (selectedType === 'multiple_choice') {
      if (correctAnswers.includes(value)) {
        setCorrectAnswers(correctAnswers.filter(c => c !== value));
      } else {
        setCorrectAnswers([...correctAnswers, value]);
      }
    } else {
      setCorrectAnswers([value]);
    }
  };

  const QUESTION_TYPES = [
    { value: 'single_choice', label: 'Single Choice', icon: CheckCircle2, desc: 'One correct answer from a list.' },
    { value: 'multiple_choice', label: 'Multiple Choice', icon: Layers, desc: 'Multiple correct answers allowed.' },
    { value: 'true_false', label: 'True/False', icon: CheckCircle2, desc: 'Binary choice interaction.' },
    { value: 'short_text', label: 'Short Text', icon: Type, desc: 'Free text entry for answers.' },
    { value: 'dropdown', label: 'Dropdown', icon: ListOrdered, desc: 'Select one from a collapsed menu.' },
    { value: 'ordering', label: 'Ordering', icon: ListOrdered, desc: 'Drag items into the correct sequence.' },
    { value: 'matching', icon: Layers, label: 'Matching', desc: 'Associate items from two columns.' },
    { value: 'hotspot', icon: ImageIcon, label: 'Hotspot', desc: 'Select a location on an image.' },
    { value: 'rating', icon: Star, label: 'Rating', desc: 'Star-based satisfaction scale.' },
  ];

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    // Prepare options and correct answer based on dynamic state
    let finalOptions = data.options as string;
    let finalCorrect = data.correct_answer as string;

    if (['single_choice', 'multiple_choice', 'dropdown'].includes(selectedType)) {
      finalOptions = optionsList.join(', ');
      finalCorrect = correctAnswers.join(', ');
    } else if (selectedType === 'true_false') {
      finalOptions = "True, False";
      finalCorrect = correctAnswers[0] || "";
    }

    const payload = {
      ...data,
      options: finalOptions,
      correct_answer: finalCorrect,
    };

    onSaveQuestion(payload, formData.get('required') === 'on');
    setDialogs({...dialogs, question: false});
  };

  return (
    <>
      {/* Test Dialog */}
      <Dialog open={dialogs.test} onOpenChange={(val) => setDialogs({...dialogs, test: val})}>
        <DialogContent className="sm:max-w-[450px] rounded-[2rem] p-0 overflow-hidden border-none shadow-2xl bg-white">
          <div className="bg-primary p-8 text-white">
            <DialogTitle className="text-2xl font-black">{editingItem ? 'Edit Test' : 'New Assessment'}</DialogTitle>
            <DialogDescription className="text-white/80 font-medium">Define the core metadata for your quiz.</DialogDescription>
          </div>
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            onSaveTest(Object.fromEntries(formData.entries()));
            setDialogs({...dialogs, test: false});
          }} className="p-8 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-bold">Test ID</Label>
                <Input name="id" defaultValue={editingItem?.id} placeholder="Auto-generated" disabled={!!editingItem} className="rounded-xl h-11" />
              </div>
              <div className="space-y-2"><Label className="font-bold">Category</Label><Input name="category" defaultValue={editingItem?.category} className="rounded-xl h-11" /></div>
            </div>
            <div className="space-y-2"><Label className="font-bold">Title</Label><Input name="title" defaultValue={editingItem?.title} required className="rounded-xl h-11" /></div>
            <div className="space-y-2"><Label className="font-bold">Description</Label><Textarea name="description" defaultValue={editingItem?.description} className="rounded-xl min-h-[80px]" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label className="font-bold">Difficulty</Label><Input name="difficulty" defaultValue={editingItem?.difficulty} className="rounded-xl h-11" /></div>
              <div className="space-y-2"><Label className="font-bold">Duration</Label><Input name="duration" defaultValue={editingItem?.duration} placeholder="e.g. 15m" className="rounded-xl h-11" /></div>
            </div>
            <div className="space-y-2"><Label className="font-bold">Image URL</Label><Input name="image_url" defaultValue={editingItem?.image_url} className="rounded-xl h-11" /></div>
            <DialogFooter className="pt-4"><Button type="submit" className="rounded-full w-full h-12 font-black text-lg shadow-xl">Save Assessment</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Question Dialog */}
      <Dialog open={dialogs.question} onOpenChange={(val) => setDialogs({...dialogs, question: val})}>
        <DialogContent className="sm:max-w-[700px] rounded-[2.5rem] max-h-[90vh] overflow-hidden p-0 border-none shadow-2xl bg-white flex flex-col">
          <div className="bg-slate-900 p-8 text-white shrink-0">
            <div className="flex items-center gap-3 mb-1">
              <div className="bg-primary p-2 rounded-lg">
                <HelpCircle className="w-5 h-5" />
              </div>
              <DialogTitle className="text-2xl font-black">{editingItem ? 'Edit Question' : 'Add Question'}</DialogTitle>
            </div>
            <DialogDescription className="text-white/60">Configuring content for: <span className="text-white font-bold">{selectedTestId}</span></DialogDescription>
          </div>
          
          <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-8 space-y-8">
            
            <div className="space-y-4">
              <Label className="font-black text-sm uppercase tracking-widest text-slate-400">Interaction Type</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {QUESTION_TYPES.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setSelectedType(type.value as QuestionType)}
                    className={cn(
                      "flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all text-left",
                      selectedType === type.value 
                        ? "bg-primary/5 border-primary shadow-md ring-4 ring-primary/5" 
                        : "bg-slate-50 border-slate-100 hover:border-slate-300"
                    )}
                  >
                    <type.icon className={cn("w-5 h-5", selectedType === type.value ? "text-primary" : "text-slate-400")} />
                    <span className={cn("text-xs font-black", selectedType === type.value ? "text-primary" : "text-slate-600")}>{type.label}</span>
                    <input type="radio" name="question_type" value={type.value} checked={selectedType === type.value} readOnly className="hidden" />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="font-bold flex items-center justify-between">
                  Question Prompt
                  <span className="text-[10px] font-black text-slate-400 uppercase">Required</span>
                </Label>
                <Textarea name="question_text" defaultValue={editingItem?.question_text} required placeholder="What would you like to ask?" className="rounded-xl min-h-[80px] text-lg font-medium" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-bold">Internal Reference ID</Label>
                  <Input name="id" defaultValue={editingItem?.id} placeholder="Auto-generated" className="rounded-xl h-11 font-mono text-xs" disabled={!!editingItem} />
                </div>
                <div className="flex items-end pb-1">
                  <div className="flex items-center space-x-3 py-2.5 bg-slate-50 rounded-xl px-4 border w-full">
                    <input type="checkbox" name="required" id="q_required" className="w-5 h-5 rounded-md border-2 border-slate-300 accent-primary" defaultChecked={editingItem?.required === "TRUE" || editingItem?.required === true} />
                    <Label htmlFor="q_required" className="font-black cursor-pointer text-xs">Compulsory</Label>
                  </div>
                </div>
              </div>

              {/* DYNAMIC OPTIONS SECTION */}
              {(['single_choice', 'multiple_choice', 'dropdown'].includes(selectedType)) && (
                <div className="space-y-4 p-6 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="font-black text-sm uppercase tracking-widest text-slate-500">Available Choices</Label>
                    <Button type="button" size="sm" onClick={addOption} className="rounded-full h-8 gap-1.5 font-bold">
                      <Plus className="w-3 h-3" /> Add Option
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    {optionsList.map((option, idx) => (
                      <div key={idx} className="flex items-center gap-3 animate-in fade-in slide-in-from-left-2 duration-200">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white border font-bold text-xs text-slate-400">
                          {idx + 1}
                        </div>
                        
                        <div className="flex-1 relative">
                          <Input 
                            value={option} 
                            onChange={(e) => updateOptionValue(idx, e.target.value)}
                            placeholder={`Option ${idx + 1}`}
                            className="rounded-xl h-12 pr-10 bg-white border-slate-200 focus:ring-primary/20"
                          />
                        </div>

                        {/* Correct Answer Selection */}
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => toggleCorrect(option)}
                            className={cn(
                              "w-12 h-12 rounded-xl border-2 flex items-center justify-center transition-all",
                              correctAnswers.includes(option) 
                                ? "bg-green-500 border-green-600 text-white shadow-lg" 
                                : "bg-white border-slate-200 text-slate-300 hover:border-green-400 hover:text-green-500"
                            )}
                            title="Mark as correct"
                          >
                            {selectedType === 'multiple_choice' ? (
                              <Check className={cn("w-5 h-5", correctAnswers.includes(option) ? "opacity-100" : "opacity-30")} />
                            ) : (
                              <Circle className={cn("w-3 h-3 fill-current", correctAnswers.includes(option) ? "opacity-100" : "opacity-0")} />
                            )}
                          </button>

                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => removeOption(idx)}
                            disabled={optionsList.length <= 1}
                            className="h-12 w-12 rounded-xl text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  {correctAnswers.length === 0 && selectedType !== 'dropdown' && (
                    <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest text-center mt-2">
                      Please select at least one correct answer
                    </p>
                  )}
                </div>
              )}

              {/* True / False Section */}
              {selectedType === 'true_false' && (
                <div className="space-y-4 p-6 bg-slate-50 rounded-3xl border-2 border-slate-200">
                  <Label className="font-black text-sm uppercase tracking-widest text-slate-500">Correct Answer</Label>
                  <RadioGroup 
                    value={correctAnswers[0] || ""} 
                    onValueChange={(val) => setCorrectAnswers([val])}
                    className="flex gap-4"
                  >
                    {['True', 'False'].map((val) => (
                      <div key={val} className={cn(
                        "flex-1 flex items-center gap-3 p-4 rounded-2xl border-2 transition-all cursor-pointer",
                        correctAnswers[0] === val ? "bg-primary/5 border-primary" : "bg-white border-slate-200"
                      )} onClick={() => setCorrectAnswers([val])}>
                        <RadioGroupItem value={val} id={`tf-${val}`} />
                        <Label htmlFor={`tf-${val}`} className="font-bold cursor-pointer">{val}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )}

              {/* Conditional: Order Group for ordering/matching */}
              {(['ordering', 'matching'].includes(selectedType)) && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="font-bold">
                      {selectedType === 'ordering' ? 'Sequence Items' : 'Matching Pairs'}
                    </Label>
                    <Input 
                      name="order_group" 
                      defaultValue={editingItem?.order_group} 
                      placeholder={selectedType === 'ordering' ? "Item 1, Item 2, Item 3" : "LeftA|RightA, LeftB|RightB"} 
                      className="rounded-xl h-11" 
                    />
                    <p className="text-[10px] text-muted-foreground font-medium italic">
                      {selectedType === 'ordering' ? 'Comma separated items in ANY order (shuffled for users).' : 'Formatted as Left|Right, separated by commas.'}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold">Correct Solution</Label>
                    <Input name="correct_answer" defaultValue={editingItem?.correct_answer} placeholder="Correct order or all pairs" className="rounded-xl h-11 font-mono text-xs bg-slate-50" />
                  </div>
                </div>
              )}

              {/* Short Text Correct Answer */}
              {selectedType === 'short_text' && (
                <div className="space-y-2">
                  <Label className="font-bold">Correct Answer Key</Label>
                  <Input name="correct_answer" defaultValue={editingItem?.correct_answer} placeholder="The exact answer expected" className="rounded-xl h-11 font-mono" />
                </div>
              )}

              {/* Media & Metadata */}
              {(selectedType === 'hotspot' || editingItem?.image_url) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="space-y-2">
                    <Label className="font-bold">Media URL</Label>
                    <Input name="image_url" defaultValue={editingItem?.image_url} placeholder="https://..." className="rounded-xl h-11" />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold">Metadata JSON</Label>
                    <Input name="metadata" defaultValue={editingItem?.metadata} placeholder='[{"id": "zone1", ...}]' className="rounded-xl h-11 font-mono text-[10px]" />
                  </div>
                </div>
              )}
            </div>

            <DialogFooter className="pt-4 border-t sticky bottom-0 bg-white pb-2 mt-auto">
              <Button type="submit" className="rounded-full w-full h-14 font-black text-xl shadow-xl hover:scale-[1.02] transition-transform bg-primary">
                <Save className="w-5 h-5 mr-2" />
                Commit to Question Bank
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* User Dialog */}
      <Dialog open={dialogs.user} onOpenChange={(val) => setDialogs({...dialogs, user: val})}>
        <DialogContent className="sm:max-w-[400px] rounded-[2rem] p-0 overflow-hidden border-none shadow-2xl bg-white">
          <div className="bg-slate-100 p-8 border-b">
            <DialogTitle className="text-2xl font-black text-slate-900">{editingItem ? 'Edit User' : 'New Account'}</DialogTitle>
          </div>
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            onSaveUser(Object.fromEntries(formData.entries()));
            setDialogs({...dialogs, user: false});
          }} className="p-8 space-y-6">
            <div className="space-y-2"><Label className="font-bold">Full Name</Label><Input name="name" defaultValue={editingItem?.name} required className="rounded-xl h-11" /></div>
            <div className="space-y-2"><Label className="font-bold">Email Address</Label><Input name="email" type="email" defaultValue={editingItem?.email} required disabled={!!editingItem} className="rounded-xl h-11" /></div>
            <div className="space-y-2"><Label className="font-bold">Access Secret</Label><Input name="password" type="password" placeholder={editingItem ? "Leave to keep current" : "Set password"} required={!editingItem} className="rounded-xl h-11" /></div>
            <div className="space-y-2"><Label className="font-bold">Permission Role</Label>
              <select name="role" defaultValue={editingItem?.role || 'user'} className="w-full h-11 px-3 rounded-xl border bg-slate-50 font-bold outline-none">
                <option value="user">Student / User</option>
                <option value="admin">Administrator</option>
              </select>
            </div>
            <DialogFooter className="pt-4"><Button type="submit" className="rounded-full w-full h-12 font-black text-lg">Update Records</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Bulk Edit Dialog */}
      <Dialog open={dialogs.bulk} onOpenChange={(val) => setDialogs({...dialogs, bulk: val})}>
        <DialogContent className="sm:max-w-[750px] h-[85vh] flex flex-col rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl bg-slate-900">
          <div className="bg-slate-950 p-8 text-white flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-black">Bulk Data Sync</DialogTitle>
              <DialogDescription className="text-slate-400">Direct JSON manipulation for: {selectedTestId}</DialogDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => setDialogs({...dialogs, bulk: false})} className="rounded-full text-white hover:bg-white/10">Discard</Button>
              <Button onClick={() => onSaveBulk(questionJson)} className="rounded-full bg-primary text-white font-bold px-6 shadow-lg shadow-primary/30"><Save className="w-4 h-4 mr-2" /> Push Changes</Button>
            </div>
          </div>
          <div className="flex-1 p-6 bg-slate-900">
            <textarea 
              className="w-full h-full font-mono text-xs p-8 bg-slate-950 text-green-400 border border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/40 leading-relaxed resize-none" 
              value={questionJson} 
              onChange={(e) => setQuestionJson(e.target.value)} 
              spellCheck={false}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
