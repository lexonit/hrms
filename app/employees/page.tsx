'use client';

import React from 'react';
import { EmployeeDirectoryModule } from '@/components/modules';
import AuthenticatedLayout from '@/components/layouts/authenticated-layout';

/**
 * Employee Directory Page
 */
export default function EmployeesPage() {
  return (
    <AuthenticatedLayout>
      <EmployeeDirectoryModule />
    </AuthenticatedLayout>
  );
}
