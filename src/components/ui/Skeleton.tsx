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
    <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-3.5">
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="space-y-1.5 flex-1">
          <Skeleton className="w-28 h-3.5" />
          <Skeleton className="w-20 h-2.5" />
        </div>
      </div>
      <Skeleton className="w-full h-48 rounded-2xl" />
      <div className="flex gap-4 pt-1">
        <Skeleton className="w-16 h-4 rounded-full" />
        <Skeleton className="w-16 h-4 rounded-full" />
      </div>
      <Skeleton className="w-3/4 h-3.5" />
    </div>
  );
};
