
"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Play, ChevronRight, User as UserIcon } from "lucide-react";

interface QuizStartProps {
  title: string;
  description?: string;
  questionsCount: number;
  duration?: string;
  user: any;
  guestName: string;
  setGuestName: (name: string) => void;
  onStart: () => void;
}

export function QuizStart({
  title,
  description,
  questionsCount,
  duration,
  user,
  guestName,
  setGuestName,
  onStart
}: QuizStartProps) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md border-none shadow-2xl rounded-[2.5rem] overflow-hidden">
        <div className="h-2 bg-primary" />
        <CardHeader className="text-center pt-10">
          <div className="mx-auto w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mb-6">
            <Play className="w-10 h-10 text-primary" />
          </div>
          <CardTitle className="text-3xl font-black tracking-tight">{title}</CardTitle>
          <CardDescription className="text-base font-medium mt-2">
            {description || 'Ready to test your knowledge?'}
          </CardDescription>
        </CardHeader>
        <CardContent className="px-8 pb-8 space-y-6">
          <div className="flex items-center justify-center gap-6 py-4">
            <div className="text-center">
              <p className="text-2xl font-black text-slate-900">{questionsCount}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Items</p>
            </div>
            <div className="w-px h-10 bg-slate-200" />
            <div className="text-center">
              <p className="text-2xl font-black text-slate-900">{duration || '15m'}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Time</p>
            </div>
          </div>

          {!user && (
            <div className="space-y-3 p-6 bg-slate-50 rounded-2xl border-2 border-slate-100">
              <Label htmlFor="guestName" className="font-bold flex items-center gap-2 text-slate-700">
                <UserIcon className="w-4 h-4 text-primary" />
                Your Full Name
              </Label>
              <Input 
                id="guestName"
                placeholder="Enter your name to begin..."
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="h-12 rounded-xl bg-white border-slate-200 focus:ring-primary/20"
              />
              <p className="text-[10px] text-muted-foreground font-medium italic">This will be used to record your score in our database.</p>
            </div>
          )}

          {user && (
            <div className="p-4 bg-green-50 rounded-2xl border-2 border-green-100 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center font-black text-green-700 text-sm">
                {user.displayName?.charAt(0) || user.email.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-black text-green-900">Signed in as {user.displayName || 'Student'}</p>
                <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest">Active Session</p>
              </div>
            </div>
          )}

          <Button 
            onClick={onStart}
            className="w-full h-14 rounded-full text-lg font-black shadow-xl transition-all hover:scale-[1.02] bg-primary"
          >
            Start Assessment
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
