"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Phone, Mail, Briefcase, Building2, DollarSign } from "lucide-react";
import { api } from "@/lib/api";
import type { ServiceProvider, Service } from "@/lib/types";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import StarRating from "@/components/ui/StarRating";
import { CardSkeleton } from "@/components/ui/Skeleton";
import EmptyState from "@/components/ui/EmptyState";

export default function ProviderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [provider, setProvider] = useState<ServiceProvider | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const numId = Number(id);
    if (isNaN(numId)) { router.replace("/services"); return; }

    Promise.all([
      api.providers.get(numId),
      api.services.list({ provider_id: numId, limit: 50 }),
    ])
      .then(([prov, svcs]) => {
        setProvider(prov);
        setServices(svcs);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <CardSkeleton />
          <div className="lg:col-span-2 space-y-6"><CardSkeleton /><CardSkeleton /></div>
        </div>
      </div>
    );
  }

  if (error || !provider) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <EmptyState
          variant="error"
          title="Provider not found"
          message="This service provider may have been removed."
          action={
            <Link href="/services" className="px-5 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-lg">
              Browse Providers
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <aside className="space-y-5">
            <div className="bg-white rounded-2xl border border-slate-100 p-6">
              <div className="flex flex-col items-center text-center mb-5">
                <Avatar name={provider.name} src={provider.avatar_url} size="xl" rounded="full" className="mb-4" />
                <h1 className="text-xl font-bold text-slate-900 mb-1">{provider.name}</h1>
                {provider.business_id && (
                  <Link href={`/businesses/${provider.business_id}`} className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 transition-colors">
                    <Building2 className="w-3.5 h-3.5" />
                    View Business
                  </Link>
                )}
                {provider.rating != null && (
                  <div className="mt-3"><StarRating rating={provider.rating} size="md" /></div>
                )}
              </div>

              <div className="space-y-3">
                {provider.phone && (
                  <a href={`tel:${provider.phone}`} className="flex items-center gap-2.5 text-sm text-slate-600 hover:text-primary-600 transition-colors">
                    <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                    {provider.phone}
                  </a>
                )}
                {provider.email && (
                  <a href={`mailto:${provider.email}`} className="flex items-center gap-2.5 text-sm text-slate-600 hover:text-primary-600 transition-colors">
                    <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="truncate">{provider.email}</span>
                  </a>
                )}
              </div>

              <div className="mt-5 space-y-2">
                {provider.phone && (
                  <a href={`tel:${provider.phone}`} className="block w-full text-center bg-primary-600 hover:bg-primary-700 text-white font-medium text-sm py-2.5 rounded-xl transition-colors">
                    Call Now
                  </a>
                )}
                {provider.email && (
                  <a href={`mailto:${provider.email}`} className="block w-full text-center border border-primary-200 text-primary-600 font-medium text-sm py-2.5 rounded-xl hover:bg-primary-50 transition-colors">
                    Send Message
                  </a>
                )}
              </div>
            </div>
          </aside>

          {/* Main */}
          <div className="lg:col-span-2 space-y-6">
            {provider.bio && (
              <div className="bg-white rounded-2xl border border-slate-100 p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-3">About</h2>
                <p className="text-slate-600 leading-relaxed text-sm">{provider.bio}</p>
              </div>
            )}

            <div className="bg-white rounded-2xl border border-slate-100 p-6">
              <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2 mb-5">
                <Briefcase className="w-5 h-5 text-slate-400" />
                Services Offered ({services.length})
              </h2>
              {services.length === 0 ? (
                <EmptyState title="No services listed" message="This provider hasn't listed any services yet." className="py-10" />
              ) : (
                <div className="space-y-4">
                  {services.map((svc) => (
                    <ServiceItem key={svc.id} service={svc} />
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

function ServiceItem({ service }: { service: Service }) {
  const hasPrice = service.price_min != null || service.price_max != null;
  return (
    <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
      <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center shrink-0">
        <Briefcase className="w-5 h-5 text-primary-600" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-semibold text-slate-900 text-sm">{service.name}</h3>
          {hasPrice && (
            <div className="text-right shrink-0">
              <div className="flex items-center gap-1 text-sm font-semibold text-slate-800">
                <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                {service.price_min != null && service.price_max != null
                  ? `${service.price_min} – ${service.price_max}`
                  : service.price_min ?? service.price_max}
              </div>
              {service.price_unit && (
                <span className="text-xs text-slate-400">per {service.price_unit}</span>
              )}
            </div>
          )}
        </div>
        {service.description && (
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{service.description}</p>
        )}
      </div>
    </div>
  );
}
