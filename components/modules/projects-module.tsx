'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { HoverCard, Button, Input, Textarea, Badge, Card, Avatar } from '@/components/ui';
import { Target, FolderPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Projects Module Component
 * Full-featured project portfolio with add project form
 */
export const ProjectsModule: React.FC = () => {
  const { projects, currentUser, addProject, users } = useStore();
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    ownerId: currentUser?.id || '1',
    members: [] as string[],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addProject({ ...formData, members: [formData.ownerId] });
    setIsAdding(false);
    setFormData({
      name: '',
      description: '',
      ownerId: currentUser?.id || '1',
      members: [],
    });
  };

  return (
    <div className="space-y-6 pb-32">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Project Portfolio</h2>
          <p className="text-sm text-muted-foreground">Manage organizational initiatives.</p>
        </div>
        <Button onClick={() => setIsAdding(true)}>
          <FolderPlus size={18} className="mr-2" /> New Project
        </Button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
          >
            <Card className="p-6 bg-accent/10 border-dashed border-2 overflow-hidden">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    required
                    placeholder="Project Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  <select
                    className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                    value={formData.ownerId}
                    onChange={(e) => setFormData({ ...formData, ownerId: e.target.value })}
                  >
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name}
                      </option>
                    ))}
                  </select>
                </div>
                <Textarea
                  required
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
                <div className="flex justify-end space-x-2">
                  <Button variant="ghost" onClick={() => setIsAdding(false)} type="button">
                    Cancel
                  </Button>
                  <Button type="submit">Create</Button>
                </div>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {projects.map((project) => (
          <HoverCard key={project.id} className="p-6 group overflow-hidden">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                <Target size={24} />
              </div>
              <Badge variant="secondary">Active</Badge>
            </div>
            <h3 className="text-xl font-bold mb-2">{project.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-6">{project.description}</p>
            <div className="flex -space-x-2">
              {project.members.slice(0, 4).map((mid) => (
                <Avatar
                  key={mid}
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${mid}`}
                  alt="Member"
                  fallback={mid}
                  size={32}
                  className="w-8 h-8 rounded-full border-2 border-card"
                />
              ))}
            </div>
          </HoverCard>
        ))}
      </div>
    </div>
  );
};
