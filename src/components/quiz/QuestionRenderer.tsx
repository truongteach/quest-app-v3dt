"use client";

import React, { useState, useEffect } from 'react';
import { Question, QuestionType } from '@/types/quiz';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, ArrowUp, ArrowDown, GripVertical, CheckCircle2 } from "lucide-react";
import Image from 'next/image';

interface Props {
  question: Question;
  value: any;
  onChange: (val: any) => void;
  reviewMode?: boolean;
}

export const QuestionRenderer: React.FC<Props> = ({ question, value, onChange, reviewMode }) => {
  const options = question.options ? question.options.split(',').map(o => o.trim()) : [];

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
          className="hotspot-container relative w-full aspect-video border rounded-xl overflow-hidden cursor-crosshair shadow-md"
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
            <div className="w-full h-full bg-muted flex items-center justify-center">Image URL Missing</div>
          )}
          
          {coords && (
            <div 
              className="absolute w-6 h-6 border-2 border-white bg-accent/60 rounded-full -translate-x-1/2 -translate-y-1/2 shadow-lg"
              style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
            />
          )}

          {reviewMode && zones.map((z: any) => (
            <div 
              key={z.id}
              className="absolute border-2 border-dashed border-green-500 bg-green-500/10 rounded-full -translate-x-1/2 -translate-y-1/2 flex items-center justify-center overflow-hidden"
              style={{ 
                left: `${z.x}%`, 
                top: `${z.y}%`, 
                width: `${z.radius * 2}%`, 
                height: `${z.radius * 2}%` 
              }}
            >
              <span className="text-[10px] font-bold text-green-700 bg-white/80 px-1 rounded">{z.label}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground text-center italic">Click the image to select your answer</p>
      </div>
    );
  };

  const renderDefault = () => {
    switch(question.question_type) {
      case 'short_text':
        return (
          <div className="space-y-2">
            <Input 
              value={value || ""} 
              onChange={(e) => onChange(e.target.value)} 
              placeholder="Type your answer here..."
              disabled={reviewMode}
              className="h-12 text-lg"
            />
            {reviewMode && <div className="text-sm">Correct: <span className="font-bold text-green-600">{question.correct_answer}</span></div>}
          </div>
        );
      case 'dropdown':
        return (
          <div className="space-y-2">
            <Select onValueChange={onChange} value={value} disabled={reviewMode}>
              <SelectTrigger className="h-12 text-lg">
                <SelectValue placeholder="Choose an option" />
              </SelectTrigger>
              <SelectContent>
                {options.map((o, i) => (
                  <SelectItem key={i} value={o}>{o}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {reviewMode && <div className="text-sm">Correct: <span className="font-bold text-green-600">{question.correct_answer}</span></div>}
          </div>
        );
      case 'true_false':
        return (
          <RadioGroup value={value} onValueChange={onChange} disabled={reviewMode} className="flex flex-col space-y-3">
             {['True', 'False'].map((o) => (
               <div key={o} className={`flex items-center space-x-3 p-4 rounded-lg border transition-colors ${value === o ? 'bg-primary/5 border-primary' : 'hover:bg-muted'}`}>
                <RadioGroupItem value={o} id={`tf-${question.id}-${o}`} />
                <Label htmlFor={`tf-${question.id}-${o}`} className="flex-1 cursor-pointer font-medium text-lg">{o}</Label>
                {reviewMode && o === question.correct_answer && <CheckCircle2 className="w-5 h-5 text-green-500" />}
              </div>
             ))}
          </RadioGroup>
        );
      default:
        return <div className="p-4 border border-dashed rounded text-center">Question type "{question.question_type}" implementation coming soon.</div>;
    }
  }

  const renderContent = () => {
    switch (question.question_type) {
      case 'single_choice': return renderSingleChoice();
      case 'multiple_choice': return renderMultipleChoice();
      case 'rating': return renderRating();
      case 'ordering': return renderOrdering();
      case 'hotspot': return renderHotspot();
      default: return renderDefault();
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-xl md:text-2xl font-semibold leading-tight text-foreground">
          {question.question_text}
          {question.required && <span className="text-destructive ml-1">*</span>}
        </h2>
      </div>
      <div className="space-y-4">
        {renderContent()}
      </div>
    </div>
  );
};