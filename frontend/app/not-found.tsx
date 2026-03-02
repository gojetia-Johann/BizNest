import Link from "next/link";
import { Building2, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-20 h-20 bg-primary-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <Building2 className="w-10 h-10 text-primary-500" />
        </div>
        <h1 className="text-6xl font-extrabold text-slate-900 mb-3">404</h1>
        <h2 className="text-xl font-semibold text-slate-700 mb-3">
          Page not found
        </h2>
        <p className="text-slate-500 text-sm max-w-sm mx-auto mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-medium px-6 py-2.5 rounded-xl transition-colors"
        >
          <Home className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
