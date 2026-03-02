import Image from "next/image";
import { cn, getInitials } from "@/lib/utils";

interface AvatarProps {
  name: string;
  src?: string | null;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  rounded?: "lg" | "full";
}

const sizeMap = {
  sm: { container: "w-8 h-8", text: "text-xs", px: 32 },
  md: { container: "w-12 h-12", text: "text-sm", px: 48 },
  lg: { container: "w-16 h-16", text: "text-base", px: 64 },
  xl: { container: "w-24 h-24", text: "text-xl", px: 96 },
};

export default function Avatar({
  name,
  src,
  size = "md",
  className,
  rounded = "lg",
}: AvatarProps) {
  const { container, text } = sizeMap[size];
  const roundedClass = rounded === "full" ? "rounded-full" : "rounded-xl";

  if (src) {
    return (
      <div
        className={cn(
          container,
          roundedClass,
          "overflow-hidden shrink-0 bg-slate-100",
          className
        )}
      >
        <Image
          src={src}
          alt={name}
          width={sizeMap[size].px}
          height={sizeMap[size].px}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        container,
        roundedClass,
        "shrink-0 bg-primary-600 flex items-center justify-center",
        className
      )}
    >
      <span className={cn("font-bold text-white select-none", text)}>
        {getInitials(name)}
      </span>
    </div>
  );
}
