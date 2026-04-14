import { Card } from "@/app/components/ui/card";

type StatsCardProps = {
  description: string;
  label: string;
  tone?: "default" | "muted" | "highlight";
  value: string;
};

const toneClasses = {
  default: "bg-white",
  muted: "bg-slate-50",
  highlight: "bg-[linear-gradient(180deg,#eff6ff_0%,#dbeafe_100%)]",
} as const;

export function StatsCard({
  description,
  label,
  tone = "default",
  value,
}: StatsCardProps) {
  return (
    <Card className={toneClasses[tone]}>
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-slate-950">{value}</p>
      <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
    </Card>
  );
}
