
/**
 * src/components/admin/TestsTab.tsx
 * 
 * Purpose: Master control terminal for the assessment module library.
 * Key components: TestsTable, TestsGrid, EventsFilterBar.
 * Props: Standard administrative crud handlers.
 */

"use client";

import React, { useState } from 'react';
import { Plus, Search, LayoutGrid, List, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useLanguage } from '@/context/language-context';
import { useRegistryFilter } from '@/hooks/useRegistryFilter';

// Sub-components per Protocol v18.9
import { TestsTable } from './tests/TestsTable';

export function TestsTab({ tests, loading, onEdit, onDelete, onManageQuestions, onViewAnalytics, onAdd, onRefresh }: any) {
  const { t } = useLanguage();
  const [viewMode, setViewMode] = useState<'list' | 'card'>('list');

  const { searchTerm, setSearchTerm, currentPage, setCurrentPage, paginatedData, totalItems, pageSize } = useRegistryFilter({
    data: tests,
    searchFields: (test: any) => [test.title, test.id, test.category]
  });

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-[2rem] border shadow-sm">
        <h2 className="font-black text-2xl text-slate-900 tracking-tight uppercase">{t('testLibrary')}</h2>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full md:w-64 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder={t('searchTests')} className="pl-10 rounded-full bg-slate-50 border-slate-200 h-11" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <Button variant="outline" size="icon" onClick={onRefresh} className="rounded-full h-11 w-11"><RefreshCcw className={cn("w-4 h-4", loading && "animate-spin")} /></Button>
          </div>
          <div className="flex items-center bg-slate-100 p-1 rounded-full border">
            <Button variant={viewMode === 'list' ? 'secondary' : 'ghost'} size="icon" onClick={() => setViewMode('list')} className={cn("rounded-full h-9 w-9", viewMode === 'list' && "bg-white shadow-sm")}><List className="w-4 h-4" /></Button>
            <Button variant={viewMode === 'card' ? 'secondary' : 'ghost'} size="icon" onClick={() => setViewMode('card')} className={cn("rounded-full h-9 w-9", viewMode === 'card' && "bg-white shadow-sm")}><LayoutGrid className="w-4 h-4" /></Button>
          </div>
          <Button onClick={onAdd} className="rounded-full h-11 px-6 gap-2 font-black shadow-lg bg-primary"><Plus className="w-4 h-4" /> {t('newTest')}</Button>
        </div>
      </div>

      <TestsTable 
        data={paginatedData} loading={loading} onEdit={onEdit} onDelete={onDelete} 
        onManageQuestions={onManageQuestions} onViewAnalytics={onViewAnalytics} t={t}
        pagination={{ currentPage, totalItems, pageSize, onPageChange: setCurrentPage }}
      />
    </div>
  );
}
