import { notFound } from "next/navigation";

import { Card } from "@/components/ui/card";
import { getBlogPostBySlug, getBlogPosts } from "@/features/cms/lib/content";
import { CmsShell } from "@/features/cms/components/cms-shell";
import { RichTextRenderer } from "@/features/cms/components/rich-text-renderer";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

function formatDate(dateString: string) {
  if (!dateString) {
    return "";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
  }).format(new Date(dateString));
}

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <CmsShell>
      <Card className="mx-auto max-w-4xl bg-white/90 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.08)] sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
          {formatDate(post.publishedAt)}
        </p>
        <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
          {post.title}
        </h1>
        <p className="mt-5 text-base leading-8 text-slate-600 sm:text-lg">
          {post.description}
        </p>
        <div className="mt-10">
          <RichTextRenderer content={post.content} />
        </div>
      </Card>
    </CmsShell>
  );
}
