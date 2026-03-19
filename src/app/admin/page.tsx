
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
    toast({ title: "Seeding Started", description: "Pushing full feature demo to your Google Sheet..." });
    
    try {
      // 1. Seed Tests
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

      // 2. Seed Questions for the tour test
      await handlePost('saveQuestions', { 
        testId: 'demo-full', 
        questions: DEMO_QUESTIONS 
      });

      toast({ title: "Success", description: "Demo library populated successfully." });
      setTimeout(fetchData, 2000); // Wait for GAS to finalize
    } catch (error) {
      toast({ variant: "destructive", title: "Seed Failed", description: "Some content could not be pushed." });
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
            toast({ title: "Success", description: "Test saved." });
            fetchData();
          }
        }}
        onSaveUser={async (userData) => {
          const ok = await handlePost('saveUser', { data: userData });
          if (ok) {
            toast({ title: "Success", description: "User updated." });
            fetchData();
          }
        }}
        onSaveQuestion={() => {}}
        onSaveBulk={() => {}}
      />
    </div>
  );
}
