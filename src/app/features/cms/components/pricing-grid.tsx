import Link from "next/link";

import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import type { CmsPricingPlan } from "@/app/features/cms/lib/content";

type PricingGridProps = {
  plans: CmsPricingPlan[];
};

export function PricingGrid({ plans }: PricingGridProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {plans.map((plan) => (
        <Card key={plan.name} className="bg-white/95">
          <h3 className="text-2xl font-semibold tracking-tight text-slate-950">
            {plan.name}
          </h3>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            {plan.description}
          </p>
          <div className="mt-6 flex items-end gap-2">
            <span className="text-4xl font-semibold tracking-tight text-slate-950">
              {plan.price}
            </span>
            {plan.suffix ? (
              <span className="pb-1 text-sm text-slate-500">{plan.suffix}</span>
            ) : null}
          </div>
          <ul className="mt-6 space-y-3 text-sm leading-6 text-slate-600">
            {plan.features.map((feature) => (
              <li key={feature}>• {feature}</li>
            ))}
          </ul>
          {plan.cta ? (
            <div className="mt-8">
              <Link href={plan.cta.href}>
                <Button width="full">{plan.cta.label}</Button>
              </Link>
            </div>
          ) : null}
        </Card>
      ))}
    </div>
  );
}
