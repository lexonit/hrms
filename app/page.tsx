'use client';

import React, { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useStore } from '@/lib/store';
import { LoginModule } from '@/components/modules';

/**
 * Home Page Component
 * Shows login or redirects to dashboard/intended page if authenticated
 */
export default function HomePage() {
  const { currentUser } = useStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (currentUser) {
      // Get redirect parameter if exists, otherwise go to dashboard
      const redirect = searchParams.get('redirect') || '/dashboard';
      router.push(redirect);
    }
  }, [currentUser, router, searchParams]);

  // Show login page if user is not authenticated
  if (!currentUser) {
    return <LoginModule />;
  }

  // Show nothing while redirecting
  return null;
}
