
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Database, 
  LayoutGrid, 
  Settings, 
  RefreshCcw, 
  CheckCircle2, 
  XCircle, 
  ChevronLeft,
  FileText,
  Users as UsersIcon,
  BarChart3,
  ExternalLink,
  Search,
  AlertCircle,
  ShieldAlert,
  Loader2,
  Table as TableIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { API_URL } from '@/lib/api-config';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth-context';

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [tests, setTests] = useState<any[]>([]);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const fetchTests = async () => {
    if (!API_URL) {
      setStatus('error');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}?action=getTests`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setTests(data);
        setStatus('success');
      } else {
        throw new Error("Invalid format");
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
      toast({
        variant: "destructive",
        title: "Sync Error",
        description: "Could not fetch tests metadata from the 'Tests' sheet.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') fetchTests();
  }, [user]);

  if (authLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <ShieldAlert className="w-20 h-20 text-red-500 mb-4" />
        <h1 className="text-2xl font-black">Access Denied</h1>
        <p className="text-muted-foreground mt-2">Admins only.</p>
        <Link href="/" className="mt-6"><Button>Return Home</Button></Link>
      </div>
    );
  }

  const filteredTests = tests.filter(t => 
    (t.title?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (t.id?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50/50">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/"><Button variant="ghost" size="icon" className="rounded-full"><ChevronLeft /></Button></Link>
            <div>
              <h1 className="text-xl font-bold flex items-center gap-2">
                <Settings className="w-5 h-5 text-primary" />
                QuestFlow Admin
              </h1>
              <p className="text-xs text-muted-foreground">Master Controller</p>
            </div>
          </div>
          <Button onClick={fetchTests} disabled={loading} className="rounded-full">
            <RefreshCcw className={loading ? "animate-spin mr-2" : "mr-2"} />
            Sync Metadata
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 border-none shadow-sm flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-xl text-blue-600"><LayoutGrid /></div>
            <div><p className="text-xs font-bold text-muted-foreground uppercase">Total Tests</p><p className="text-2xl font-black">{tests.length}</p></div>
          </Card>
          <Card className="p-6 border-none shadow-sm flex items-center gap-4">
            <div className="p-3 bg-green-50 rounded-xl text-green-600"><UsersIcon /></div>
            <div><p className="text-xs font-bold text-muted-foreground uppercase">User Count</p><p className="text-2xl font-black">Sheets</p></div>
          </Card>
          <Card className="p-6 border-none shadow-sm flex items-center gap-4">
            <div className="p-3 bg-purple-50 rounded-xl text-purple-600"><Database /></div>
            <div><p className="text-xs font-bold text-muted-foreground uppercase">Storage</p><p className="text-2xl font-black">Multi-Sheet</p></div>
          </Card>
          <Card className="p-6 border-none shadow-sm flex items-center gap-4">
            <div className="p-3 bg-orange-50 rounded-xl text-orange-600"><RefreshCcw /></div>
            <div><p className="text-xs font-bold text-muted-foreground uppercase">Status</p><p className="text-2xl font-black">{status.toUpperCase()}</p></div>
          </Card>
        </div>

        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Assessment Registry</CardTitle>
              <CardDescription>Listing all tests defined in your 'Tests' sheet.</CardDescription>
            </div>
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search test registry..." 
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
                    <TableHead>Test ID / Sheet Name</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Difficulty</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTests.map((t, i) => (
                    <TableRow key={i}>
                      <TableCell><Badge variant="outline" className="font-mono">{t.id}</Badge></TableCell>
                      <TableCell className="font-bold">{t.title}</TableCell>
                      <TableCell><Badge variant="secondary">{t.category}</Badge></TableCell>
                      <TableCell>{t.difficulty}</TableCell>
                      <TableCell className="text-right">
                        <Link href={`/quiz?id=${t.id}`}>
                          <Button variant="ghost" size="sm" className="rounded-full">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Launch
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
      </main>
    </div>
  );
}
