import type { ReactNode } from "react";

type CmsShellProps = {
  children: ReactNode;
};

export function CmsShell({ children }: CmsShellProps) {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#eef2ff_35%,#fff7ed_100%)] px-4 py-4 sm:px-6 sm:py-6">
      <div className="mx-auto max-w-7xl space-y-6">{children}</div>
    </main>
  );
}
