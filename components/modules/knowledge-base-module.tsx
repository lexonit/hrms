'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { Card, Badge, Input, HoverCard, Button, Textarea } from '@/components/ui';
import { Search, BookOpen, ExternalLink, Plus, X } from 'lucide-react';
import type { KnowledgeBaseDoc } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Knowledge Base Module Component
 * Full-featured wiki with document editor modal
 */
export const KnowledgeBaseModule: React.FC = () => {
  const { docs, upsertDoc } = useStore();
  const [search, setSearch] = useState('');
  const [editingDoc, setEditingDoc] = useState<Partial<KnowledgeBaseDoc> | null>(null);

  const filtered = docs.filter(
    (d) =>
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.content.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingDoc && editingDoc.title && editingDoc.content && editingDoc.space) {
      upsertDoc({
        id: editingDoc.id,
        title: editingDoc.title,
        content: editingDoc.content,
        space: editingDoc.space,
      });
      setEditingDoc(null);
    }
  };

  return (
    <div className="space-y-8 pb-32">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black tracking-tighter">Yan Wiki</h2>
          <p className="text-sm text-muted-foreground">The collective memory of our organization.</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              placeholder="Search knowledge..."
              className="pl-10 h-11"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button
            onClick={() => setEditingDoc({ title: '', content: '', space: 'General' })}
            className="rounded-xl h-11 px-6"
          >
            <Plus size={18} className="mr-2" /> Add Page
          </Button>
        </div>
      </div>

      {/* Document Editor Modal */}
      <AnimatePresence>
        {editingDoc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setEditingDoc(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden border border-accent/20"
            >
              <div className="p-6 border-b bg-accent/5 flex justify-between items-center">
                <h3 className="text-xl font-bold">
                  {editingDoc.id ? 'Edit Document' : 'Create New Document'}
                </h3>
                <button
                  onClick={() => setEditingDoc(null)}
                  className="p-2 hover:bg-accent/20 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSave} className="p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-140px)]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    required
                    placeholder="Document Title"
                    value={editingDoc.title || ''}
                    onChange={(e) => setEditingDoc({ ...editingDoc, title: e.target.value })}
                  />
                  <select
                    className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                    value={editingDoc.space || 'General'}
                    onChange={(e) => setEditingDoc({ ...editingDoc, space: e.target.value })}
                  >
                    <option value="General">General</option>
                    <option value="Engineering">Engineering</option>
                    <option value="HR">HR</option>
                    <option value="Product">Product</option>
                    <option value="Sales">Sales</option>
                    <option value="Marketing">Marketing</option>
                  </select>
                </div>
                <Textarea
                  required
                  placeholder="Document content (supports Markdown)"
                  className="min-h-[300px] font-mono text-sm"
                  value={editingDoc.content || ''}
                  onChange={(e) => setEditingDoc({ ...editingDoc, content: e.target.value })}
                />
                <div className="flex justify-end space-x-2 pt-4 border-t">
                  <Button variant="ghost" onClick={() => setEditingDoc(null)} type="button">
                    Cancel
                  </Button>
                  <Button type="submit">{editingDoc.id ? 'Update' : 'Create'} Document</Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((doc) => (
          <HoverCard
            key={doc.id}
            className="p-8 flex flex-col group cursor-pointer border-accent/20"
            onClick={() => setEditingDoc(doc)}
          >
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-primary/10 text-primary rounded-xl">
                <BookOpen size={20} />
              </div>
              <Badge className="text-[8px] uppercase font-black tracking-[0.2em]">{doc.space}</Badge>
            </div>
            <h4 className="font-black text-xl mb-3 tracking-tight group-hover:text-primary transition-colors">
              {doc.title}
            </h4>
            <p className="text-xs text-muted-foreground line-clamp-4 leading-relaxed italic mb-8">
              &quot;{doc.content.replace(/[#*`]/g, '').slice(0, 150)}...&quot;
            </p>
            <div className="mt-auto pt-6 border-t border-dashed flex justify-between items-center text-[9px] font-black uppercase text-muted-foreground opacity-50">
              <span>Ref ID: {doc.id.toUpperCase()}</span>
              <ExternalLink size={12} />
            </div>
          </HoverCard>
        ))}
      </div>
    </div>
  );
};
