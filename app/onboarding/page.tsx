'use client';

import React from 'react';
import { OnboardingModule } from '@/components/modules';
import AuthenticatedLayout from '@/components/layouts/authenticated-layout';
import { useStore } from '@/lib/store';
import { UserRole } from '@/types';
import { redirect } from 'next/navigation';

/**
 * Onboarding Page
 * Restricted to HR and Admin
 */
export default function OnboardingPage() {
  const { currentUser } = useStore();
  
  // Client-side protection (Middleware handles server-side)
  // We need to wait for store hydration, but for now this is a secondary check
  if (currentUser && 
      currentUser.role !== UserRole.SUPER_ADMIN && 
      currentUser.role !== UserRole.HR_ADMIN) {
    redirect('/dashboard');
  }

  return (
    <AuthenticatedLayout>
      <OnboardingModule />
    </AuthenticatedLayout>
  );
}
