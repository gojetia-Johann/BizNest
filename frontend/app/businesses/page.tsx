"use client";

import { useState, useEffect, useRef } from "react";
import { Building2, Search, Filter, X, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import type { BusinessListItem } from "@/lib/types";
import { useDebounce } from "@/lib/hooks";
import BusinessCard from "@/components/cards/BusinessCard";
import { GridSkeleton } from "@/components/ui/Skeleton";
import EmptyState from "@/components/ui/EmptyState";

const LIMIT = 24;

export default function BusinessesPage() {
  const [allItems, setAllItems] = useState<BusinessListItem[]>([]);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(false);
  const [city, setCity] = useState("");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const debouncedCity = useDebounce(city, 400);
  const prevCity = useRef(debouncedCity);

  // Initial load and city-filter reload
  useEffect(() => {
    const isReset = debouncedCity !== prevCity.current;
    prevCity.current = debouncedCity;
    setLoading(true);
    setError(false);
    api.businesses
      .list({ skip: 0, limit: LIMIT, city: debouncedCity || undefined })
      .then((data) => {
        setAllItems(data);
        setSkip(data.length);
        setHasMore(data.length === LIMIT);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
    if (isReset) {/* intentional reset */}
  }, [debouncedCity]);

  function loadMore() {
    setLoadingMore(true);
    api.businesses
      .list({ skip, limit: LIMIT, city: debouncedCity || undefined })
      .then((data) => {
        setAllItems((prev) => [...prev, ...data]);
        setSkip((s) => s + data.length);
        setHasMore(data.length === LIMIT);
      })
      .catch(() => {})
      .finally(() => setLoadingMore(false));
  }

  function clearFilters() {
    setCity("");
    setSearch("");
  }

  const displayed = debouncedSearch
    ? allItems.filter((b) =>
        b.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        b.city?.toLowerCase().includes(debouncedSearch.toLowerCase())
      )
    : allItems;

  const hasFilters = city || search;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-r from-violet-600 via-purple-700 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-extrabold">Businesses</h1>
          </div>
          <p className="text-violet-200 ml-16">
            Discover shops, stores, and companies near you.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-2xl border border-slate-100 p-4 mb-8 flex flex-col sm:flex-row gap-3">
          <div className="flex-1 flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2.5">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or city…"
              className="flex-1 bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none"
            />
          </div>
          <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2.5 sm:w-52">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Filter by city…"
              className="flex-1 bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none"
            />
          </div>
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors whitespace-nowrap"
            >
              <X className="w-4 h-4" />
              Clear
            </button>
          )}
        </div>

        {/* Count */}
        {!loading && !error && (
          <p className="text-sm text-slate-500 mb-4">
            Showing {displayed.length} business{displayed.length !== 1 ? "es" : ""}
            {debouncedCity ? ` in "${debouncedCity}"` : ""}
          </p>
        )}

        {loading ? (
          <GridSkeleton count={12} />
        ) : error ? (
          <EmptyState
            variant="error"
            title="Failed to load businesses"
            message="Could not connect to the server. Make sure the backend is running."
            action={
              <button
                onClick={() => {
                  setLoading(true);
                  api.businesses
                    .list({ skip: 0, limit: LIMIT, city: debouncedCity || undefined })
                    .then((data) => { setAllItems(data); setSkip(data.length); setHasMore(data.length === LIMIT); setError(false); })
                    .catch(() => setError(true))
                    .finally(() => setLoading(false));
                }}
                className="px-5 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700"
              >
                Retry
              </button>
            }
          />
        ) : displayed.length === 0 ? (
          <EmptyState
            title="No businesses found"
            message={hasFilters ? "Try adjusting your filters." : "No businesses have been listed yet."}
            action={
              hasFilters ? (
                <button
                  onClick={clearFilters}
                  className="px-5 py-2.5 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-200"
                >
                  Clear filters
                </button>
              ) : undefined
            }
          />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayed.map((b) => (
                <BusinessCard key={b.id} business={b} />
              ))}
            </div>

            {/* Load More */}
            {hasMore && !debouncedSearch && (
              <div className="mt-10 text-center">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="inline-flex items-center gap-2 px-8 py-3 bg-white border border-slate-200 hover:border-primary-300 text-slate-700 hover:text-primary-600 text-sm font-medium rounded-xl transition-all disabled:opacity-50"
                >
                  {loadingMore ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : null}
                  {loadingMore ? "Loading…" : "Load More"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
