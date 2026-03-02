import Link from "next/link";
import {
  Building2,
  Wrench,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const BENEFITS = [
  "Reach thousands of active customers",
  "Appear in local & category searches",
  "Showcase your products and services",
  "Location-based discovery (Near Me)",
  "AI-powered recommendations (coming soon)",
  "Free to list, premium plans available",
];

export default function ListYourBusinessPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary-700 to-violet-800 text-white py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
            Grow Your Business with BizNest
          </h1>
          <p className="text-xl text-white/70 max-w-xl mx-auto">
            List your business or services and connect with customers actively
            searching for what you offer.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-14">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              Why list on BizNest?
            </h2>
            <ul className="space-y-3">
              {BENEFITS.map((b) => (
                <li key={b} className="flex items-start gap-3 text-slate-700">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                  <span className="text-sm">{b}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            {/* Business card */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                <Building2 className="w-5 h-5 text-primary-600" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">
                List Your Business
              </h3>
              <p className="text-sm text-slate-500 mb-4">
                Shops, stores, restaurants, clinics — any business can list on
                BizNest and reach local customers.
              </p>
              <Link href="/signup?role=business" className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-medium text-sm py-2.5 rounded-xl transition-all shadow-sm">
                Get Started <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Provider card */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center mb-4">
                <Wrench className="w-5 h-5 text-violet-600" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">
                Offer Services
              </h3>
              <p className="text-sm text-slate-500 mb-4">
                Electricians, plumbers, photographers, tutors — create a
                service provider profile and get discovered.
              </p>
              <Link href="/signup?role=provider" className="w-full flex items-center justify-center gap-2 border-2 border-violet-300 text-violet-600 hover:bg-violet-50 font-medium text-sm py-2.5 rounded-xl transition-all">
                Create Profile <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* AI teaser */}
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-2xl p-8 text-white text-center">
          <div className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-6 h-6 text-primary-300" />
          </div>
          <h3 className="text-xl font-bold mb-2">AI-Powered Features Coming</h3>
          <p className="text-white/60 text-sm max-w-md mx-auto mb-5">
            Smart recommendations, AI-assisted search ranking, and a built-in
            chatbot to help customers find your business — launching soon.
          </p>
          <button className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium text-sm rounded-xl transition-colors">
            Join the Waitlist
          </button>
        </div>

        {/* Back */}
        <div className="text-center mt-10">
          <Link
            href="/"
            className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
          >
            ← Back to BizNest
          </Link>
        </div>
      </div>
    </div>
  );
}
