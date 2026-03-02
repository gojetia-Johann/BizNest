"use client";

import { useState, useEffect } from "react";
import { ShoppingBag, Search, X, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import type { ProductListItem } from "@/lib/types";
import { useDebounce } from "@/lib/hooks";
import ProductCard from "@/components/cards/ProductCard";
import { GridSkeleton } from "@/components/ui/Skeleton";
import EmptyState from "@/components/ui/EmptyState";

const LIMIT = 24;

export default function ProductsPage() {
  const [allItems, setAllItems] = useState<ProductListItem[]>([]);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    setLoading(true);
    setError(false);
    api.products
      .list({ skip: 0, limit: LIMIT })
      .then((data) => {
        setAllItems(data);
        setSkip(data.length);
        setHasMore(data.length === LIMIT);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  function loadMore() {
    setLoadingMore(true);
    api.products
      .list({ skip, limit: LIMIT })
      .then((data) => {
        setAllItems((prev) => [...prev, ...data]);
        setSkip((s) => s + data.length);
        setHasMore(data.length === LIMIT);
      })
      .catch(() => {})
      .finally(() => setLoadingMore(false));
  }

  const displayed = debouncedSearch
    ? allItems.filter((p) =>
        p.name.toLowerCase().includes(debouncedSearch.toLowerCase())
      )
    : allItems;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-extrabold">Products</h1>
          </div>
          <p className="text-emerald-100 ml-16">Browse goods sold by businesses on BizNest.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl border border-slate-100 p-4 mb-8 flex gap-3">
          <div className="flex-1 flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2.5">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products…"
              className="flex-1 bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none"
            />
            {search && (
              <button onClick={() => setSearch("")} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {!loading && !error && (
          <p className="text-sm text-slate-500 mb-4">
            {displayed.length} product{displayed.length !== 1 ? "s" : ""} available
          </p>
        )}

        {loading ? (
          <GridSkeleton count={12} />
        ) : error ? (
          <EmptyState
            variant="error"
            title="Failed to load products"
            message="Could not connect to the server. Make sure the backend is running."
          />
        ) : displayed.length === 0 ? (
          <EmptyState
            title="No products found"
            message={search ? `No products match "${search}".` : "No products have been listed yet."}
          />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayed.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
            {hasMore && !debouncedSearch && (
              <div className="mt-10 text-center">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="inline-flex items-center gap-2 px-8 py-3 bg-white border border-slate-200 hover:border-primary-300 text-slate-700 hover:text-primary-600 text-sm font-medium rounded-xl transition-all disabled:opacity-50"
                >
                  {loadingMore && <Loader2 className="w-4 h-4 animate-spin" />}
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
