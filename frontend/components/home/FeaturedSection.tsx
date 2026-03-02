"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import type { BusinessListItem, ServiceProviderListItem } from "@/lib/types";
import { api } from "@/lib/api";
import BusinessCard from "@/components/cards/BusinessCard";
import ServiceProviderCard from "@/components/cards/ServiceProviderCard";
import { GridSkeleton } from "@/components/ui/Skeleton";
import EmptyState from "@/components/ui/EmptyState";

function Section({
  title,
  subtitle,
  viewAllHref,
  dark = false,
  children,
}: {
  title: string;
  subtitle: string;
  viewAllHref: string;
  dark?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={`py-16 lg:py-20 ${dark ? "bg-slate-900" : "bg-white"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className={`font-semibold text-sm uppercase tracking-widest mb-2 ${dark ? "text-violet-400" : "text-primary-600"}`}>
              {subtitle}
            </p>
            <h2 className={`text-3xl lg:text-4xl font-extrabold ${dark ? "text-white" : "text-slate-900"}`}>{title}</h2>
          </div>
          <Link
            href={viewAllHref}
            className={`hidden sm:flex items-center gap-1.5 text-sm font-semibold transition-colors ${dark ? "text-slate-400 hover:text-white" : "text-primary-600 hover:text-primary-700"}`}
          >
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {children}
        <div className="mt-6 text-center sm:hidden">
          <Link href={viewAllHref} className={`text-sm font-semibold ${dark ? "text-slate-400" : "text-primary-600"}`}>
            View all →
          </Link>
        </div>
      </div>
    </div>
  );
}

export function FeaturedBusinesses() {
  const [businesses, setBusinesses] = useState<BusinessListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    api.businesses
      .list({ limit: 6 })
      .then(setBusinesses)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Section title="Featured Businesses" subtitle="Discover" viewAllHref="/businesses">
      {loading ? (
        <GridSkeleton count={6} />
      ) : error || businesses.length === 0 ? (
        <EmptyState
          title="No businesses yet"
          message="Be the first to list your business on BizNest."
          action={
            <Link
              href="/list-your-business"
              className="px-5 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
            >
              List Your Business
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {businesses.map((b) => (
            <BusinessCard key={b.id} business={b} />
          ))}
        </div>
      )}
    </Section>
  );
}

export function FeaturedProviders() {
  const [providers, setProviders] = useState<ServiceProviderListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    api.providers
      .list({ limit: 6 })
      .then(setProviders)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Section title="Service Providers" subtitle="Top Professionals" viewAllHref="/services" dark>
      {loading ? (
        <GridSkeleton count={6} />
      ) : error || providers.length === 0 ? (
        <EmptyState
          title="No providers yet"
          message="Service providers will appear here once they join BizNest."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {providers.map((p) => (
            <ServiceProviderCard key={p.id} provider={p} />
          ))}
        </div>
      )}
    </Section>
  );
}
