
"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ArrowLeft, Copy, FileSpreadsheet, Code2, Rocket, Info, Table as TableIcon, Users, Database, LayoutGrid } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SetupGuide() {
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: "Data copied to clipboard." });
  };

  const SAMPLE_USERS = `id	name	email	role	password
U001	Admin User	admin@example.com	admin	admin123
U002	Jane Smith	user@example.com	user	pass123`;

  const SAMPLE_TESTS = `id	title	description	category	difficulty	duration	image_url
demo-1	QuestFlow Essentials	Learn the basics.	Product Tour	Beginner	5 mins	https://picsum.photos/seed/math/800/450
logic-1	Logic Master	Advanced reasoning.	Specialized	Advanced	10 mins	https://picsum.photos/seed/logic/800/450`;

  const SAMPLE_QUESTIONS = `id	question_text	question_type	options	correct_answer	order_group	image_url	metadata	required
q1	What is 2+2?	single_choice	3,4,5	4			TRUE
q2	Arrange these:	ordering		1,2,3	1,2,3			TRUE`;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-12">
      <div className="max-w-4xl mx-auto space-y-10">
        <div className="flex items-center justify-between">
          <Link href="/"><Button variant="ghost" className="rounded-full"><ArrowLeft className="w-4 h-4 mr-2" /> Back Home</Button></Link>
          <div className="text-right">
            <h1 className="text-3xl font-black tracking-tight">QuestFlow Multi-Sheet Setup</h1>
            <p className="text-sm text-muted-foreground">Architecture v8.0</p>
          </div>
        </div>

        <section className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center font-bold">1</div>
            <h2 className="text-2xl font-black">Prepare Your Google Sheet</h2>
          </div>
          
          <Tabs defaultValue="tests" className="w-full">
            <TabsList className="grid grid-cols-3 bg-white border p-1 rounded-xl">
              <TabsTrigger value="tests" className="rounded-lg font-bold">1. Tests (Library)</TabsTrigger>
              <TabsTrigger value="qsheets" className="rounded-lg font-bold">2. Question Sheets</TabsTrigger>
              <TabsTrigger value="core" className="rounded-lg font-bold">3. Users & Logs</TabsTrigger>
            </TabsList>
            
            <TabsContent value="tests" className="space-y-4">
              <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
                <CardHeader className="bg-slate-50 border-b flex flex-row items-center justify-between">
                  <CardTitle className="text-sm flex items-center gap-2"><LayoutGrid className="w-4 h-4 text-primary" /> Tab: Tests</CardTitle>
                  <Button size="sm" variant="outline" onClick={() => copyToClipboard(SAMPLE_TESTS)} className="rounded-full h-8 text-xs font-bold">Copy Metadata</Button>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="text-xs text-muted-foreground mb-4">Paste this into cell <strong>A1</strong> of a tab named <strong>Tests</strong>. The <code>id</code> must match a sheet name exactly.</p>
                  <pre className="bg-slate-900 p-4 rounded-xl font-mono text-[10px] text-green-400 overflow-x-auto">{SAMPLE_TESTS}</pre>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="qsheets" className="space-y-4">
              <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
                <CardHeader className="bg-slate-50 border-b flex flex-row items-center justify-between">
                  <CardTitle className="text-sm flex items-center gap-2"><TableIcon className="w-4 h-4 text-primary" /> Test Question Sheets</CardTitle>
                  <Button size="sm" variant="outline" onClick={() => copyToClipboard(SAMPLE_QUESTIONS)} className="rounded-full h-8 text-xs font-bold">Copy Question Template</Button>
                </CardHeader>
                <CardContent className="pt-6">
                  <Alert className="mb-4 bg-blue-50 border-blue-100"><Info className="h-4 w-4" /><AlertDescription className="text-xs">Create a separate tab for each test. If a test ID is <code>demo-1</code>, name the tab exactly <code>demo-1</code>.</AlertDescription></Alert>
                  <pre className="bg-slate-900 p-4 rounded-xl font-mono text-[10px] text-green-400 overflow-x-auto">{SAMPLE_QUESTIONS}</pre>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="core" className="space-y-4">
              <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
                <CardHeader className="bg-slate-50 border-b"><CardTitle className="text-sm">Tab: Users</CardTitle></CardHeader>
                <CardContent className="pt-6">
                  <pre className="bg-slate-900 p-4 rounded-xl font-mono text-[10px] text-green-400 mb-4">{SAMPLE_USERS}</pre>
                  <div className="text-xs text-muted-foreground flex items-center gap-2"><Database className="w-3 h-3" /> Create a <strong>Responses</strong> tab as well to track submissions.</div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>

        <section className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center font-bold">2</div>
            <h2 className="text-2xl font-black">Finalize Deployment</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-8"><h3 className="font-bold flex items-center gap-2 mb-4"><Code2 className="text-primary" /> Apps Script</h3><p className="text-sm text-slate-600 mb-6">Use the code in <code>docs/backend.gs</code>. Ensure you deploy as a <strong>Web App</strong> accessible by <strong>Anyone</strong>.</p></Card>
            <Card className="p-8"><h3 className="font-bold flex items-center gap-2 mb-4"><Rocket className="text-primary" /> Ready!</h3><p className="text-sm text-slate-600 mb-6">Login with <code>admin@example.com</code> / <code>admin123</code> to access your dashboard.</p><Link href="/login" className="w-full"><Button className="w-full rounded-full font-bold">Go to Login</Button></Link></Card>
          </div>
        </section>
      </div>
    </div>
  );
}
