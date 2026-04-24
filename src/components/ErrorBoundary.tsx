"use client";

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCcw, Home, ShieldAlert } from "lucide-react";
import Image from 'next/image';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * DNTRNG™ GLOBAL ERROR BOUNDARY
 * 
 * Catch-all safety net for client-side crashes.
 * Provides a professional recovery terminal instead of a white screen.
 */
export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught Terminal Error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md w-full bg-white rounded-[3rem] shadow-2xl p-12 border border-slate-100 animate-in zoom-in-95 duration-500">
            <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-rose-500/10">
              <ShieldAlert className="w-10 h-10 text-rose-500" />
            </div>
            
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-4">Protocol Interrupted</h2>
            <p className="text-slate-500 font-medium leading-relaxed mb-10">
              An unexpected error occurred in the intelligence registry. The system has been paused for safety.
            </p>

            <div className="grid grid-cols-1 gap-4">
              <Button 
                onClick={() => window.location.reload()} 
                className="h-14 rounded-full bg-slate-900 font-black uppercase text-xs tracking-widest gap-2 shadow-xl border-none"
              >
                <RefreshCcw className="w-4 h-4" /> Restart Session
              </Button>
              <Button 
                variant="ghost"
                onClick={() => window.location.href = '/'} 
                className="h-14 rounded-full font-black uppercase text-xs tracking-widest text-slate-400 hover:text-slate-900"
              >
                <Home className="w-4 h-4 mr-2" /> Return to Base
              </Button>
            </div>
          </div>
          <p className="mt-8 text-[9px] font-black uppercase tracking-[0.4em] text-slate-300">DNTRNG™ • RECOVERY PROTOCOL ACTIVE</p>
        </div>
      );
    }

    return this.props.children;
  }
}
