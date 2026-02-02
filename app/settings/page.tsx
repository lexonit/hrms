'use client';

import React from 'react';
import AuthenticatedLayout from '@/components/layouts/authenticated-layout';
import { Card, Badge } from '@/components/ui';
import { Shield, Bell, Palette, Lock, Users } from 'lucide-react';

/**
 * Settings Page
 * Application settings and preferences
 */
export default function SettingsPage() {
  return (
    <AuthenticatedLayout>
      <div className="space-y-8 pb-32">
        <div>
          <h2 className="text-3xl font-black tracking-tight mb-2">Settings</h2>
          <p className="text-muted-foreground">Manage your application preferences and security.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Account Settings */}
          <Card className="p-8 rounded-[2rem]">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-primary/10 text-primary rounded-xl">
                <Shield size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg">Account & Security</h3>
                <p className="text-xs text-muted-foreground">Password, 2FA, and authentication</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="p-4 bg-accent/10 rounded-xl">
                <p className="text-sm font-medium">Two-Factor Authentication</p>
                <p className="text-xs text-muted-foreground mt-1">Add an extra layer of security</p>
              </div>
              <div className="p-4 bg-accent/10 rounded-xl">
                <p className="text-sm font-medium">Password Management</p>
                <p className="text-xs text-muted-foreground mt-1">Change or reset your password</p>
              </div>
              <div className="p-4 bg-accent/10 rounded-xl">
                <p className="text-sm font-medium">Active Sessions</p>
                <p className="text-xs text-muted-foreground mt-1">Manage your logged-in devices</p>
              </div>
            </div>
          </Card>

          {/* Notification Settings */}
          <Card className="p-8 rounded-[2rem]">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-secondary/10 text-secondary rounded-xl">
                <Bell size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg">Notifications</h3>
                <p className="text-xs text-muted-foreground">Control your notification preferences</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-accent/10 rounded-xl">
                <div>
                  <p className="text-sm font-medium">Email Notifications</p>
                  <p className="text-xs text-muted-foreground mt-1">Receive updates via email</p>
                </div>
                <Badge variant="default">Enabled</Badge>
              </div>
              <div className="flex items-center justify-between p-4 bg-accent/10 rounded-xl">
                <div>
                  <p className="text-sm font-medium">Push Notifications</p>
                  <p className="text-xs text-muted-foreground mt-1">Browser notifications</p>
                </div>
                <Badge variant="secondary">Disabled</Badge>
              </div>
              <div className="flex items-center justify-between p-4 bg-accent/10 rounded-xl">
                <div>
                  <p className="text-sm font-medium">Task Reminders</p>
                  <p className="text-xs text-muted-foreground mt-1">Deadline and milestone alerts</p>
                </div>
                <Badge variant="default">Enabled</Badge>
              </div>
            </div>
          </Card>

          {/* Appearance Settings */}
          <Card className="p-8 rounded-[2rem]">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-accent/10 text-accent rounded-xl">
                <Palette size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg">Appearance</h3>
                <p className="text-xs text-muted-foreground">Customize your interface</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="p-4 bg-accent/10 rounded-xl">
                <p className="text-sm font-medium">Theme</p>
                <p className="text-xs text-muted-foreground mt-1">Light / Dark / System</p>
              </div>
              <div className="p-4 bg-accent/10 rounded-xl">
                <p className="text-sm font-medium">Sidebar</p>
                <p className="text-xs text-muted-foreground mt-1">Expanded / Collapsed by default</p>
              </div>
              <div className="p-4 bg-accent/10 rounded-xl">
                <p className="text-sm font-medium">Language</p>
                <p className="text-xs text-muted-foreground mt-1">English (US)</p>
              </div>
            </div>
          </Card>

          {/* Privacy Settings */}
          <Card className="p-8 rounded-[2rem]">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-destructive/10 text-destructive rounded-xl">
                <Lock size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg">Privacy & Data</h3>
                <p className="text-xs text-muted-foreground">Control your data and visibility</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="p-4 bg-accent/10 rounded-xl">
                <p className="text-sm font-medium">Profile Visibility</p>
                <p className="text-xs text-muted-foreground mt-1">Who can see your profile</p>
              </div>
              <div className="p-4 bg-accent/10 rounded-xl">
                <p className="text-sm font-medium">Activity Status</p>
                <p className="text-xs text-muted-foreground mt-1">Show online/offline status</p>
              </div>
              <div className="p-4 bg-accent/10 rounded-xl">
                <p className="text-sm font-medium">Data Export</p>
                <p className="text-xs text-muted-foreground mt-1">Download your data</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Admin Only Section */}
        <Card className="p-8 rounded-[2rem] border-primary/20 bg-primary/5">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-primary/10 text-primary rounded-xl">
              <Users size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg">Organization Settings</h3>
              <p className="text-xs text-muted-foreground">Admin and HR management settings</p>
            </div>
            <Badge variant="default" className="ml-auto">
              Admin Only
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-background rounded-xl">
              <p className="text-sm font-medium">User Management</p>
              <p className="text-xs text-muted-foreground mt-1">Add, edit, or remove users</p>
            </div>
            <div className="p-4 bg-background rounded-xl">
              <p className="text-sm font-medium">Role Permissions</p>
              <p className="text-xs text-muted-foreground mt-1">Configure role-based access</p>
            </div>
            <div className="p-4 bg-background rounded-xl">
              <p className="text-sm font-medium">Audit Logs</p>
              <p className="text-xs text-muted-foreground mt-1">View system activity logs</p>
            </div>
          </div>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}
