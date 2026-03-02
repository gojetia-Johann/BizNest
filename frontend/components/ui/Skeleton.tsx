import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  rounded?: "sm" | "md" | "lg" | "full" | "xl" | "2xl";
}

export default function Skeleton({ className, rounded = "md" }: SkeletonProps) {
  const roundedClass = {
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    "2xl": "rounded-2xl",
    full: "rounded-full",
  }[rounded];

  return (
    <div className={cn("skeleton", roundedClass, className)} />
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 space-y-4">
      <div className="flex items-start gap-4">
        <Skeleton className="w-14 h-14" rounded="xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-3.5 w-1/2" />
        </div>
      </div>
      <Skeleton className="h-3.5 w-full" />
      <Skeleton className="h-3.5 w-4/5" />
      <div className="flex gap-2">
        <Skeleton className="h-5 w-16" rounded="full" />
        <Skeleton className="h-5 w-20" rounded="full" />
      </div>
      <Skeleton className="h-9 w-full" rounded="lg" />
    </div>
  );
}

export function GridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
