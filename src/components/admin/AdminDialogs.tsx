"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import { Question } from '@/types/quiz';
import { Skeleton } from '@/components/ui/skeleton';

// Performance: Lazy load dialogs to reduce initial JS bundle size
const TestDialog = dynamic(() => import('./dialogs/TestDialog').then(mod => mod.TestDialog), {
  ssr: false,
  loading: () => <Skeleton className="fixed inset-0 z-50 bg-white/10" />
});

const QuestionDialog = dynamic(() => import('./dialogs/QuestionDialog').then(mod => mod.QuestionDialog), {
  ssr: false,
  loading: () => <Skeleton className="fixed inset-0 z-50 bg-white/10" />
});

const UserDialog = dynamic(() => import('./dialogs/UserDialog').then(mod => mod.UserDialog), {
  ssr: false,
  loading: () => <Skeleton className="fixed inset-0 z-50 bg-white/10" />
});

const BulkDialog = dynamic(() => import('./dialogs/BulkDialog').then(mod => mod.BulkDialog), {
  ssr: false,
  loading: () => <Skeleton className="fixed inset-0 z-50 bg-white/10" />
});

interface AdminDialogsProps {
  dialogs: {
    test: boolean;
    user: boolean;
    question: boolean;
    bulk: boolean;
  };
  setDialogs: (dialogs: any) => void;
  editingItem: any;
  selectedTestId: string;
  questions: Question[];
  onSaveTest: (data: any) => void;
  onSaveUser: (data: any) => void;
  onSaveUsers?: (data: any[]) => void;
  onSaveQuestion: (data: any, isRequired: boolean) => void;
  onSaveBulk: (json: string) => void;
  loading?: boolean;
}

export function AdminDialogs({ 
  dialogs, 
  setDialogs, 
  editingItem, 
  selectedTestId, 
  questions,
  onSaveTest, 
  onSaveUser, 
  onSaveUsers,
  onSaveQuestion, 
  onSaveBulk,
  loading
}: AdminDialogsProps) {
  return (
    <>
      {dialogs.test && (
        <TestDialog 
          open={dialogs.test} 
          onOpenChange={(val) => setDialogs({...dialogs, test: val})}
          editingItem={editingItem}
          onSave={onSaveTest}
          loading={loading}
        />
      )}

      {dialogs.question && (
        <QuestionDialog 
          open={dialogs.question}
          onOpenChange={(val) => setDialogs({...dialogs, question: val})}
          editingItem={editingItem}
          selectedTestId={selectedTestId}
          onSave={onSaveQuestion}
          loading={loading}
        />
      )}

      {dialogs.user && (
        <UserDialog 
          open={dialogs.user}
          onOpenChange={(val) => setDialogs({...dialogs, user: val})}
          editingItem={editingItem}
          onSave={onSaveUser}
          onSaveBatch={onSaveUsers}
          loading={loading}
        />
      )}

      {dialogs.bulk && (
        <BulkDialog 
          open={dialogs.bulk}
          onOpenChange={(val) => setDialogs({...dialogs, bulk: val})}
          selectedTestId={selectedTestId}
          questions={questions}
          onSave={onSaveBulk}
        />
      )}
    </>
  );
}
