import { type LucideIcon, SearchX, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  message?: string;
  action?: React.ReactNode;
  className?: string;
  variant?: "default" | "error";
}

export default function EmptyState({
  icon: Icon,
  title,
  message,
  action,
  className,
  variant = "default",
}: EmptyStateProps) {
  const DefaultIcon = variant === "error" ? AlertCircle : SearchX;
  const IconComponent = Icon ?? DefaultIcon;

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 px-4 text-center",
        className
      )}
    >
      <div
        className={cn(
          "w-16 h-16 rounded-2xl flex items-center justify-center mb-5",
          variant === "error"
            ? "bg-red-50 text-red-400"
            : "bg-slate-100 text-slate-400"
        )}
      >
        <IconComponent className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-semibold text-slate-800 mb-2">{title}</h3>
      {message && (
        <p className="text-slate-500 text-sm max-w-xs leading-relaxed">
          {message}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
