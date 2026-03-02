import { Search, MapPin, PhoneCall } from "lucide-react";

const STEPS = [
  {
    step: "01",
    icon: Search,
    title: "Search",
    description:
      "Type what you need — a service, business, or product. One unified search covers everything.",
    gradient: "from-violet-500 to-purple-600",
    glow: "shadow-violet-300",
  },
  {
    step: "02",
    icon: MapPin,
    title: "Discover",
    description:
      "Browse verified businesses and service providers nearby. Compare ratings, pricing, and portfolios.",
    gradient: "from-rose-500 to-pink-600",
    glow: "shadow-rose-300",
  },
  {
    step: "03",
    icon: PhoneCall,
    title: "Connect",
    description:
      "Reach out directly to the provider that fits your needs. Book, call, or message — your choice.",
    gradient: "from-emerald-500 to-teal-600",
    glow: "shadow-emerald-300",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-primary-600 font-semibold text-sm uppercase tracking-widest mb-2">
            How It Works
          </p>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900">
            Get started in 3 simple steps
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {STEPS.map((step, i) => (
            <div key={step.step} className="relative flex flex-col items-center text-center">
              {/* Connector line */}
              {i < STEPS.length - 1 && (
                <div className="hidden md:block absolute top-10 left-[calc(50%+2.5rem)] w-[calc(100%-5rem)] h-0.5 bg-gradient-to-r from-slate-200 to-slate-200" />
              )}

              {/* Icon */}
              <div
                className={`relative z-10 w-20 h-20 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-xl ${step.glow} mb-6`}
              >
                <step.icon className="w-9 h-9 text-white" />
                <span className="absolute -top-2.5 -right-2.5 w-7 h-7 bg-white border-2 border-slate-100 rounded-full text-xs font-extrabold text-slate-600 flex items-center justify-center shadow-sm">
                  {i + 1}
                </span>
              </div>

              <h3 className="text-xl font-extrabold text-slate-900 mb-3">{step.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed max-w-xs">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
