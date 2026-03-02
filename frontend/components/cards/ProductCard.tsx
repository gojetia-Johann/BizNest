import Link from "next/link";
import { ShoppingBag, Tag, ArrowRight, Sparkles } from "lucide-react";
import Image from "next/image";
import type { Category } from "@/lib/types";
import { formatPrice, truncate, cn } from "@/lib/utils";

export interface ProductCardData {
  id: number;
  name: string;
  slug: string;
  price?: number | null;
  image_url?: string | null;
  business_id: number;
  description?: string | null;
  currency?: string | null;
  is_available?: boolean;
  business?: { id: number; name: string } | null;
  category?: Category;
}

const IMAGE_GRADIENTS = [
  "from-violet-400 to-purple-600",
  "from-rose-400 to-pink-600",
  "from-emerald-400 to-teal-600",
  "from-amber-400 to-orange-500",
  "from-sky-400 to-blue-600",
  "from-fuchsia-400 to-pink-600",
];

const CATEGORY_CHIPS = [
  "bg-violet-100 text-violet-700 border-violet-200",
  "bg-rose-100 text-rose-700 border-rose-200",
  "bg-emerald-100 text-emerald-700 border-emerald-200",
  "bg-amber-100 text-amber-700 border-amber-200",
  "bg-sky-100 text-sky-700 border-sky-200",
  "bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200",
];

interface ProductCardProps {
  product: ProductCardData;
}

export default function ProductCard({ product }: ProductCardProps) {
  const currency = product.currency ?? "PHP";
  const available = product.is_available ?? true;
  const gradient = IMAGE_GRADIENTS[product.id % IMAGE_GRADIENTS.length];
  const chipColor = CATEGORY_CHIPS[product.id % CATEGORY_CHIPS.length];

  return (
    <Link
      href={`/products/${product.id}`}
      className="group block bg-white rounded-2xl overflow-hidden border border-slate-100 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
    >
      {/* Image */}
      <div className={cn("relative h-44 bg-gradient-to-br", gradient)}>
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <ShoppingBag className="w-12 h-12 text-white/70" />
          </div>
        )}

        {/* Unavailable overlay */}
        {!available && (
          <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center">
            <span className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide">
              Unavailable
            </span>
          </div>
        )}

        {/* Price badge */}
        {product.price != null && (
          <div className="absolute top-3 right-3">
            <span className="bg-white text-slate-900 text-sm font-extrabold px-3 py-1.5 rounded-xl shadow-lg">
              {formatPrice(product.price, currency)}
            </span>
          </div>
        )}

        {/* Available badge */}
        {available && (
          <div className="absolute top-3 left-3">
            <span className="bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
              <Sparkles className="w-3 h-3" /> In Stock
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-slate-900 truncate group-hover:text-primary-600 transition-colors mb-1.5">
          {product.name}
        </h3>

        {product.category && (
          <span className={cn("inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full border mb-2", chipColor)}>
            <Tag className="w-3 h-3" />
            {product.category.name}
          </span>
        )}

        {product.description && (
          <p className="text-xs text-slate-500 leading-relaxed mb-3">
            {truncate(product.description, 70)}
          </p>
        )}

        {product.business && (
          <p className="text-xs text-slate-500 mb-3">
            by <span className="font-semibold text-slate-700">{product.business.name}</span>
          </p>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <span className={cn("text-xs font-bold", available ? "text-emerald-600" : "text-red-500")}>
            {available ? "Available" : "Out of Stock"}
          </span>
          <span className="text-xs font-bold text-primary-600 flex items-center gap-1 group-hover:gap-2 transition-all">
            Details <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}
