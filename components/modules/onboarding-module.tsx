'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { Card, Button, Input, Badge } from '@/components/ui';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  UserRole,
  Project,
  Task,
  KnowledgeBaseDoc,
  Attendance,
  LeaveRequest,
  TimesheetEntry,
  Sprint,
  Notification,
  PreviousEmployment,
  UserDocument,
} from '@/types';
import { UserPlus, Briefcase, Mail, CheckCircle, Upload, Plus, Trash, Building, FileText, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

/**
 * Onboarding Module Component
 * Guided form for adding new employees (Admins Only)
 */
export const OnboardingModule: React.FC = () => {
  const { addUser, users } = useStore();
  const router = useRouter();
  
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    avatar?: string;
    phone: string;
    dob: string;
    gender: string;
    address: string;
    emergencyName: string;
    emergencyRelation: string;
    emergencyPhone: string;
    role: UserRole;
    designation: string;
    department: string;
    joinedDate: string;
    managerId: string;
    previousEmployment: PreviousEmployment[];
    documents: UserDocument[];
  }>({
    name: '',
    email: '',
    phone: '',
    dob: '',
    gender: '',
    address: '',
    emergencyName: '',
    emergencyRelation: '',
    emergencyPhone: '',
    role: UserRole.EMPLOYEE,
    designation: '',
    department: '',
    joinedDate: new Date().toISOString().split('T')[0],
    managerId: '',
    previousEmployment: [],
    documents: [],
  });

  const [step, setStep] = useState(1);
  const totalSteps = 5;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        const url = URL.createObjectURL(file);
        setFormData(prev => ({ ...prev, avatar: url }));
    }
  };

  // Previous Employment Handlers
  const addEmployment = () => {
    setFormData((prev) => ({
      ...prev,
      previousEmployment: [
        ...prev.previousEmployment,
        { companyName: '', designation: '', startDate: '', endDate: '' },
      ],
    }));
  };

  const removeEmployment = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      previousEmployment: prev.previousEmployment.filter((_, i) => i !== index),
    }));
  };

  const updateEmployment = (index: number, field: keyof PreviousEmployment, value: string) => {
    setFormData((prev) => ({
      ...prev,
      previousEmployment: prev.previousEmployment.map((emp, i) =>
        i === index ? { ...emp, [field]: value } : emp
      ),
    }));
  };

  // Document Handlers
  const addDocument = (type: UserDocument['type']) => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        setFormData((prev) => ({
          ...prev,
          documents: [
            ...prev.documents,
            {
              name: file.name,
              type,
              url: URL.createObjectURL(file), // Mock URL
              uploadedAt: new Date().toISOString(),
            },
          ],
        }));
      }
    };
    fileInput.click();
  };

  const removeDocument = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Final Submit
      addUser({
        ...formData,
        emergencyContact: {
          name: formData.emergencyName,
          relation: formData.emergencyRelation,
          phone: formData.emergencyPhone
        }
      });
      // Show success and redirect
      // For now, let's just alert and redirect or reset
      alert('Employee Onboarded Successfully!');
      router.push('/employees');
    }
  };

  const steps = [
    { id: 1, title: 'Personal', icon: UserPlus },
    { id: 2, title: 'Role', icon: Briefcase },
    { id: 3, title: 'History', icon: Building },
    { id: 4, title: 'Documents', icon: FileText },
    { id: 5, title: 'Review', icon: CheckCircle },
  ];

  const managers = users.filter(
    (u) =>
      u.role === UserRole.MANAGER ||
      u.role === UserRole.HR_ADMIN ||
      u.role === UserRole.SUPER_ADMIN
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-32">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Employee Onboarding</h2>
        <p className="text-muted-foreground">
          Welcome to the team! Provide details to set up the new employee account.
        </p>
      </div>

      {/* Progress Stepper */}
      <div className="flex justify-between items-center relative mb-12">
        <div className="absolute left-0 top-1/2 w-full h-1 bg-gray-200 -z-10 rounded-full" />
        <div
          className="absolute left-0 top-1/2 h-1 bg-primary -z-10 rounded-full transition-all duration-300"
          style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
        />
        {steps.map((s) => (
          <div key={s.id} className="flex flex-col items-center bg-card p-2 rounded-xl">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg border-4 transition-colors ${
                step >= s.id
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background text-muted-foreground border-muted'
              }`}
            >
              <s.icon size={20} />
            </div>
            <span
              className={`text-xs font-medium mt-2 ${
                step >= s.id ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              {s.title}
            </span>
          </div>
        ))}
      </div>

      <Card className="p-8 shadow-xl border-t-4 border-t-primary">
        <form onSubmit={handleSubmit}>
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex flex-col items-center justify-center space-y-4 mb-6">
                   <div className="relative">
                      <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary bg-muted flex items-center justify-center">
                        {formData.avatar ? (
                          <img src={formData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <UserPlus size={32} className="text-muted-foreground" />
                        )}
                      </div>
                      <label 
                        htmlFor="avatar-upload" 
                        className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-1 rounded-full cursor-pointer hover:bg-primary/90 transition-colors"
                      >
                         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
                      </label>
                      <input 
                        id="avatar-upload" 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleAvatarUpload} 
                      />
                   </div>
                   <p className="text-sm text-muted-foreground">Upload Profile Picture</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Full Name</label>
                    <Input
                      required
                      name="name"
                      placeholder="e.g. Jane Doe"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email Address</label>
                    <Input
                      required
                      type="email"
                      name="email"
                      placeholder="jane@company.com"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phone Number</label>
                    <Input
                      name="phone"
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                   <div className="space-y-2">
                    <label className="text-sm font-medium">Date of Birth</label>
                    <Input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                    />
                  </div>
                   <div className="space-y-2">
                    <label className="text-sm font-medium">Gender</label>
                     <select
                        name="gender"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={formData.gender}
                        onChange={handleChange}
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                  </div>
                   <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium">Address</label>
                    <textarea
                      name="address"
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Full residential address"
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="pt-6 border-t">
                  <h3 className="text-lg font-semibold mb-4">Emergency Contact</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     <div className="space-y-2">
                        <label className="text-sm font-medium">Contact Name</label>
                        <Input
                          name="emergencyName"
                          placeholder="Contact Name"
                          value={formData.emergencyName}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Relation</label>
                        <Input
                          name="emergencyRelation"
                          placeholder="e.g. Spouse, Parent"
                          value={formData.emergencyRelation}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Phone</label>
                        <Input
                          name="emergencyPhone"
                          placeholder="Emergency Phone"
                          value={formData.emergencyPhone}
                          onChange={handleChange}
                        />
                      </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Joining Date</label>
                    <Input
                      required
                      type="date"
                      name="joinedDate"
                      value={formData.joinedDate}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Department</label>
                    <select
                      required
                      name="department"
                      className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                      value={formData.department}
                      onChange={handleChange}
                    >
                      <option value="">Select Department</option>
                      <option value="Engineering">Engineering</option>
                      <option value="Design">Design</option>
                      <option value="Product">Product</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Sales">Sales</option>
                      <option value="HR">Human Resources</option>
                      <option value="Operations">Operations</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Designation</label>
                    <Input
                      required
                      name="designation"
                      placeholder="e.g. Senior Frontend Engineer"
                      value={formData.designation}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Role</label>
                    <select
                      required
                      name="role"
                      className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                      value={formData.role}
                      onChange={handleChange}
                    >
                      {Object.values(UserRole).map((role) => (
                        <option key={role} value={role}>
                          {role.replace('_', ' ')}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Reporting Manager</label>
                    <select
                      name="managerId"
                      className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                      value={formData.managerId}
                      onChange={handleChange}
                    >
                      <option value="">Select Manager</option>
                      {managers.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name} ({m.designation})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Employment History</h3>
                  <Button type="button" variant="outline" size="sm" onClick={addEmployment}>
                    <Plus size={16} className="mr-2" /> Add Previous Company
                  </Button>
                </div>

                {formData.previousEmployment.length === 0 ? (
                  <div className="text-center py-10 border-2 border-dashed rounded-lg text-muted-foreground bg-accent/5">
                    <Building className="mx-auto mb-2 opacity-50" size={32} />
                    <p>No employment history added yet. Click above to add.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {formData.previousEmployment.map((emp, index) => (
                      <div key={index} className="p-4 border rounded-lg bg-accent/5 relative group">
                        <button
                          type="button"
                          onClick={() => removeEmployment(index)}
                          className="absolute top-2 right-2 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash size={16} />
                        </button>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input
                            placeholder="Company Name"
                            value={emp.companyName}
                            onChange={(e) => updateEmployment(index, 'companyName', e.target.value)}
                          />
                          <Input
                            placeholder="Designation"
                            value={emp.designation}
                            onChange={(e) => updateEmployment(index, 'designation', e.target.value)}
                          />
                          <Input
                            type="date"
                            placeholder="Start Date"
                            value={emp.startDate}
                            onChange={(e) => updateEmployment(index, 'startDate', e.target.value)}
                          />
                          <Input
                            type="date"
                            placeholder="End Date"
                            value={emp.endDate}
                            onChange={(e) => updateEmployment(index, 'endDate', e.target.value)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {['Resume', 'Experience Letter', 'Relieving Letter', 'ID Proof'].map((type) => (
                    <div
                      key={type}
                      className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-accent/5 transition-colors cursor-pointer group"
                      onClick={() => addDocument(type as any)}
                    >
                      <Upload className="mb-2 text-primary group-hover:scale-110 transition-transform" />
                      <span className="font-medium text-sm">Upload {type}</span>
                      <span className="text-xs text-muted-foreground mt-1">PDF, JPG, PNG up to 5MB</span>
                    </div>
                  ))}
                </div>

                {formData.documents.length > 0 && (
                  <div className="space-y-2 mt-6">
                    <h4 className="font-medium text-sm mb-3">Uploaded Documents</h4>
                    {formData.documents.map((doc, index) => (
                      <div key={index} className="flex justify-between items-center p-3 border rounded-md bg-card">
                        <div className="flex items-center gap-3">
                          <FileText size={18} className="text-primary" />
                          <div>
                            <p className="font-medium text-sm">{doc.type}</p>
                            <p className="text-xs text-muted-foreground">{doc.name}</p>
                          </div>
                        </div>
                        <Button
                           type="button" 
                           variant="ghost" 
                           size="sm" 
                           className="text-destructive h-8 w-8 p-0"
                           onClick={() => removeDocument(index)}
                        >
                          <X size={16} />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="bg-accent/10 p-6 rounded-lg space-y-4">
                  <div className="flex items-center gap-4">
                     <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                        <Upload className="text-primary" />
                     </div>
                     <div>
                        <h4 className="font-bold">Summary Review</h4>
                        <p className="text-xs text-muted-foreground">Please verify all details before creating the account.</p>
                     </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm mt-4 border-t pt-4">
                    <div className="col-span-2 flex justify-center mb-2">
                       {formData.avatar && (
                          <img src={formData.avatar} alt="Profile" className="w-20 h-20 rounded-full border-2 border-primary object-cover" />
                       )}
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Name</span>
                      <span className="font-medium">{formData.name}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Email</span>
                      <span className="font-medium">{formData.email}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Phone</span>
                      <span className="font-medium">{formData.phone || '-'}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Date of Birth</span>
                      <span className="font-medium">{formData.dob || '-'}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Gender</span>
                      <span className="font-medium">{formData.gender || '-'}</span>
                    </div>
                     <div>
                      <span className="text-muted-foreground block">Address</span>
                      <span className="font-medium">{formData.address || '-'}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Department</span>
                      <span className="font-medium">{formData.department}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Role</span>
                      <span className="font-medium">{formData.role}</span>
                    </div>
                    <div>
                        <span className="text-muted-foreground block">Designation</span>
                        <span className="font-medium">{formData.designation}</span>
                    </div>
                    <div>
                        <span className="text-muted-foreground block">Joined Date</span>
                        <span className="font-medium">{formData.joinedDate}</span>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4 mt-2">
                     <h5 className="font-bold text-sm mb-2">Emergency Contact</h5>
                     {formData.emergencyName ? (
                         <div className="text-sm grid grid-cols-1 md:grid-cols-3 gap-2">
                            <div><span className="text-muted-foreground">Name:</span> {formData.emergencyName}</div>
                            <div><span className="text-muted-foreground">Relation:</span> {formData.emergencyRelation}</div>
                            <div><span className="text-muted-foreground">Phone:</span> {formData.emergencyPhone}</div>
                         </div>
                     ) : (
                        <span className="text-xs text-muted-foreground">Not Provided</span>
                     )}
                  </div>

                  {/* Additional Review Sections */}
                  <div className="border-t pt-4 mt-2">
                    <h5 className="font-bold text-sm mb-2">Previous Employment</h5>
                    {formData.previousEmployment.length > 0 ? (
                       <ul className="list-disc pl-4 text-xs space-y-1">
                          {formData.previousEmployment.map((emp, i) => (
                             <li key={i}>{emp.designation} at {emp.companyName}</li>
                          ))}
                       </ul>
                    ) : (
                       <span className="text-xs text-muted-foreground">None Added</span>
                    )}
                  </div>

                  <div className="border-t pt-4 mt-2">
                    <h5 className="font-bold text-sm mb-2">Documents</h5>
                    {formData.documents.length > 0 ? (
                       <div className="flex gap-2 flex-wrap">
                          {formData.documents.map((doc, i) => (
                             <Badge key={i} variant="secondary" className="text-xs">
                                {doc.type}
                             </Badge>
                          ))}
                       </div>
                    ) : (
                       <span className="text-xs text-muted-foreground">None Uploaded</span>
                    )}
                  </div>

                </div>

                <div className="flex items-start gap-3 p-4 bg-yellow-50 text-yellow-800 rounded-md text-sm">
                   <CheckCircle size={16} className="mt-0.5" />
                   <p>By clicking "Complete Onboarding", a new account will be created and an automated welcome email will be sent to the user with login credentials.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-between pt-8 border-t mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={() => step > 1 && setStep(step - 1)}
              disabled={step === 1}
            >
              Back
            </Button>
            
            <Button type="submit" className="min-w-[120px]">
              {step === totalSteps ? 'Complete Onboarding' : 'Next Step'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
