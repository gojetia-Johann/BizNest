"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ShoppingBag, Building2, CheckCircle2, XCircle, DollarSign } from "lucide-react";
import Image from "next/image";
import { api } from "@/lib/api";
import type { Product } from "@/lib/types";
import Badge from "@/components/ui/Badge";
import { CardSkeleton } from "@/components/ui/Skeleton";
import EmptyState from "@/components/ui/EmptyState";
import { formatPrice } from "@/lib/utils";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const numId = Number(id);
    if (isNaN(numId)) { router.replace("/products"); return; }
    api.products
      .get(numId)
      .then(setProduct)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <CardSkeleton /><CardSkeleton />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <EmptyState
          variant="error"
          title="Product not found"
          message="This product may have been removed."
          action={
            <Link href="/products" className="px-5 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-lg">
              Browse Products
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image */}
          <div className="relative aspect-square bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl overflow-hidden">
            {product.image_url ? (
              <Image src={product.image_url} alt={product.name} fill className="object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <ShoppingBag className="w-20 h-20 text-slate-300" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-3">{product.name}</h1>
              {product.price != null && (
                <div className="flex items-center gap-1.5 text-3xl font-extrabold text-primary-600">
                  <DollarSign className="w-7 h-7" />
                  {formatPrice(product.price, product.currency)}
                </div>
              )}
            </div>

            {/* Availability */}
            <div className="flex items-center gap-2">
              {product.is_available ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <span className="text-sm font-medium text-emerald-700">In Stock</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-red-400" />
                  <span className="text-sm font-medium text-red-600">Out of Stock</span>
                </>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div>
                <h2 className="text-sm font-semibold text-slate-700 mb-2">Description</h2>
                <p className="text-slate-600 text-sm leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Sold by — link to business by ID */}
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-xs text-slate-500 mb-1">Sold by</p>
              <Link
                href={`/businesses/${product.business_id}`}
                className="flex items-center gap-2 text-sm font-semibold text-slate-800 hover:text-primary-600 transition-colors"
              >
                <Building2 className="w-4 h-4 text-slate-400" />
                View Business
              </Link>
            </div>

            {/* CTA */}
            <Link
              href={`/businesses/${product.business_id}`}
              className="block w-full text-center bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3.5 rounded-xl transition-colors"
            >
              Visit Store
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
