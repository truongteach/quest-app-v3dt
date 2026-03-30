/**
 * DNTRNG™ Assessment Configuration Registry
 * 
 * Contains standardized thresholds, messages, and diagnostic metadata.
 */

export interface Verdict {
  message: string;
  highlight: string;
  color: string;
  border: string;
  bg: string;
  iconName: 'Trophy' | 'Zap' | 'Target' | 'AlertCircle' | 'XCircle';
}

export const getVerdictData = (pct: number): Verdict => {
  if (pct >= 95) return { 
    message: "Elite status verified. Perfect cognitive execution.", 
    highlight: "Elite",
    color: "text-emerald-600",
    border: "border-l-emerald-500",
    bg: "bg-emerald-50",
    iconName: 'Trophy'
  };
  if (pct >= 80) return { 
    message: "Outstanding performance. High-precision synchronization achieved.", 
    highlight: "Precision",
    color: "text-primary",
    border: "border-l-primary",
    bg: "bg-primary/5",
    iconName: 'Zap'
  };
  if (pct >= 60) return { 
    message: "Alignment success. Functional mastery established.", 
    highlight: "Mastery",
    color: "text-amber-600",
    border: "border-l-amber-500",
    bg: "bg-amber-50",
    iconName: 'Target'
  };
  if (pct >= 40) return { 
    message: "Optimization recommended. Foundational gaps identified.", 
    highlight: "Optimization",
    color: "text-orange-600",
    border: "border-l-orange-500",
    bg: "bg-orange-50",
    iconName: 'AlertCircle'
  };
  return { 
    message: "Critical realignment required. Baseline protocols not met.", 
    highlight: "Critical",
    color: "text-rose-600",
    border: "border-l-rose-500",
    bg: "bg-rose-50",
    iconName: 'XCircle'
  };
};
