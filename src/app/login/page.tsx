
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Database, LogIn, Loader2, ArrowLeft, Mail } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/hooks/use-toast";
import Link from 'next/link';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setLoading(true);
    const success = await login(email);
    
    if (success) {
      toast({
        title: "Welcome back!",
        description: "Successfully signed in via Google Sheets.",
      });
      router.push('/tests');
    } else {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "Email not found in the Users database. Please contact your administrator.",
      });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <Link href="/" className="mb-8">
        <Button variant="ghost" className="rounded-full">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to home
        </Button>
      </Link>

      <Card className="w-full max-w-md border-none shadow-2xl rounded-[2rem] overflow-hidden">
        <div className="h-2 bg-primary" />
        <CardHeader className="text-center pt-10">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
            <Database className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-3xl font-black tracking-tight">QuestFlow Login</CardTitle>
          <CardDescription className="text-base">Sign in with your email to access assessments.</CardDescription>
        </CardHeader>
        <CardContent className="px-8 pb-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="font-bold ml-1">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className="h-14 pl-11 rounded-xl bg-slate-50 border-slate-200"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <Button 
              type="submit"
              disabled={loading || !email}
              className="w-full h-14 rounded-full text-lg font-bold shadow-lg transition-all hover:scale-[1.02]"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
              ) : (
                <LogIn className="w-5 h-5 mr-2" />
              )}
              Sign In
            </Button>
          </form>
        </CardContent>
        <CardFooter className="bg-slate-50/50 p-6 flex flex-col items-center gap-2 text-center">
          <p className="text-xs text-muted-foreground font-medium px-4">
            Your access is verified against the <strong>Users</strong> tab in your Google Sheet.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
