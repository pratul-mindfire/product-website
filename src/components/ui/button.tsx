import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonWidth = "auto" | "full";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
  width?: ButtonWidth;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-slate-950 text-white hover:bg-slate-800 disabled:bg-slate-400",
  secondary:
    "border border-slate-700 text-white hover:bg-white hover:text-slate-950",
  ghost: "border border-slate-200 bg-white text-slate-950 hover:bg-slate-50",
};

const widthClasses: Record<ButtonWidth, string> = {
  auto: "inline-flex",
  full: "flex w-full",
};

export function Button({
  children,
  className = "",
  type = "button",
  variant = "primary",
  width = "auto",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`h-12 items-center justify-center rounded-2xl px-5 text-sm font-semibold transition disabled:cursor-not-allowed ${widthClasses[width]} ${variantClasses[variant]} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}
