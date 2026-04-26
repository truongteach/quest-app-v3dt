
/**
 * TestsTable.tsx
 * 
 * Purpose: Renders the administrative test library in a compact list view.
 * Used by: src/components/admin/TestsTab.tsx
 */

import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart3, FileEdit, Edit, Trash2 } from 'lucide-react';
import { Pagination } from '../Pagination';

export function TestsTable({ data, loading, onEdit, onDelete, onManageQuestions, onViewAnalytics, t, pagination }: any) {
  return (
    <Card className="border-none shadow-sm bg-white dark:bg-slate-900 overflow-hidden rounded-[2rem]">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50/50">
            <TableHead className="px-8 py-5 font-black uppercase text-[10px] tracking-widest">ID</TableHead>
            <TableHead className="font-black uppercase text-[10px] tracking-widest px-8">Title</TableHead>
            <TableHead className="font-black uppercase text-[10px] tracking-widest px-8 text-center">Items</TableHead>
            <TableHead className="font-black uppercase text-[10px] tracking-widest px-8">Category</TableHead>
            <TableHead className="px-8 text-right font-black uppercase text-[10px] tracking-widest">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((t_item: any) => (
            <TableRow key={t_item.id} className="group hover:bg-slate-50/80">
              <TableCell className="px-8 py-5"><Badge variant="outline" className="font-mono text-[10px]">{t_item.id}</Badge></TableCell>
              <TableCell className="px-8 font-black text-slate-700">{t_item.title}</TableCell>
              <TableCell className="px-8 text-center font-bold text-slate-500">{t_item.questions_count ?? "---"}</TableCell>
              <TableCell className="px-8"><Badge className="bg-primary/5 text-primary border-none text-[10px]">{t_item.category || 'General'}</Badge></TableCell>
              <TableCell className="px-8 text-right">
                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="sm" onClick={() => onViewAnalytics(t_item)} className="rounded-full text-primary font-black text-xs"><BarChart3 className="w-4 h-4 mr-1.5" /> Analytics</Button>
                  <Button variant="ghost" size="sm" onClick={() => onManageQuestions(t_item.id)} className="rounded-full text-slate-600 font-black text-xs"><FileEdit className="w-4 h-4 mr-1.5" /> {t('questions')}</Button>
                  <Button variant="ghost" size="icon" onClick={() => onEdit(t_item)} className="rounded-full h-8 w-8"><Edit className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => onDelete(t_item.id)} className="rounded-full h-8 w-8 text-destructive"><Trash2 className="w-4 h-4" /></Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination {...pagination} />
    </Card>
  );
}

import { Card } from "@/components/ui/card";
