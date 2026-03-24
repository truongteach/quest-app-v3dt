"use client";

import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  FileText,
  LayoutGrid,
  List,
  MoreVertical,
  ChevronRight,
  Clock,
  ListChecks
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface TestsTabProps {
  tests: any[];
  onEdit: (test: any) => void;
  onDelete: (id: string) => void;
  onManageQuestions: (id: string) => void;
  onAdd: () => void;
}

export function TestsTab({ tests, onEdit, onDelete, onManageQuestions, onAdd }: TestsTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<'list' | 'card'>('list');

  const filtered = tests.filter(t => 
    (t.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (t.id || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-[2rem] border shadow-sm">
        <div>
          <h2 className="font-black text-2xl text-slate-900 tracking-tight uppercase">Test Library</h2>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Manage your active assessments</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search tests..." 
              className="pl-10 rounded-full bg-slate-50 border-slate-200 h-11" 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
          </div>

          <div className="flex items-center bg-slate-100 p-1 rounded-full border">
            <Button 
              variant={viewMode === 'list' ? 'secondary' : 'ghost'} 
              size="icon" 
              onClick={() => setViewMode('list')}
              className={cn("rounded-full h-9 w-9", viewMode === 'list' && "bg-white shadow-sm")}
            >
              <List className="w-4 h-4" />
            </Button>
            <Button 
              variant={viewMode === 'card' ? 'secondary' : 'ghost'} 
              size="icon" 
              onClick={() => setViewMode('card')}
              className={cn("rounded-full h-9 w-9", viewMode === 'card' && "bg-white shadow-sm")}
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
          </div>

          <Button onClick={onAdd} className="rounded-full h-11 px-6 gap-2 font-black shadow-lg bg-primary">
            <Plus className="w-4 h-4" /> New Test
          </Button>
        </div>
      </div>

      {viewMode === 'list' ? (
        <Card className="border-none shadow-sm bg-white overflow-hidden rounded-[2rem]">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-none">
                  <TableHead className="px-8 py-5 font-black uppercase text-[10px] tracking-widest">ID</TableHead>
                  <TableHead className="font-black uppercase text-[10px] tracking-widest px-8">Test Title</TableHead>
                  <TableHead className="font-black uppercase text-[10px] tracking-widest px-8">Category</TableHead>
                  <TableHead className="font-black uppercase text-[10px] tracking-widest px-8 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((t, i) => (
                  <TableRow key={i} className="group border-b border-slate-50 last:border-none">
                    <TableCell className="px-8 py-5">
                      <Badge variant="outline" className="font-mono text-[10px] bg-slate-50 rounded-md border-slate-200">
                        {t.id}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-8 font-black text-slate-700">{t.title}</TableCell>
                    <TableCell className="px-8">
                      <Badge variant="secondary" className="font-black text-[10px] uppercase tracking-wider px-3 rounded-full bg-primary/5 text-primary border-none">
                        {t.category || 'General'}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-8 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <Button variant="ghost" size="sm" onClick={() => onManageQuestions(t.id)} className="rounded-full text-primary font-black text-xs hover:bg-primary/5">
                          <FileText className="w-4 h-4 mr-1.5" /> QUESTIONS
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => onEdit(t)} className="rounded-full h-8 w-8 hover:bg-slate-100">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => onDelete(t.id)} className="rounded-full h-8 w-8 text-destructive hover:bg-destructive/5">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filtered.length === 0 && (
              <div className="py-24 text-center">
                <p className="font-black text-slate-300 uppercase tracking-widest">No Tests Found</p>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((t, i) => (
            <Card key={i} className="group overflow-hidden border-none shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 rounded-[2.5rem] bg-white flex flex-col">
              <div className="relative aspect-video overflow-hidden bg-slate-100">
                <img 
                  src={t.image_url || `https://picsum.photos/seed/${t.id}/800/450`} 
                  alt={t.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-white/95 text-primary hover:bg-white shadow-xl border-none backdrop-blur-md font-black text-[10px] uppercase tracking-widest px-4 py-1.5 rounded-full">
                    {t.category || "General"}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="secondary" className="rounded-full h-10 w-10 shadow-2xl bg-white/80 backdrop-blur-md">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="rounded-2xl p-2 w-48 shadow-2xl border-none" align="end">
                      <DropdownMenuItem onClick={() => onEdit(t)} className="rounded-xl font-bold p-3 cursor-pointer">
                        <Edit className="w-4 h-4 mr-2" /> Edit Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDelete(t.id)} className="rounded-xl font-bold p-3 cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive">
                        <Trash2 className="w-4 h-4 mr-2" /> Delete Test
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <CardHeader className="flex-1 pb-2">
                <div className="flex justify-between items-start gap-2 mb-2">
                  <Badge variant="outline" className="font-mono text-[9px] uppercase tracking-tighter opacity-50 px-2 rounded-md">
                    {t.id}
                  </Badge>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.difficulty || 'Easy'}</span>
                </div>
                <CardTitle className="text-xl font-black text-slate-900 line-clamp-1 group-hover:text-primary transition-colors">
                  {t.title}
                </CardTitle>
                <CardDescription className="line-clamp-2 mt-2 font-medium text-slate-500 text-sm">
                  {t.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="pb-6">
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <ListChecks className="w-4 h-4 text-primary opacity-40" />
                    <span>{t.duration || '15m'} Limit</span>
                  </div>
                  <div className="h-4 w-px bg-slate-100" />
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-primary opacity-40" />
                    <span>Live Sync</span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="pt-0 p-4 mt-auto">
                <Button 
                  onClick={() => onManageQuestions(t.id)}
                  className="w-full h-12 rounded-full font-black text-xs uppercase tracking-widest shadow-lg group-hover:shadow-primary/20 transition-all hover:scale-[1.02]"
                >
                  Questions
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}