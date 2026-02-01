'use client';

import React from 'react';
import { LeaveModule } from '@/components/modules';
import AuthenticatedLayout from '@/components/layouts/authenticated-layout';

/**
 * Leaves Page
 */
export default function LeavesPage() {
  return (
    <AuthenticatedLayout>
      <LeaveModule />
    </AuthenticatedLayout>
  );
}
