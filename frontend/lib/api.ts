import type {
  Category,
  Business,
  BusinessListItem,
  ServiceProvider,
  ServiceProviderListItem,
  Service,
  Product,
  ProductListItem,
  SearchResult,
  NearMeResult,
} from "./types";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost/api/v1";

async function fetcher<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...options?.headers },
  });
  if (!res.ok) throw new Error(`API error ${res.status}: ${res.statusText}`);
  return res.json() as Promise<T>;
}

export const api = {
  categories: {
    list: () => fetcher<Category[]>("/categories"),
    get: (id: number) => fetcher<Category>(`/categories/${id}`),
  },

  businesses: {
    /**
     * Returns a plain array (no pagination wrapper).
     * Use skip/limit for offset-based paging.
     * Limit max: 100.
     */
    list: (params?: {
      skip?: number;
      limit?: number;
      city?: string;
      category_id?: number;
    }) => {
      const q = new URLSearchParams();
      if (params?.skip) q.set("skip", String(params.skip));
      if (params?.limit) q.set("limit", String(params.limit));
      if (params?.city) q.set("city", params.city);
      if (params?.category_id) q.set("category_id", String(params.category_id));
      return fetcher<BusinessListItem[]>(`/businesses?${q}`);
    },
    get: (id: number) => fetcher<Business>(`/businesses/${id}`),
  },

  providers: {
    /**
     * Returns a plain array (no pagination wrapper).
     * Use skip/limit for offset-based paging.
     */
    list: (params?: {
      skip?: number;
      limit?: number;
      category_id?: number;
    }) => {
      const q = new URLSearchParams();
      if (params?.skip) q.set("skip", String(params.skip));
      if (params?.limit) q.set("limit", String(params.limit));
      if (params?.category_id) q.set("category_id", String(params.category_id));
      return fetcher<ServiceProviderListItem[]>(`/services/providers?${q}`);
    },
    get: (id: number) => fetcher<ServiceProvider>(`/services/providers/${id}`),
  },

  services: {
    /** Returns a plain array of full ServiceRead objects. */
    list: (params?: {
      skip?: number;
      limit?: number;
      provider_id?: number;
      category_id?: number;
    }) => {
      const q = new URLSearchParams();
      if (params?.skip) q.set("skip", String(params.skip));
      if (params?.limit) q.set("limit", String(params.limit));
      if (params?.provider_id) q.set("provider_id", String(params.provider_id));
      if (params?.category_id) q.set("category_id", String(params.category_id));
      return fetcher<Service[]>(`/services?${q}`);
    },
  },

  products: {
    /** Returns a plain array (no pagination wrapper). */
    list: (params?: {
      skip?: number;
      limit?: number;
      business_id?: number;
      category_id?: number;
    }) => {
      const q = new URLSearchParams();
      if (params?.skip) q.set("skip", String(params.skip));
      if (params?.limit) q.set("limit", String(params.limit));
      if (params?.business_id) q.set("business_id", String(params.business_id));
      if (params?.category_id) q.set("category_id", String(params.category_id));
      return fetcher<ProductListItem[]>(`/products?${q}`);
    },
    get: (id: number) => fetcher<Product>(`/products/${id}`),
  },

  search: {
    /**
     * Unified search.
     * - `types`: comma-separated filter. Valid values: businesses, services, products, providers
     * - Results have type "business" | "service" | "product" | "provider"
     * - `category` in results is a plain string (category name), not an object
     */
    query: (params: {
      q: string;
      lat?: number;
      lon?: number;
      radius_m?: number;
      /** e.g. "businesses", "services,products", "providers" */
      types?: string;
      limit?: number;
    }) => {
      const q = new URLSearchParams({ q: params.q });
      if (params.lat != null) q.set("lat", String(params.lat));
      if (params.lon != null) q.set("lon", String(params.lon));
      if (params.radius_m) q.set("radius_m", String(params.radius_m));
      if (params.types) q.set("types", params.types);
      if (params.limit) q.set("limit", String(params.limit));
      return fetcher<SearchResult[]>(`/search?${q}`);
    },

    /**
     * Location-based provider search.
     * Returns a custom shape (NOT SearchResult[]).
     * `service_type` is REQUIRED by the backend.
     */
    nearMe: (params: {
      lat: number;
      lon: number;
      service_type: string;
      radius_m?: number;
      limit?: number;
    }) => {
      const q = new URLSearchParams({
        lat: String(params.lat),
        lon: String(params.lon),
        service_type: params.service_type,
      });
      if (params.radius_m) q.set("radius_m", String(params.radius_m));
      if (params.limit) q.set("limit", String(params.limit));
      return fetcher<NearMeResult[]>(`/search/near-me?${q}`);
    },
  },
};
