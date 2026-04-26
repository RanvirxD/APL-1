'use client';

export function StadiumSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center py-8 animate-pulse">
      <div className="w-72 h-72 rounded-full bg-muted/50 mb-8" />
      <div className="space-y-3 w-full px-4">
        <div className="h-4 bg-muted/50 rounded w-1/3" />
        <div className="h-4 bg-muted/50 rounded w-1/4" />
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-3 animate-pulse">
      <div className="h-4 bg-muted/50 rounded w-1/3" />
      <div className="h-8 bg-muted/50 rounded w-1/2" />
      <div className="h-4 bg-muted/50 rounded w-1/4" />
    </div>
  );
}

export function DensityCardsSkeleton() {
  return (
    <div className="px-4 grid grid-cols-2 gap-3 animate-pulse">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-card border border-border rounded-lg p-4 space-y-2">
          <div className="h-3 bg-muted/50 rounded w-2/3" />
          <div className="h-8 bg-muted/50 rounded" />
          <div className="h-3 bg-muted/50 rounded w-1/2" />
        </div>
      ))}
    </div>
  );
}
