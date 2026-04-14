import Link from "next/link";

import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import type { CmsHero } from "@/app/features/cms/lib/content";

type HeroSectionProps = {
  hero: CmsHero;
};

export function HeroSection({ hero }: HeroSectionProps) {
  return (
    <Card className="overflow-hidden border-white/60 bg-white/80 p-8 shadow-[0_30px_120px_rgba(15,23,42,0.12)] backdrop-blur sm:p-12">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-500">
          {hero.eyebrow}
        </p>
        <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
          {hero.title}
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
          {hero.description}
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          {hero.primaryCta ? (
            <Link href={hero.primaryCta.href}>
              <Button>{hero.primaryCta.label}</Button>
            </Link>
          ) : null}
          {hero.secondaryCta ? (
            <Link href={hero.secondaryCta.href}>
              <Button variant="ghost">{hero.secondaryCta.label}</Button>
            </Link>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
