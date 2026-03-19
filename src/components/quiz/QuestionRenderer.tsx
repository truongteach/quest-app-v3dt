
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Question, QuestionType } from '@/types/quiz';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, ArrowUp, ArrowDown, CheckCircle2, Link2, XCircle, GripVertical, Info, Check, X, RotateCcw, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  question: Question;
  value: any;
  onChange: (val: any) => void;
  reviewMode?: boolean;
}

export const QuestionRenderer: React.FC<Props> = ({ question, value, onChange, reviewMode }) => {
  // --- TOP LEVEL HOOKS ---
  
  // 1. General Options
  const options = useMemo(() => 
    question.options ? question.options.split(',').map(o => o.trim()) : [], 
    [question.options]
  );

  // 2. Matching logic setup
  const matchingPairs = useMemo(() => {
    if (question.question_type !== 'matching') return [];
    return question.order_group?.split(',').map(p => {
      const [left, right] = p.split('|');
      return { left: (left || "").trim(), right: (right || "").trim() };
    }) || [];
  }, [question.order_group, question.question_type]);

  const leftItems = useMemo(() => matchingPairs.map(p => p.left), [matchingPairs]);
  
  // 3. Shuffling for Matching
  const [shuffledRightItems, setShuffledRightItems] = useState<string[]>([]);
  useEffect(() => {
    if (question.question_type === 'matching' || question.question_type === 'ordering') {
      const pool = matchingPairs.length > 0 
        ? matchingPairs.map(p => p.right).sort(() => 0.5 - Math.random())
        : (question.order_group?.split(',').map(i => i.trim()) || []).sort(() => 0.5 - Math.random());
      setShuffledRightItems(pool);
    }
  }, [matchingPairs, question.order_group, question.question_type]);

  // 4. Ordering initialization
  const initialOrderItems = useMemo(() => 
    question.order_group?.split(',').map(i => i.trim()) || [],
    [question.order_group]
  );

  // 5. Interactive states
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
  const [draggedMatchingItem, setDraggedMatchingItem] = useState<string | null>(null);
  const [selectedPoolItem, setSelectedPoolItem] = useState<string | null>(null);

  // 6. Correct answers for matching
  const correctMatchingPairs = useMemo(() => {
    if (question.question_type !== 'matching') return [];
    return question.correct_answer?.split(',').map(p => {
      const [l, r] = p.split('|');
      return { l: (l || "").trim(), r: (r || "").trim() };
    }) || [];
  }, [question.correct_answer, question.question_type]);

  // --- DERIVED DATA ---
  const matches = (value as Record<string, string>) || {};
  const currentOrder = (value as string[]) || initialOrderItems;

  // --- INTERACTION HANDLERS ---
  const handleMatchingDrop = (prompt: string, answer: string) => {
    if (reviewMode) return;
    const newMatches = { ...matches };
    newMatches[prompt] = answer;
    onChange(newMatches);
    setDraggedMatchingItem(null);
    setSelectedPoolItem(null);
  };

  const clearMatchingMatch = (prompt: string) => {
    if (reviewMode) return;
    const newMatches = { ...matches };
    delete newMatches[prompt];
    onChange(newMatches);
  };

  const isMatchingAnswerUsed = (answer: string) => Object.values(matches).includes(answer);

  // --- RENDER FUNCTIONS ---
  const renderSingleChoice = () => (
    <RadioGroup 
      value={value || ""} 
      onValueChange={onChange}
      disabled={reviewMode}
      className="space-y-3"
    >
      {options.map((option, idx) => (
        <div key={idx} className={`flex items-center space-x-3 p-4 rounded-xl border-2 transition-all ${value === option ? 'bg-primary/5 border-primary shadow-sm' : 'hover:bg-muted border-transparent bg-muted/30'}`}>
          <RadioGroupItem value={option} id={`q-${question.id}-${idx}`} />
          <Label htmlFor={`q-${question.id}-${idx}`} className="flex-1 cursor-pointer font-medium text-lg">{option}</Label>
          {reviewMode && option === question.correct_answer && <CheckCircle2 className="w-6 h-6 text-green-500" />}
        </div>
      ))}
    </RadioGroup>
  );

  const renderMultipleChoice = () => {
    const selected = (value as string[]) || [];
    const toggle = (opt: string) => {
      if (reviewMode) return;
      const next = selected.includes(opt) ? selected.filter(s => s !== opt) : [...selected, opt];
      onChange(next);
    };

    return (
      <div className="space-y-3">
        {options.map((option, idx) => (
          <div key={idx} className={`flex items-center space-x-3 p-4 rounded-xl border-2 transition-all ${selected.includes(option) ? 'bg-primary/5 border-primary shadow-sm' : 'hover:bg-muted border-transparent bg-muted/30'}`}>
            <Checkbox 
              id={`q-${question.id}-${idx}`} 
              checked={selected.includes(option)} 
              onCheckedChange={() => toggle(option)}
              disabled={reviewMode}
            />
            <Label htmlFor={`q-${question.id}-${idx}`} className="flex-1 cursor-pointer font-medium text-lg">{option}</Label>
            {reviewMode && question.correct_answer?.split(',').map(c => c.trim()).includes(option) && <CheckCircle2 className="w-6 h-6 text-green-500" />}
          </div>
        ))}
      </div>
    );
  };

  const renderRating = () => {
    const ratingValue = parseInt(value || "0");
    const max = 5;
    return (
      <div className="flex items-center justify-center space-x-2 py-8">
        {Array.from({ length: max }).map((_, i) => (
          <button
            key={i}
            type="button"
            disabled={reviewMode}
            onClick={() => onChange((i + 1).toString())}
            className={`p-2 transition-transform hover:scale-125 ${reviewMode ? 'cursor-default' : 'cursor-pointer'}`}
          >
            <Star 
              className={`w-12 h-12 transition-colors ${i < ratingValue ? 'fill-accent text-accent' : 'text-slate-200'}`} 
            />
          </button>
        ))}
      </div>
    );
  };

  const renderOrdering = () => {
    const correctOrder = question.correct_answer?.split(',').map(i => i.trim()) || [];

    const handleDragStart = (e: React.DragEvent, index: number) => {
      if (reviewMode) return;
      setDraggedItemIndex(index);
      e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
      e.preventDefault();
      if (draggedItemIndex === null || draggedItemIndex === index || reviewMode) return;
      
      const newOrder = [...currentOrder];
      const itemToMove = newOrder.splice(draggedItemIndex, 1)[0];
      newOrder.splice(index, 0, itemToMove);
      
      setDraggedItemIndex(index);
      onChange(newOrder);
    };

    const handleDragEnd = () => {
      setDraggedItemIndex(null);
    };

    const resetOrder = () => {
      onChange(initialOrderItems);
    };

    return (
      <div className="space-y-4">
        {!reviewMode && (
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-xl border border-primary/10 text-xs font-medium text-primary">
              <Info className="w-4 h-4" />
              <span>Drag items to reorder them into the correct sequence.</span>
            </div>
            <Button variant="outline" size="sm" onClick={resetOrder} className="rounded-full gap-2">
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>
          </div>
        )}
        <div className="space-y-3">
          {currentOrder.map((item, idx) => {
            const isCorrectPos = reviewMode && item === correctOrder[idx];
            const isDragging = draggedItemIndex === idx;

            return (
              <div 
                key={`${item}-${idx}`}
                draggable={!reviewMode}
                onDragStart={(e) => handleDragStart(e, idx)}
                onDragOver={(e) => handleDragOver(e, idx)}
                onDragEnd={handleDragEnd}
                className={cn(
                  "flex items-center gap-4 p-5 rounded-2xl border-2 transition-all duration-200 group select-none",
                  isDragging ? "opacity-20 bg-slate-100 border-primary border-dashed scale-[0.98]" : "bg-white border-slate-100 shadow-sm",
                  !reviewMode && !isDragging && "hover:border-primary/40 hover:shadow-lg cursor-grab active:cursor-grabbing hover:-translate-y-0.5",
                  reviewMode && isCorrectPos && "border-green-500 bg-green-50/50",
                  reviewMode && !isCorrectPos && "border-destructive/30 bg-destructive/5"
                )}
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-50 font-black text-slate-400 text-sm shrink-0 border border-slate-100">
                  {idx + 1}
                </div>
                
                <div className="flex-1 font-bold text-slate-700 text-lg">
                  {item}
                </div>

                {reviewMode ? (
                  <div className="flex items-center gap-4">
                    {!isCorrectPos && (
                      <div className="text-right">
                        <p className="text-[10px] font-black uppercase tracking-widest text-destructive/40 leading-none mb-1">Correct Position {idx + 1}</p>
                        <p className="text-sm font-black text-slate-900">{correctOrder[idx]}</p>
                      </div>
                    )}
                    <div className={cn(
                      "p-2 rounded-full shadow-sm",
                      isCorrectPos ? "bg-green-100 text-green-600" : "bg-destructive/10 text-destructive"
                    )}>
                      {isCorrectPos ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
                    </div>
                  </div>
                ) : (
                  <GripVertical className="w-6 h-6 text-slate-200 group-hover:text-primary transition-colors shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderMatching = () => {
    return (
      <div className="space-y-8">
        {!reviewMode && (
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-xl border border-primary/10 text-xs font-medium text-primary">
              <Info className="w-4 h-4" />
              <span>Drag answers to center drop zones or tap to select and place.</span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onChange({})} className="rounded-full gap-2 text-destructive hover:bg-destructive/10">
              <Trash2 className="w-4 h-4" />
              Clear All
            </Button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-8 space-y-6">
            <div className="grid grid-cols-2 gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
              <span className="px-4">Prompts</span>
              <span className="px-4">Drop Zones</span>
            </div>
            {leftItems.map((prompt, idx) => {
              const currentMatch = matches[prompt];
              const isCorrect = reviewMode && currentMatch && correctMatchingPairs.find(cp => cp.l === prompt)?.r === currentMatch;

              return (
                <div key={idx} className="flex flex-col sm:flex-row items-stretch gap-4 group">
                  <div className="w-full sm:w-1/2 p-6 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-slate-600 shadow-sm flex items-center">
                    {prompt}
                  </div>

                  <div 
                    className={cn(
                      "w-full sm:w-1/2 min-h-[80px] rounded-2xl border-2 transition-all flex items-center justify-center p-3 relative overflow-hidden",
                      !currentMatch && !reviewMode && "border-dashed border-slate-200 bg-slate-50/30 hover:border-primary/40 hover:bg-primary/5",
                      !currentMatch && selectedPoolItem && !reviewMode && "border-primary border-solid animate-pulse bg-primary/10 ring-4 ring-primary/5",
                      currentMatch && "border-solid border-slate-100 bg-white shadow-md",
                      reviewMode && isCorrect && "border-green-500 bg-green-50/50",
                      reviewMode && currentMatch && !isCorrect && "border-destructive/30 bg-destructive/5"
                    )}
                    onDragOver={(e) => {
                      e.preventDefault();
                      if (!reviewMode) e.currentTarget.classList.add('bg-primary/10', 'border-primary', 'scale-[1.02]');
                    }}
                    onDragLeave={(e) => {
                      if (!reviewMode) e.currentTarget.classList.remove('bg-primary/10', 'border-primary', 'scale-[1.02]');
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      const answer = e.dataTransfer.getData("text/plain");
                      handleMatchingDrop(prompt, answer);
                      e.currentTarget.classList.remove('bg-primary/10', 'border-primary', 'scale-[1.02]');
                    }}
                    onClick={() => {
                      if (selectedPoolItem) handleMatchingDrop(prompt, selectedPoolItem);
                    }}
                  >
                    {currentMatch ? (
                      <div className="flex items-center justify-between w-full">
                        <span className="font-bold text-primary text-lg">{currentMatch}</span>
                        {!reviewMode && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 rounded-full text-slate-300 hover:text-destructive hover:bg-destructive/10"
                            onClick={(e) => { e.stopPropagation(); clearMatchingMatch(prompt); }}
                          >
                            <XCircle className="w-5 h-5" />
                          </Button>
                        )}
                        {reviewMode && isCorrect && <CheckCircle2 className="w-6 h-6 text-green-600 ml-2" />}
                        {reviewMode && !isCorrect && <XCircle className="w-6 h-6 text-destructive ml-2" />}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-1 text-center">
                        <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest opacity-60">
                          {reviewMode ? "Unmatched" : (selectedPoolItem ? "Tap to place" : "Drop Zone")}
                        </span>
                        {!reviewMode && !selectedPoolItem && <div className="w-8 h-1 bg-slate-200 rounded-full" />}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="lg:col-span-4 bg-white p-8 rounded-[2rem] border-2 border-slate-100 sticky top-24 shadow-xl shadow-slate-200/50">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6 px-1 flex items-center justify-between">
              Answer Pool
              <div className="h-1 flex-1 mx-4 bg-slate-50 rounded-full" />
            </h3>
            <div className="flex flex-wrap lg:flex-col gap-4">
              {shuffledRightItems.map((answer, idx) => {
                const used = isMatchingAnswerUsed(answer);
                const isSelected = selectedPoolItem === answer;

                return (
                  <div
                    key={idx}
                    draggable={!used && !reviewMode}
                    onDragStart={(e) => {
                      e.dataTransfer.setData("text/plain", answer);
                      setDraggedMatchingItem(answer);
                    }}
                    onClick={() => {
                      if (!used && !reviewMode) {
                        setSelectedPoolItem(isSelected ? null : answer);
                      }
                    }}
                    className={cn(
                      "p-4 rounded-xl border-2 font-bold text-sm transition-all shadow-sm relative group",
                      used ? "opacity-20 bg-slate-50 border-transparent cursor-not-allowed" : "bg-white border-slate-100 hover:border-primary/50 hover:shadow-xl cursor-grab active:cursor-grabbing hover:-translate-y-1",
                      isSelected && "border-primary bg-primary/5 ring-4 ring-primary/10 scale-105 z-10",
                      reviewMode && "cursor-default pointer-events-none"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {!used && <GripVertical className="w-4 h-4 text-slate-200 group-hover:text-primary transition-colors" />}
                      {answer}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderHotspot = () => {
    const coords = (value as { x: number; y: number } | null);
    const zones: any[] = JSON.parse(question.metadata || "[]");

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (reviewMode) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      onChange({ x, y });
    };

    return (
      <div className="space-y-4">
        <div 
          className="hotspot-container relative w-full aspect-video border-4 border-white rounded-[2rem] overflow-hidden cursor-crosshair shadow-2xl bg-muted"
          onClick={handleClick}
        >
          {question.image_url ? (
            <img 
              src={question.image_url} 
              alt="Question Visual" 
              className="w-full h-full object-cover select-none"
              draggable={false}
            />
          ) : (
            <div className="w-full h-full bg-slate-100 flex flex-col items-center justify-center text-muted-foreground">
              <Link2 className="w-12 h-12 mb-2 opacity-20" />
              <span className="font-bold text-xs uppercase tracking-widest opacity-40">Visual reference missing</span>
            </div>
          )}
          
          {coords && (
            <div 
              className="absolute w-10 h-10 border-4 border-white bg-primary/80 rounded-full -translate-x-1/2 -translate-y-1/2 shadow-2xl ring-8 ring-primary/10 animate-in zoom-in-50"
              style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
            >
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full shadow-sm" />
              </div>
            </div>
          )}

          {reviewMode && zones.map((z: any) => (
            <div 
              key={z.id}
              className="absolute border-4 border-dashed border-green-500 bg-green-500/10 rounded-full -translate-x-1/2 -translate-y-1/2 flex items-center justify-center overflow-hidden transition-all hover:bg-green-500/20"
              style={{ 
                left: `${z.x}%`, 
                top: `${z.y}%`, 
                width: `${z.radius * 2}%`, 
                height: `${z.radius * 2}%` 
              }}
            >
              <span className="text-[10px] font-black text-white bg-green-600 px-3 py-1 rounded-full shadow-lg border border-green-400">{z.label}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center gap-2 py-4">
          <div className="w-2 h-2 rounded-full bg-primary/20" />
          <p className="text-xs font-black uppercase tracking-widest text-muted-foreground/60 italic">Interactive Visual Selection</p>
          <div className="w-2 h-2 rounded-full bg-primary/20" />
        </div>
      </div>
    );
  };

  const renderDefault = () => {
    switch(question.question_type) {
      case 'short_text':
        return (
          <div className="space-y-4">
            <Input 
              value={value || ""} 
              onChange={(e) => onChange(e.target.value)} 
              placeholder="Type your answer here..."
              disabled={reviewMode}
              className="h-16 text-xl font-bold border-2 rounded-2xl px-6 focus-visible:ring-primary/20 transition-all shadow-sm"
            />
            {reviewMode && (
              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-2xl border-2 border-green-100 shadow-sm">
                <div className="p-1.5 bg-green-600 rounded-full"><Check className="w-3 h-3 text-white" /></div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-green-600 leading-none mb-1">Correct Answer</span>
                  <span className="font-bold text-green-900">{question.correct_answer}</span>
                </div>
              </div>
            )}
          </div>
        );
      case 'dropdown':
        return (
          <div className="space-y-4">
            <Select onValueChange={onChange} value={value} disabled={reviewMode}>
              <SelectTrigger className="h-16 text-xl font-bold border-2 rounded-2xl px-6 shadow-sm">
                <SelectValue placeholder="Choose an option" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl">
                {options.map((o, i) => (
                  <SelectItem key={i} value={o} className="font-medium">{o}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {reviewMode && (
              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-2xl border-2 border-green-100 shadow-sm">
                <div className="p-1.5 bg-green-600 rounded-full"><Check className="w-3 h-3 text-white" /></div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-green-600 leading-none mb-1">Correct Selection</span>
                  <span className="font-bold text-green-900">{question.correct_answer}</span>
                </div>
              </div>
            )}
          </div>
        );
      case 'true_false':
        return (
          <RadioGroup value={value} onValueChange={onChange} disabled={reviewMode} className="flex flex-col space-y-4">
             {['True', 'False'].map((o) => (
               <div key={o} className={cn(
                 "flex items-center space-x-3 p-6 rounded-[2rem] border-2 transition-all",
                 value === o ? 'bg-primary/5 border-primary shadow-lg ring-4 ring-primary/5' : 'hover:bg-muted border-slate-100 bg-slate-50/50'
               )}>
                <RadioGroupItem value={o} id={`tf-${question.id}-${o}`} className="w-6 h-6" />
                <Label htmlFor={`tf-${question.id}-${o}`} className="flex-1 cursor-pointer font-black text-2xl tracking-tight">{o}</Label>
                {reviewMode && o === question.correct_answer && <CheckCircle2 className="w-8 h-8 text-green-600" />}
              </div>
             ))}
          </RadioGroup>
        );
      default:
        return <div className="p-12 border-2 border-dashed border-slate-200 rounded-[2rem] text-center text-muted-foreground bg-muted/20">
          <p className="font-bold uppercase tracking-widest text-xs mb-2 opacity-40">System Notification</p>
          Question type "{question.question_type}" implementation coming soon.
        </div>;
    }
  }

  const renderContent = () => {
    switch (question.question_type) {
      case 'single_choice': return renderSingleChoice();
      case 'multiple_choice': return renderMultipleChoice();
      case 'rating': return renderRating();
      case 'ordering': return renderOrdering();
      case 'matching': return renderMatching();
      case 'hotspot': return renderHotspot();
      default: return renderDefault();
    }
  };

  return (
    <div className="w-full">
      <div className="mb-10">
        <h2 className="text-3xl md:text-4xl font-black leading-[1.15] text-foreground tracking-tighter max-w-2xl">
          {question.question_text}
          {question.required && <span className="text-destructive ml-2 select-none">*</span>}
        </h2>
        <div className="h-1.5 w-20 bg-primary/10 rounded-full mt-6" />
      </div>
      <div className="space-y-10">
        {renderContent()}
      </div>
    </div>
  );
};
