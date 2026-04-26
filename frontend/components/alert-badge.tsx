'use client';

import { AlertTriangle, AlertCircle } from 'lucide-react';

interface AlertBadgeProps {
  type: 'warning' | 'critical' | 'info';
  title: string;
  message: string;
  animated?: boolean;
}

export function AlertBadge({ type, title, message, animated = true }: AlertBadgeProps) {
  const styles = {
    warning: {
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/50',
      icon: 'text-yellow-500',
      title: 'text-yellow-500',
    },
    critical: {
      bg: 'bg-accent/10',
      border: 'border-accent/50',
      icon: 'text-accent',
      title: 'text-accent',
    },
    info: {
      bg: 'bg-primary/10',
      border: 'border-primary/50',
      icon: 'text-primary',
      title: 'text-primary',
    },
  };

  const style = styles[type];
  const Icon = type === 'critical' ? AlertTriangle : AlertCircle;

  return (
    <div
      className={`${style.bg} border ${style.border} rounded-lg p-4 ${animated ? 'animate-slide-up' : ''}`}
    >
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 ${style.icon} mt-0.5 flex-shrink-0`} />
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-semibold ${style.title} mb-1`}>{title}</p>
          <p className="text-xs text-muted-foreground">{message}</p>
        </div>
        {animated && (
          <div className={`w-2 h-2 rounded-full ${style.icon.replace('text-', 'bg-')} animate-pulse flex-shrink-0`} />
        )}
      </div>
    </div>
  );
}
