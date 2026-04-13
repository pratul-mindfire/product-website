"use client";

import { useCmsBlogs } from "@/app/hooks/useCMS";
import { BlogPostList } from "@/app/features/cms/components/blog-post-list";
import { CmsShell } from "@/app/features/cms/components/cms-shell";
import { SectionIntro } from "@/app/features/cms/components/section-intro";

function LoadingState() {
  return (
    <CmsShell>
      <section className="space-y-8 rounded-[2rem] border border-white/60 bg-white/80 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.08)] backdrop-blur sm:p-10">
        <SectionIntro
          title="Blog"
          description="Latest articles, notes, and implementation ideas from the product team."
        />
        <div className="rounded-[1.75rem] border border-slate-200 bg-white/95 p-8 text-center text-slate-600">
          Loading blog posts...
        </div>
      </section>
    </CmsShell>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <CmsShell>
      <section className="space-y-8 rounded-[2rem] border border-white/60 bg-white/80 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.08)] backdrop-blur sm:p-10">
        <SectionIntro
          title="Blog"
          description="Latest articles, notes, and implementation ideas from the product team."
        />
        <div className="rounded-[1.75rem] border border-rose-200 bg-white/95 p-8 text-center text-rose-600">
          {message}
        </div>
      </section>
    </CmsShell>
  );
}

export default function BlogPage() {
  const { data, error, isLoading } = useCmsBlogs();

  if (isLoading) {
    return <LoadingState />;
  }

  if (!data) {
    return (
      <ErrorState
        message={
          error instanceof Error ? error.message : "Unable to load blog posts."
        }
      />
    );
  }

  return (
    <CmsShell>
      <section className="space-y-8 rounded-[2rem] border border-white/60 bg-white/80 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.08)] backdrop-blur sm:p-10">
        <SectionIntro
          title="Blog"
          description="Latest articles, notes, and implementation ideas from the product team."
        />
        <BlogPostList posts={data} />
      </section>
    </CmsShell>
  );
}
