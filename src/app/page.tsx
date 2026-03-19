"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Play, 
  Database, 
  Smartphone, 
  CheckCircle, 
  LayoutGrid, 
  ShieldCheck, 
  Zap,
  ArrowRight,
  Globe,
  Layers,
  Cpu
} from "lucide-react";
import { UserNav } from '@/components/UserNav';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col selection:bg-primary selection:text-white">
      {/* Navigation */}
      <header className="py-4 px-6 md:px-12 border-b border-slate-100 bg-white/70 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-slate-900 p-2 rounded-xl shadow-lg transform -rotate-3 hover:rotate-0 transition-all duration-300">
              <Zap className="text-primary w-5 h-5 fill-current" />
            </div>
            <h1 className="text-xl font-black tracking-tighter text-slate-900 uppercase">DNTRNG</h1>
          </div>
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-8 text-sm font-bold uppercase tracking-widest text-slate-400">
              <Link href="/tests" className="hover:text-primary transition-colors">Intelligence</Link>
              <Link href="/setup-guide" className="hover:text-primary transition-colors">Protocol</Link>
            </nav>
            <div className="h-6 w-px bg-slate-100 hidden md:block" />
            <UserNav />
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-20 pb-32 md:pt-40 md:pb-56">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full" />
            <div className="absolute bottom-[10%] right-[-10%] w-[30%] h-[30%] bg-accent/5 blur-[120px] rounded-full" />
          </div>

          <div className="container max-w-6xl mx-auto px-6 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 border border-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
              Intelligence Protocol v8.5 Active
            </div>
            
            <h2 className="text-6xl md:text-9xl font-black mb-8 tracking-tight text-slate-900 leading-[0.85] animate-in fade-in slide-in-from-bottom-6 duration-1000">
              Simplify <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent italic">Intelligence.</span>
            </h2>
            
            <p className="text-lg md:text-2xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed mb-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
              The next-generation assessment engine built for speed, scale, and seamless Google Sheets integration.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
              <Link href="/tests">
                <Button size="lg" className="h-16 px-10 text-lg rounded-full shadow-2xl shadow-primary/20 hover:scale-105 transition-all bg-primary font-black uppercase tracking-tight">
                  Launch Console
                </Button>
              </Link>
              <Link href="/quiz?id=demo-full">
                <Button size="lg" variant="outline" className="h-16 px-10 text-lg rounded-full hover:bg-slate-50 border-2 border-slate-200 text-slate-900 font-black uppercase tracking-tight transition-all">
                  <Play className="w-4 h-4 mr-2 fill-slate-900" />
                  Live Preview
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="bg-slate-50/50 py-32 border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20">
              <h3 className="text-sm font-black uppercase tracking-[0.4em] text-primary mb-4">Core Infrastructure</h3>
              <h4 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Built for Performance</h4>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Direct Sync",
                  description: "Real-time bi-directional bridge between DNTRNG and Google Sheets.",
                  icon: Database,
                  accent: "text-blue-500"
                },
                {
                  title: "Deep Logic",
                  description: "Complex matching, ordering, and hotspot interactions for nuanced testing.",
                  icon: Cpu,
                  accent: "text-purple-500"
                },
                {
                  title: "Global Edge",
                  description: "Deployed on high-performance infrastructure for sub-millisecond response times.",
                  icon: Globe,
                  accent: "text-emerald-500"
                }
              ].map((feature, i) => (
                <Card key={i} className="border-none shadow-sm bg-white hover:shadow-2xl transition-all duration-500 rounded-[2.5rem] p-8 group overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-full -mr-16 -mt-16 group-hover:bg-primary/5 transition-colors duration-500" />
                  <CardHeader className="p-0 mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                      <feature.icon className={cn("w-8 h-8", feature.accent)} />
                    </div>
                  </CardHeader>
                  <CardTitle className="text-2xl font-black text-slate-900 mb-4">{feature.title}</CardTitle>
                  <CardDescription className="text-base font-medium leading-relaxed text-slate-500">
                    {feature.description}
                  </CardDescription>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-32 px-6">
          <div className="max-w-5xl mx-auto bg-slate-900 rounded-[4rem] p-12 md:p-24 text-center relative overflow-hidden group shadow-[0_40px_80px_-15px_rgba(0,0,0,0.3)]">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
            <div className="relative z-10">
              <h3 className="text-3xl md:text-6xl font-black text-white mb-8 tracking-tighter leading-tight">
                Ready to deploy your first <br />
                <span className="text-primary italic">Intelligence Module?</span>
              </h3>
              <p className="text-slate-400 text-lg md:text-xl font-medium max-w-2xl mx-auto mb-12">
                Join the professional teams using DNTRNG to streamline their data and assessment protocols.
              </p>
              <Link href="/admin/tests/new">
                <Button size="lg" className="h-16 px-12 text-lg rounded-full bg-white text-slate-900 hover:bg-slate-100 font-black uppercase tracking-tight transition-all">
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
            
            {/* Visual Decoration */}
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-primary/20 rounded-full blur-[100px] group-hover:bg-primary/30 transition-all duration-1000" />
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-accent/20 rounded-full blur-[100px] group-hover:bg-accent/30 transition-all duration-1000" />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-20 border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-slate-900 p-2 rounded-lg">
                  <Zap className="text-primary w-4 h-4 fill-current" />
                </div>
                <h1 className="text-lg font-black tracking-tighter text-slate-900 uppercase">DNTRNG</h1>
              </div>
              <p className="text-slate-400 font-medium max-w-xs leading-relaxed">
                Intelligence protocols simplified for the modern web. Built with speed and scale in mind.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900">Platform</h4>
              <nav className="flex flex-col gap-2 text-sm font-bold text-slate-400">
                <Link href="/tests" className="hover:text-primary transition-colors">Library</Link>
                <Link href="/admin" className="hover:text-primary transition-colors">Console</Link>
                <Link href="/setup-guide" className="hover:text-primary transition-colors">Setup Protocol</Link>
              </nav>
            </div>
            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900">Legal</h4>
              <nav className="flex flex-col gap-2 text-sm font-bold text-slate-400">
                <span className="cursor-default">Privacy</span>
                <span className="cursor-default">Intelligence Usage</span>
              </nav>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center pt-10 border-t border-slate-50 gap-6">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">
              © {new Date().getFullYear()} DNTRNG PLATFORM • ALL RIGHTS RESERVED
            </p>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-full border border-slate-100">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Node Status: Optimal</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Utility for cleaner class joining
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
