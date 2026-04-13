import { Card } from "@/app/components/ui/card";
import type { CmsFeature } from "@/app/features/cms/lib/content";

type FeaturesGridProps = {
  features: CmsFeature[];
};

export function FeaturesGrid({ features }: FeaturesGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {features.map((feature) => (
        <Card key={feature.title} className="bg-white/90">
          {feature.icon ? (
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-600">
              {feature.icon}
            </p>
          ) : null}
          <h3 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950">
            {feature.title}
          </h3>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            {feature.description}
          </p>
        </Card>
      ))}
    </div>
  );
}
