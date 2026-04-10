import {
  getBlogPostHref,
  getFeaturesContent,
  getLandingPageContent,
  getLatestBlogPreview,
  getPricingContent,
  getBlogPosts,
} from "@/features/cms/lib/content";
import { BlogPostList } from "@/features/cms/components/blog-post-list";
import { CmsShell } from "@/features/cms/components/cms-shell";
import { FeaturesGrid } from "@/features/cms/components/features-grid";
import { HeroSection } from "@/features/cms/components/hero-section";
import { NewsletterForm } from "@/features/cms/components/newsletter-form";
import { PricingGrid } from "@/features/cms/components/pricing-grid";
import { SectionIntro } from "@/features/cms/components/section-intro";

export default async function LandingPage() {
  const [landingPage, features, pricingPlans, blogPosts] = await Promise.all([
    getLandingPageContent(),
    getFeaturesContent(),
    getPricingContent(),
    getBlogPosts(),
  ]);

  return (
    <CmsShell>
      <HeroSection hero={landingPage.hero} />

      <section className="space-y-8 rounded-[2rem] border border-white/60 bg-white/70 p-8 backdrop-blur sm:p-10">
        <SectionIntro
          description={landingPage.features.description}
          title={landingPage.features.title}
        />
        <FeaturesGrid features={features} />
      </section>

      <section className="space-y-8 rounded-[2rem] border border-white/60 bg-white/70 p-8 backdrop-blur sm:p-10">
        <SectionIntro
          description={landingPage.pricing.description}
          title={landingPage.pricing.title}
        />
        <PricingGrid plans={pricingPlans} />
      </section>

      <section className="space-y-8 rounded-[2rem] border border-white/60 bg-white/70 p-8 backdrop-blur sm:p-10">
        <div className="flex flex-col gap-4">
          <SectionIntro
            description={landingPage.blog.description}
            title={landingPage.blog.title}
          />
        </div>
        <BlogPostList
          getHref={getBlogPostHref}
          posts={getLatestBlogPreview(blogPosts)}
        />
      </section>

      <NewsletterForm content={landingPage.newsletter} />
    </CmsShell>
  );
}
