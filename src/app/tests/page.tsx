
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { API_URL } from '@/lib/api-config';
import { AVAILABLE_TESTS as DEMO_TESTS } from '@/app/lib/demo-data';
import { LibraryHeader } from '@/components/library/LibraryHeader';
import { CardView } from '@/components/library/CardView';
import { ListView } from '@/components/library/ListView';
import { EmptyState } from '@/components/library/EmptyState';
import { AILoader } from '@/components/ui/ai-loader';
import { Sparkles, AlertCircle, RefreshCcw, Database, Filter, LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/language-context';
import { useSettings } from '@/context/settings-context';
import { cn } from '@/lib/utils';

/**
 * INTELLIGENCE LIBRARY PROTOCOL
 * 
 * This component manages the retrieval and presentation of assessment modules.
 */
export default function TestsLibrary() {
  const { t } = useLanguage();
  const { settings } = useSettings();
  const [search, setSearch] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
  const [tests, setTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  const brandName = String(settings.platform_name || "DNTRNG");

  useEffect(() => {
    const saved = localStorage.getItem('dntrng_test_view') as 'card' | 'list';
    if (saved && (saved === 'card' || saved === 'list')) {
      setViewMode(saved);
    }
    fetchTests();
  }, []);

  const handleViewChange = (mode: 'card' | 'list') => {
    setViewMode(mode);
    localStorage.setItem('dntrng_test_view', mode);
  };

  const fetchTests = async () => {
    setLoading(true);
    setError(null);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort("Timeout"), 8000);

    try {
      if (API_URL) {
        const res = await fetch(`${API_URL}?action=getTests`, { 
          signal: controller.signal,
          cache: 'no-store'
        });
        clearTimeout(timeoutId);
        if (!res.ok) throw new Error("Registry Handshake Rejected");
        const data = await res.json();
        setTests(Array.isArray(data) ? data : []);
      } else {
        setTests(DEMO_TESTS);
      }
      setLastSync(new Date());
    } catch (err: any) {
      clearTimeout(timeoutId);
      setError("The Registry Bridge is currently unresponsive or misconfigured.");
    } finally {
      setLoading(false);
    }
  };

  const categories = useMemo(() => {
    const cats = new Set<string>();
    tests.forEach(t_item => {
      const cat = String(t_item.category || "").trim();
      if (cat) cats.add(cat);
    });
    return ["all", ...Array.from(cats).sort()];
  }, [tests]);

  const filteredTests = useMemo(() => {
    return tests.filter(t_item => {
      const title = String(t_item.title || "");
      const matchesSearch = title.toLowerCase().includes(search.toLowerCase());
      const matchesDifficulty = difficultyFilter === "all" || String(t_item.difficulty).toLowerCase() === difficultyFilter.toLowerCase();
      const matchesCategory = categoryFilter === "all" || String(t_item.category).toLowerCase() === categoryFilter.toLowerCase();
      return matchesSearch && matchesDifficulty && matchesCategory;
    });
  }, [tests, search, difficultyFilter, categoryFilter]);

  return (
    <div className="min-h-screen bg-slate-50/30 dark:bg-slate-950 flex flex-col transition-colors duration-300">
      <LibraryHeader 
        search={search}
        setSearch={setSearch}
        viewMode={viewMode}
        setViewMode={handleViewChange}
        loading={loading}
        onRefresh={fetchTests}
        lastSync={lastSync}
      />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12 md:py-16">
        {loading ? (
          <div className="py-40"><AILoader /></div>
        ) : error ? (
          <div className="max-w-xl mx-auto text-center py-32 space-y-10">
            <AlertCircle className="w-24 h-24 text-red-500 mx-auto" />
            <h2 className="text-4xl font-black uppercase tracking-tight">Sync Failure</h2>
            <Button onClick={fetchTests} className="h-16 px-12 rounded-full bg-slate-900">Re-initialize Connection</Button>
          </div>
        ) : (
          <div className="space-y-12">
            {!search && (
              <div className="px-4">
                <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter uppercase mb-4">{t('chooseTest')}</h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium text-lg max-w-2xl">{t('testSubtitle')}</p>
              </div>
            )}
            
            {filteredTests.length > 0 ? (
              viewMode === 'card' ? (
                <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4 px-4">
                  <CardView tests={filteredTests} />
                </div>
              ) : (
                <div className="flex flex-col gap-[10px] px-4">
                  <ListView tests={filteredTests} />
                </div>
              )
            ) : (
              <EmptyState onClear={() => { setSearch(""); setDifficultyFilter("all"); setCategoryFilter("all"); }} />
            )}
          </div>
        )}
      </main>
    </div>
  );
}
