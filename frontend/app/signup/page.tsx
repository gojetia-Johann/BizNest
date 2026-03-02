"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Wrench,
  Building2,
  Zap,
  Droplets,
  Scissors,
  Printer,
  UtensilsCrossed,
  Hammer,
  Car,
  Home,
  Camera,
  BookOpen,
  Stethoscope,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Check,
  Eye,
  EyeOff,
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  Lock,
  FileText,
  Briefcase,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type Role = "consumer" | "provider" | "business";

interface FormData {
  role: Role | null;
  category: string | null;
  // personal / business details
  fullName: string;
  businessName: string;
  email: string;
  phone: string;
  city: string;
  website: string;
  bio: string;
  description: string;
  yearsExperience: string;
  // credentials
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
}

const INITIAL_FORM: FormData = {
  role: null,
  category: null,
  fullName: "",
  businessName: "",
  email: "",
  phone: "",
  city: "",
  website: "",
  bio: "",
  description: "",
  yearsExperience: "",
  password: "",
  confirmPassword: "",
  agreeTerms: false,
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const ROLES = [
  {
    id: "consumer" as Role,
    label: "Consumer",
    sublabel: "I'm looking for services or products",
    icon: Search,
    gradient: "from-sky-500 to-blue-600",
    glow: "shadow-sky-300",
    check: "bg-sky-500",
  },
  {
    id: "provider" as Role,
    label: "Service Provider",
    sublabel: "I offer professional services (electrician, plumber, etc.)",
    icon: Wrench,
    gradient: "from-violet-500 to-purple-600",
    glow: "shadow-violet-300",
    check: "bg-violet-500",
  },
  {
    id: "business" as Role,
    label: "Business Owner",
    sublabel: "I run a shop, store, or company",
    icon: Building2,
    gradient: "from-emerald-500 to-teal-600",
    glow: "shadow-emerald-300",
    check: "bg-emerald-500",
  },
];

const CATEGORIES = [
  { slug: "electrical",      label: "Electrical",        icon: Zap,             bg: "bg-amber-500",   hover: "hover:bg-amber-600" },
  { slug: "plumbing",        label: "Plumbing",           icon: Droplets,        bg: "bg-sky-500",     hover: "hover:bg-sky-600" },
  { slug: "beauty-wellness", label: "Beauty & Wellness",  icon: Scissors,        bg: "bg-rose-500",    hover: "hover:bg-rose-600" },
  { slug: "printing-design", label: "Printing & Design",  icon: Printer,         bg: "bg-violet-500",  hover: "hover:bg-violet-600" },
  { slug: "food-beverage",   label: "Food & Beverage",    icon: UtensilsCrossed, bg: "bg-orange-500",  hover: "hover:bg-orange-600" },
  { slug: "hardware-tools",  label: "Hardware & Tools",   icon: Hammer,          bg: "bg-slate-600",   hover: "hover:bg-slate-700" },
  { slug: "automotive",      label: "Automotive",         icon: Car,             bg: "bg-red-500",     hover: "hover:bg-red-600" },
  { slug: "home-services",   label: "Home Services",      icon: Home,            bg: "bg-emerald-500", hover: "hover:bg-emerald-600" },
  { slug: "photography",     label: "Photography",        icon: Camera,          bg: "bg-fuchsia-500", hover: "hover:bg-fuchsia-600" },
  { slug: "education",       label: "Education",          icon: BookOpen,        bg: "bg-blue-500",    hover: "hover:bg-blue-600" },
  { slug: "healthcare",      label: "Healthcare",         icon: Stethoscope,     bg: "bg-teal-500",    hover: "hover:bg-teal-600" },
  { slug: "cleaning",        label: "Cleaning",           icon: Sparkles,        bg: "bg-cyan-500",    hover: "hover:bg-cyan-600" },
];

// ─── Step indicator ───────────────────────────────────────────────────────────

function StepBar({ steps, current }: { steps: string[]; current: number }) {
  return (
    <div className="flex items-center gap-0 mb-10">
      {steps.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all",
                  done
                    ? "bg-violet-600 border-violet-600 text-white"
                    : active
                    ? "bg-white border-violet-600 text-violet-600"
                    : "bg-white border-slate-200 text-slate-400"
                )}
              >
                {done ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              <span
                className={cn(
                  "text-xs font-semibold hidden sm:block",
                  active ? "text-violet-700" : done ? "text-violet-500" : "text-slate-400"
                )}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-0.5 mx-2 mt-[-14px]",
                  done ? "bg-violet-500" : "bg-slate-200"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Field components ─────────────────────────────────────────────────────────

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      {children}
      {error && <p className="mt-1.5 text-xs text-rose-600 font-medium">{error}</p>}
    </div>
  );
}

function Input({
  icon: Icon,
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  icon?: React.ComponentType<{ className?: string }>;
  error?: boolean;
}) {
  return (
    <div className="relative">
      {Icon && (
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
          <Icon className="w-4 h-4" />
        </div>
      )}
      <input
        className={cn(
          "w-full rounded-xl border bg-slate-50 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all",
          "focus:bg-white focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500",
          Icon ? "pl-10 pr-4" : "px-4",
          error ? "border-rose-400 bg-rose-50" : "border-slate-200"
        )}
        {...props}
      />
    </div>
  );
}

function Textarea({
  icon: Icon,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="relative">
      {Icon && (
        <div className="absolute left-3.5 top-3.5 text-slate-400 pointer-events-none">
          <Icon className="w-4 h-4" />
        </div>
      )}
      <textarea
        rows={3}
        className={cn(
          "w-full rounded-xl border border-slate-200 bg-slate-50 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all resize-none",
          "focus:bg-white focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500",
          Icon ? "pl-10 pr-4" : "px-4"
        )}
        {...props}
      />
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function SignupPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const roleInfo = ROLES.find((r) => r.id === form.role);
  const categoryInfo = CATEGORIES.find((c) => c.slug === form.category);

  // Whether step 2 (category) is skipped for consumers
  const isConsumer = form.role === "consumer";

  // Steps depend on role: consumers skip step 2
  const STEPS = isConsumer
    ? ["Account Type", "Your Details", "Set Password"]
    : ["Account Type", "Category", "Your Details", "Set Password"];

  const totalSteps = STEPS.length;

  function set<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  // ── Validation per step ──
  function validate(): boolean {
    const errs: typeof errors = {};

    if (step === 0) {
      if (!form.role) errs.role = "Please select an account type.";
    }

    if (step === 1 && !isConsumer) {
      if (!form.category) errs.category = "Please select a category.";
    }

    const detailsStep = isConsumer ? 1 : 2;
    if (step === detailsStep) {
      if (!form.fullName.trim()) errs.fullName = "Full name is required.";
      if (form.role === "business" && !form.businessName.trim())
        errs.businessName = "Business name is required.";
      if (!form.email.trim()) errs.email = "Email is required.";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
        errs.email = "Enter a valid email address.";
      if (!form.phone.trim()) errs.phone = "Phone number is required.";
      if (!form.city.trim()) errs.city = "City is required.";
    }

    const credStep = isConsumer ? 2 : 3;
    if (step === credStep) {
      if (!form.password) errs.password = "Password is required.";
      else if (form.password.length < 8)
        errs.password = "Password must be at least 8 characters.";
      if (!form.confirmPassword) errs.confirmPassword = "Please confirm your password.";
      else if (form.password !== form.confirmPassword)
        errs.confirmPassword = "Passwords do not match.";
      if (!form.agreeTerms) errs.agreeTerms = "You must agree to the Terms of Service.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function next() {
    if (!validate()) return;
    if (step < totalSteps - 1) setStep((s) => s + 1);
    else handleSubmit();
  }

  function back() {
    setErrors({});
    setStep((s) => s - 1);
  }

  async function handleSubmit() {
    setSubmitting(true);
    // TODO: wire to POST /api/v1/auth/register once auth is implemented
    await new Promise((r) => setTimeout(r, 1200));
    setSubmitting(false);
    setSubmitted(true);
  }

  // ── Success screen ──
  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-600 via-purple-700 to-indigo-800 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-200">
            <Check className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mb-2">
            You&apos;re all set!
          </h2>
          <p className="text-slate-500 mb-1 text-sm">
            Welcome to BizNest
            {form.fullName ? `, ${form.fullName.split(" ")[0]}` : ""}!
          </p>
          <p className="text-slate-400 text-sm mb-8">
            Your account has been registered
            {form.category ? ` under <strong>${categoryInfo?.label}</strong>` : ""}.
            We&apos;ll send a confirmation to <span className="font-semibold text-slate-600">{form.email}</span>.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href="/"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              Go to Home <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/businesses" className="text-sm text-slate-500 hover:text-violet-600 transition-colors">
              Browse Businesses →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isLastStep = step === totalSteps - 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-600 via-purple-700 to-indigo-800">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <Link href="/" className="text-white font-extrabold text-xl tracking-tight">
          Biz<span className="text-amber-300">Nest</span>
        </Link>
        <p className="text-white/60 text-sm">
          Already have an account?{" "}
          <Link href="/login" className="text-white font-semibold hover:text-amber-300 transition-colors">
            Sign in
          </Link>
        </p>
      </div>

      {/* Card */}
      <div className="flex justify-center px-4 pb-16 pt-6">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-8 sm:p-10">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Create your account
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Join BizNest — find or offer services, all in one place.
            </p>
          </div>

          {/* Step bar */}
          <StepBar steps={STEPS} current={step} />

          {/* ── STEP 0: Account type ── */}
          {step === 0 && (
            <div>
              <h2 className="text-lg font-bold text-slate-800 mb-5">
                Who are you joining as?
              </h2>
              <div className="flex flex-col gap-4">
                {ROLES.map((role) => {
                  const selected = form.role === role.id;
                  return (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => set("role", role.id)}
                      className={cn(
                        "flex items-center gap-5 p-5 rounded-2xl border-2 text-left transition-all duration-150 cursor-pointer group",
                        selected
                          ? "border-violet-500 bg-violet-50 shadow-md shadow-violet-100"
                          : "border-slate-200 hover:border-violet-300 hover:bg-slate-50"
                      )}
                    >
                      <div
                        className={cn(
                          "w-14 h-14 rounded-xl flex items-center justify-center shrink-0 shadow-lg bg-gradient-to-br transition-transform group-hover:scale-105",
                          role.gradient,
                          role.glow
                        )}
                      >
                        <role.icon className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-900 text-base">{role.label}</p>
                        <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">{role.sublabel}</p>
                      </div>
                      <div
                        className={cn(
                          "w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all",
                          selected
                            ? `${role.check} border-transparent`
                            : "border-slate-300"
                        )}
                      >
                        {selected && <Check className="w-3.5 h-3.5 text-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>
              {errors.role && (
                <p className="mt-3 text-xs text-rose-600 font-medium">{errors.role}</p>
              )}
            </div>
          )}

          {/* ── STEP 1 (for non-consumers): Category ── */}
          {step === 1 && !isConsumer && (
            <div>
              <h2 className="text-lg font-bold text-slate-800 mb-2">
                What category best describes your{" "}
                {form.role === "provider" ? "service" : "business"}?
              </h2>
              <p className="text-slate-500 text-sm mb-6">
                This helps consumers find you when searching for specific services or businesses.
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {CATEGORIES.map((cat) => {
                  const selected = form.category === cat.slug;
                  return (
                    <button
                      key={cat.slug}
                      type="button"
                      onClick={() => set("category", cat.slug)}
                      className={cn(
                        "relative flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-150 cursor-pointer group",
                        selected
                          ? "border-violet-500 bg-violet-50 shadow-md shadow-violet-100"
                          : "border-slate-200 hover:border-violet-300 hover:bg-slate-50"
                      )}
                    >
                      {selected && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-violet-600 rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                      <div
                        className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-110",
                          cat.bg
                        )}
                      >
                        <cat.icon className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-xs font-semibold text-slate-700 text-center leading-tight">
                        {cat.label}
                      </span>
                    </button>
                  );
                })}
              </div>
              {errors.category && (
                <p className="mt-3 text-xs text-rose-600 font-medium">{errors.category}</p>
              )}
            </div>
          )}

          {/* ── STEP 2 (or 1 for consumers): Your Details ── */}
          {((isConsumer && step === 1) || (!isConsumer && step === 2)) && (
            <div>
              <h2 className="text-lg font-bold text-slate-800 mb-1">
                {form.role === "business" ? "Tell us about your business" : "Tell us about yourself"}
              </h2>
              {!isConsumer && categoryInfo && (
                <div className={cn("inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-white text-xs font-bold mb-5 shadow-sm", categoryInfo.bg)}>
                  <categoryInfo.icon className="w-3.5 h-3.5" />
                  {categoryInfo.label}
                </div>
              )}
              {isConsumer && <div className="mb-5" />}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full name — always */}
                <Field label="Full Name" required error={errors.fullName}>
                  <Input
                    icon={User}
                    placeholder="Juan dela Cruz"
                    value={form.fullName}
                    onChange={(e) => set("fullName", e.target.value)}
                    error={!!errors.fullName}
                  />
                </Field>

                {/* Business name — business only */}
                {form.role === "business" && (
                  <Field label="Business Name" required error={errors.businessName}>
                    <Input
                      icon={Building2}
                      placeholder="Cruz Hardware Store"
                      value={form.businessName}
                      onChange={(e) => set("businessName", e.target.value)}
                      error={!!errors.businessName}
                    />
                  </Field>
                )}

                {/* Email */}
                <Field label="Email Address" required error={errors.email}>
                  <Input
                    icon={Mail}
                    type="email"
                    placeholder="juan@example.com"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    error={!!errors.email}
                  />
                </Field>

                {/* Phone */}
                <Field label="Phone Number" required error={errors.phone}>
                  <Input
                    icon={Phone}
                    type="tel"
                    placeholder="+63 917 000 0000"
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    error={!!errors.phone}
                  />
                </Field>

                {/* City */}
                <Field label="City / Municipality" required error={errors.city}>
                  <Input
                    icon={MapPin}
                    placeholder="Manila"
                    value={form.city}
                    onChange={(e) => set("city", e.target.value)}
                    error={!!errors.city}
                  />
                </Field>

                {/* Website — business + provider optional */}
                {form.role !== "consumer" && (
                  <Field label="Website (optional)">
                    <Input
                      icon={Globe}
                      type="url"
                      placeholder="https://yourbusiness.com"
                      value={form.website}
                      onChange={(e) => set("website", e.target.value)}
                    />
                  </Field>
                )}

                {/* Years experience — providers only */}
                {form.role === "provider" && (
                  <Field label="Years of Experience">
                    <Input
                      icon={Briefcase}
                      type="number"
                      min="0"
                      placeholder="5"
                      value={form.yearsExperience}
                      onChange={(e) => set("yearsExperience", e.target.value)}
                    />
                  </Field>
                )}
              </div>

              {/* Bio / Description — full width */}
              {form.role === "provider" && (
                <div className="mt-4">
                  <Field label="Bio (optional)">
                    <Textarea
                      icon={FileText}
                      placeholder="Describe your skills, specializations, and experience…"
                      value={form.bio}
                      onChange={(e) => set("bio", e.target.value)}
                    />
                  </Field>
                </div>
              )}
              {form.role === "business" && (
                <div className="mt-4">
                  <Field label="Business Description (optional)">
                    <Textarea
                      icon={FileText}
                      placeholder="Tell customers what your business offers…"
                      value={form.description}
                      onChange={(e) => set("description", e.target.value)}
                    />
                  </Field>
                </div>
              )}
            </div>
          )}

          {/* ── STEP 3 (or 2 for consumers): Set Password ── */}
          {((isConsumer && step === 2) || (!isConsumer && step === 3)) && (
            <div>
              <h2 className="text-lg font-bold text-slate-800 mb-6">
                Secure your account
              </h2>

              <div className="flex flex-col gap-4">
                <Field label="Password" required error={errors.password}>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Minimum 8 characters"
                      value={form.password}
                      onChange={(e) => set("password", e.target.value)}
                      className={cn(
                        "w-full rounded-xl border bg-slate-50 pl-10 pr-12 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all",
                        "focus:bg-white focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500",
                        errors.password ? "border-rose-400 bg-rose-50" : "border-slate-200"
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {/* Strength indicator */}
                  {form.password && (
                    <div className="mt-2 flex gap-1">
                      {[...Array(4)].map((_, i) => {
                        const strength = Math.min(Math.floor(form.password.length / 3), 4);
                        const colors = ["bg-red-400", "bg-orange-400", "bg-amber-400", "bg-emerald-500"];
                        return (
                          <div
                            key={i}
                            className={cn(
                              "h-1.5 flex-1 rounded-full transition-all",
                              i < strength ? colors[strength - 1] : "bg-slate-200"
                            )}
                          />
                        );
                      })}
                      <span className="text-xs text-slate-400 ml-1 self-center whitespace-nowrap">
                        {["", "Weak", "Fair", "Good", "Strong"][Math.min(Math.floor(form.password.length / 3), 4)]}
                      </span>
                    </div>
                  )}
                </Field>

                <Field label="Confirm Password" required error={errors.confirmPassword}>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input
                      type={showConfirm ? "text" : "password"}
                      placeholder="Re-enter your password"
                      value={form.confirmPassword}
                      onChange={(e) => set("confirmPassword", e.target.value)}
                      className={cn(
                        "w-full rounded-xl border bg-slate-50 pl-10 pr-12 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all",
                        "focus:bg-white focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500",
                        errors.confirmPassword ? "border-rose-400 bg-rose-50" : "border-slate-200"
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((v) => !v)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </Field>

                <label className="flex items-start gap-3 cursor-pointer mt-2">
                  <div className="relative mt-0.5">
                    <input
                      type="checkbox"
                      checked={form.agreeTerms}
                      onChange={(e) => set("agreeTerms", e.target.checked)}
                      className="sr-only"
                    />
                    <div
                      onClick={() => set("agreeTerms", !form.agreeTerms)}
                      className={cn(
                        "w-5 h-5 rounded border-2 flex items-center justify-center transition-all cursor-pointer",
                        form.agreeTerms
                          ? "bg-violet-600 border-violet-600"
                          : errors.agreeTerms
                          ? "border-rose-400"
                          : "border-slate-300 hover:border-violet-400"
                      )}
                    >
                      {form.agreeTerms && <Check className="w-3 h-3 text-white" />}
                    </div>
                  </div>
                  <span className="text-sm text-slate-600 leading-relaxed">
                    I agree to the{" "}
                    <a href="#" className="text-violet-600 font-semibold hover:underline">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-violet-600 font-semibold hover:underline">
                      Privacy Policy
                    </a>
                  </span>
                </label>
                {errors.agreeTerms && (
                  <p className="text-xs text-rose-600 font-medium -mt-2">{errors.agreeTerms}</p>
                )}
              </div>

              {/* Summary pill */}
              {roleInfo && (
                <div className="mt-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-xs text-slate-500 mb-2 font-semibold uppercase tracking-wide">Registration summary</p>
                  <div className="flex flex-wrap gap-2">
                    <span className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-white text-xs font-bold bg-gradient-to-r", roleInfo.gradient)}>
                      <roleInfo.icon className="w-3.5 h-3.5" />
                      {roleInfo.label}
                    </span>
                    {categoryInfo && (
                      <span className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-white text-xs font-bold", categoryInfo.bg)}>
                        <categoryInfo.icon className="w-3.5 h-3.5" />
                        {categoryInfo.label}
                      </span>
                    )}
                    {form.fullName && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200 text-slate-700 text-xs font-semibold">
                        <User className="w-3.5 h-3.5" />
                        {form.fullName}
                      </span>
                    )}
                    {form.city && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200 text-slate-700 text-xs font-semibold">
                        <MapPin className="w-3.5 h-3.5" />
                        {form.city}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Navigation buttons ── */}
          <div className="flex items-center gap-3 mt-10">
            {step > 0 && (
              <button
                type="button"
                onClick={back}
                className="flex items-center gap-2 px-5 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-semibold text-sm hover:border-slate-300 hover:bg-slate-50 transition-all"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
            )}
            <button
              type="button"
              onClick={next}
              disabled={submitting}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-bold text-sm shadow-md shadow-violet-200 hover:shadow-violet-300 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Creating account…
                </>
              ) : isLastStep ? (
                <>
                  Create Account <Check className="w-4 h-4" />
                </>
              ) : (
                <>
                  Continue <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          <p className="text-center text-xs text-slate-400 mt-5">
            Step {step + 1} of {totalSteps}
          </p>
        </div>
      </div>
    </div>
  );
}
