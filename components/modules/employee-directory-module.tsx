'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { Card, Badge, Input, Avatar, Button } from '@/components/ui';
import { HoverCard } from '@/components/ui';
import { Search, MapPin, Mail, Phone, Calendar, Briefcase, FileText, X, Edit2, CheckCircle, Plus, Trash, User as UserIcon, AlertCircle } from 'lucide-react';
import { UserRole, PreviousEmployment, UserDocument, User } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';

export const EmployeeDirectoryModule: React.FC = () => {
  const { users, currentUser, updateUser } = useStore();
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // State for editing form
  const [editForm, setEditForm] = useState<Partial<User>>({});

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.department.toLowerCase().includes(search.toLowerCase())
  );

  const activeUser = users.find(u => u.id === selectedUser);

  // Initialize edit form when opening modal
  React.useEffect(() => {
    if (activeUser) {
      setEditForm({
        ...activeUser,
        previousEmployment: activeUser.previousEmployment || [],
        documents: activeUser.documents || [],
      });
    }
  }, [activeUser]);

  const canEdit = currentUser && activeUser && (
    currentUser.role === UserRole.SUPER_ADMIN || 
    currentUser.role === UserRole.HR_ADMIN || 
    currentUser.id === activeUser.id
  );

  const handleSave = () => {
    if (!activeUser) return;
    updateUser(activeUser.id, editForm);
    setIsEditing(false);
  };

  // Helper for adding employment row
  const addEmployment = () => {
    setEditForm(prev => ({
      ...prev,
      previousEmployment: [...(prev.previousEmployment || []), { companyName: '', designation: '', startDate: '', endDate: '' }]
    }));
  };

  // Helper for updating employment row
  const updateEmployment = (index: number, field: keyof PreviousEmployment, value: string) => {
    setEditForm(prev => ({
      ...prev,
      previousEmployment: (prev.previousEmployment || []).map((item, i) => i === index ? { ...item, [field]: value } : item)
    }));
  };
  
  const removeEmployment = (index: number) => {
    setEditForm(prev => ({
      ...prev,
      previousEmployment: (prev.previousEmployment || []).filter((_, i) => i !== index)
    }));
  };

  const handleInputChange = (field: keyof User, value: any) => {
      setEditForm(prev => ({ ...prev, [field]: value }));
  };

  const handleEmergencyChange = (field: string, value: string) => {
      setEditForm(prev => ({
          ...prev,
          emergencyContact: {
              name: prev.emergencyContact?.name || '',
              relation: prev.emergencyContact?.relation || '',
              phone: prev.emergencyContact?.phone || '',
              ...prev.emergencyContact,
              [field]: value
          } as any
      }))
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Organization Directory</h2>
          <p className="text-sm text-muted-foreground">Find and connect with your team members.</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            placeholder="Search name or department..."
            className="pl-10 h-11"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map((user) => (
          <HoverCard 
            key={user.id} 
            className="p-8 text-center bg-card shadow-sm border-accent/20 cursor-pointer hover:border-primary/50 transition-colors group"
            onClick={() => { setSelectedUser(user.id); setIsEditing(false); }}
          >
            <div className="relative w-24 h-24 mx-auto mb-6">
              <Avatar
                src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                alt={user.name}
                fallback={user.name}
                size={96}
                className="w-full h-full rounded-2xl border-4 border-background shadow-xl group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-4 border-card rounded-full shadow-sm" />
            </div>
            <h3 className="font-black text-lg tracking-tight">{user.name}</h3>
            <p className="text-xs text-primary font-bold uppercase tracking-widest mt-1">{user.designation}</p>
            <div className="flex justify-center gap-2 mt-4 pt-4 border-t border-dashed">
              <Badge variant="secondary" className="text-[10px] rounded-lg">
                {user.department}
              </Badge>
              <Badge variant="outline" className="text-[10px] rounded-lg">
                {user.role.replace('_', ' ')}
              </Badge>
            </div>
          </HoverCard>
        ))}
      </div>

      <AnimatePresence>
        {selectedUser && activeUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
            onClick={() => setSelectedUser(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-4xl bg-card border rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-32 bg-gradient-to-r from-primary/20 to-secondary/20 shrink-0">
                <Button variant="ghost" className="absolute top-4 right-4 rounded-full w-10 h-10 p-0 bg-background/50 hover:bg-background" onClick={() => setSelectedUser(null)}>
                  <X size={20} />
                </Button>
                {canEdit && !isEditing && (
                   <Button variant="secondary" size="sm" className="absolute bottom-4 right-4 rounded-full shadow-lg" onClick={() => setIsEditing(true)}>
                     <Edit2 size={16} className="mr-2" /> Edit Profile
                   </Button>
                )}
                {isEditing && (
                   <div className="absolute bottom-4 right-4 flex gap-2">
                       <Button variant="secondary" size="sm" className="rounded-full shadow-lg" onClick={() => setIsEditing(false)}>
                         Cancel
                       </Button>
                       <Button size="sm" className="rounded-full shadow-lg" onClick={handleSave}>
                         <CheckCircle size={16} className="mr-2" /> Save Changes
                       </Button>
                   </div>
                )}
              </div>
              
              <div className="px-8 pt-8 overflow-y-auto flex-1">
                 <div className="relative -mt-16 mb-6">
                    <Avatar
                        src={activeUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${activeUser.name}`}
                        alt={activeUser.name}
                        fallback={activeUser.name}
                        size={128}
                        className="w-32 h-32 rounded-3xl border-8 border-card shadow-2xl"
                    />
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                     {/* Sidebar Info */}
                     <div className="space-y-6">
                        <div>
                            {isEditing ? (
                                <Input 
                                    value={editForm.name} 
                                    onChange={(e) => handleInputChange('name', e.target.value)} 
                                    className="text-2xl font-bold mb-2 h-auto py-2"
                                />
                            ) : (
                                <h2 className="text-3xl font-black tracking-tight">{activeUser.name}</h2>
                            )}
                            
                            {isEditing ? (
                                <Input 
                                    value={editForm.designation} 
                                    onChange={(e) => handleInputChange('designation', e.target.value)} 
                                    className="text-sm font-bold uppercase tracking-widest mt-1"
                                    placeholder="DESIGNATION"
                                />
                            ) : (
                                <p className="text-primary font-bold uppercase tracking-widest text-sm mt-1">{activeUser.designation}</p>
                            )}
                        </div>
                        
                        <div className="space-y-3 text-sm">
                            <h4 className="font-semibold text-muted-foreground uppercase text-xs tracking-wider mb-2">Contact & Personal</h4>
                            
                            <div className="flex items-center p-2 rounded-lg hover:bg-accent/5">
                                <Mail size={16} className="mr-3 text-primary shrink-0" />
                                <div className="flex-1 overflow-hidden">
                                     {isEditing ? (
                                        <Input value={editForm.email} onChange={(e) => handleInputChange('email', e.target.value)} className="h-8" />
                                     ) : (
                                        <span className="truncate block">{activeUser.email}</span>
                                     )}
                                </div>
                            </div>
                            
                            <div className="flex items-center p-2 rounded-lg hover:bg-accent/5">
                                <Phone size={16} className="mr-3 text-primary shrink-0" />
                                <div className="flex-1">
                                     {isEditing ? (
                                        <Input 
                                            value={editForm.phone || ''} 
                                            onChange={(e) => handleInputChange('phone', e.target.value)} 
                                            className="h-8" 
                                            placeholder="Phone Number"
                                        />
                                     ) : (
                                        <span>{activeUser.phone || 'N/A'}</span>
                                     )}
                                </div>
                            </div>

                             <div className="flex items-center p-2 rounded-lg hover:bg-accent/5">
                                <MapPin size={16} className="mr-3 text-primary shrink-0" />
                                <div className="flex-1">
                                     {isEditing ? (
                                        <Input 
                                            value={editForm.address || ''} 
                                            onChange={(e) => handleInputChange('address', e.target.value)} 
                                            className="h-8" 
                                            placeholder="Address"
                                        />
                                     ) : (
                                        <span className="truncate block" title={activeUser.address}>{activeUser.address || 'N/A'}</span>
                                     )}
                                </div>
                            </div>

                            <div className="flex items-center p-2 rounded-lg hover:bg-accent/5">
                                <UserIcon size={16} className="mr-3 text-primary shrink-0" />
                                <div className="flex-1 flex gap-2">
                                     {isEditing ? (
                                        <>
                                            <Input type="date" value={editForm.dob || ''} onChange={(e) => handleInputChange('dob', e.target.value)} className="h-8 w-1/2" />
                                            <select 
                                                className="h-8 w-1/2 rounded-md border border-input bg-background px-2 text-xs"
                                                value={editForm.gender || ''}
                                                onChange={(e) => handleInputChange('gender', e.target.value)}
                                            >
                                                <option value="">Gender</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                            </select>
                                        </>
                                     ) : (
                                        <span>{activeUser.dob ? `${activeUser.dob} (${activeUser.gender || '?'})` : 'N/A'}</span>
                                     )}
                                </div>
                            </div>

                            <div className="my-4 border-t pt-4">
                                <h4 className="font-semibold text-muted-foreground uppercase text-xs tracking-wider mb-2 flex items-center">
                                    <AlertCircle size={12} className="mr-2" /> Emergency Contact
                                </h4>
                                <div className="bg-red-50 p-3 rounded-lg space-y-2 text-xs text-red-900">
                                    {isEditing ? (
                                        <>
                                            <Input 
                                                placeholder="Contact Name" 
                                                className="h-7 bg-white/50" 
                                                value={editForm.emergencyContact?.name || ''}
                                                onChange={(e) => handleEmergencyChange('name', e.target.value)}
                                            />
                                            <div className="flex gap-2">
                                                <Input 
                                                    placeholder="Relation" 
                                                    className="h-7 bg-white/50" 
                                                    value={editForm.emergencyContact?.relation || ''}
                                                    onChange={(e) => handleEmergencyChange('relation', e.target.value)}
                                                />
                                                <Input 
                                                    placeholder="Phone" 
                                                    className="h-7 bg-white/50" 
                                                    value={editForm.emergencyContact?.phone || ''}
                                                    onChange={(e) => handleEmergencyChange('phone', e.target.value)}
                                                />
                                            </div>
                                        </>
                                    ) : (
                                        activeUser.emergencyContact ? (
                                            <>
                                                <div className="font-bold">{activeUser.emergencyContact.name}</div>
                                                <div>{activeUser.emergencyContact.relation} • {activeUser.emergencyContact.phone}</div>
                                            </>
                                        ) : (
                                            <div className="italic text-red-900/50">Not Provided</div>
                                        )
                                    )}
                                </div>
                            </div>

                            <div className="my-4 border-t pt-4">
                                <h4 className="font-semibold text-muted-foreground uppercase text-xs tracking-wider mb-2">Work Info</h4>
                                <div className="flex items-center p-2 rounded-lg hover:bg-accent/5">
                                    <Briefcase size={16} className="mr-3 text-primary shrink-0" />
                                    <div className="flex-1">
                                        {isEditing ? (
                                            <Input value={editForm.department || ''} onChange={(e) => handleInputChange('department', e.target.value)} className="h-8" />
                                        ) : (
                                            <span>{activeUser.department}</span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center p-2 rounded-lg hover:bg-accent/5">
                                    <Calendar size={16} className="mr-3 text-primary shrink-0" />
                                    <div className="flex-1">
                                         Joined {activeUser.joinedDate}
                                    </div>
                                </div>
                            </div>

                        </div>
                     </div>
                     
                     {/* Main Content */}
                     <div className="md:col-span-2 space-y-8">
                        <div>
                            <h3 className="font-bold text-lg border-b pb-2 mb-4 flex items-center">
                                <Briefcase className="mr-2" size={20} /> Work History
                                {isEditing && (
                                   <Button variant="ghost" size="sm" className="ml-auto h-8 text-xs" onClick={addEmployment}>
                                       <Plus size={14} className="mr-1" /> Add
                                   </Button>
                                )}
                            </h3>
                            
                            {!isEditing ? (
                                <div className="space-y-4">
                                    {(activeUser.previousEmployment || []).length > 0 ? (
                                        activeUser.previousEmployment?.map((emp, i) => (
                                            <div key={i} className="flex gap-4 p-4 rounded-xl border bg-card hover:bg-accent/5 transition-colors">
                                                <div className="w-2 bg-primary/20 rounded-full" />
                                                <div>
                                                    <h4 className="font-bold">{emp.designation}</h4>
                                                    <p className="text-sm font-medium">{emp.companyName}</p>
                                                    <p className="text-xs text-muted-foreground mt-1">{emp.startDate} - {emp.endDate || 'Present'}</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-muted-foreground text-sm italic">No history available.</p>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-4">
                                     {(editForm.previousEmployment || []).map((emp, index) => (
                                          <div key={index} className="p-4 border rounded-xl bg-accent/5 relative group">
                                               <Button variant="ghost" size="sm" className="absolute top-2 right-2 h-6 w-6 p-0 text-destructive" onClick={() => removeEmployment(index)}>
                                                   <Trash size={14} />
                                               </Button>
                                               <div className="grid grid-cols-2 gap-3">
                                                   <Input placeholder="Company" value={emp.companyName} onChange={e => updateEmployment(index, 'companyName', e.target.value)} className="h-9 bg-card" />
                                                   <Input placeholder="Role" value={emp.designation} onChange={e => updateEmployment(index, 'designation', e.target.value)} className="h-9 bg-card" />
                                                   <Input type="date" value={emp.startDate} onChange={e => updateEmployment(index, 'startDate', e.target.value)} className="h-9 bg-card" />
                                                   <Input type="date" value={emp.endDate} onChange={e => updateEmployment(index, 'endDate', e.target.value)} className="h-9 bg-card" />
                                               </div>
                                          </div>
                                     ))}
                                     {editForm.previousEmployment.length === 0 && (
                                         <p className="text-center text-xs text-muted-foreground py-4">Click "Add" to insert employment history.</p>
                                     )}
                                </div>
                            )}
                        </div>

                        <div>
                            <h3 className="font-bold text-lg border-b pb-2 mb-4 flex items-center">
                                <FileText className="mr-2" size={20} /> Documents
                            </h3>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {(activeUser.documents || []).length > 0 ? (
                                        activeUser.documents?.map((doc, i) => (
                                            <div key={i} className="flex items-center p-3 border rounded-lg bg-card">
                                                <FileText className="mr-3 text-primary shrink-0" />
                                                <div className="overflow-hidden">
                                                    <p className="font-medium text-sm truncate">{doc.type}</p>
                                                    <p className="text-xs text-muted-foreground truncate">{doc.name}</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-muted-foreground text-sm italic col-span-2">No documents uploaded.</p>
                                    )}
                              </div>
                        </div>
                     </div>
                 </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
