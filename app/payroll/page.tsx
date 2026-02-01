'use client';

import React from 'react';
import { PayrollModule } from '@/components/modules';
import AuthenticatedLayout from '@/components/layouts/authenticated-layout';

/**
 * Payroll Page
 */
export default function PayrollPage() {
  return (
    <AuthenticatedLayout>
      <PayrollModule />
    </AuthenticatedLayout>
  );
}
