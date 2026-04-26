'use client';

import { useState } from 'react';
import { RoleSwitcher, UserRole } from '@/components/role-switcher';
import { TabNavigation, AttendeeTab, AdminTab } from '@/components/tab-navigation';
import { AttendeeDashboard } from '@/components/attendee-dashboard';
import { AdminDashboard } from '@/components/admin-dashboard';

export default function Home() {
  const [role, setRole] = useState<UserRole>('attendee');
  const [activeTab, setActiveTab] = useState<string>('home');

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    setActiveTab(newRole === 'attendee' ? 'home' : 'dashboard');
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <main className="relative">
      <RoleSwitcher onRoleChange={handleRoleChange} />
      
      {role === 'attendee' ? (
        <AttendeeDashboard activeTab={activeTab as AttendeeTab} />
      ) : (
        <AdminDashboard activeTab={activeTab as AdminTab} />
      )}

      <TabNavigation role={role} activeTab={activeTab} onTabChange={handleTabChange} />
    </main>
  );
}
