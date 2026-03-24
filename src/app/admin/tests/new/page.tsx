"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { API_URL } from '@/lib/api-config';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Save, Loader2, Sparkles, LayoutGrid, Image as ImageIcon, Clock, Gauge, X } from "lucide-react";

export default function NewTestPage() {
  const [loading, setLoading] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!API_URL) return;

    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    if (!data.id) {
      const slug = (data.title as string || 'test').toLowerCase().replace(/[^a-z0-9]/g, '-');
      data.id = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    try {
      await fetch(API_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify({ action: 'saveTest', data })
      });
      
      toast({ 
        title: "Test Created", 
        description: "Redirecting to question editor..." 
      });
      
      router.push(`/admin/tests/${data.id}`);
    } catch (err) {
      toast({ 
        variant: "destructive", 
        title: "Error", 
        description: "Could not create the test." 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()} className="rounded-full">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-8">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 uppercase leading-none">New Test</h1>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-3">Setup a new assessment for students</p>
          </div>

          <form onSubmit={handleCreate} className="space-y-6">
            <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white">
              <CardHeader className="bg-slate-50/50 border-b p-8">
                <CardTitle className="text-xl font-black flex items-center gap-3">
                  <LayoutGrid className="w-5 h-5 text-primary" />
                  Test Details
                </CardTitle>
                <CardDescription>Primary information about this test.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="font-black text-[10px] uppercase tracking-widest text-slate-400 ml-1">Test ID</Label>
                    <Input name="id" placeholder="leave blank for auto-id" className="h-12 rounded-xl bg-slate-50 border-none ring-1 ring-slate-100 font-mono text-xs" />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-black text-[10px] uppercase tracking-widest text-slate-400 ml-1">Category</Label>
                    <Input name="category" placeholder="Math, English, etc." className="h-12 rounded-xl bg-slate-50 border-none ring-1 ring-slate-100 font-bold" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="font-black text-[10px] uppercase tracking-widest text-slate-400 ml-1">Test Title</Label>
                  <Input name="title" required placeholder="Name of your test" className="h-14 rounded-xl bg-slate-50 border-none ring-1 ring-slate-100 font-black text-lg" />
                </div>

                <div className="space-y-2">
                  <Label className="font-black text-[10px] uppercase tracking-widest text-slate-400 ml-1">Description</Label>
                  <Textarea name="description" placeholder="A brief summary of this test..." className="min-h-[120px] rounded-2xl bg-slate-50 border-none ring-1 ring-slate-100 font-medium p-4" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  <div className="space-y-2">
                    <Label className="font-black text-[10px] uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
                      <Gauge className="w-3 h-3" /> Difficulty
                    </Label>
                    <Input name="difficulty" placeholder="Easy, Medium, Hard" className="h-12 rounded-xl bg-slate-50 border-none ring-1 ring-slate-100 font-bold" />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-black text-[10px] uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
                      <Clock className="w-3 h-3" /> Time Limit
                    </Label>
                    <Input name="duration" placeholder="e.g. 15m" className="h-12 rounded-xl bg-slate-50 border-none ring-1 ring-slate-100 font-bold" />
                  </div>
                </div>

                <div className="space-y-2 pt-4">
                  <Label className="font-black text-[10px] uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
                    <ImageIcon className="w-3 h-3" /> Cover Image URL
                  </Label>
                  <Input name="image_url" placeholder="https://..." className="h-12 rounded-xl bg-slate-50 border-none ring-1 ring-slate-100" />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end pt-4 pb-20">
              <Button 
                type="submit" 
                disabled={loading}
                className="h-16 px-12 rounded-full bg-primary font-black text-xl shadow-2xl"
              >
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin mr-3" />
                ) : (
                  <Save className="w-6 h-6 mr-3" />
                )}
                Save and Add Questions
              </Button>
            </div>
          </form>
        </div>

        {showSidebar && (
          <div className="hidden lg:block w-80 shrink-0 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="sticky top-28 space-y-6">
              <Card className="border-none shadow-xl rounded-[2rem] bg-slate-900 text-white p-8 relative overflow-hidden group">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setShowSidebar(false)}
                  className="absolute top-4 right-4 h-8 w-8 rounded-full text-slate-400 hover:text-white hover:bg-white/10 z-10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </Button>
                <Sparkles className="w-8 h-8 text-primary mb-6 animate-pulse" />
                <h3 className="text-xl font-black uppercase tracking-tight mb-4">Pro Tip</h3>
                <p className="text-sm text-slate-400 font-medium leading-relaxed">
                  Tests are saved instantly to your Google Sheet. After saving this, you'll be taken to the editor where you can start adding questions.
                </p>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}