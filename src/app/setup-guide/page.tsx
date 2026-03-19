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
  Languages
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
    toast({ title: lang === 'en' ? "Copied!" : "Đã sao chép!", description: lang === 'en' ? "Protocol metadata copied to clipboard." : "Dữ liệu giao thức đã được sao chép." });
  };

  const content = {
    en: {
      title: "Setup Protocol",
      subtitle: "Intelligence Initialization v17.0",
      returnBase: "Return to Base",
      launchConsole: "Launch Console",
      step1: {
        num: "01",
        title: "Sheet Architecture",
        desc: "Provision your database structure in Google Sheets.",
        alertTitle: "Protocol Requirement",
        alertDesc: "Create a new Google Sheet. You will need to create at least three core tabs named exactly as shown below. Each tab must have the specific headers provided.",
        tabTests: "Tests (Registry)",
        tabUsers: "Users (Identity)",
        tabResponses: "Responses (Logs)",
        testsTitle: "Tab: Tests",
        testsDesc: "This sheet acts as the master catalog for all assessment modules.",
        testsHeaders: "id, title, description, category, difficulty, duration, image_url",
        usersTitle: "Tab: Users",
        usersHeaders: "id, name, email, role, password",
        responsesTitle: "Tab: Responses",
        responsesDesc: "Leave this sheet blank; the engine will auto-populate logs.",
        responsesHeaders: "Timestamp, User Name, User Email, Test ID, Score, Total, Duration (ms), Raw Responses",
        dynamicTitle: "Dynamic Question Tabs",
        dynamicDesc: "For every test added to the Tests tab, you must create a new tab named exactly after that test's id.",
        dynamicHeaders: "id, question_text, question_type, options, correct_answer, order_group, image_url, metadata, required"
      },
      step2: {
        num: "02",
        title: "Intelligence Bridge",
        desc: "Deploy the Google Apps Script backend.",
        codeTitle: "Code Injection",
        codeDesc: "Open Extensions > Apps Script in your Google Sheet. Delete any existing code and paste the content from the DNTRNG template.",
        deployTitle: "Cloud Deployment",
        deploy1: "New Deployment > Web App",
        deploy2: "Execute as: Me",
        deploy3: "Who has access: Anyone",
        deployFooter: "Copy the generated Web App URL for the final integration step."
      },
      step3: {
        num: "03",
        title: "Handshake",
        desc: "Connect the DNTRNG frontend to your new bridge.",
        logicTitle: "Integration Logic",
        logicDesc: "Update src/lib/api-config.ts with your Web App URL.",
        ready: "Protocol Ready",
        launch: "Launch System"
      }
    },
    vi: {
      title: "Giao Thức Thiết Lập",
      subtitle: "Khởi Tạo Trí Tuệ v17.0",
      returnBase: "Trở về Trang chủ",
      launchConsole: "Mở Bảng Điều Khiển",
      step1: {
        num: "01",
        title: "Kiến Trúc Bảng Tính",
        desc: "Thiết lập cấu trúc cơ sở dữ liệu trên Google Sheets.",
        alertTitle: "Yêu Cầu Giao Thức",
        alertDesc: "Tạo một Google Sheet mới. Bạn cần tạo ít nhất ba tab chính với tên chính xác như dưới đây. Mỗi tab phải có các tiêu đề cột cụ thể.",
        tabTests: "Tests (Đăng ký)",
        tabUsers: "Users (Danh tính)",
        tabResponses: "Responses (Nhật ký)",
        testsTitle: "Tab: Tests",
        testsDesc: "Trang này đóng vai trò là danh mục chính cho tất cả các bài kiểm tra.",
        testsHeaders: "id, title, description, category, difficulty, duration, image_url",
        usersTitle: "Tab: Users",
        usersHeaders: "id, name, email, role, password",
        responsesTitle: "Tab: Responses",
        responsesDesc: "Để trống trang này; hệ thống sẽ tự động điền nhật ký khi hoàn thành bài kiểm tra.",
        responsesHeaders: "Timestamp, User Name, User Email, Test ID, Score, Total, Duration (ms), Raw Responses",
        dynamicTitle: "Tab Câu Hỏi Động",
        dynamicDesc: "Với mỗi bài kiểm tra được thêm vào tab Tests, bạn phải tạo một tab mới được đặt tên chính xác theo id của bài kiểm tra đó.",
        dynamicHeaders: "id, question_text, question_type, options, correct_answer, order_group, image_url, metadata, required"
      },
      step2: {
        num: "02",
        title: "Cầu Nối Trí Tuệ",
        desc: "Triển khai backend bằng Google Apps Script.",
        codeTitle: "Nhúng Mã Nguồn",
        codeDesc: "Mở Tiện ích mở rộng > Apps Script trong Google Sheet. Xóa mã hiện có và dán nội dung từ mẫu DNTRNG.",
        deployTitle: "Triển Khai Đám Mây",
        deploy1: "Triển khai mới > Ứng dụng Web",
        deploy2: "Thực thi dưới tên: Tôi (Me)",
        deploy3: "Ai có quyền truy cập: Mọi người (Anyone)",
        deployFooter: "Sao chép URL Ứng dụng Web để thực hiện bước tích hợp cuối cùng."
      },
      step3: {
        num: "03",
        title: "Cái Bắt Tay",
        desc: "Kết nối frontend DNTRNG với cầu nối mới của bạn.",
        logicTitle: "Logic Tích Hợp",
        logicDesc: "Cập nhật src/lib/api-config.ts với URL Ứng dụng Web của bạn.",
        ready: "Giao Thức Sẵn Sàng",
        launch: "Kích Hoạt Hệ Thống"
      }
    }
  };

  const t = content[lang];

  const SAMPLE_TESTS = `id	title	description	category	difficulty	duration	image_url
demo-full	The Ultimate Feature Tour	Experience every single question type.	Product Tour	Beginner	10 mins	https://picsum.photos/seed/mountain1/800/450`;

  return (
    <div className="min-h-screen bg-white selection:bg-primary selection:text-white">
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
              <button 
                onClick={() => setLang('en')}
                className={cn(
                  "px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all",
                  lang === 'en' ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
                )}
              >
                EN
              </button>
              <button 
                onClick={() => setLang('vi')}
                className={cn(
                  "px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all",
                  lang === 'vi' ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
                )}
              >
                VI
              </button>
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
        
        {/* Step 1: Google Sheets */}
        <section className="space-y-10">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-[2rem] bg-slate-900 text-primary flex items-center justify-center text-2xl font-black shadow-2xl">{t.step1.num}</div>
            <div>
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">{t.step1.title}</h2>
              <p className="text-slate-500 font-medium">{t.step1.desc}</p>
            </div>
          </div>

          <div className="space-y-8">
            <Alert className="bg-primary/5 border-primary/20 rounded-[2rem] p-8">
              <Info className="h-6 w-6 text-primary" />
              <AlertTitle className="text-lg font-black uppercase tracking-tight text-primary mb-2">{t.step1.alertTitle}</AlertTitle>
              <AlertDescription className="text-slate-600 font-medium leading-relaxed">
                {t.step1.alertDesc}
              </AlertDescription>
            </Alert>

            <Tabs defaultValue="tests" className="w-full">
              <TabsList className="grid grid-cols-3 bg-slate-100 p-1.5 rounded-[1.5rem] h-auto">
                <TabsTrigger value="tests" className="rounded-xl py-3 font-black uppercase text-[10px] tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm">{t.step1.tabTests}</TabsTrigger>
                <TabsTrigger value="users" className="rounded-xl py-3 font-black uppercase text-[10px] tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm">{t.step1.tabUsers}</TabsTrigger>
                <TabsTrigger value="responses" className="rounded-xl py-3 font-black uppercase text-[10px] tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm">{t.step1.tabResponses}</TabsTrigger>
              </TabsList>
              
              <TabsContent value="tests" className="mt-6 space-y-6">
                <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white">
                  <CardHeader className="bg-slate-50/50 border-b p-8">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <LayoutGrid className="w-5 h-5 text-primary" />
                        <CardTitle className="text-lg font-black uppercase">{t.step1.testsTitle}</CardTitle>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => copyToClipboard(t.step1.testsHeaders)} className="rounded-full font-bold h-9 border-2">Copy Headers</Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8">
                    <p className="text-sm text-slate-500 font-medium mb-6">{t.step1.testsDesc}</p>
                    <div className="bg-slate-900 p-6 rounded-2xl overflow-hidden relative">
                      <div className="font-mono text-[10px] text-primary/70 mb-2 uppercase tracking-widest">Header Definition</div>
                      <code className="text-green-400 font-mono text-xs block overflow-x-auto whitespace-nowrap pb-2">{t.step1.testsHeaders}</code>
                    </div>
                  </CardContent>
                </Card>

                <Alert className="border-dashed border-2 rounded-3xl p-6 bg-slate-50">
                  <TableIcon className="w-5 h-5 text-slate-400" />
                  <AlertTitle className="font-black text-sm uppercase mb-1">{t.step1.dynamicTitle}</AlertTitle>
                  <AlertDescription className="text-xs text-slate-500 font-medium">
                    {t.step1.dynamicDesc}
                    <br/><br/>
                    <strong>Headers:</strong> <code className="bg-white px-2 py-0.5 rounded border font-mono">{t.step1.dynamicHeaders}</code>
                  </AlertDescription>
                </Alert>
              </TabsContent>

              <TabsContent value="users" className="mt-6">
                <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white">
                  <CardHeader className="bg-slate-50/50 border-b p-8">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Users className="w-5 h-5 text-primary" />
                        <CardTitle className="text-lg font-black uppercase">{t.step1.usersTitle}</CardTitle>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => copyToClipboard(t.step1.usersHeaders)} className="rounded-full font-bold h-9 border-2">Copy Headers</Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="bg-slate-900 p-6 rounded-2xl overflow-hidden">
                      <div className="font-mono text-[10px] text-primary/70 mb-2 uppercase tracking-widest">Header Definition</div>
                      <code className="text-green-400 font-mono text-xs block overflow-x-auto whitespace-nowrap">{t.step1.usersHeaders}</code>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="responses" className="mt-6">
                <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white">
                  <CardHeader className="bg-slate-50/50 border-b p-8">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Database className="w-5 h-5 text-primary" />
                        <CardTitle className="text-lg font-black uppercase">{t.step1.responsesTitle}</CardTitle>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => copyToClipboard(t.step1.responsesHeaders)} className="rounded-full font-bold h-9 border-2">Copy Headers</Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8">
                    <p className="text-sm text-slate-500 font-medium mb-6">{t.step1.responsesDesc}</p>
                    <div className="bg-slate-900 p-6 rounded-2xl overflow-hidden">
                      <div className="font-mono text-[10px] text-primary/70 mb-2 uppercase tracking-widest">Required Headers</div>
                      <code className="text-green-400 font-mono text-xs block overflow-x-auto whitespace-nowrap">{t.step1.responsesHeaders}</code>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Step 2: Apps Script */}
        <section className="space-y-10">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-[2rem] bg-slate-900 text-primary flex items-center justify-center text-2xl font-black shadow-2xl">{t.step2.num}</div>
            <div>
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">{t.step2.title}</h2>
              <p className="text-slate-500 font-medium">{t.step2.desc}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-none shadow-xl rounded-[2.5rem] p-10 bg-white group hover:shadow-2xl transition-all">
              <Code2 className="w-10 h-10 text-primary mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-black uppercase mb-4">{t.step2.codeTitle}</h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6">
                {t.step2.codeDesc}
              </p>
              <Button 
                variant="outline" 
                className="w-full rounded-full font-black text-[10px] uppercase tracking-widest border-2 h-12"
                onClick={() => {
                   toast({ title: "Template Reference", description: "Reference src/app/lib/gas-template.ts" });
                }}
              >
                Access Template
              </Button>
            </Card>

            <Card className="border-none shadow-xl rounded-[2.5rem] p-10 bg-slate-900 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Rocket className="w-24 h-24" />
              </div>
              <Rocket className="w-10 h-10 text-primary mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-black uppercase mb-4">{t.step2.deployTitle}</h3>
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span className="text-xs font-bold text-slate-300">{t.step2.deploy1}</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span className="text-xs font-bold text-slate-300">{t.step2.deploy2}</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span className="text-xs font-bold text-slate-300">{t.step2.deploy3}</span>
                </div>
              </div>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest leading-relaxed">
                {t.step2.deployFooter}
              </p>
            </Card>
          </div>
        </section>

        {/* Step 3: Frontend Config */}
        <section className="space-y-10">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-[2rem] bg-slate-900 text-primary flex items-center justify-center text-2xl font-black shadow-2xl">{t.step3.num}</div>
            <div>
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">{t.step3.title}</h2>
              <p className="text-slate-500 font-medium">{t.step3.desc}</p>
            </div>
          </div>

          <Card className="border-none shadow-2xl rounded-[3rem] overflow-hidden bg-white">
            <CardContent className="p-0 flex flex-col md:flex-row">
              <div className="flex-1 p-12 border-b md:border-b-0 md:border-r border-slate-100">
                <h3 className="text-xl font-black uppercase mb-6 flex items-center gap-3">
                  <CheckCircle2 className="text-emerald-500" />
                  {t.step3.logicTitle}
                </h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed mb-8">
                  {t.step3.logicDesc}
                </p>
                <div className="p-6 bg-slate-900 rounded-2xl">
                  <pre className="text-xs text-blue-400 font-mono">
                    export const API_URL = "https://script.google.com/..."
                  </pre>
                </div>
              </div>
              <div className="w-full md:w-80 bg-slate-50 p-12 flex flex-col justify-center">
                <div className="space-y-6">
                  <div className="text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">{t.step3.ready}</p>
                    <Link href="/login">
                      <Button className="w-full h-14 rounded-full font-black uppercase tracking-tighter bg-primary shadow-xl shadow-primary/20 hover:scale-105 transition-transform">
                        {t.step3.launch}
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3 text-xs font-bold text-slate-400">
                      <Users className="w-4 h-4" />
                      <span>Admin: admin@dntrng.com</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-bold text-slate-400">
                      <Zap className="w-4 h-4" />
                      <span>Pass: admin123</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

      </main>

      {/* Footer */}
      <footer className="py-20 border-t border-slate-100 bg-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">
            © {new Date().getFullYear()} DNTRNG PLATFORM • INITIALIZATION PROTOCOL COMPLETED
          </p>
        </div>
      </footer>
    </div>
  );
}
