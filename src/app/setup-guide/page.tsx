
"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ArrowLeft, Copy, Check, FileSpreadsheet, Code2, Rocket, Info, Table as TableIcon, Users, History } from "lucide-react";
import { GAS_CODE } from '@/app/lib/gas-template';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SetupGuide() {
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Code copied to clipboard.",
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-12">
      <div className="max-w-4xl mx-auto space-y-10">
        <div className="flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" className="rounded-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back Home
            </Button>
          </Link>
          <div className="text-right">
            <h1 className="text-3xl font-black tracking-tight text-slate-900">QuestFlow Setup</h1>
            <p className="text-sm text-muted-foreground font-medium">Sheet-to-App Integration Guide</p>
          </div>
        </div>

        <section className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center font-bold shadow-lg">1</div>
            <h2 className="text-2xl font-black text-slate-800">Configure Your Google Sheet</h2>
          </div>
          
          <Alert className="bg-blue-50 border-blue-100 text-blue-800">
            <Info className="h-4 w-4" />
            <AlertTitle className="font-bold">Required Tab Names</AlertTitle>
            <AlertDescription className="font-medium">
              Your sheet must have exactly three tabs named: <code className="font-bold">Questions</code>, <code className="font-bold">Users</code>, and <code className="font-bold">Responses</code>.
            </AlertDescription>
          </Alert>

          <Tabs defaultValue="questions" className="w-full">
            <TabsList className="grid grid-cols-3 bg-white border p-1 rounded-xl">
              <TabsTrigger value="questions" className="rounded-lg font-bold">Questions</TabsTrigger>
              <TabsTrigger value="users" className="rounded-lg font-bold">Users</TabsTrigger>
              <TabsTrigger value="responses" className="rounded-lg font-bold">Responses</TabsTrigger>
            </TabsList>
            
            <TabsContent value="questions">
              <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
                <CardHeader className="bg-slate-50 border-b">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <TableIcon className="w-4 h-4 text-primary" />
                    Tab: Questions
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <p className="text-sm text-muted-foreground">Add these headers in <strong>Row 1</strong>:</p>
                  <div className="bg-slate-900 p-4 rounded-xl overflow-x-auto font-mono text-xs text-green-400 whitespace-nowrap">
                    test_id, id, question_text, question_type, options, correct_answer, order_group, image_url, metadata, required
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-3 bg-slate-50 rounded-lg border">
                      <p className="font-bold text-primary mb-1">test_id</p>
                      <p className="text-muted-foreground">Matches the quiz selection (e.g., demo-1)</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg border">
                      <p className="font-bold text-primary mb-1">question_type</p>
                      <p className="text-muted-foreground">single_choice, ordering, matching, hotspot, etc.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users">
              <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
                <CardHeader className="bg-slate-50 border-b">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    Tab: Users
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <p className="text-sm text-muted-foreground">Add these headers in <strong>Row 1</strong>:</p>
                  <div className="bg-slate-900 p-4 rounded-xl font-mono text-xs text-green-400">
                    email, role
                  </div>
                  <Alert variant="default" className="bg-amber-50 border-amber-100 text-amber-800">
                    <Info className="h-4 w-4" />
                    <AlertDescription className="text-xs font-medium">
                      Roles can be <code className="font-bold uppercase">admin</code> or <code className="font-bold uppercase">user</code>. Admins get dashboard access.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="responses">
              <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
                <CardHeader className="bg-slate-50 border-b">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <History className="w-4 h-4 text-primary" />
                    Tab: Responses
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <p className="text-sm text-muted-foreground">The script will automatically populate these headers:</p>
                  <div className="bg-slate-900 p-4 rounded-xl font-mono text-xs text-green-400">
                    Timestamp, Test ID, Score, Total, Duration (ms), Raw Responses
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>

        <section className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center font-bold shadow-lg">2</div>
            <h2 className="text-2xl font-black text-slate-800">Deploy Apps Script</h2>
          </div>
          <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between border-b bg-slate-50">
              <CardTitle className="text-sm flex items-center gap-2">
                <Code2 className="w-4 h-4 text-primary" />
                Backend Script
              </CardTitle>
              <Button size="sm" variant="outline" onClick={() => copyToClipboard(GAS_CODE)} className="rounded-full h-8 text-xs font-bold">
                <Copy className="w-3 h-3 mr-2" />
                Copy Code
              </Button>
            </CardHeader>
            <CardContent className="pt-6">
              <ol className="space-y-4 text-sm font-medium text-slate-600">
                <li className="flex gap-3">
                  <span className="text-primary font-black">1.</span>
                  <span>In Google Sheets, go to <strong>Extensions {">"} Apps Script</strong>.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-black">2.</span>
                  <span>Paste the code and replace <code className="bg-slate-100 px-1 rounded font-bold text-slate-900">YOUR_SPREADSHEET_ID_HERE</code>.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-black">3.</span>
                  <span>Click <strong>Deploy {">"} New Deployment</strong>. Select <strong>Web App</strong>.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-black">4.</span>
                  <span>Set Execute as <strong>Me</strong> and Access to <strong>Anyone</strong>.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-black">5.</span>
                  <span>Copy the <strong>Web App URL</strong> and update <code className="bg-slate-100 px-1 rounded font-bold text-slate-900">src/lib/api-config.ts</code>.</span>
                </li>
              </ol>
            </CardContent>
          </Card>
        </section>

        <div className="text-center pt-8">
          <Link href="/login">
            <Button size="lg" className="rounded-full h-14 px-12 text-lg font-black shadow-2xl hover:scale-105 transition-all">
              <Rocket className="w-5 h-5 mr-2" />
              Start Integration Test
            </Button>
          </Link>
          <p className="text-xs text-muted-foreground mt-4 font-bold uppercase tracking-widest">Everything is powered by your sheet.</p>
        </div>
      </div>
    </div>
  );
}
