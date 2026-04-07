import type { HTMLAttributes, ReactNode } from "react";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function Card({ children, className = "", ...props }: CardProps) {
  return (
    <div
      className={`rounded-[1.75rem] border border-slate-200 p-6 ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  );
}
