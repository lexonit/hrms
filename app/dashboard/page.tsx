'use client';

import React from 'react';
import { DashboardModule } from '@/components/modules';
import AuthenticatedLayout from '@/components/layouts/authenticated-layout';

/**
 * Dashboard Page
 */
export default function DashboardPage() {
  return (
    <AuthenticatedLayout>
      <DashboardModule />
    </AuthenticatedLayout>
  );
}
