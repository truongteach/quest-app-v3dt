
"use client";

import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { API_URL } from '@/lib/api-config';
import { OverviewTab } from '@/components/admin/OverviewTab';
import { AdminDialogs } from '@/components/admin/AdminDialogs';
import { useRouter } from 'next/navigation';
import { DEMO_QUESTIONS, AVAILABLE_TESTS } from '@/app/lib/demo-data';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{ tests: any[], users: any[], responses: any[] }>({
    tests: [],
    users: [],
    responses: []
  });
  const { toast } = useToast();
  const router = useRouter();

  const [dialogs, setDialogs] = useState({
    test: false,
    user: false,
    question: false,
    bulk: false
  });

  const fetchData = async () => {
    if (!API_URL) return;
    setLoading(true);
    try {
      const [testsRes, usersRes, responsesRes] = await Promise.all([
        fetch(`${API_URL}?action=getTests`),
        fetch(`${API_URL}?action=getUsers`),
        fetch(`${API_URL}?action=getResponses`)
      ]);

      const [testsData, usersData, responsesData] = await Promise.all([
        testsRes.json(),
        usersRes.json(),
        responsesRes.json()
      ]);

      setData({
        tests: Array.isArray(testsData) ? testsData : [],
        users: Array.isArray(usersData) ? usersData : [],
        responses: Array.isArray(responsesData) ? responsesData : []
      });
    } catch (err) {
      toast({ variant: "destructive", title: "Sync Error", description: "Could not fetch data." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePost = async (action: string, payload: any) => {
    if (!API_URL) return;
    setLoading(true);
    try {
      await fetch(API_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify({ action, ...payload })
      });
      return true;
    } catch (err) {
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleSeedData = async () => {
    toast({ title: "Seeding Started", description: "Synchronizing demo library with your Google Sheet..." });
    
    try {
      // Seed Tests using static IDs from demo-data.ts to avoid duplication via GAS upsertRow
      for (const test of AVAILABLE_TESTS) {
        await handlePost('saveTest', { data: {
          id: test.id,
          title: test.title,
          description: test.description,
          category: test.category,
          difficulty: test.difficulty,
          duration: test.duration,
          image_url: test.image
        }});
      }

      // Seed Questions for the primary demo test
      // saveQuestions clears the sheet first, ensuring no duplicates for that specific test
      await handlePost('saveQuestions', { 
        testId: 'demo-full', 
        questions: DEMO_QUESTIONS 
      });

      toast({ title: "Sync Complete", description: "Demo content is now live in your database." });
      
      // Refresh local data to reflect changes
      setTimeout(fetchData, 2000);
    } catch (error) {
      toast({ variant: "destructive", title: "Seed Error", description: "Could not complete the sync." });
    }
  };

  return (
    <div className="space-y-8">
      <OverviewTab 
        data={data} 
        onNewTest={() => setDialogs({ ...dialogs, test: true })}
        onManageContent={() => router.push('/admin/tests')}
        onSync={fetchData}
        onSeed={handleSeedData}
        setActiveTab={(tab) => router.push(`/admin/${tab === 'overview' ? '' : tab}`)}
      />

      <AdminDialogs 
        dialogs={dialogs} 
        setDialogs={setDialogs}
        editingItem={null}
        selectedTestId=""
        questions={[]}
        onSaveTest={async (testData) => {
          const payload = { ...testData };
          if (!payload.id) {
            const slug = (payload.title as string || 'test').toLowerCase().replace(/[^a-z0-9]/g, '-');
            payload.id = `${slug}-${Date.now().toString().slice(-4)}`;
          }
          const ok = await handlePost('saveTest', { data: payload });
          if (ok) {
            toast({ title: "Success", description: "Assessment record updated." });
            fetchData();
          }
        }}
        onSaveUser={async (userData) => {
          const ok = await handlePost('saveUser', { data: userData });
          if (ok) {
            toast({ title: "Success", description: "User record updated." });
            fetchData();
          }
        }}
        onSaveQuestion={() => {}}
        onSaveBulk={() => {}}
      />
    </div>
  );
}
