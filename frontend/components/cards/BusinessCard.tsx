import Link from "next/link";
import { MapPin, Phone, Globe, ArrowRight } from "lucide-react";
import type { Category } from "@/lib/types";
import Avatar from "@/components/ui/Avatar";
import StarRating from "@/components/ui/StarRating";
import { truncate, cn } from "@/lib/utils";

export interface BusinessCardData {
  id: number;
  name: string;
  slug: string;
  city?: string | null;
  rating?: number | null;
  logo_url?: string | null;
  description?: string | null;
  region?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  is_active?: boolean;
  category?: Category;
}

const ACCENT_COLORS = [
  { border: "border-t-violet-500", badge: "bg-violet-100 text-violet-700", cta: "text-violet-600 hover:text-violet-700" },
  { border: "border-t-rose-500",   badge: "bg-rose-100 text-rose-700",     cta: "text-rose-600 hover:text-rose-700"   },
  { border: "border-t-amber-500",  badge: "bg-amber-100 text-amber-700",   cta: "text-amber-600 hover:text-amber-700" },
  { border: "border-t-emerald-500",badge: "bg-emerald-100 text-emerald-700",cta:"text-emerald-600 hover:text-emerald-700"},
  { border: "border-t-sky-500",    badge: "bg-sky-100 text-sky-700",       cta: "text-sky-600 hover:text-sky-700"     },
  { border: "border-t-fuchsia-500",badge: "bg-fuchsia-100 text-fuchsia-700",cta:"text-fuchsia-600 hover:text-fuchsia-700"},
];

interface BusinessCardProps {
  business: BusinessCardData;
}

export default function BusinessCard({ business }: BusinessCardProps) {
  const accent = ACCENT_COLORS[business.id % ACCENT_COLORS.length];
  const location = [business.city, business.region].filter(Boolean).join(", ");

  return (
    <Link
      href={`/businesses/${business.id}`}
      className={cn(
        "group block bg-white rounded-2xl border border-slate-100 border-t-4 overflow-hidden",
        "hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200",
        accent.border
      )}
    >
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <Avatar name={business.name} src={business.logo_url} size="lg" rounded="lg" />
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-slate-900 truncate text-base group-hover:text-primary-600 transition-colors">
              {business.name}
            </h3>
            {business.category && (
              <span className={cn("inline-block mt-1 text-xs font-semibold px-2.5 py-0.5 rounded-full", accent.badge)}>
                {business.category.name}
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        {business.description && (
          <p className="text-sm text-slate-500 leading-relaxed mb-3">
            {truncate(business.description, 90)}
          </p>
        )}

        {/* Meta */}
        <div className="space-y-1.5 mb-4">
          {location && (
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{location}</span>
            </div>
          )}
          {business.phone && (
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{business.phone}</span>
            </div>
          )}
          {business.website && (
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{business.website.replace(/^https?:\/\//, "")}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          {business.rating != null ? (
            <StarRating rating={business.rating} />
          ) : (
            <span className="text-xs text-slate-400">No reviews yet</span>
          )}
          <span className={cn("text-xs font-bold flex items-center gap-1 group-hover:gap-2 transition-all", accent.cta)}>
            View <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}
