'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';

export default function AuthPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to login if not authenticated, or to boards if already authenticated
    if (authService.isAuthenticated()) {
      router.push('/boards');
    } else {
      router.push('/auth/login');
    }
  }, [router]);

  return null;
}

