'use client';

import React from 'react';
import { TimesheetModule } from '@/components/modules';
import AuthenticatedLayout from '@/components/layouts/authenticated-layout';

/**
 * Timesheets Page
 */
export default function TimesheetsPage() {
  return (
    <AuthenticatedLayout>
      <TimesheetModule />
    </AuthenticatedLayout>
  );
}
