"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  LayoutGrid,
  Zap,
  Droplets,
  Scissors,
  Printer,
  UtensilsCrossed,
  Wrench,
  Car,
  Home,
  Camera,
  BookOpen,
  Stethoscope,
  Sparkles,
  HelpCircle,
} from "lucide-react";
import { api } from "@/lib/api";
import type { Category } from "@/lib/types";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  electrical: Zap,
  plumbing: Droplets,
  "beauty-wellness": Scissors,
  beauty: Scissors,
  wellness: Scissors,
  "printing-design": Printer,
  printing: Printer,
  "food-beverage": UtensilsCrossed,
  food: UtensilsCrossed,
  "hardware-tools": Wrench,
  hardware: Wrench,
  automotive: Car,
  "home-services": Home,
  home: Home,
  photography: Camera,
  education: BookOpen,
  healthcare: Stethoscope,
  health: Stethoscope,
  cleaning: Sparkles,
};

const COLOR_CYCLE = [
  { card: "bg-amber-500  hover:bg-amber-600",   text: "text-white" },
  { card: "bg-sky-500    hover:bg-sky-600",      text: "text-white" },
  { card: "bg-rose-500   hover:bg-rose-600",     text: "text-white" },
  { card: "bg-violet-500 hover:bg-violet-600",   text: "text-white" },
  { card: "bg-orange-500 hover:bg-orange-600",   text: "text-white" },
  { card: "bg-slate-700  hover:bg-slate-800",    text: "text-white" },
  { card: "bg-red-500    hover:bg-red-600",      text: "text-white" },
  { card: "bg-emerald-500 hover:bg-emerald-600", text: "text-white" },
  { card: "bg-fuchsia-500 hover:bg-fuchsia-600", text: "text-white" },
  { card: "bg-blue-500   hover:bg-blue-600",     text: "text-white" },
  { card: "bg-teal-500   hover:bg-teal-600",     text: "text-white" },
  { card: "bg-cyan-500   hover:bg-cyan-600",     text: "text-white" },
];

function getIcon(slug: string) {
  const key = Object.keys(ICON_MAP).find(
    (k) => slug.toLowerCase().includes(k) || k.includes(slug.toLowerCase())
  );
  return key ? ICON_MAP[key] : HelpCircle;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.categories
      .list()
      .then(setCategories)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Merge API categories with static fallback
  const displayCategories =
    categories.length > 0
      ? categories
      : STATIC_CATEGORIES.map((c, i) => ({
          id: i + 1,
          name: c.name,
          slug: c.slug,
          description: c.description,
        }));

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <LayoutGrid className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-extrabold">All Categories</h1>
          </div>
          <p className="text-slate-400 ml-16">
            Browse all service and business categories on BizNest.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="skeleton h-28 rounded-2xl"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {displayCategories.map((cat, i) => {
              const Icon = getIcon(cat.slug);
              const palette = COLOR_CYCLE[i % COLOR_CYCLE.length];
              return (
                <Link
                  key={cat.id}
                  href={`/search?q=${encodeURIComponent(cat.name)}`}
                  className={cn(
                    "flex flex-col items-center gap-3 p-5 rounded-2xl transition-all duration-200 hover:shadow-xl hover:scale-105 cursor-pointer group shadow-md",
                    palette.card, palette.text
                  )}
                >
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center group-hover:bg-white/30 group-hover:scale-110 transition-all">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold leading-tight">
                      {cat.name}
                    </p>
                    {cat.description && (
                      <p className="text-xs opacity-80 mt-0.5 leading-snug line-clamp-2">
                        {cat.description}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

const STATIC_CATEGORIES = [
  { name: "Electrical", slug: "electrical", description: "Wiring, repairs & installations" },
  { name: "Plumbing", slug: "plumbing", description: "Pipes, fixtures & drainage" },
  { name: "Beauty & Wellness", slug: "beauty-wellness", description: "Salons, spas & grooming" },
  { name: "Printing & Design", slug: "printing-design", description: "Print shops & graphic design" },
  { name: "Food & Beverage", slug: "food-beverage", description: "Restaurants, cafés & catering" },
  { name: "Hardware & Tools", slug: "hardware-tools", description: "Tools, supplies & materials" },
  { name: "Automotive", slug: "automotive", description: "Repairs, parts & accessories" },
  { name: "Home Services", slug: "home-services", description: "Repairs, renovations & maintenance" },
  { name: "Photography", slug: "photography", description: "Events, portraits & videography" },
  { name: "Education", slug: "education", description: "Tutoring, training & courses" },
  { name: "Healthcare", slug: "healthcare", description: "Clinics, wellness & medical" },
  { name: "Cleaning", slug: "cleaning", description: "Home, office & commercial cleaning" },
];
