
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Question, QuestionType } from '@/types/quiz';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, ArrowUp, ArrowDown, CheckCircle2, Link2, XCircle, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  question: Question;
  value: any;
  onChange: (val: any) => void;
  reviewMode?: boolean;
}

export const QuestionRenderer: React.FC<Props> = ({ question, value, onChange, reviewMode }) => {
  const options = useMemo(() => question.options ? question.options.split(',').map(o => o.trim()) : [], [question.options]);

  const renderSingleChoice = () => (
    <RadioGroup 
      value={value || ""} 
      onValueChange={onChange}
      disabled={reviewMode}
      className="space-y-3"
    >
      {options.map((option, idx) => (
        <div key={idx} className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors ${value === option ? 'bg-primary/5 border-primary' : 'hover:bg-muted'}`}>
          <RadioGroupItem value={option} id={`q-${question.id}-${idx}`} />
          <Label htmlFor={`q-${question.id}-${idx}`} className="flex-1 cursor-pointer">{option}</Label>
          {reviewMode && option === question.correct_answer && <CheckCircle2 className="w-5 h-5 text-green-500" />}
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
          <div key={idx} className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors ${selected.includes(option) ? 'bg-primary/5 border-primary' : 'hover:bg-muted'}`}>
            <Checkbox 
              id={`q-${question.id}-${idx}`} 
              checked={selected.includes(option)} 
              onCheckedChange={() => toggle(option)}
              disabled={reviewMode}
            />
            <Label htmlFor={`q-${question.id}-${idx}`} className="flex-1 cursor-pointer">{option}</Label>
            {reviewMode && question.correct_answer?.split(',').map(c => c.trim()).includes(option) && <CheckCircle2 className="w-5 h-5 text-green-500" />}
          </div>
        ))}
      </div>
    );
  };

  const renderRating = () => {
    const ratingValue = parseInt(value || "0");
    const max = 5;
    return (
      <div className="flex items-center justify-center space-x-2 py-4">
        {Array.from({ length: max }).map((_, i) => (
          <button
            key={i}
            type="button"
            disabled={reviewMode}
            onClick={() => onChange((i + 1).toString())}
            className={`p-2 transition-transform hover:scale-110 ${reviewMode ? 'cursor-default' : 'cursor-pointer'}`}
          >
            <Star 
              className={`w-10 h-10 ${i < ratingValue ? 'fill-accent text-accent' : 'text-muted-foreground'}`} 
            />
          </button>
        ))}
      </div>
    );
  };

  const renderOrdering = () => {
    const items = (value as string[]) || question.order_group?.split(',').map(i => i.trim()) || [];
    const correctOrder = question.correct_answer?.split(',').map(i => i.trim()) || [];

    const move = (index: number, direction: 'up' | 'down') => {
      if (reviewMode) return;
      const next = [...items];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= items.length) return;
      [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
      onChange(next);
    };

    return (
      <div className="space-y-2">
        {items.map((item, idx) => {
          const isCorrectPos = reviewMode && item === correctOrder[idx];
          return (
            <div key={idx} className={`flex items-center space-x-3 p-3 rounded-lg border bg-card ${reviewMode ? (isCorrectPos ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50') : 'border-border'}`}>
              <div className="flex flex-col space-y-1">
                <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => move(idx, 'up')} disabled={idx === 0 || reviewMode}>
                  <ArrowUp className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => move(idx, 'down')} disabled={idx === items.length - 1 || reviewMode}>
                  <ArrowDown className="w-4 h-4" />
                </Button>
              </div>
              <span className="font-medium text-lg min-w-[1.5rem]">{idx + 1}.</span>
              <span className="flex-1">{item}</span>
              {reviewMode && !isCorrectPos && (
                <span className="text-xs font-bold text-red-600">Correct: {correctOrder[idx]}</span>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderMatching = () => {
    const pairs = useMemo(() => 
      question.order_group?.split(',').map(p => {
        const [left, right] = p.split('|');
        return { left: (left || "").trim(), right: (right || "").trim() };
      }) || [], 
    [question.order_group]);

    const leftItems = useMemo(() => pairs.map(p => p.left), [pairs]);
    
    // Stable shuffle on client to avoid hydration mismatch
    const [shuffledRightItems, setShuffledRightItems] = useState<string[]>([]);
    useEffect(() => {
      const right = pairs.map(p => p.right);
      setShuffledRightItems([...right].sort(() => Math.random() - 0.5));
    }, [pairs]);

    const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
    const matches = (value as Record<string, string>) || {};

    const handleMatch = (right: string) => {
      if (reviewMode || !selectedLeft) return;
      const newMatches = { ...matches, [selectedLeft]: right };
      onChange(newMatches);
      setSelectedLeft(null);
    };

    const clearMatch = (left: string) => {
      if (reviewMode) return;
      const newMatches = { ...matches };
      delete newMatches[left];
      onChange(newMatches);
    };

    const correctPairs = useMemo(() => 
      question.correct_answer?.split(',').map(p => {
        const [l, r] = p.split('|');
        return { l: (l || "").trim(), r: (r || "").trim() };
      }) || [], 
    [question.correct_answer]);

    return (
      <div className="grid grid-cols-2 gap-4 md:gap-12 relative py-4">
        <div className="space-y-4">
          <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1">Column A</Label>
          {leftItems.map((left, idx) => (
            <div 
              key={idx}
              className={cn(
                "p-4 border-2 rounded-xl cursor-pointer transition-all flex items-center justify-between group shadow-sm",
                selectedLeft === left ? "border-primary bg-primary/5 ring-4 ring-primary/10" : "bg-card hover:border-primary/50",
                matches[left] && "border-green-200 bg-green-50/50",
                reviewMode && "cursor-default"
              )}
              onClick={() => !reviewMode && setSelectedLeft(left)}
            >
              <div className="flex items-center gap-3">
                <GripVertical className="w-4 h-4 text-muted-foreground/40" />
                <span className="font-semibold text-sm md:text-base">{left}</span>
              </div>
              {matches[left] && (
                <div className="flex items-center gap-2">
                  <div className="hidden md:block h-px w-8 bg-green-200" />
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-8 w-8 rounded-full text-destructive hover:bg-destructive/10"
                    onClick={(e) => { e.stopPropagation(); clearMatch(left); }}
                    disabled={reviewMode}
                  >
                    <XCircle className="w-5 h-5" />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1">Column B</Label>
          {shuffledRightItems.map((right, idx) => {
            const matchedLeft = Object.keys(matches).find(k => matches[k] === right);
            const isCorrect = reviewMode && matchedLeft && correctPairs.find(cp => cp.l === matchedLeft)?.r === right;
            
            return (
              <div 
                key={idx}
                className={cn(
                  "p-4 border-2 rounded-xl cursor-pointer transition-all flex items-center gap-3 shadow-sm",
                  matchedLeft ? "border-green-500 bg-green-50 text-green-900 font-medium" : "bg-card hover:border-primary/50",
                  !matchedLeft && selectedLeft && "border-dashed border-primary/60 animate-pulse bg-primary/5",
                  reviewMode && isCorrect && "border-green-600 bg-green-100",
                  reviewMode && matchedLeft && !isCorrect && "border-destructive bg-destructive/5",
                  reviewMode && "cursor-default"
                )}
                onClick={() => handleMatch(right)}
              >
                <Link2 className={cn("w-5 h-5 shrink-0", matchedLeft ? "text-green-600" : "text-muted-foreground/50")} />
                <span className="text-sm md:text-base">{right}</span>
              </div>
            );
          })}
        </div>
        
        {selectedLeft && !reviewMode && (
          <div className="col-span-2 text-center mt-4 animate-in fade-in slide-in-from-top-2">
            <p className="text-sm font-medium text-primary bg-primary/10 inline-block px-4 py-1.5 rounded-full">
              Connecting <strong>{selectedLeft}</strong>... Select a match from Column B
            </p>
          </div>
        )}
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
          className="hotspot-container relative w-full aspect-video border-2 rounded-2xl overflow-hidden cursor-crosshair shadow-xl bg-muted"
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
            <div className="w-full h-full bg-muted flex flex-col items-center justify-center text-muted-foreground">
              <Link2 className="w-12 h-12 mb-2 opacity-20" />
              <span>Visual reference missing</span>
            </div>
          )}
          
          {coords && (
            <div 
              className="absolute w-8 h-8 border-4 border-white bg-primary/70 rounded-full -translate-x-1/2 -translate-y-1/2 shadow-2xl ring-4 ring-primary/20 animate-in zoom-in-50"
              style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
            >
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
            </div>
          )}

          {reviewMode && zones.map((z: any) => (
            <div 
              key={z.id}
              className="absolute border-2 border-dashed border-green-500 bg-green-500/20 rounded-full -translate-x-1/2 -translate-y-1/2 flex items-center justify-center overflow-hidden"
              style={{ 
                left: `${z.x}%`, 
                top: `${z.y}%`, 
                width: `${z.radius * 2}%`, 
                height: `${z.radius * 2}%` 
              }}
            >
              <span className="text-[10px] font-bold text-white bg-green-600 px-2 py-0.5 rounded-full shadow-sm">{z.label}</span>
            </div>
          ))}
        </div>
        <p className="text-sm text-center text-muted-foreground italic">Click the image to mark your answer</p>
      </div>
    );
  };

  const renderDefault = () => {
    switch(question.question_type) {
      case 'short_text':
        return (
          <div className="space-y-3">
            <Input 
              value={value || ""} 
              onChange={(e) => onChange(e.target.value)} 
              placeholder="Type your answer here..."
              disabled={reviewMode}
              className="h-14 text-lg border-2 focus-visible:ring-primary/20"
            />
            {reviewMode && <div className="text-sm p-3 bg-green-50 rounded-lg border border-green-100">Correct: <span className="font-bold text-green-700">{question.correct_answer}</span></div>}
          </div>
        );
      case 'dropdown':
        return (
          <div className="space-y-3">
            <Select onValueChange={onChange} value={value} disabled={reviewMode}>
              <SelectTrigger className="h-14 text-lg border-2">
                <SelectValue placeholder="Choose an option" />
              </SelectTrigger>
              <SelectContent>
                {options.map((o, i) => (
                  <SelectItem key={i} value={o}>{o}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {reviewMode && <div className="text-sm p-3 bg-green-50 rounded-lg border border-green-100">Correct: <span className="font-bold text-green-700">{question.correct_answer}</span></div>}
          </div>
        );
      case 'true_false':
        return (
          <RadioGroup value={value} onValueChange={onChange} disabled={reviewMode} className="flex flex-col space-y-3">
             {['True', 'False'].map((o) => (
               <div key={o} className={`flex items-center space-x-3 p-4 rounded-xl border-2 transition-colors ${value === o ? 'bg-primary/5 border-primary shadow-sm' : 'hover:bg-muted'}`}>
                <RadioGroupItem value={o} id={`tf-${question.id}-${o}`} />
                <Label htmlFor={`tf-${question.id}-${o}`} className="flex-1 cursor-pointer font-semibold text-lg">{o}</Label>
                {reviewMode && o === question.correct_answer && <CheckCircle2 className="w-6 h-6 text-green-600" />}
              </div>
             ))}
          </RadioGroup>
        );
      default:
        return <div className="p-8 border-2 border-dashed rounded-2xl text-center text-muted-foreground bg-muted/20">Question type "{question.question_type}" implementation coming soon.</div>;
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
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold leading-tight text-foreground tracking-tight">
          {question.question_text}
          {question.required && <span className="text-destructive ml-1.5">*</span>}
        </h2>
      </div>
      <div className="space-y-6">
        {renderContent()}
      </div>
    </div>
  );
};
