
/**
 * QuestionTypeSidebar.tsx
 * 
 * Purpose: Provides a list of available question types for selection in the Step Editor.
 * Used by: src/components/admin/dialogs/QuestionDialog.tsx
 * Props:
 *   - selectedType: QuestionType — current active type
 *   - setSelectedType: (type: QuestionType) => void — selection dispatcher
 *   - loading: boolean — current sync state
 */

import React from 'react';
import { cn } from "@/lib/utils";
import { QuestionType } from '@/types/quiz';
import { 
  CheckCircle2, 
  Layers, 
  ListOrdered, 
  Grid, 
  Type, 
  Star, 
  Link2, 
  ImageIcon 
} from "lucide-react";

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

interface QuestionTypeSidebarProps {
  selectedType: QuestionType;
  setSelectedType: (type: QuestionType) => void;
  loading: boolean;
}

export function QuestionTypeSidebar({ selectedType, setSelectedType, loading }: QuestionTypeSidebarProps) {
  return (
    <div className="w-[280px] bg-slate-50 border-r p-4 overflow-y-auto hidden lg:block">
      <p className="text-[10px] font-black uppercase text-slate-400 mb-4 px-4 tracking-widest">Input Protocol</p>
      {QUESTION_TYPES.map((type) => (
        <button 
          key={type.value} 
          type="button"
          disabled={loading}
          onClick={() => setSelectedType(type.value as QuestionType)} 
          className={cn(
            "w-full flex items-center gap-4 p-4 rounded-2xl transition-all mb-1", 
            selectedType === type.value ? "bg-primary text-white shadow-xl" : "hover:bg-white text-slate-500",
            loading && "opacity-50 cursor-not-allowed"
          )}
        >
          <type.icon className="w-5 h-5" />
          <span className="text-xs font-black uppercase">{type.label}</span>
        </button>
      ))}
    </div>
  );
}
