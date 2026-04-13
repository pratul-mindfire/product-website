import type { ReactNode } from "react";

type SectionBadgeProps = {
  children: ReactNode;
};

export function SectionBadge({ children }: SectionBadgeProps) {
  return (
    <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-amber-700">
      {children}
    </span>
  );
}
