'use client';

import React from 'react';
import { ProjectsModule } from '@/components/modules';
import AuthenticatedLayout from '@/components/layouts/authenticated-layout';

/**
 * Projects Page
 */
export default function ProjectsPage() {
  return (
    <AuthenticatedLayout>
      <ProjectsModule />
    </AuthenticatedLayout>
  );
}
