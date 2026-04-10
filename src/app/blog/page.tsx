import {
  getBlogPostHref,
  getBlogPosts,
  getLandingPageContent,
} from "@/features/cms/lib/content";
import { BlogPostList } from "@/features/cms/components/blog-post-list";
import { CmsShell } from "@/features/cms/components/cms-shell";
import { SectionIntro } from "@/features/cms/components/section-intro";

export default async function BlogPage() {
  const [posts, landingPage] = await Promise.all([
    getBlogPosts(),
    getLandingPageContent(),
  ]);

  return (
    <CmsShell>
      <section className="space-y-8 rounded-[2rem] border border-white/60 bg-white/80 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.08)] backdrop-blur sm:p-10">
        <SectionIntro
          title={landingPage.blog.title}
          description={landingPage.blog.description}
        />
        <BlogPostList getHref={getBlogPostHref} posts={posts} />
      </section>
    </CmsShell>
  );
}
