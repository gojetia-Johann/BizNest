// ─── Full detail types (returned by GET /{id} endpoints) ────────────────────

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  parent_id?: number | null;
}

/** Full business — returned by GET /businesses/{id} */
export interface Business {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  category_id?: number | null;
  address?: string | null;
  city?: string | null;
  region?: string | null;
  postal_code?: string | null;
  country?: string;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  is_active: boolean;
  rating?: number | null;
  logo_url?: string | null;
}

/** Full service provider — returned by GET /services/providers/{id} */
export interface ServiceProvider {
  id: number;
  name: string;
  slug: string;
  bio?: string | null;
  business_id?: number | null;
  phone?: string | null;
  email?: string | null;
  is_active: boolean;
  rating?: number | null;
  avatar_url?: string | null;
}

/** Full service — returned by GET /services */
export interface Service {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  price_min?: number | null;
  price_max?: number | null;
  price_unit?: string | null;
  is_active: boolean;
  provider_id: number;
  category_id?: number | null;
}

/** Full product — returned by GET /products/{id} */
export interface Product {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  business_id: number;
  category_id?: number | null;
  price?: number | null;
  currency: string;
  image_url?: string | null;
  is_available: boolean;
}

// ─── Lightweight list types (returned by GET list endpoints) ─────────────────

/** Minimal business — returned by GET /businesses (list) */
export interface BusinessListItem {
  id: number;
  name: string;
  slug: string;
  city?: string | null;
  rating?: number | null;
  logo_url?: string | null;
}

/** Minimal provider — returned by GET /services/providers (list) */
export interface ServiceProviderListItem {
  id: number;
  name: string;
  slug: string;
  rating?: number | null;
  avatar_url?: string | null;
}

/** Minimal product — returned by GET /products (list) */
export interface ProductListItem {
  id: number;
  name: string;
  slug: string;
  price?: number | null;
  image_url?: string | null;
  business_id: number;
}

// ─── Search types ─────────────────────────────────────────────────────────────

/** Type values returned by GET /search */
export type SearchResultType =
  | "business"
  | "service"
  | "product"
  | "provider";

/**
 * SearchResultItem — returned by GET /search.
 * Note: `category` is a plain string (category name), NOT a Category object.
 * Note: `type` is "provider" for service providers (NOT "service_provider").
 */
export interface SearchResult {
  type: SearchResultType;
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  category?: string | null;
  city?: string | null;
  rating?: number | null;
  image_url?: string | null;
  price?: number | null;
  price_unit?: string | null;
}

// ─── Near-me types ────────────────────────────────────────────────────────────

/**
 * NearMeResult — returned by GET /search/near-me.
 * This is a custom shape, NOT a SearchResult.
 */
export interface NearMeResult {
  id: number;
  name: string;
  slug: string;
  rating?: number | null;
  services: Array<{ name: string; price: number | null }>;
}
