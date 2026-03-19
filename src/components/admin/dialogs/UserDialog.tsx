"use client";

import React from 'react';
import { 
  Dialog,
  DialogContent,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users as UsersIcon } from "lucide-react";

interface UserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingItem: any;
  onSave: (data: any) => void;
}

export function UserDialog({ open, onOpenChange, editingItem, onSave }: UserDialogProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onSave(Object.fromEntries(formData.entries()));
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px] rounded-[3rem] p-0 overflow-hidden border-none shadow-2xl bg-white">
        <div className="bg-slate-100 p-10 border-b relative">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <UsersIcon className="w-20 h-20" />
          </div>
          <DialogTitle className="text-3xl font-black uppercase tracking-tight text-slate-900">
            {editingItem ? 'Edit Profile' : 'New Identity'}
          </DialogTitle>
        </div>
        <form onSubmit={handleSubmit} className="p-10 space-y-6">
          <div className="space-y-2">
            <Label className="font-black text-[10px] uppercase tracking-widest text-slate-400 ml-1">Identity Name</Label>
            <Input name="name" defaultValue={editingItem?.name} required className="rounded-xl h-12 bg-slate-50 border-none ring-1 ring-slate-200 font-bold" />
          </div>
          <div className="space-y-2">
            <Label className="font-black text-[10px] uppercase tracking-widest text-slate-400 ml-1">Communication Email</Label>
            <Input name="email" type="email" defaultValue={editingItem?.email} required disabled={!!editingItem} className="rounded-xl h-12 bg-slate-50 border-none ring-1 ring-slate-200" />
          </div>
          <div className="space-y-2">
            <Label className="font-black text-[10px] uppercase tracking-widest text-slate-400 ml-1">Access Secret</Label>
            <Input name="password" type="password" placeholder={editingItem ? "Leave to maintain" : "Define secret..."} required={!editingItem} className="rounded-xl h-12 bg-slate-50 border-none ring-1 ring-slate-200" />
          </div>
          <div className="space-y-2">
            <Label className="font-black text-[10px] uppercase tracking-widest text-slate-400 ml-1">Permission Level</Label>
            <select name="role" defaultValue={editingItem?.role || 'user'} className="w-full h-12 px-4 rounded-xl border-none ring-1 ring-slate-200 bg-slate-50 font-black text-sm outline-none focus:ring-primary/40">
              <option value="user">Student Operator</option>
              <option value="admin">Platform Admin</option>
            </select>
          </div>
          <DialogFooter className="pt-6">
            <Button type="submit" className="rounded-full w-full h-16 font-black text-lg bg-slate-900 text-white shadow-xl">Update Identity Records</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}