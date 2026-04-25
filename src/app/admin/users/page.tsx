"use client";

import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { API_URL } from '@/lib/api-config';
import { UsersTab } from '@/components/admin/UsersTab';
import { AdminDialogs } from '@/components/admin/AdminDialogs';
import { AILoader } from '@/components/ui/ai-loader';
import { logActivity } from '@/lib/activity-log';
import { trackEvent } from '@/lib/tracker';

export default function AdminUsersPage() {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [responses, setResponses] = useState<any[]>([]);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [dialogs, setDialogs] = useState({ test: false, user: false, question: false, bulk: false });
  const { toast } = useToast();

  const fetchData = async () => {
    if (!API_URL) return;
    setLoading(true);
    try {
      const [uRes, rRes] = await Promise.all([
        fetch(`${API_URL}?action=getUsers`),
        fetch(`${API_URL}?action=getResponses`)
      ]);
      const uData = await uRes.json();
      const rData = await rRes.json();
      setUsers(Array.isArray(uData) ? uData : []);
      setResponses(Array.isArray(rData) ? rData : []);
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: "Could not fetch user registry." });
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
      toast({ title: "Success", description: "Identity record updated." });
      setDialogs({ ...dialogs, user: false });
      setTimeout(fetchData, 1500);
      return true;
    } catch (err) {
      toast({ variant: "destructive", title: "Error" });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {loading && users.length === 0 ? (
        <div className="py-20">
          <AILoader />
        </div>
      ) : (
        <UsersTab 
          users={users}
          responses={responses}
          loading={loading}
          onEdit={(item) => { setEditingItem(item); setDialogs({ ...dialogs, user: true }); }}
          onDelete={async (email) => {
            const u = users.find(u => u.email === email);
            const ok = await handlePost('deleteUser', { email });
            if (ok) {
              logActivity("Student deleted", u?.name || email);
              trackEvent('admin_student_delete', { details: { studentId: email } });
            }
          }}
          onAdd={() => { setEditingItem(null); setDialogs({ ...dialogs, user: true }); }}
          onRefresh={fetchData}
        />
      )}

      <AdminDialogs 
        dialogs={dialogs} 
        setDialogs={setDialogs}
        editingItem={editingItem}
        selectedTestId=""
        questions={[]}
        onSaveTest={() => {}}
        onSaveUser={async (userData) => {
          const ok = await handlePost('saveUser', { data: userData });
          if (ok) {
            logActivity(editingItem ? "Student record edited" : "Student added", userData.name);
            trackEvent(editingItem ? 'admin_student_edit' : 'admin_student_add', { 
              details: { studentEmail: userData.email, studentName: userData.name } 
            });
          }
        }}
        onSaveUsers={async (usersData) => {
          const ok = await handlePost('saveUsers', { data: usersData });
          if (ok) {
            logActivity("Bulk student provisioning", `${usersData.length} records committed`);
            trackEvent('admin_student_add', { details: { count: usersData.length, type: 'batch' } });
          }
        }}
        onSaveQuestion={() => {}}
        onSaveBulk={() => {}}
        loading={loading}
      />
    </div>
  );
}
