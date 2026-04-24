"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, Mail } from "lucide-react";

/**
 * DNTRNG™ SYSTEM 404 TERMINAL
 * 
 * Professional fallback UI for unknown route exceptions.
 */
export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full space-y-12 animate-in zoom-in-95 duration-500">
        {/* Site Identity */}
        <Link href="/" className="inline-block">
          <Image 
            src="/brand/logo-horizontal.png" 
            alt="DNTRNG" 
            width={180} 
            height={45} 
            priority
          />
        </Link>

        {/* Decorative 404 Layer */}
        <div className="relative flex flex-col items-center justify-center py-20">
          <span className="absolute inset-0 flex items-center justify-center text-[120px] font-black text-[#1a2340] opacity-[0.08] select-none pointer-events-none">
            404
          </span>
          <div className="relative z-10 space-y-3">
            <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Page not found</h1>
            <p className="text-sm font-medium text-slate-500 max-w-[280px] mx-auto leading-relaxed">
              The page you're looking for doesn't exist or has been moved in the registry.
            </p>
          </div>
        </div>

        {/* Recovery Pathways */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/" className="w-full sm:w-auto">
            <Button className="w-full h-14 px-10 rounded-full bg-[#3B5BDB] hover:bg-[#2D4DB5] font-black uppercase text-xs tracking-widest shadow-xl shadow-blue-500/20 border-none transition-all hover:scale-[1.02]">
              <Home className="w-4 h-4 mr-2" /> Go Home
            </Button>
          </Link>
          <Button 
            variant="outline" 
            onClick={() => router.back()}
            className="w-full sm:w-auto h-14 px-10 rounded-full border-2 border-slate-200 text-slate-900 font-black uppercase text-xs tracking-widest bg-white hover:bg-slate-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
        </div>

        {/* Support Registry */}
        <div className="pt-8 flex flex-col items-center gap-2">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Protocol Inconsistency?
          </p>
          <a 
            href="mailto:support@dntrng.com" 
            className="flex items-center gap-2 text-xs font-black text-slate-600 hover:text-primary transition-colors group"
          >
            <Mail className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100" />
            support@dntrng.com
          </a>
        </div>
      </div>
      
      <p className="fixed bottom-8 text-[9px] font-black uppercase tracking-[0.6em] text-slate-300">
        DNTRNG™ • INTELLIGENCE REGISTRY
      </p>
    </div>
  );
}
