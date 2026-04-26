
/**
 * EventsFilterBar.tsx
 * 
 * Purpose: Centralized controls for searching, filtering, and exporting system events.
 * Used by: src/components/admin/EventsTab.tsx
 */

import React from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, RefreshCcw, Download } from 'lucide-react';
import { cn } from "@/lib/utils";

interface EventsFilterBarProps {
  dateFilter: string;
  setDateFilter: (f: any) => void;
  eventTypeFilter: string;
  setEventTypeFilter: (t: string) => void;
  eventTypes: string[];
  searchTerm: string;
  setSearchTerm: (s: string) => void;
  loading: boolean;
  onRefresh: () => void;
  onExport: () => void;
}

export function EventsFilterBar({ 
  dateFilter, setDateFilter, eventTypeFilter, setEventTypeFilter, 
  eventTypes, searchTerm, setSearchTerm, loading, onRefresh, onExport 
}: EventsFilterBarProps) {
  return (
    <Card className="border-none shadow-sm bg-white p-6 rounded-[2.5rem] flex flex-wrap items-center justify-between gap-6">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex bg-slate-100 p-1 rounded-full border">
          {['today', 'week', 'month', 'all'].map((f) => (
            <button
              key={f}
              onClick={() => setDateFilter(f)}
              className={cn("px-4 py-2 rounded-full text-[10px] font-black uppercase", dateFilter === f ? "bg-white text-primary shadow-sm" : "text-slate-400")}
            >
              {f}
            </button>
          ))}
        </div>
        <select value={eventTypeFilter} onChange={(e) => setEventTypeFilter(e.target.value)} className="h-10 px-4 rounded-full bg-slate-50 border text-[10px] font-black uppercase outline-none">
          <option value="all">All Events</option>
          {eventTypes.map(t => <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>)}
        </select>
        <div className="relative w-64">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-11 h-10 rounded-full bg-slate-50 font-bold text-xs" />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" onClick={onRefresh} className="rounded-full h-11 w-11"><RefreshCcw className={cn("w-4 h-4", loading && "animate-spin")} /></Button>
        <Button onClick={onExport} className="rounded-full h-11 px-6 font-black uppercase text-[10px] bg-slate-900 text-white shadow-xl"><Download className="w-4 h-4 mr-2" /> Export CSV</Button>
      </div>
    </Card>
  );
}
