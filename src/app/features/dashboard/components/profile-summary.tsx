import { Card } from "@/app/components/ui/card";

type ProfileSummaryProps = {
  email: string | null;
  name: string | null;
};

export function ProfileSummary({ email, name }: ProfileSummaryProps) {
  return (
    <Card className="border-slate-800 bg-slate-900 px-4 py-4">
      <p className="text-sm font-semibold text-white">{name}</p>
      <p className="mt-1 text-sm text-slate-400">{email}</p>
    </Card>
  );
}
