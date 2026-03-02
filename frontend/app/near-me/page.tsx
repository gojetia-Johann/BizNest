"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin, Navigation, Search, Loader2, AlertCircle, Star, Briefcase } from "lucide-react";
import { api } from "@/lib/api";
import type { NearMeResult } from "@/lib/types";
import Avatar from "@/components/ui/Avatar";
import StarRating from "@/components/ui/StarRating";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import { formatPrice } from "@/lib/utils";

const SERVICE_TYPES = [
  "Electrician",
  "Plumber",
  "Hair Salon",
  "Printing Shop",
  "Carpenter",
  "Mechanic",
  "Photographer",
  "Cleaning Service",
  "Tutor",
  "Doctor",
];

const RADIUS_OPTIONS = [
  { value: 5000, label: "5 km" },
  { value: 10000, label: "10 km" },
  { value: 25000, label: "25 km" },
  { value: 50000, label: "50 km" },
];

export default function NearMePage() {
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [locating, setLocating] = useState(false);
  const [serviceType, setServiceType] = useState("");
  const [customType, setCustomType] = useState("");
  const [radius, setRadius] = useState(25000);
  const [results, setResults] = useState<NearMeResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [searched, setSearched] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  function requestLocation() {
    setLocating(true);
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude });
        setLocating(false);
      },
      () => {
        setLocationError("Location access denied. Please allow location access in your browser settings.");
        setLocating(false);
      }
    );
  }

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!location) return;
    const type = customType.trim() || serviceType;
    if (!type) {
      setSearchError("Please select or type a service to search for.");
      return;
    }
    setSearchError(null);
    setSearching(true);
    setSearched(false);
    try {
      const data = await api.search.nearMe({
        lat: location.lat,
        lon: location.lon,
        service_type: type,
        radius_m: radius,
      });
      setResults(data);
    } catch {
      setResults([]);
    } finally {
      setSearching(false);
      setSearched(true);
    }
  }

  const selectedType = customType.trim() || serviceType;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary-700 to-violet-800 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <MapPin className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold mb-3">Near Me</h1>
          <p className="text-white/70 text-lg">Find service providers in your area right now.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Step 1: Location */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-6">
          <h2 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <span className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full text-xs font-bold flex items-center justify-center">1</span>
            Your Location
          </h2>

          {location ? (
            <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
              <Navigation className="w-5 h-5 text-emerald-600 shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-emerald-700">Location acquired</p>
                <p className="text-xs text-emerald-600">
                  {location.lat.toFixed(5)}, {location.lon.toFixed(5)}
                </p>
              </div>
              <button onClick={() => setLocation(null)} className="text-xs text-slate-500 hover:text-slate-700">
                Reset
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={requestLocation}
                disabled={locating}
                className="w-full flex items-center justify-center gap-2.5 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-medium py-3 rounded-xl transition-colors"
              >
                {locating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Navigation className="w-5 h-5" />}
                {locating ? "Getting location…" : "Use My Current Location"}
              </button>
              {locationError && (
                <div className="mt-3 flex items-start gap-2 text-sm text-red-600 bg-red-50 rounded-xl p-3">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  {locationError}
                </div>
              )}
            </>
          )}
        </div>

        {/* Step 2: Service type */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-6">
          <h2 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <span className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full text-xs font-bold flex items-center justify-center">2</span>
            What are you looking for?
          </h2>

          <div className="flex flex-wrap gap-2 mb-4">
            {SERVICE_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => { setServiceType(type); setCustomType(""); setSearchError(null); }}
                className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  serviceType === type && !customType
                    ? "bg-primary-600 text-white border-primary-600"
                    : "bg-white text-slate-600 border-slate-200 hover:border-primary-300"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2.5">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              value={customType}
              onChange={(e) => { setCustomType(e.target.value); setServiceType(""); setSearchError(null); }}
              placeholder="Or type a custom service…"
              className="flex-1 bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none"
            />
          </div>

          {searchError && (
            <p className="mt-2 text-sm text-red-600 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {searchError}
            </p>
          )}

          {/* Radius */}
          <div className="mt-4">
            <p className="text-xs font-medium text-slate-500 mb-2">Search radius</p>
            <div className="flex gap-2">
              {RADIUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setRadius(opt.value)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                    radius === opt.value
                      ? "bg-primary-600 text-white border-primary-600"
                      : "bg-white text-slate-600 border-slate-200 hover:border-primary-300"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Search button */}
        <form onSubmit={handleSearch}>
          <button
            type="submit"
            disabled={!location || searching}
            className="w-full flex items-center justify-center gap-2.5 bg-primary-600 hover:bg-primary-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-2xl transition-colors shadow-sm text-base"
          >
            {searching ? <Loader2 className="w-5 h-5 animate-spin" /> : <MapPin className="w-5 h-5" />}
            {searching ? "Searching nearby…" : "Find Near Me"}
          </button>
          {!location && (
            <p className="text-center text-xs text-slate-400 mt-2">Enable location to search</p>
          )}
          {!selectedType && location && (
            <p className="text-center text-xs text-slate-400 mt-2">Select or type a service above</p>
          )}
        </form>

        {/* Results */}
        {searched && (
          <div className="mt-10">
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              {results.length > 0
                ? `${results.length} provider${results.length !== 1 ? "s" : ""} found near you`
                : "No providers found nearby"}
            </h3>
            {selectedType && (
              <p className="text-sm text-slate-500 mb-5">
                Searching for <span className="font-medium text-slate-700">{selectedType}</span> within{" "}
                {RADIUS_OPTIONS.find((r) => r.value === radius)?.label}
              </p>
            )}
            {results.length === 0 ? (
              <EmptyState
                title="Nothing found nearby"
                message="Try expanding your search radius or searching for a different service."
              />
            ) : (
              <div className="space-y-4">
                {results.map((r) => (
                  <NearMeResultCard key={r.id} result={r} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function NearMeResultCard({ result }: { result: NearMeResult }) {
  return (
    <Link
      href={`/services/${result.id}`}
      className="group block bg-white rounded-2xl border border-slate-100 p-5 hover:border-primary-200 hover:shadow-lg transition-all"
    >
      <div className="flex items-start gap-4">
        <Avatar name={result.name} size="lg" rounded="full" />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-semibold text-slate-900 group-hover:text-primary-600 transition-colors">
                {result.name}
              </h3>
              {result.rating != null && (
                <StarRating rating={result.rating} size="sm" className="mt-1" />
              )}
            </div>
            <span className="text-xs font-medium text-primary-600 flex items-center gap-1 group-hover:gap-2 transition-all shrink-0">
              View Profile →
            </span>
          </div>

          {/* Services offered */}
          {result.services.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {result.services.slice(0, 4).map((svc, i) => (
                <div key={i} className="flex items-center gap-1.5 bg-slate-50 rounded-lg px-2.5 py-1">
                  <Briefcase className="w-3 h-3 text-slate-400" />
                  <span className="text-xs text-slate-700 font-medium">{svc.name}</span>
                  {svc.price != null && (
                    <span className="text-xs text-slate-500">
                      · {formatPrice(svc.price, "PHP")}
                    </span>
                  )}
                </div>
              ))}
              {result.services.length > 4 && (
                <Badge variant="outline">+{result.services.length - 4} more</Badge>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
