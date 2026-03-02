import Link from "next/link";
import {
  Building2,
  MapPin,
  Mail,
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
} from "lucide-react";

const FOOTER_LINKS = {
  Explore: [
    { href: "/businesses", label: "Businesses" },
    { href: "/services", label: "Service Providers" },
    { href: "/products", label: "Products" },
    { href: "/categories", label: "Browse Categories" },
    { href: "/near-me", label: "Near Me" },
  ],
  "For Business": [
    { href: "/list-your-business", label: "List Your Business" },
    { href: "/services/providers", label: "Become a Provider" },
    { href: "#", label: "Advertising" },
    { href: "#", label: "Business Dashboard" },
  ],
  Support: [
    { href: "#", label: "Help Center" },
    { href: "#", label: "Contact Us" },
    { href: "#", label: "Privacy Policy" },
    { href: "#", label: "Terms of Service" },
  ],
};

const SOCIAL = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
];

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                Biz<span className="text-primary-400">Nest</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Your all-in-one platform for discovering trusted service
              providers, local businesses, and products in your area.
            </p>
            <div className="flex gap-3 mt-5">
              {SOCIAL.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 bg-slate-800 rounded-lg flex items-center justify-center text-slate-400 hover:bg-primary-600 hover:text-white transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([group, links]) => (
            <div key={group}>
              <h3 className="text-white font-semibold text-sm mb-4">
                {group}
              </h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-slate-400 hover:text-white text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} BizNest. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-slate-500 text-sm">
            <MapPin className="w-3.5 h-3.5" />
            <span>Connecting communities, one business at a time</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
