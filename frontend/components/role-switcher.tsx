'use client';

import { useState } from 'react';

export type UserRole = 'attendee' | 'admin';

interface RoleSwitcherProps {
  onRoleChange?: (role: UserRole) => void;
}

export function RoleSwitcher({ onRoleChange }: RoleSwitcherProps) {
  const [role, setRole] = useState<UserRole>('attendee');

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    onRoleChange?.(newRole);
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-card border border-border rounded-lg p-2">
      <button
        onClick={() => handleRoleChange('attendee')}
        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
          role === 'attendee'
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        Attendee
      </button>
      <div className="w-px h-4 bg-border" />
      <button
        onClick={() => handleRoleChange('admin')}
        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
          role === 'admin'
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        Admin
      </button>
    </div>
  );
}
