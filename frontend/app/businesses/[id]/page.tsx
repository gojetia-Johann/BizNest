"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  Globe,
  CheckCircle2,
  ShoppingBag,
} from "lucide-react";
import { api } from "@/lib/api";
import type { Business, ProductListItem } from "@/lib/types";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import StarRating from "@/components/ui/StarRating";
import { CardSkeleton } from "@/components/ui/Skeleton";
import EmptyState from "@/components/ui/EmptyState";
import ProductCard from "@/components/cards/ProductCard";

export default function BusinessDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [business, setBusiness] = useState<Business | null>(null);
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const numId = Number(id);
    if (isNaN(numId)) { router.replace("/businesses"); return; }

    Promise.all([
      api.businesses.get(numId),
      api.products.list({ business_id: numId, limit: 12 }),
    ])
      .then(([biz, prods]) => {
        setBusiness(biz);
        setProducts(prods);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <CardSkeleton />
            <div className="lg:col-span-2 space-y-6"><CardSkeleton /><CardSkeleton /></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <EmptyState
          variant="error"
          title="Business not found"
          message="This business may have been removed or the link is invalid."
          action={
            <Link href="/businesses" className="px-5 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700">
              Browse Businesses
            </Link>
          }
        />
      </div>
    );
  }

  const location = [business.address, business.city, business.region, business.country]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <aside className="space-y-5">
            <div className="bg-white rounded-2xl border border-slate-100 p-6">
              <div className="flex flex-col items-center text-center mb-5">
                <Avatar name={business.name} src={business.logo_url} size="xl" rounded="lg" className="mb-4" />
                <h1 className="text-xl font-bold text-slate-900 mb-1">{business.name}</h1>
                {/* Category not in full BusinessRead, so skip badge unless category_id present */}
                {business.rating != null && (
                  <div className="mt-3">
                    <StarRating rating={business.rating} size="md" />
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 mb-5">
                <CheckCircle2 className={`w-4 h-4 ${business.is_active ? "text-emerald-500" : "text-slate-400"}`} />
                <span className="text-sm text-slate-600">
                  {business.is_active ? "Currently Active" : "Inactive"}
                </span>
              </div>

              <div className="space-y-3">
                {location && (
                  <div className="flex items-start gap-2.5 text-sm text-slate-600">
                    <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                    <span>{location}</span>
                  </div>
                )}
                {business.phone && (
                  <a href={`tel:${business.phone}`} className="flex items-center gap-2.5 text-sm text-slate-600 hover:text-primary-600 transition-colors">
                    <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                    {business.phone}
                  </a>
                )}
                {business.email && (
                  <a href={`mailto:${business.email}`} className="flex items-center gap-2.5 text-sm text-slate-600 hover:text-primary-600 transition-colors">
                    <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="truncate">{business.email}</span>
                  </a>
                )}
                {business.website && (
                  <a href={business.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-sm text-primary-600 hover:text-primary-700 transition-colors">
                    <Globe className="w-4 h-4 shrink-0" />
                    <span className="truncate">{business.website.replace(/^https?:\/\//, "")}</span>
                  </a>
                )}
              </div>

              {(business.phone || business.email) && (
                <div className="mt-5 space-y-2">
                  {business.phone && (
                    <a href={`tel:${business.phone}`} className="block w-full text-center bg-primary-600 hover:bg-primary-700 text-white font-medium text-sm py-2.5 rounded-xl transition-colors">
                      Call Now
                    </a>
                  )}
                  {business.email && (
                    <a href={`mailto:${business.email}`} className="block w-full text-center border border-primary-200 text-primary-600 font-medium text-sm py-2.5 rounded-xl hover:bg-primary-50 transition-colors">
                      Send Email
                    </a>
                  )}
                </div>
              )}
            </div>
          </aside>

          {/* Main */}
          <div className="lg:col-span-2 space-y-6">
            {business.description && (
              <div className="bg-white rounded-2xl border border-slate-100 p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-3">About</h2>
                <p className="text-slate-600 leading-relaxed text-sm">{business.description}</p>
              </div>
            )}

            <div className="bg-white rounded-2xl border border-slate-100 p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-slate-400" />
                  Products ({products.length})
                </h2>
                {products.length > 0 && (
                  <Link href={`/products?business_id=${business.id}`} className="text-sm font-medium text-primary-600 hover:text-primary-700">
                    View all →
                  </Link>
                )}
              </div>
              {products.length === 0 ? (
                <EmptyState title="No products listed" message="This business hasn't added any products yet." className="py-10" />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {products.slice(0, 4).map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
