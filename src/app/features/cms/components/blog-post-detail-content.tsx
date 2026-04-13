"use client";

import { useSearchParams } from "next/navigation";

import { Card } from "@/app/components/ui/card";
import { useCmsBlogs } from "@/app/hooks/useCMS";
import type { CmsBlogPost } from "@/app/features/cms/lib/content";
import { CmsShell } from "@/app/features/cms/components/cms-shell";
import { RichTextRenderer } from "@/app/features/cms/components/rich-text-renderer";

type BlogPostDetailContentProps = {
  slug: string;
};

function formatDate(dateString: string) {
  if (!dateString) {
    return "";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
  }).format(new Date(dateString));
}

function LoadingState() {
  return (
    <CmsShell>
      <Card className="mx-auto max-w-4xl bg-white/90 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.08)] sm:p-10">
        <p className="text-base text-slate-600">Loading blog post...</p>
      </Card>
    </CmsShell>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <CmsShell>
      <Card className="mx-auto max-w-4xl border-rose-200 bg-white/90 p-8 text-center shadow-[0_30px_80px_rgba(15,23,42,0.08)] sm:p-10">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
          Unable to load blog post
        </h1>
        <p className="mt-4 text-base leading-8 text-slate-600">{message}</p>
      </Card>
    </CmsShell>
  );
}

function NotFoundState() {
  return (
    <CmsShell>
      <Card className="mx-auto max-w-4xl bg-white/90 p-8 text-center shadow-[0_30px_80px_rgba(15,23,42,0.08)] sm:p-10">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
          Blog post not found
        </h1>
        <p className="mt-4 text-base leading-8 text-slate-600">
          This post is unavailable or no longer exists in the CMS.
        </p>
      </Card>
    </CmsShell>
  );
}

function getPostFromSearchParams(
  slug: string,
  searchParams: URLSearchParams,
): CmsBlogPost | null {
  const title = searchParams.get("title")?.trim();

  if (!title) {
    return null;
  }

  let content: unknown = [];
  const encodedContent = searchParams.get("content");

  if (encodedContent) {
    try {
      content = JSON.parse(encodedContent);
    } catch {
      content = [];
    }
  }

  return {
    slug,
    title,
    description: searchParams.get("description")?.trim() ?? "",
    publishedAt: searchParams.get("publishedAt") ?? "",
    coverImage: null,
    content,
  };
}

export function BlogPostDetailContent({ slug }: BlogPostDetailContentProps) {
  const searchParams = useSearchParams();
  const { data: posts, error, isLoading } = useCmsBlogs();
  const postFromParams = getPostFromSearchParams(slug, searchParams);
  const selectedPost =
    postFromParams ?? posts?.find((post) => post.slug === slug) ?? null;

  if (isLoading) {
    return <LoadingState />;
  }

  if (!posts) {
    return (
      <ErrorState
        message={
          error instanceof Error ? error.message : "Unable to load blog post."
        }
      />
    );
  }

  if (!selectedPost) {
    return <NotFoundState />;
  }

  return (
    <CmsShell>
      <Card className="mx-auto max-w-4xl bg-white/90 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.08)] sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
          {formatDate(selectedPost.publishedAt)}
        </p>
        <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
          {selectedPost.title}
        </h1>
        <p className="mt-5 text-base leading-8 text-slate-600 sm:text-lg">
          {selectedPost.description}
        </p>
        <div className="mt-10">
          <RichTextRenderer content={selectedPost.content} />
        </div>
      </Card>
    </CmsShell>
  );
}
