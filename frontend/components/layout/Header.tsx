"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import {
  Building2,
  Menu,
  X,
  Search,
  MapPin,
  Briefcase,
  ShoppingBag,
  LayoutGrid,
  Wrench,
  Upload,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/businesses", label: "Businesses", icon: Building2 },
  { href: "/services", label: "Services", icon: Wrench },
  { href: "/products", label: "Products", icon: ShoppingBag },
  { href: "/categories", label: "Categories", icon: LayoutGrid },
  { href: "/near-me", label: "Near Me", icon: MapPin, highlight: true },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center shadow-sm group-hover:bg-primary-700 transition-colors">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">
              Biz<span className="text-primary-600">Nest</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150",
                  link.highlight
                    ? pathname === link.href
                      ? "bg-primary-600 text-white"
                      : "text-primary-600 hover:bg-primary-50"
                    : pathname === link.href
                    ? "bg-primary-50 text-primary-700"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                )}
              >
                <link.icon className="w-3.5 h-3.5" />
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="hidden lg:flex items-center gap-2">
            {searchOpen ? (
              <form
                onSubmit={handleSearchSubmit}
                className="flex items-center gap-1 bg-slate-100 rounded-xl px-3 py-1.5"
              >
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  ref={searchRef}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search anything…"
                  className="bg-transparent text-sm outline-none w-48 text-slate-700 placeholder-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>
            )}
            <Link
              href="/upload-inventory"
              className="px-4 py-2 text-sm font-medium text-emerald-700 border border-emerald-200 rounded-lg hover:bg-emerald-50 transition-colors"
            >
              <Upload className="w-4 h-4 inline mr-1.5 -mt-0.5" />
              Upload Inventory
            </Link>
            <Link
              href="/signup?role=business"
              className="px-4 py-2 text-sm font-medium text-primary-600 border border-primary-200 rounded-lg hover:bg-primary-50 transition-colors"
            >
              <Briefcase className="w-4 h-4 inline mr-1.5 -mt-0.5" />
              List Business
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-violet-600 to-purple-600 rounded-lg hover:from-violet-700 hover:to-purple-700 transition-all shadow-sm"
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile actions */}
          <div className="lg:hidden flex items-center gap-1">
            <Link
              href="/search"
              className="p-2 text-slate-500 hover:text-slate-700 rounded-lg"
            >
              <Search className="w-5 h-5" />
            </Link>
            <button
              className="p-2 text-slate-500 hover:text-slate-700 rounded-lg"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white px-4 py-3 space-y-1 animate-slide-up">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                link.highlight
                  ? "text-primary-600 hover:bg-primary-50"
                  : pathname === link.href
                  ? "bg-primary-50 text-primary-700"
                  : "text-slate-600 hover:bg-slate-100"
              )}
            >
              <link.icon className="w-4 h-4" />
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-slate-100 flex gap-2">
            <Link
              href="/signup?role=business"
              className="flex-1 text-center px-3 py-2.5 text-sm font-medium text-primary-600 border border-primary-200 rounded-xl"
              onClick={() => setMobileOpen(false)}
            >
              List Business
            </Link>
            <Link
              href="/signup"
              className="flex-1 text-center px-3 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl"
              onClick={() => setMobileOpen(false)}
            >
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
