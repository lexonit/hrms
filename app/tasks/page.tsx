'use client';

import React from 'react';
import { KanbanModule } from '@/components/modules';
import AuthenticatedLayout from '@/components/layouts/authenticated-layout';

/**
 * Kanban Tasks Page
 */
export default function TasksPage() {
  return (
    <AuthenticatedLayout>
      <KanbanModule />
    </AuthenticatedLayout>
  );
}
