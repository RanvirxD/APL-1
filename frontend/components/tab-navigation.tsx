'use client';

import { UserRole } from './role-switcher';
import { MapPin, Bell, BarChart3, MessageCircle, AlertCircle, Home } from 'lucide-react';

export const ATTENDEE_TABS = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'venue', label: 'Venue', icon: MapPin },
  { id: 'chat', label: 'Chat', icon: MessageCircle },
  { id: 'ai', label: 'Ask AI', icon: Bell },
  { id: 'sos', label: 'SOS', icon: AlertCircle },
] as const;

export const ADMIN_TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { id: 'alerts', label: 'Alerts', icon: Bell },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
  { id: 'chat', label: 'Chat', icon: MessageCircle },
  { id: 'staff', label: 'Staff Map', icon: MapPin },
] as const;

export type AttendeeTab = (typeof ATTENDEE_TABS)[number]['id'];
export type AdminTab = (typeof ADMIN_TABS)[number]['id'];

interface TabNavigationProps {
  role: UserRole;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function TabNavigation({ role, activeTab, onTabChange }: TabNavigationProps) {
  const tabs = role === 'attendee' ? ATTENDEE_TABS : ADMIN_TABS;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-40">
      {/* Safe area padding for notch */}
      <div className="flex gap-1 px-4 py-2 pb-[max(1rem,env(safe-area-inset-bottom))]">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-lg transition-all ${
              activeTab === id
                ? 'bg-primary/20 text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-xs font-medium">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
