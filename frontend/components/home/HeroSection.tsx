"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  MapPin,
  ChevronDown,
  Zap,
  Droplets,
  Scissors,
  Printer,
  Hammer,
  Camera,
} from "lucide-react";

const POPULAR_SEARCHES = [
  { label: "Electrician", icon: Zap },
  { label: "Plumber", icon: Droplets },
  { label: "Hair Salon", icon: Scissors },
  { label: "Printing Shop", icon: Printer },
  { label: "Carpenter", icon: Hammer },
  { label: "Photographer", icon: Camera },
];

const TYPE_OPTIONS = [
  { value: "", label: "All Types" },
  { value: "business", label: "Businesses" },
  { value: "service_provider", label: "Service Providers" },
  { value: "product", label: "Products" },
];

const STATS = [
  { value: "2,000+", label: "Businesses" },
  { value: "500+", label: "Service Providers" },
  { value: "10k+", label: "Products" },
  { value: "50+", label: "Categories" },
];

export default function HeroSection() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [typeOpen, setTypeOpen] = useState(false);
  const typeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (typeRef.current && !typeRef.current.contains(e.target as Node)) {
        setTypeOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleSearch(e?: React.FormEvent, overrideQuery?: string) {
    e?.preventDefault();
    const q = overrideQuery ?? query;
    if (!q.trim()) return;
    const params = new URLSearchParams({ q: q.trim() });
    if (typeFilter) params.set("types", typeFilter);
    router.push(`/search?${params}`);
  }

  const selectedType =
    TYPE_OPTIONS.find((o) => o.value === typeFilter) ?? TYPE_OPTIONS[0];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-violet-700 via-purple-800 to-indigo-900 text-white">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      {/* Glow blobs — more vivid */}
      <div className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-rose-500/30 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 -right-20 w-[500px] h-[500px] bg-fuchsia-600/25 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-400/10 rounded-full blur-2xl" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        {/* Headline */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm text-white/80 mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Philippines&apos; fastest-growing business platform
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-balance mb-5">
            Find Trusted Services &{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-rose-300 to-fuchsia-300">
              Businesses Near You
            </span>
          </h1>
          <p className="text-lg text-white/70 max-w-xl mx-auto">
            Search electricians, printing shops, hardware stores, salons, and
            thousands more — all in one place.
          </p>
        </div>

        {/* Search bar */}
        <form
          onSubmit={handleSearch}
          className="bg-white rounded-2xl shadow-2xl shadow-black/30 p-2 flex flex-col sm:flex-row gap-2 mb-8 max-w-3xl mx-auto"
        >
          {/* Type dropdown */}
          <div ref={typeRef} className="relative shrink-0">
            <button
              type="button"
              onClick={() => setTypeOpen(!typeOpen)}
              className="flex items-center gap-1.5 px-4 py-3 rounded-xl text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors w-full sm:w-auto whitespace-nowrap"
            >
              {selectedType.label}
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform ${typeOpen ? "rotate-180" : ""}`}
              />
            </button>
            {typeOpen && (
              <div className="absolute top-full left-0 mt-1 w-44 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-10">
                {TYPE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setTypeFilter(opt.value);
                      setTypeOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="hidden sm:block w-px bg-slate-200 self-stretch" />

          {/* Search input */}
          <div className="flex-1 flex items-center gap-3 px-3">
            <Search className="w-5 h-5 text-slate-400 shrink-0" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search businesses, services, products…"
              className="flex-1 py-3 text-slate-700 placeholder-slate-400 text-sm outline-none bg-transparent"
            />
          </div>

          {/* Location hint */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 text-slate-400 text-sm">
            <MapPin className="w-4 h-4" />
            <span className="text-slate-500 text-sm">Location</span>
          </div>

          {/* Search button */}
          <button
            type="submit"
            className="bg-gradient-to-r from-rose-500 to-fuchsia-600 hover:from-rose-600 hover:to-fuchsia-700 text-white font-bold px-7 py-3 rounded-xl transition-all shadow-lg hover:shadow-rose-500/40 shrink-0 text-sm"
          >
            Search
          </button>
        </form>

        {/* Popular searches */}
        <div className="flex flex-wrap justify-center gap-2 mb-14">
          <span className="text-white/50 text-sm self-center mr-1">
            Popular:
          </span>
          {POPULAR_SEARCHES.map(({ label, icon: Icon }) => (
            <button
              key={label}
              onClick={() => handleSearch(undefined, label)}
              className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/15 text-white/80 hover:text-white text-sm px-3 py-1.5 rounded-full transition-all"
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
          {STATS.map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="text-2xl font-extrabold text-white">{value}</div>
              <div className="text-white/50 text-xs mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
