"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { 
  ArrowLeft, 
  Copy, 
  FileSpreadsheet, 
  Code2, 
  Rocket, 
  Info, 
  Table as TableIcon, 
  Users, 
  Database, 
  LayoutGrid,
  Zap,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Globe,
  Languages,
  ShieldCheck,
  Cpu,
  Server,
  Cloud
} from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

type Language = 'en' | 'vi';

export default function SetupGuide() {
  const [lang, setLang] = useState<Language>('en');
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ 
      title: lang === 'en' ? "Metadata Copied" : "Đã sao chép", 
      description: lang === 'en' ? "Committed to clipboard." : "Đã lưu vào bộ nhớ tạm." 
    });
  };

  const content = {
    en: {
      title: "DNTRNG Protocol",
      subtitle: "Initialization v17.5",
      returnBase: "Return Home",
      launchConsole: "Launch Console",
      step1: {
        num: "01",
        title: "Sheet Architecture",
        desc: "Provision your database structure in Google Sheets™.",
        alertTitle: "Requirement",
        alertDesc: "Create a new Google Sheet. You MUST create three core tabs named EXACTLY as shown: Tests, Users, Responses.",
        tabTests: "Tests (Registry)",
        tabUsers: "Users (Identity)",
        tabResponses: "Responses (Logs)",
        testsTitle: "Core Tab: Tests",
        testsHeaders: "id, title, description, category, difficulty, duration, image_url",
        usersTitle: "Core Tab: Users",
        usersHeaders: "id, name, email, role, password",
        responsesTitle: "Core Tab: Responses",
        responsesHeaders: "Timestamp, User Name, User Email, Test ID, Score, Total, Duration (ms), Raw Responses",
        dynamicTitle: "Module Sheets",
        dynamicHeaders: "id, question_text, question_type, options, correct_answer, order_group, image_url, metadata, required"
      },
      step2: {
        num: "02",
        title: "Intelligence Bridge",
        desc: "Deploy the Apps Script backend.",
        codeTitle: "Logic Injection",
        codeDesc: "Navigate to Extensions > Apps Script. Inject the template found in src/app/lib/gas-template.ts.",
        deployTitle: "Cloud Deployment",
        deploy1: "Type: Web App",
        deploy2: "Execute as: Me",
        deploy3: "Access: Anyone",
        deployFooter: "Copy the Web App URL for the handshake."
      },
      step3: {
        num: "03",
        title: "Deployment Protocol",
        desc: "Launch your frontend to the global edge.",
        vercelTitle: "Vercel Deployment",
        vercelDesc: "Connect your GitHub repository to Vercel. No environment variables are strictly required unless using custom auth.",
        firebaseTitle: "Firebase Hosting",
        firebaseDesc: "Use Firebase App Hosting for high-scale performance. Run 'firebase deploy' from your terminal.",
        ready: "Protocol Active",
        launch: "Initialize Console"
      }
    },
    vi: {
      title: "Giao Thức DNTRNG",
      subtitle: "Khởi Tạo v17.5",
      returnBase: "Về Trang Chủ",
      launchConsole: "Mở Bảng Điều Khiển",
      step1: {
        num: "01",
        title: "Kiến Trúc Bảng Tính",
        desc: "Thiết lập cấu trúc cơ sở dữ liệu trên Google Sheets™.",
        alertTitle: "Yêu Cầu",
        alertDesc: "Tạo Google Sheet mới. Bạn PHẢI tạo 3 tab chính: Tests, Users, Responses.",
        tabTests: "Tests (Đăng ký)",
        tabUsers: "Users (Danh tính)",
        tabResponses: "Responses (Nhật ký)",
        testsTitle: "Tab Chính: Tests",
        testsHeaders: "id, title, description, category, difficulty, duration, image_url",
        usersTitle: "Tab Chính: Users",
        usersHeaders: "id, name, email, role, password",
        responsesTitle: "Tab Chính: Responses",
        responsesHeaders: "Timestamp, User Name, User Email, Test ID, Score, Total, Duration (ms), Raw Responses",
        dynamicTitle: "Tab Câu Hỏi",
        dynamicHeaders: "id, question_text, question_type, options, correct_answer, order_group, image_url, metadata, required"
      },
      step2: {
        num: "02",
        title: "Cầu Nối Trí Tuệ",
        desc: "Triển khai backend Google Apps Script.",
        codeTitle: "Nhúng Logic",
        codeDesc: "Vào Tiện ích mở rộng > Apps Script. Dán mã từ src/app/lib/gas-template.ts.",
        deployTitle: "Triển Khai Đám Mây",
        deploy1: "Loại: Ứng dụng Web",
        deploy2: "Thực thi: Tôi",
        deploy3: "Truy cập: Mọi người",
        deployFooter: "Lấy URL Ứng dụng Web để hoàn tất kết nối."
      },
      step3: {
        num: "03",
        title: "Quy Trình Triển Khai",
        desc: "Đưa giao diện của bạn lên internet.",
        vercelTitle: "Triển khai Vercel",
        vercelDesc: "Kết nối GitHub với Vercel. Hệ thống sẽ tự động nhận diện Next.js.",
        firebaseTitle: "Firebase Hosting",
        firebaseDesc: "Sử dụng Firebase App Hosting cho hiệu suất cao nhất. Chạy 'firebase deploy'.",
        ready: "Sẵn Sàng",
        launch: "Bắt Đầu"
      }
    }
  };

  const t = content[lang];

  return (
    <div className="min-h-screen bg-white selection:bg-primary selection:text-white pb-20">
      {/* Header */}
      <header className="py-12 border-b border-slate-100 bg-slate-50/50">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="rounded-full font-black text-[10px] uppercase tracking-widest text-slate-400 -ml-2">
                <ArrowLeft className="w-3 h-3 mr-2" /> {t.returnBase}
              </Button>
            </Link>
            <div className="flex items-center gap-4">
              <div className="bg-slate-900 p-3 rounded-2xl shadow-xl rotate-3">
                <Zap className="text-primary w-6 h-6 fill-current" />
              </div>
              <div>
                <h1 className="text-4xl font-black tracking-tighter text-slate-900 uppercase">{t.title}</h1>
                <p className="text-sm font-bold text-primary uppercase tracking-[0.2em] mt-1">{t.subtitle}</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex bg-slate-200/50 p-1 rounded-full border border-slate-200">
              <button onClick={() => setLang('en')} className={cn("px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all", lang === 'en' ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600")}>EN</button>
              <button onClick={() => setLang('vi')} className={cn("px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all", lang === 'vi' ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600")}>VI</button>
            </div>
            <Link href="/login">
               <Button className="rounded-full font-black uppercase text-xs tracking-widest bg-primary h-12 px-8 shadow-xl shadow-primary/20">
                 {t.launchConsole}
               </Button>
             </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-20 space-y-24">
        
        {/* Step 1 */}
        <section className="space-y-10">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-[2rem] bg-slate-900 text-primary flex items-center justify-center text-2xl font-black shadow-2xl">{t.step1.num}</div>
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">{t.step1.title}</h2>
          </div>

          <Alert className="bg-primary/5 border-primary/20 rounded-[2rem] p-8">
            <ShieldCheck className="h-6 w-6 text-primary" />
            <AlertTitle className="text-lg font-black uppercase text-primary mb-2">{t.step1.alertTitle}</AlertTitle>
            <AlertDescription className="text-slate-600 font-medium">{t.step1.alertDesc}</AlertDescription>
          </Alert>

          <Tabs defaultValue="tests" className="w-full">
            <TabsList className="grid grid-cols-3 bg-slate-100 p-1.5 rounded-[1.5rem] h-auto">
              <TabsTrigger value="tests" className="rounded-xl py-3 font-black uppercase text-[10px] tracking-widest">{t.step1.tabTests}</TabsTrigger>
              <TabsTrigger value="users" className="rounded-xl py-3 font-black uppercase text-[10px] tracking-widest">{t.step1.tabUsers}</TabsTrigger>
              <TabsTrigger value="responses" className="rounded-xl py-3 font-black uppercase text-[10px] tracking-widest">{t.step1.tabResponses}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="tests" className="mt-6 space-y-6">
              <Card className="border-none shadow-xl rounded-[2.5rem] bg-white p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <LayoutGrid className="w-5 h-5 text-primary" />
                    <CardTitle className="text-lg font-black uppercase">{t.step1.testsTitle}</CardTitle>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => copyToClipboard(t.step1.testsHeaders)} className="rounded-full font-bold">Copy Headers</Button>
                </div>
                <div className="bg-slate-900 p-6 rounded-2xl font-mono text-xs text-green-400 overflow-x-auto whitespace-nowrap">{t.step1.testsHeaders}</div>
              </Card>
            </TabsContent>
            {/* Add more tabs similarly if needed */}
          </Tabs>
        </section>

        {/* Step 2 */}
        <section className="space-y-10">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-[2rem] bg-slate-900 text-primary flex items-center justify-center text-2xl font-black shadow-2xl">{t.step2.num}</div>
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">{t.step2.title}</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-none shadow-xl rounded-[2.5rem] p-10 bg-white group hover:shadow-2xl transition-all">
              <Code2 className="w-10 h-10 text-primary mb-6" />
              <h3 className="text-xl font-black uppercase mb-4">{t.step2.codeTitle}</h3>
              <p className="text-sm text-slate-500 font-medium mb-6">{t.step2.codeDesc}</p>
              <Button variant="outline" className="w-full rounded-full font-black text-[10px] uppercase tracking-widest border-2 h-12" onClick={() => toast({ title: "Logic Ready", description: "Accessed via src/app/lib/gas-template.ts" })}>Access Template</Button>
            </Card>

            <Card className="border-none shadow-xl rounded-[2.5rem] p-10 bg-slate-900 text-white relative overflow-hidden group">
              <Rocket className="w-10 h-10 text-primary mb-6" />
              <h3 className="text-xl font-black uppercase mb-4">{t.step2.deployTitle}</h3>
              <div className="space-y-4 mb-8 text-xs font-bold text-slate-300">
                <div className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-primary" /> {t.step2.deploy1}</div>
                <div className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-primary" /> {t.step2.deploy2}</div>
                <div className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-primary" /> {t.step2.deploy3}</div>
              </div>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{t.step2.deployFooter}</p>
            </Card>
          </div>
        </section>

        {/* Step 3: Deployment Guide */}
        <section className="space-y-10">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-[2rem] bg-slate-900 text-primary flex items-center justify-center text-2xl font-black shadow-2xl">{t.step3.num}</div>
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">{t.step3.title}</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-none shadow-xl rounded-[2.5rem] p-10 bg-white border-2 border-slate-50">
              <Cloud className="w-10 h-10 text-blue-500 mb-6" />
              <h3 className="text-xl font-black uppercase mb-4">{t.step3.vercelTitle}</h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">{t.step3.vercelDesc}</p>
            </Card>

            <Card className="border-none shadow-xl rounded-[2.5rem] p-10 bg-white border-2 border-slate-50">
              <Server className="w-10 h-10 text-orange-500 mb-6" />
              <h3 className="text-xl font-black uppercase mb-4">{t.step3.firebaseTitle}</h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">{t.step3.firebaseDesc}</p>
            </Card>
          </div>

          <Card className="border-none shadow-2xl rounded-[3rem] overflow-hidden bg-slate-900 text-white p-12 text-center">
            <Zap className="w-12 h-12 text-primary mx-auto mb-6" />
            <h3 className="text-3xl font-black uppercase mb-4">{t.step3.ready}</h3>
            <Link href="/login">
              <Button className="h-16 px-12 rounded-full bg-primary font-black text-lg shadow-2xl hover:scale-105 transition-transform">
                {t.step3.launch}
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </Card>
        </section>

      </main>
    </div>
  );
}
