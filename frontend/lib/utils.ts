import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);
}

export function formatRating(rating: number) {
  return rating.toFixed(1);
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function buildAvatarUrl(name: string, size = 80) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=${size}&background=4f46e5&color=fff&bold=true`;
}

export function truncate(str: string, maxLen: number) {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen).trimEnd() + "…";
}
