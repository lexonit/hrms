'use client';

import React from 'react';
import { KnowledgeBaseModule } from '@/components/modules';
import AuthenticatedLayout from '@/components/layouts/authenticated-layout';

/**
 * Knowledge Base Page
 */
export default function KnowledgeBasePage() {
  return (
    <AuthenticatedLayout>
      <KnowledgeBaseModule />
    </AuthenticatedLayout>
  );
}
