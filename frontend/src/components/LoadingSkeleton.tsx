import { cn } from '@/lib/utils';

interface LoadingSkeletonProps {
  className?: string;
}

export default function LoadingSkeleton({ className }: LoadingSkeletonProps) {
  return (
    <div className={cn('skeleton', className)} />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="card p-4 animate-pulse">
      <div className="skeleton h-48 mb-4" />
      <div className="skeleton h-4 mb-2 w-3/4" />
      <div className="skeleton h-4 mb-4 w-1/2" />
      <div className="skeleton h-6 w-20" />
    </div>
  );
}

export function ProductGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {[...Array(count)].map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}