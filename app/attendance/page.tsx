'use client';

import React from 'react';
import { AttendanceModule } from '@/components/modules';
import AuthenticatedLayout from '@/components/layouts/authenticated-layout';

/**
 * Attendance Page
 */
export default function AttendancePage() {
  return (
    <AuthenticatedLayout>
      <AttendanceModule />
    </AuthenticatedLayout>
  );
}
