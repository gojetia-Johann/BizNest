"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export default function Pagination({
  page,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
    if (totalPages <= 7) return i + 1;
    if (page <= 4) return i + 1;
    if (page >= totalPages - 3) return totalPages - 6 + i;
    return page - 3 + i;
  });

  return (
    <div className={cn("flex items-center justify-center gap-1", className)}>
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {pages[0] > 1 && (
        <>
          <PageButton page={1} current={page} onClick={onPageChange} />
          {pages[0] > 2 && (
            <span className="px-1 text-slate-400 text-sm">…</span>
          )}
        </>
      )}

      {pages.map((p) => (
        <PageButton key={p} page={p} current={page} onClick={onPageChange} />
      ))}

      {pages[pages.length - 1] < totalPages && (
        <>
          {pages[pages.length - 1] < totalPages - 1 && (
            <span className="px-1 text-slate-400 text-sm">…</span>
          )}
          <PageButton
            page={totalPages}
            current={page}
            onClick={onPageChange}
          />
        </>
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

function PageButton({
  page,
  current,
  onClick,
}: {
  page: number;
  current: number;
  onClick: (p: number) => void;
}) {
  return (
    <button
      onClick={() => onClick(page)}
      className={cn(
        "w-9 h-9 rounded-lg text-sm font-medium transition-colors",
        page === current
          ? "bg-primary-600 text-white shadow-sm"
          : "text-slate-600 hover:bg-slate-100"
      )}
    >
      {page}
    </button>
  );
}
