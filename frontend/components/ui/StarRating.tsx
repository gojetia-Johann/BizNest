import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  className?: string;
}

export default function StarRating({
  rating,
  maxStars = 5,
  size = "sm",
  showValue = true,
  className,
}: StarRatingProps) {
  const sizeClass = {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  }[size];

  const textClass = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  }[size];

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: maxStars }).map((_, i) => {
          const filled = i < Math.floor(rating);
          const half = !filled && i < rating;
          return (
            <Star
              key={i}
              className={cn(
                sizeClass,
                filled || half
                  ? "fill-amber-400 text-amber-400"
                  : "fill-slate-200 text-slate-200"
              )}
            />
          );
        })}
      </div>
      {showValue && (
        <span className={cn("font-medium text-slate-700", textClass)}>
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
