"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * ADMIN CATCH-ALL REDIRECT PROTOCOL
 * 
 * Captures any unknown routes within the /admin segment 
 * and redirects to the primary dashboard.
 */
export default function AdminCatchAll() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard with error context
    router.replace('/admin?error=route-not-found');
  }, [router]);

  return null;
}
