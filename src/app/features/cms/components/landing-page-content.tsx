"use client";

import { useCMS } from "@/app/hooks/useCMS";
import { BlogPostList } from "@/app/features/cms/components/blog-post-list";
import { CmsShell } from "@/app/features/cms/components/cms-shell";
import { FeaturesGrid } from "@/app/features/cms/components/features-grid";
import { HeroSection } from "@/app/features/cms/components/hero-section";
import { NewsletterForm } from "@/app/features/cms/components/newsletter-form";
import { PricingGrid } from "@/app/features/cms/components/pricing-grid";
import { SectionIntro } from "@/app/features/cms/components/section-intro";

function LoadingState() {
  return (
    <CmsShell>
      <div className="rounded-[2rem] border border-white/60 bg-white/80 p-10 text-center text-slate-600">
        Loading landing page...
      </div>
    </CmsShell>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <CmsShell>
      <div className="rounded-[2rem] border border-rose-200 bg-white/90 p-10 text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
          Unable to load landing page
        </h1>
        <p className="mt-4 text-base leading-8 text-slate-600">{message}</p>
      </div>
    </CmsShell>
  );
}

export function LandingPageContent() {
  const { landingPageQuery, blogsQuery, plansQuery, featuresQuery } = useCMS();
  const isLoading =
    landingPageQuery.isLoading ||
    blogsQuery.isLoading ||
    plansQuery.isLoading ||
    featuresQuery.isLoading;
  const error =
    landingPageQuery.error ||
    blogsQuery.error ||
    plansQuery.error ||
    featuresQuery.error;
  const hasData =
    landingPageQuery.data &&
    blogsQuery.data &&
    plansQuery.data &&
    featuresQuery.data;

  if (isLoading) {
    return <LoadingState />;
  }

  if (!hasData) {
    return (
      <ErrorState
        message={
          error instanceof Error
            ? error.message
            : "Please check the API configuration and try again."
        }
      />
    );
  }

  return (
    <CmsShell>
      <HeroSection hero={landingPageQuery.data.hero} />

      <section className="space-y-8 rounded-[2rem] border border-white/60 bg-white/70 p-8 backdrop-blur sm:p-10">
        <SectionIntro
          description={landingPageQuery.data.features.description}
          title={landingPageQuery.data.features.title}
        />
        <FeaturesGrid features={featuresQuery.data} />
      </section>

      <section className="space-y-8 rounded-[2rem] border border-white/60 bg-white/70 p-8 backdrop-blur sm:p-10">
        <SectionIntro
          description={landingPageQuery.data.pricing.description}
          title={landingPageQuery.data.pricing.title}
        />
        <PricingGrid plans={plansQuery.data} />
      </section>

      <section className="space-y-8 rounded-[2rem] border border-white/60 bg-white/70 p-8 backdrop-blur sm:p-10">
        <SectionIntro
          description={landingPageQuery.data.blog.description}
          title={landingPageQuery.data.blog.title}
        />
        <BlogPostList posts={blogsQuery.data} />
      </section>

      <NewsletterForm content={landingPageQuery.data.newsletter} />
    </CmsShell>
  );
}
