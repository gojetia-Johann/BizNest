"use client";

import Link from "next/link";
import { Phone, Mail, ArrowRight, Star } from "lucide-react";
import type { Service } from "@/lib/types";
import Avatar from "@/components/ui/Avatar";
import { cn } from "@/lib/utils";

export interface ProviderCardData {
  id: number;
  name: string;
  slug: string;
  rating?: number | null;
  avatar_url?: string | null;
  bio?: string | null;
  phone?: string | null;
  email?: string | null;
  business?: { id: number; name: string } | null;
  services?: Service[];
}

interface ServiceProviderCardProps {
  provider: ProviderCardData;
}

/** 6 gradient schemes — assigned by `id % 6` so every card gets a stable color */
const BANNER_GRADIENTS = [
  "from-violet-500 via-purple-600 to-indigo-600",
  "from-rose-500 via-pink-600 to-fuchsia-600",
  "from-emerald-500 via-teal-600 to-cyan-600",
  "from-amber-500 via-orange-500 to-red-500",
  "from-sky-500 via-blue-600 to-indigo-600",
  "from-fuchsia-500 via-purple-600 to-violet-600",
];

const SERVICE_CHIP_COLORS = [
  "bg-violet-100 text-violet-700",
  "bg-rose-100 text-rose-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-sky-100 text-sky-700",
  "bg-fuchsia-100 text-fuchsia-700",
  "bg-pink-100 text-pink-700",
  "bg-teal-100 text-teal-700",
];

export default function ServiceProviderCard({ provider }: ServiceProviderCardProps) {
  const gradient = BANNER_GRADIENTS[provider.id % BANNER_GRADIENTS.length];
  const serviceCount = provider.services?.length ?? 0;

  return (
    <Link
      href={`/services/${provider.id}`}
      className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-100 hover:border-transparent transition-all duration-200"
    >
      {/* Gradient banner */}
      <div className={cn("relative h-24 bg-gradient-to-r", gradient)}>
        {/* Subtle dot pattern overlay */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "20px 20px",
          }}
        />
      </div>

      {/* Avatar — overlaps banner */}
      <div className="flex justify-center -mt-10 relative z-10 mb-3">
        <Avatar
          name={provider.name}
          src={provider.avatar_url}
          size="xl"
          rounded="full"
          className="ring-4 ring-white shadow-lg"
        />
      </div>

      {/* Content */}
      <div className="px-5 pb-5 text-center">
        <h3 className="font-bold text-slate-900 text-lg leading-tight mb-0.5 group-hover:text-violet-700 transition-colors">
          {provider.name}
        </h3>

        {provider.business && (
          <p className="text-xs text-slate-500 mb-2">@ {provider.business.name}</p>
        )}

        {/* Rating */}
        {provider.rating != null ? (
          <div className="flex items-center justify-center gap-1 mb-3">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="text-sm font-bold text-slate-800">{provider.rating.toFixed(1)}</span>
          </div>
        ) : (
          <p className="text-xs text-slate-400 mb-3">No reviews yet</p>
        )}

        {/* Bio */}
        {provider.bio && (
          <p className="text-xs text-slate-500 leading-relaxed mb-3 line-clamp-2">
            {provider.bio}
          </p>
        )}

        {/* Service chips */}
        {provider.services && provider.services.length > 0 && (
          <div className="flex flex-wrap justify-center gap-1.5 mb-4">
            {provider.services.slice(0, 3).map((s, i) => (
              <span
                key={s.id}
                className={cn(
                  "text-xs font-medium px-2.5 py-1 rounded-full",
                  SERVICE_CHIP_COLORS[i % SERVICE_CHIP_COLORS.length]
                )}
              >
                {s.name}
              </span>
            ))}
            {provider.services.length > 3 && (
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                +{provider.services.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Contact info */}
        {(provider.phone || provider.email) && (
          <div className="flex gap-2 justify-center mb-4">
            {provider.phone && (
              <span className="text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded-lg">
                <Phone className="w-3 h-3 inline mr-1" />
                {provider.phone}
              </span>
            )}
          </div>
        )}

        {/* CTA */}
        <div className={cn("w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-all bg-gradient-to-r", gradient, "group-hover:opacity-90 group-hover:shadow-md")}>
          View Profile <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
