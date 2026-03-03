"use client";

import { useRef, useState, useCallback } from "react";
import * as XLSX from "xlsx";
import {
  Upload,
  Download,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
  ChevronRight,
  RotateCcw,
  Building2,
  Package,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

interface InventoryRow {
  name: string;
  description: string;
  price: string | number;
  currency: string;
  category_name: string;
  is_available: string | boolean;
  image_url: string;
  // validation
  _valid?: boolean;
  _errors?: string[];
  _row?: number;
}

interface UploadResult {
  created: number;
  skipped: number;
  errors: string[];
}

// ─── Template columns ─────────────────────────────────────────────────────────

const TEMPLATE_COLUMNS = [
  "Name",
  "Description",
  "Price",
  "Currency",
  "Category",
  "Available",
  "Image URL",
];

const TEMPLATE_SAMPLE_ROWS = [
  ["Flat Head Screwdriver", "Heavy-duty flat head 30cm", 85, "PHP", "Hardware & Tools", "TRUE", ""],
  ["LED Bulb 9W", "Energy-saving warm white", 59.99, "PHP", "Electrical", "TRUE", ""],
  ["Drill Bit Set", "12-piece HSS drill bits", 320, "PHP", "Hardware & Tools", "FALSE", ""],
];

const CATEGORIES = [
  "Electrical", "Plumbing", "Beauty & Wellness", "Printing & Design",
  "Food & Beverage", "Hardware & Tools", "Automotive", "Home Services",
  "Photography", "Education", "Healthcare", "Cleaning",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function downloadTemplate() {
  const wb = XLSX.utils.book_new();

  // Main data sheet
  const ws = XLSX.utils.aoa_to_sheet([TEMPLATE_COLUMNS, ...TEMPLATE_SAMPLE_ROWS]);

  // Column widths
  ws["!cols"] = [
    { wch: 28 }, { wch: 38 }, { wch: 10 }, { wch: 10 },
    { wch: 22 }, { wch: 12 }, { wch: 40 },
  ];

  // Style the header row bold (xlsx-js-style not available, so we mark with comment)
  XLSX.utils.book_append_sheet(wb, ws, "Inventory");

  // Instructions sheet
  const instructions = XLSX.utils.aoa_to_sheet([
    ["BIZNEST INVENTORY UPLOAD — INSTRUCTIONS"],
    [],
    ["Column", "Required", "Notes"],
    ["Name", "YES", "Product or item name (max 200 characters)"],
    ["Description", "No", "Short description of the item"],
    ["Price", "No", "Numeric value only, e.g. 199.99"],
    ["Currency", "No", "3-letter code: PHP (default), USD, SGD…"],
    ["Category", "No", "Must match an existing category on BizNest"],
    ["Available", "No", "TRUE or FALSE (default: TRUE)"],
    ["Image URL", "No", "Full URL to a product image (https://...)"],
    [],
    ["VALID CATEGORIES"],
    ...CATEGORIES.map((c) => [c]),
    [],
    ["TIPS"],
    ["- Do not rename the 'Inventory' sheet tab"],
    ["- Do not add or remove header columns"],
    ["- First row is the header — do not delete it"],
    ["- Maximum 500 rows per upload"],
    ["- Delete the sample rows before uploading"],
  ]);
  instructions["!cols"] = [{ wch: 18 }, { wch: 12 }, { wch: 55 }];
  XLSX.utils.book_append_sheet(wb, instructions, "Instructions");

  XLSX.writeFile(wb, "biznest-inventory-template.xlsx");
}

function parseBoolean(val: unknown): boolean {
  if (typeof val === "boolean") return val;
  if (typeof val === "number") return val !== 0;
  const s = String(val).toLowerCase().trim();
  return s === "true" || s === "1" || s === "yes";
}

function validateRow(row: InventoryRow, idx: number): InventoryRow {
  const errors: string[] = [];
  if (!row.name?.toString().trim()) errors.push("Name is required");
  if (row.price !== "" && row.price !== undefined && isNaN(Number(row.price)))
    errors.push("Price must be a number");
  if (Number(row.price) < 0) errors.push("Price cannot be negative");
  return { ...row, _valid: errors.length === 0, _errors: errors, _row: idx };
}

function parseSheet(workbook: XLSX.WorkBook): InventoryRow[] {
  const sheet = workbook.Sheets["Inventory"];
  if (!sheet) throw new Error("Sheet named 'Inventory' not found. Please use the provided template.");

  const raw = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "" });
  return raw.map((r, i) => {
    const row: InventoryRow = {
      name: String(r["Name"] ?? r["name"] ?? ""),
      description: String(r["Description"] ?? r["description"] ?? ""),
      price: (r["Price"] ?? r["price"] ?? "") as string | number,
      currency: String(r["Currency"] ?? r["currency"] ?? "PHP").toUpperCase() || "PHP",
      category_name: String(r["Category"] ?? r["category"] ?? r["category_name"] ?? ""),
      is_available: parseBoolean(r["Available"] ?? r["is_available"] ?? true),
      image_url: String(r["Image URL"] ?? r["image_url"] ?? ""),
    };
    return validateRow(row, i + 2); // +2 because row 1 is header
  }).filter((r) => r.name.trim() !== ""); // drop truly empty rows
}

// ─── Step indicator ───────────────────────────────────────────────────────────

const STEPS = ["Business ID", "Upload File", "Preview & Submit"];

function StepBar({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-0 mb-10">
      {STEPS.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div className={cn(
                "w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all",
                done ? "bg-emerald-500 border-emerald-500 text-white"
                  : active ? "bg-white border-emerald-500 text-emerald-600"
                  : "bg-white border-slate-200 text-slate-400"
              )}>
                {done ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
              </div>
              <span className={cn("text-xs font-semibold hidden sm:block",
                active ? "text-emerald-700" : done ? "text-emerald-500" : "text-slate-400"
              )}>{label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={cn("flex-1 h-0.5 mx-2 mt-[-14px]",
                done ? "bg-emerald-400" : "bg-slate-200"
              )} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function UploadInventoryPage() {
  const [step, setStep] = useState(0);
  const [businessId, setBusinessId] = useState("");
  const [businessIdError, setBusinessIdError] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [parseError, setParseError] = useState("");
  const [rows, setRows] = useState<InventoryRow[]>([]);
  const [dragging, setDragging] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<UploadResult | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const validRows = rows.filter((r) => r._valid);
  const invalidRows = rows.filter((r) => !r._valid);

  // ── Step 0: business ID ──
  function handleBusinessIdNext() {
    const id = parseInt(businessId);
    if (!businessId.trim() || isNaN(id) || id <= 0) {
      setBusinessIdError("Please enter a valid Business ID (a positive number).");
      return;
    }
    setBusinessIdError("");
    setStep(1);
  }

  // ── Step 1: file parsing ──
  const processFile = useCallback((f: File) => {
    setParseError("");
    setFile(f);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const wb = XLSX.read(data, { type: "array" });
        const parsed = parseSheet(wb);
        if (parsed.length === 0) {
          setParseError("No data rows found. Make sure the 'Inventory' sheet has at least one product row.");
          return;
        }
        if (parsed.length > 500) {
          setParseError("File exceeds 500 rows. Please split into smaller files.");
          return;
        }
        setRows(parsed);
        setStep(2);
      } catch (err: unknown) {
        setParseError(err instanceof Error ? err.message : "Failed to parse file.");
      }
    };
    reader.readAsArrayBuffer(f);
  }, []);

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) processFile(f);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) processFile(f);
  }

  // ── Step 2: submit ──
  async function handleSubmit() {
    setSubmitting(true);
    try {
      const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost/api/v1";
      const body = {
        business_id: parseInt(businessId),
        products: validRows.map((r) => ({
          name: r.name.trim(),
          description: r.description || null,
          price: r.price !== "" ? Number(r.price) : null,
          currency: r.currency || "PHP",
          category_name: r.category_name || null,
          is_available: typeof r.is_available === "boolean"
            ? r.is_available
            : parseBoolean(r.is_available),
          image_url: r.image_url || null,
        })),
      };

      const res = await fetch(`${API}/products/bulk`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.detail ?? `Server error ${res.status}`);
      }

      const data: UploadResult = await res.json();
      setResult(data);
    } catch (err: unknown) {
      setParseError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setSubmitting(false);
    }
  }

  function reset() {
    setStep(0);
    setBusinessId("");
    setFile(null);
    setRows([]);
    setParseError("");
    setResult(null);
    setSubmitting(false);
  }

  // ── Success screen ──
  if (result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-200">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mb-4">Upload Complete!</h2>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-emerald-50 rounded-2xl p-4">
              <p className="text-3xl font-extrabold text-emerald-600">{result.created}</p>
              <p className="text-xs text-emerald-700 font-semibold mt-1">Products Created</p>
            </div>
            <div className="bg-amber-50 rounded-2xl p-4">
              <p className="text-3xl font-extrabold text-amber-500">{result.skipped}</p>
              <p className="text-xs text-amber-700 font-semibold mt-1">Rows Skipped</p>
            </div>
          </div>

          {result.errors.length > 0 && (
            <div className="bg-red-50 rounded-xl p-4 mb-6 text-left">
              <p className="text-xs font-bold text-red-700 mb-2">Warnings ({result.errors.length})</p>
              <ul className="space-y-1">
                {result.errors.map((e, i) => (
                  <li key={i} className="text-xs text-red-600">{e}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <a
              href={`/businesses/${businessId}`}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
            >
              View Business <ChevronRight className="w-4 h-4" />
            </a>
            <button
              onClick={reset}
              className="text-sm text-slate-500 hover:text-slate-700 flex items-center justify-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-4 h-4" /> Upload another file
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <a href="/" className="text-white font-extrabold text-xl tracking-tight">
          Biz<span className="text-amber-300">Nest</span>
        </a>
        <button
          onClick={downloadTemplate}
          className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all"
        >
          <Download className="w-4 h-4" /> Download Template
        </button>
      </div>

      {/* Card */}
      <div className="flex justify-center px-4 pb-16 pt-6">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl p-8 sm:p-10">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900">Upload Inventory</h1>
              <p className="text-slate-500 text-sm">Bulk-add products from an Excel file</p>
            </div>
          </div>

          {/* Info banner */}
          <div className="my-6 flex gap-3 bg-sky-50 border border-sky-100 rounded-2xl p-4">
            <Info className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
            <p className="text-xs text-sky-700 leading-relaxed">
              Use the <strong>Download Template</strong> button above to get the correct Excel format.
              Fill in your products, then upload the file here. Maximum <strong>500 rows</strong> per upload.
            </p>
          </div>

          <StepBar current={step} />

          {/* ── STEP 0: Business ID ── */}
          {step === 0 && (
            <div>
              <h2 className="text-lg font-bold text-slate-800 mb-2">Which business are you uploading for?</h2>
              <p className="text-slate-500 text-sm mb-6">
                Enter the Business ID from BizNest. You can find it in the URL of your business page:
                <code className="ml-1 bg-slate-100 px-1.5 py-0.5 rounded text-xs">/businesses/[ID]</code>
              </p>

              <div className="max-w-xs">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Business ID <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="number"
                    min="1"
                    placeholder="e.g. 42"
                    value={businessId}
                    onChange={(e) => { setBusinessId(e.target.value); setBusinessIdError(""); }}
                    onKeyDown={(e) => e.key === "Enter" && handleBusinessIdNext()}
                    className={cn(
                      "w-full rounded-xl border bg-slate-50 pl-10 pr-4 py-3 text-sm outline-none transition-all",
                      "focus:bg-white focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500",
                      businessIdError ? "border-rose-400 bg-rose-50" : "border-slate-200"
                    )}
                  />
                </div>
                {businessIdError && (
                  <p className="mt-1.5 text-xs text-rose-600 font-medium">{businessIdError}</p>
                )}
              </div>

              <button
                onClick={handleBusinessIdNext}
                className="mt-8 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-sm rounded-xl hover:opacity-90 transition-opacity shadow-md shadow-emerald-200"
              >
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* ── STEP 1: Upload ── */}
          {step === 1 && (
            <div>
              <h2 className="text-lg font-bold text-slate-800 mb-6">Upload your Excel file</h2>

              {/* Drop zone */}
              <div
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}
                className={cn(
                  "relative flex flex-col items-center justify-center gap-4 border-2 border-dashed rounded-2xl py-16 cursor-pointer transition-all",
                  dragging
                    ? "border-emerald-500 bg-emerald-50"
                    : "border-slate-300 hover:border-emerald-400 hover:bg-slate-50"
                )}
              >
                <div className={cn(
                  "w-16 h-16 rounded-2xl flex items-center justify-center transition-all",
                  dragging ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-400"
                )}>
                  <FileSpreadsheet className="w-8 h-8" />
                </div>
                <div className="text-center">
                  <p className="font-bold text-slate-700">
                    {dragging ? "Drop it here!" : "Drag & drop your Excel file"}
                  </p>
                  <p className="text-slate-400 text-sm mt-1">or click to browse</p>
                  <p className="text-slate-400 text-xs mt-2">.xlsx or .xls — max 500 rows</p>
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".xlsx,.xls"
                  className="hidden"
                  onChange={handleFileInput}
                />
              </div>

              {parseError && (
                <div className="mt-4 flex gap-3 bg-red-50 border border-red-100 rounded-2xl p-4">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{parseError}</p>
                </div>
              )}

              <div className="mt-6 flex items-center gap-3">
                <button
                  onClick={() => setStep(0)}
                  className="px-5 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-all"
                >
                  ← Back
                </button>
                <button
                  onClick={downloadTemplate}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl border-2 border-emerald-200 text-emerald-700 font-semibold text-sm hover:bg-emerald-50 transition-all"
                >
                  <Download className="w-4 h-4" /> Download Template
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 2: Preview ── */}
          {step === 2 && (
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Preview</h2>
                  <p className="text-slate-500 text-sm">
                    <span className="text-slate-600 font-semibold">{file?.name}</span> —{" "}
                    {rows.length} row{rows.length !== 1 ? "s" : ""} parsed
                  </p>
                </div>
                <button
                  onClick={() => { setStep(1); setFile(null); setRows([]); setParseError(""); }}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Summary chips */}
              <div className="flex flex-wrap gap-2 mb-5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {validRows.length} valid
                </span>
                {invalidRows.length > 0 && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-100 text-red-700 text-xs font-bold">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {invalidRows.length} with errors
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">
                  <Building2 className="w-3.5 h-3.5" />
                  Business ID: {businessId}
                </span>
              </div>

              {/* Table */}
              <div className="overflow-x-auto rounded-2xl border border-slate-100 mb-6">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="px-3 py-2.5 text-left font-bold text-slate-500">#</th>
                      <th className="px-3 py-2.5 text-left font-bold text-slate-500">Name</th>
                      <th className="px-3 py-2.5 text-left font-bold text-slate-500">Price</th>
                      <th className="px-3 py-2.5 text-left font-bold text-slate-500">Currency</th>
                      <th className="px-3 py-2.5 text-left font-bold text-slate-500">Category</th>
                      <th className="px-3 py-2.5 text-left font-bold text-slate-500">Available</th>
                      <th className="px-3 py-2.5 text-left font-bold text-slate-500">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, i) => (
                      <tr
                        key={i}
                        className={cn(
                          "border-b border-slate-50 last:border-0",
                          row._valid ? "hover:bg-slate-50" : "bg-red-50"
                        )}
                      >
                        <td className="px-3 py-2.5 text-slate-400">{row._row}</td>
                        <td className="px-3 py-2.5 font-semibold text-slate-800 max-w-[140px] truncate">
                          {row.name || <span className="text-red-500 italic">empty</span>}
                        </td>
                        <td className="px-3 py-2.5 text-slate-600">
                          {row.price !== "" ? Number(row.price).toLocaleString() : "—"}
                        </td>
                        <td className="px-3 py-2.5 text-slate-600">{row.currency || "PHP"}</td>
                        <td className="px-3 py-2.5 text-slate-600 max-w-[120px] truncate">
                          {row.category_name || "—"}
                        </td>
                        <td className="px-3 py-2.5">
                          <span className={cn(
                            "px-2 py-0.5 rounded-full font-semibold",
                            parseBoolean(row.is_available)
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-slate-100 text-slate-500"
                          )}>
                            {parseBoolean(row.is_available) ? "Yes" : "No"}
                          </span>
                        </td>
                        <td className="px-3 py-2.5">
                          {row._valid ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <div className="group relative">
                              <AlertCircle className="w-4 h-4 text-red-500 cursor-help" />
                              <div className="hidden group-hover:block absolute bottom-full left-0 mb-1 z-10 bg-red-700 text-white text-xs rounded-lg p-2 whitespace-nowrap shadow-lg">
                                {row._errors?.join(", ")}
                              </div>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Error rows details */}
              {invalidRows.length > 0 && (
                <div className="mb-5 bg-red-50 border border-red-100 rounded-2xl p-4">
                  <p className="text-xs font-bold text-red-700 mb-2 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {invalidRows.length} row{invalidRows.length > 1 ? "s" : ""} will be skipped due to errors:
                  </p>
                  <ul className="space-y-1">
                    {invalidRows.map((r, i) => (
                      <li key={i} className="text-xs text-red-600">
                        Row {r._row}: <span className="font-semibold">{r.name || "(empty)"}</span> — {r._errors?.join(", ")}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {parseError && (
                <div className="mb-5 flex gap-3 bg-red-50 border border-red-100 rounded-2xl p-4">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{parseError}</p>
                </div>
              )}

              {validRows.length === 0 && (
                <div className="mb-5 flex gap-3 bg-amber-50 border border-amber-100 rounded-2xl p-4">
                  <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-700">
                    No valid rows to upload. Please fix the errors in your file and re-upload.
                  </p>
                </div>
              )}

              <div className="flex items-center gap-3">
                <button
                  onClick={() => { setStep(1); setFile(null); setRows([]); }}
                  className="px-5 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-all"
                >
                  ← Re-upload
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting || validRows.length === 0}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-sm shadow-md shadow-emerald-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Uploading…</>
                  ) : (
                    <><Upload className="w-4 h-4" /> Upload {validRows.length} Product{validRows.length !== 1 ? "s" : ""}</>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
