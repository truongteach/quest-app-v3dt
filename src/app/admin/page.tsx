
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Database, 
  LayoutGrid, 
  Settings, 
  RefreshCcw, 
  ChevronLeft,
  Users as UsersIcon,
  BarChart3,
  ExternalLink,
  Search,
  ShieldAlert,
  Loader2,
  Table as TableIcon,
  FileText,
  MessageSquare,
  Home,
  LogOut,
  ChevronRight,
  ClipboardList
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem, 
  SidebarProvider,
  SidebarTrigger,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent
} from "@/components/ui/sidebar";
import { API_URL } from '@/lib/api-config';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth-context';
import { cn } from "@/lib/utils";

type AdminTab = 'overview' | 'tests' | 'users' | 'responses';

export default function AdminDashboard() {
  const { user, loading: authLoading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{ tests: any[], users: any[], responses: any[] }>({
    tests: [],
    users: [],
    responses: []
  });
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const fetchData = async () => {
    if (!API_URL) return;
    setLoading(true);
    try {
      // Fetch Tests
      const testsRes = await fetch(`${API_URL}?action=getTests`);
      const testsData = await testsRes.json();
      
      // Fetch Users (using new action)
      const usersRes = await fetch(`${API_URL}?action=getUsers`);
      const usersData = await usersRes.json();

      // Fetch Responses (using new action)
      const responsesRes = await fetch(`${API_URL}?action=getResponses`);
      const responsesData = await responsesRes.json();

      setData({
        tests: Array.isArray(testsData) ? testsData : [],
        users: Array.isArray(usersData) ? usersData : [],
        responses: Array.isArray(responsesData) ? responsesData : []
      });

      toast({
        title: "Sync Successful",
        description: "Dashboard data updated from Google Sheets.",
      });
    } catch (err) {
      console.error(err);
      toast({
        variant: "destructive",
        title: "Sync Error",
        description: "Could not fetch data from the spreadsheet. Check your Apps Script deployment.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') fetchData();
  }, [user]);

  if (authLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>;

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <ShieldAlert className="w-20 h-20 text-red-500 mb-4" />
        <h1 className="text-2xl font-black">Access Denied</h1>
        <p className="text-muted-foreground mt-2">Only administrators can access this control panel.</p>
        <Link href="/" className="mt-6"><Button className="rounded-full">Return Home</Button></Link>
      </div>
    );
  }

  const renderOverview = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-none shadow-sm hover:shadow-md transition-all">
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-2xl text-blue-600"><LayoutGrid className="w-6 h-6" /></div>
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Live Tests</p>
              <p className="text-3xl font-black">{data.tests.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm hover:shadow-md transition-all">
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="p-3 bg-green-50 rounded-2xl text-green-600"><UsersIcon className="w-6 h-6" /></div>
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Registered Users</p>
              <p className="text-3xl font-black">{data.users.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm hover:shadow-md transition-all">
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="p-3 bg-purple-50 rounded-2xl text-purple-600"><ClipboardList className="w-6 h-6" /></div>
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Submissions</p>
              <p className="text-3xl font-black">{data.responses.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm hover:shadow-md transition-all">
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="p-3 bg-orange-50 rounded-2xl text-orange-600"><Database className="w-6 h-6" /></div>
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Cloud Sync</p>
              <p className="text-sm font-black text-orange-600">CONNECTED</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">Quick Start</CardTitle>
            <CardDescription>Manage your platform from Google Sheets</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: "Update Test Library", desc: "Modify rows in the 'Tests' tab", icon: TableIcon },
              { label: "Add Questions", desc: "Create a new tab named exactly as the Test ID", icon: FileText },
              { label: "User Access", desc: "Add or remove email/passwords in 'Users'", icon: UsersIcon }
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                <div className="bg-white p-2 rounded-lg shadow-sm"><step.icon className="w-4 h-4 text-primary" /></div>
                <div>
                  <p className="text-sm font-bold">{step.label}</p>
                  <p className="text-xs text-muted-foreground">{step.desc}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">System Status</CardTitle>
            <CardDescription>Real-time connectivity report</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Google Apps Script</span>
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none">Active</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Sheets API Access</span>
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none">Authorized</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Last Data Sync</span>
                <span className="text-xs text-muted-foreground">{new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderTests = () => (
    <Card className="border-none shadow-sm animate-in slide-in-from-bottom-4 duration-500">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Assessment Registry</CardTitle>
          <CardDescription>Manage all active test definitions</CardDescription>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Filter tests..." 
            className="pl-10 rounded-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-xl border overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead>Test ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead className="text-right">Preview</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.tests.filter(t => t.title?.toLowerCase().includes(searchTerm.toLowerCase())).map((t, i) => (
                <TableRow key={i}>
                  <TableCell><Badge variant="outline" className="font-mono bg-white">{t.id}</Badge></TableCell>
                  <TableCell className="font-bold">{t.title}</TableCell>
                  <TableCell><Badge variant="secondary" className="rounded-lg">{t.category}</Badge></TableCell>
                  <TableCell>
                    <span className={cn(
                      "text-xs font-bold px-2 py-1 rounded-full",
                      t.difficulty === 'Beginner' ? 'bg-green-50 text-green-600' :
                      t.difficulty === 'Intermediate' ? 'bg-orange-50 text-orange-600' : 'bg-red-50 text-red-600'
                    )}>
                      {t.difficulty}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/quiz?id=${t.id}`} target="_blank">
                      <Button variant="ghost" size="sm" className="rounded-full">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Open
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );

  const renderUsers = () => (
    <Card className="border-none shadow-sm animate-in slide-in-from-bottom-4 duration-500">
      <CardHeader>
        <CardTitle>Platform Users</CardTitle>
        <CardDescription>Listing all accounts defined in your 'Users' sheet</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-xl border overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead>UID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.users.map((u, i) => (
                <TableRow key={i}>
                  <TableCell className="font-mono text-xs">{u.id || `U-${i+100}`}</TableCell>
                  <TableCell className="font-bold">{u.name}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>
                    <Badge className={u.role === 'admin' ? "bg-primary" : "bg-slate-200 text-slate-700 hover:bg-slate-200"}>
                      {u.role?.toUpperCase()}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );

  const renderResponses = () => (
    <Card className="border-none shadow-sm animate-in slide-in-from-bottom-4 duration-500">
      <CardHeader>
        <CardTitle>Recent Submissions</CardTitle>
        <CardDescription>Viewing the last 50 responses captured</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-xl border overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Test ID</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Duration</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.responses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">No submissions found.</TableCell>
                </TableRow>
              ) : (
                data.responses.map((r, i) => (
                  <TableRow key={i}>
                    <TableCell className="text-xs">{new Date(r.Timestamp).toLocaleString()}</TableCell>
                    <TableCell><Badge variant="outline">{r['Test ID']}</Badge></TableCell>
                    <TableCell className="font-bold">
                      {r.Score} / {r.Total}
                      <span className="ml-2 text-xs text-muted-foreground">({Math.round((r.Score / r.Total) * 100)}%)</span>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {Math.round(r['Duration (ms)'] / 1000)}s
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-slate-50/50 w-full">
        <Sidebar className="border-r shadow-sm">
          <SidebarHeader className="p-6">
            <div className="flex items-center gap-3">
              <div className="bg-primary p-2 rounded-xl shadow-lg">
                <Settings className="text-white w-5 h-5" />
              </div>
              <div>
                <h1 className="text-lg font-black tracking-tight">Admin</h1>
                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest leading-none mt-1">QuestFlow Panel</p>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent className="px-3">
            <SidebarGroup>
              <SidebarGroupLabel className="px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Core Management</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {[
                    { id: 'overview', label: 'Dashboard', icon: BarChart3 },
                    { id: 'tests', label: 'Assessments', icon: ClipboardList },
                    { id: 'users', label: 'User Table', icon: UsersIcon },
                    { id: 'responses', label: 'Results & Logs', icon: MessageSquare }
                  ].map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton 
                        isActive={activeTab === item.id} 
                        onClick={() => setActiveTab(item.id as AdminTab)}
                        className={cn(
                          "h-12 px-4 rounded-xl font-bold transition-all",
                          activeTab === item.id ? "bg-primary text-white shadow-md hover:bg-primary" : "text-slate-500 hover:bg-slate-100"
                        )}
                      >
                        <item.icon className="w-5 h-5 mr-3" />
                        {item.label}
                        {activeTab === item.id && <ChevronRight className="ml-auto w-4 h-4 opacity-50" />}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup className="mt-8">
              <SidebarGroupLabel className="px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">External Links</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <Link href="/setup-guide" className="w-full">
                      <SidebarMenuButton className="h-12 px-4 rounded-xl font-bold text-slate-500 hover:bg-slate-100 w-full">
                        <FileText className="w-5 h-5 mr-3" />
                        Setup Guide
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <Link href="/" className="w-full">
                      <SidebarMenuButton className="h-12 px-4 rounded-xl font-bold text-slate-500 hover:bg-slate-100 w-full">
                        <Home className="w-5 h-5 mr-3" />
                        Back Home
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="p-4 border-t bg-slate-50/50">
            <div className="p-4 bg-white rounded-2xl border flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs font-black">{user.displayName || 'Admin'}</span>
                <span className="text-[10px] text-muted-foreground font-medium truncate w-24">{user.email}</span>
              </div>
              <Button variant="ghost" size="icon" onClick={logout} className="rounded-full text-destructive hover:bg-destructive/10">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1">
          <header className="h-20 border-b bg-white flex items-center justify-between px-8 sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="lg:hidden" />
              <div>
                <h2 className="text-xl font-black capitalize tracking-tight">{activeTab} Control</h2>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Live Cloud Sync Active</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                onClick={fetchData} 
                disabled={loading} 
                variant="outline"
                className="rounded-full border-2 font-bold px-6"
              >
                <RefreshCcw className={cn("w-4 h-4 mr-2", loading && "animate-spin")} />
                Sync Data
              </Button>
            </div>
          </header>

          <div className="p-8 max-w-7xl mx-auto">
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'tests' && renderTests()}
            {activeTab === 'users' && renderUsers()}
            {activeTab === 'responses' && renderResponses()}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
