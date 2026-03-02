"use client";

import Link from "next/link";
import {
  Zap, Droplets, Scissors, Printer, UtensilsCrossed,
  Wrench, Car, Home, Camera, BookOpen, Stethoscope, Sparkles,
} from "lucide-react";

const CATEGORIES = [
  {
    slug: "electrical",    label: "Electrical",
    icon: Zap,
    bg: "bg-amber-500",    hover: "hover:bg-amber-600",
    glow: "shadow-amber-200",
  },
  {
    slug: "plumbing",      label: "Plumbing",
    icon: Droplets,
    bg: "bg-sky-500",      hover: "hover:bg-sky-600",
    glow: "shadow-sky-200",
  },
  {
    slug: "beauty-wellness", label: "Beauty & Wellness",
    icon: Scissors,
    bg: "bg-rose-500",     hover: "hover:bg-rose-600",
    glow: "shadow-rose-200",
  },
  {
    slug: "printing-design", label: "Printing & Design",
    icon: Printer,
    bg: "bg-violet-500",   hover: "hover:bg-violet-600",
    glow: "shadow-violet-200",
  },
  {
    slug: "food-beverage", label: "Food & Beverage",
    icon: UtensilsCrossed,
    bg: "bg-orange-500",   hover: "hover:bg-orange-600",
    glow: "shadow-orange-200",
  },
  {
    slug: "hardware-tools", label: "Hardware & Tools",
    icon: Wrench,
    bg: "bg-slate-600",    hover: "hover:bg-slate-700",
    glow: "shadow-slate-200",
  },
  {
    slug: "automotive",    label: "Automotive",
    icon: Car,
    bg: "bg-red-500",      hover: "hover:bg-red-600",
    glow: "shadow-red-200",
  },
  {
    slug: "home-services", label: "Home Services",
    icon: Home,
    bg: "bg-emerald-500",  hover: "hover:bg-emerald-600",
    glow: "shadow-emerald-200",
  },
  {
    slug: "photography",   label: "Photography",
    icon: Camera,
    bg: "bg-fuchsia-500",  hover: "hover:bg-fuchsia-600",
    glow: "shadow-fuchsia-200",
  },
  {
    slug: "education",     label: "Education",
    icon: BookOpen,
    bg: "bg-blue-500",     hover: "hover:bg-blue-600",
    glow: "shadow-blue-200",
  },
  {
    slug: "healthcare",    label: "Healthcare",
    icon: Stethoscope,
    bg: "bg-teal-500",     hover: "hover:bg-teal-600",
    glow: "shadow-teal-200",
  },
  {
    slug: "cleaning",      label: "Cleaning",
    icon: Sparkles,
    bg: "bg-cyan-500",     hover: "hover:bg-cyan-600",
    glow: "shadow-cyan-200",
  },
];

export default function CategoryGrid() {
  return (
    <section className="py-16 lg:py-20 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-primary-400 font-semibold text-sm uppercase tracking-widest mb-2">
              Browse by Category
            </p>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-white">
              What are you looking for?
            </h2>
          </div>
          <Link
            href="/categories"
            className="hidden sm:block text-sm font-semibold text-slate-400 hover:text-white transition-colors"
          >
            All categories →
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/search?q=${encodeURIComponent(cat.label)}`}
              className="group flex flex-col items-center gap-3 cursor-pointer"
            >
              <div
                className={`w-16 h-16 rounded-2xl ${cat.bg} ${cat.hover} flex items-center justify-center shadow-lg ${cat.glow} group-hover:scale-110 group-hover:shadow-xl transition-all duration-200`}
              >
                <cat.icon className="w-7 h-7 text-white" />
              </div>
              <span className="text-xs font-semibold text-slate-300 group-hover:text-white text-center leading-tight transition-colors">
                {cat.label}
              </span>
            </Link>
          ))}
        </div>

        {/* Mobile view all */}
        <div className="mt-10 text-center sm:hidden">
          <Link href="/categories" className="text-sm font-semibold text-slate-400 hover:text-white">
            View all categories →
          </Link>
        </div>
      </div>
    </section>
  );
}
