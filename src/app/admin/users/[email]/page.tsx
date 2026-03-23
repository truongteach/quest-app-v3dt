
"use client";

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function RedirectUserDetail() {
  const router = useRouter();
  const params = useParams();
  
  useEffect(() => {
    if (params.email) {
      router.replace(`/admin/users/detail?email=${encodeURIComponent(params.email as string)}`);
    } else {
      router.replace('/admin/users');
    }
  }, [params.email, router]);

  return null;
}
