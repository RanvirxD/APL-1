'use client';

export function LiveBadge() {
  return (
    <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/50 rounded-full px-3 py-1.5">
      <div className="relative w-2 h-2">
        <div className="absolute w-2 h-2 rounded-full bg-accent animate-pulse" />
        <div className="absolute w-2 h-2 rounded-full bg-accent/50 animate-pulse" style={{ animationDelay: '0.3s' }} />
      </div>
      <span className="text-xs font-semibold text-accent">LIVE</span>
    </div>
  );
}
