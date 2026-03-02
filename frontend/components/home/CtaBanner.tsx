import Link from "next/link";
import { Building2, Wrench, ArrowRight } from "lucide-react";

export default function CtaBanner() {
  return (
    <section className="bg-gradient-to-r from-primary-600 to-violet-700 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Business CTA */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 text-white">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-5">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Own a Business?</h3>
            <p className="text-white/70 text-sm leading-relaxed mb-6">
              List your shop, store, or company on BizNest. Reach thousands of
              customers actively looking for what you offer.
            </p>
            <Link
              href="/list-your-business"
              className="inline-flex items-center gap-2 bg-white text-primary-700 font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-primary-50 transition-colors"
            >
              List Your Business <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Provider CTA */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 text-white">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-5">
              <Wrench className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Offer Services?</h3>
            <p className="text-white/70 text-sm leading-relaxed mb-6">
              Create your service provider profile. Showcase your skills,
              set your rates, and get discovered by clients near you.
            </p>
            <Link
              href="/list-your-business"
              className="inline-flex items-center gap-2 bg-white text-primary-700 font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-primary-50 transition-colors"
            >
              Become a Provider <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
