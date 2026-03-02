"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, X, Briefcase, Building2, ShoppingBag, Wrench } from "lucide-react";
import { api } from "@/lib/api";
import type { SearchResult, SearchResultType } from "@/lib/types";
import BusinessCard from "@/components/cards/BusinessCard";
import ServiceProviderCard from "@/components/cards/ServiceProviderCard";
import ProductCard from "@/components/cards/ProductCard";
import Badge from "@/components/ui/Badge";
import { GridSkeleton } from "@/components/ui/Skeleton";
import EmptyState from "@/components/ui/EmptyState";
import { cn, formatPrice } from "@/lib/utils";

/**
 * Tab definitions.
 * `backendType` maps to the backend's `types` query param value.
 * `resultType`  is the string in SearchResult.type from the API response.
 */
const TABS = [
  { key: "", label: "All Results", backendType: "", icon: null },
  { key: "businesses", label: "Businesses", backendType: "businesses", resultType: "business" as SearchResultType, icon: Building2 },
  { key: "providers", label: "Providers", backendType: "providers", resultType: "provider" as SearchResultType, icon: Briefcase },
  { key: "services", label: "Services", backendType: "services", resultType: "service" as SearchResultType, icon: Wrench },
  { key: "products", label: "Products", backendType: "products", resultType: "product" as SearchResultType, icon: ShoppingBag },
] as const;

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [activeTab, setActiveTab] = useState(searchParams.get("types") ?? "");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const runSearch = useCallback(async (q: string, types: string) => {
    if (!q.trim()) return;
    setLoading(true);
    setError(null);
    setSearched(true);
    try {
      const data = await api.search.query({ q: q.trim(), types: types || undefined });
      setResults(data);
    } catch {
      setError("Search failed. Please check your connection and try again.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const q = searchParams.get("q") ?? "";
    const types = searchParams.get("types") ?? "";
    setQuery(q);
    setActiveTab(types);
    if (q) runSearch(q, types);
  }, [searchParams, runSearch]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    const params = new URLSearchParams({ q: query.trim() });
    if (activeTab) params.set("types", activeTab);
    router.push(`/search?${params}`);
  }

  function handleTabChange(backendType: string) {
    setActiveTab(backendType);
    const params = new URLSearchParams({ q: query });
    if (backendType) params.set("types", backendType);
    router.push(`/search?${params}`);
  }

  // Filter results by the active tab's resultType
  const activeTabDef = TABS.find((t) => t.key === activeTab);
  const filtered =
    activeTab && activeTabDef && "resultType" in activeTabDef
      ? results.filter((r) => r.type === activeTabDef.resultType)
      : results;

  // Count per type for tab badges
  const counts = {
    businesses: results.filter((r) => r.type === "business").length,
    providers: results.filter((r) => r.type === "provider").length,
    services: results.filter((r) => r.type === "service").length,
    products: results.filter((r) => r.type === "product").length,
  } as Record<string, number>;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Search header */}
      <div className="bg-white border-b border-slate-200 py-6">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <div className="flex-1 flex items-center gap-3 bg-slate-100 rounded-xl px-4 py-3">
              <Search className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search businesses, services, products…"
                className="flex-1 bg-transparent text-slate-700 placeholder-slate-400 text-sm outline-none"
              />
              {query && (
                <button type="button" onClick={() => setQuery("")} className="text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button type="submit" className="bg-primary-600 hover:bg-primary-700 text-white font-medium px-6 py-3 rounded-xl transition-colors text-sm">
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs + results count */}
        {searched && !loading && (
          <div className="mb-6">
            {results.length > 0 && (
              <p className="text-sm text-slate-500 mb-4">
                Found <span className="font-semibold text-slate-800">{results.length}</span> results
                {" "}for <span className="font-semibold text-slate-800">&ldquo;{searchParams.get("q")}&rdquo;</span>
              </p>
            )}
            <div className="flex gap-2 flex-wrap">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => handleTabChange(tab.key)}
                  className={cn(
                    "flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                    activeTab === tab.key
                      ? "bg-primary-600 text-white shadow-sm"
                      : "bg-white text-slate-600 border border-slate-200 hover:border-primary-200 hover:text-primary-600"
                  )}
                >
                  {tab.icon && <tab.icon className="w-3.5 h-3.5" />}
                  {tab.label}
                  {tab.key && counts[tab.key] > 0 && (
                    <span className={cn(
                      "text-xs rounded-full px-1.5 py-0.5",
                      activeTab === tab.key ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                    )}>
                      {counts[tab.key]}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {loading ? (
          <GridSkeleton count={6} />
        ) : error ? (
          <EmptyState
            variant="error"
            title="Search failed"
            message={error}
            action={
              <button
                onClick={() => runSearch(query, activeTab)}
                className="px-5 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700"
              >
                Try again
              </button>
            }
          />
        ) : !searched ? (
          <div className="text-center py-20">
            <Search className="w-14 h-14 text-slate-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-slate-700 mb-2">Search BizNest</h2>
            <p className="text-slate-500 text-sm">Find businesses, service providers, and products all in one place.</p>
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No results found"
            message={`We couldn't find anything for "${searchParams.get("q")}". Try a different search term.`}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((result) => (
              <SearchResultCard key={`${result.type}-${result.id}`} result={result} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/** Renders the right card based on the search result type. */
function SearchResultCard({ result }: { result: SearchResult }) {
  // category is a plain string from the backend, convert to Category-like object for cards
  const categoryObj = result.category
    ? { id: 0, name: result.category, slug: "" }
    : undefined;

  if (result.type === "business") {
    return (
      <BusinessCard
        business={{
          id: result.id,
          name: result.name,
          slug: result.slug,
          description: result.description,
          city: result.city,
          rating: result.rating,
          logo_url: result.image_url,
          category: categoryObj,
        }}
      />
    );
  }

  if (result.type === "provider") {
    return (
      <ServiceProviderCard
        provider={{
          id: result.id,
          name: result.name,
          slug: result.slug,
          bio: result.description,
          rating: result.rating,
          avatar_url: result.image_url,
        }}
      />
    );
  }

  if (result.type === "product") {
    return (
      <ProductCard
        product={{
          id: result.id,
          name: result.name,
          slug: result.slug,
          description: result.description,
          price: result.price,
          image_url: result.image_url,
          business_id: 0,
          category: categoryObj,
        }}
      />
    );
  }

  // type === "service"
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 hover:border-primary-200 hover:shadow-lg transition-all">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center shrink-0">
          <Wrench className="w-5 h-5 text-primary-600" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-900 text-sm">{result.name}</h3>
          {categoryObj && (
            <Badge variant="primary" className="mt-1">{categoryObj.name}</Badge>
          )}
        </div>
      </div>
      {result.description && (
        <p className="text-xs text-slate-500 mb-3 leading-relaxed">{result.description}</p>
      )}
      {result.price != null && (
        <p className="text-sm font-semibold text-slate-700">
          From {formatPrice(result.price, "PHP")}
          {result.price_unit && (
            <span className="text-xs text-slate-400 font-normal ml-1">/{result.price_unit}</span>
          )}
        </p>
      )}
    </div>
  );
}
