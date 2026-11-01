import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
  return (
    <div
      className={`animate-pulse bg-slate-200/80 rounded-2xl ${className}`}
      aria-hidden="true"
    />
  );
};

export const PostCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white" aria-hidden="true">
      <div className="flex items-center gap-3 px-4 py-3">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="space-y-1.5 flex-1">
          <Skeleton className="w-28 h-3.5" />
          <Skeleton className="w-20 h-2.5" />
        </div>
      </div>
      <Skeleton className="w-full aspect-[4/5] rounded-none" />
      <div className="px-4 py-3 space-y-2">
        <Skeleton className="w-24 h-4" />
        <Skeleton className="w-3/4 h-3.5" />
      </div>
    </div>
  );
};
