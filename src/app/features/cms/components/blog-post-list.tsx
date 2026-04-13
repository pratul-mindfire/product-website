import Link from "next/link";

import { Card } from "@/app/components/ui/card";
import {
  getBlogPostHref,
  type CmsBlogPost,
} from "@/app/features/cms/lib/content";

type BlogPostListProps = {
  posts: CmsBlogPost[];
};

function formatDate(dateString: string) {
  if (!dateString) {
    return "";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
  }).format(new Date(dateString));
}

export function BlogPostList({ posts }: BlogPostListProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {posts.map((post) => (
        <Link key={post.slug} href={getBlogPostHref(post)}>
          <Card className="h-full bg-white/95 transition hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
              {formatDate(post.publishedAt)}
            </p>
            <h3 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950">
              {post.title}
            </h3>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              {post.description}
            </p>
          </Card>
        </Link>
      ))}
    </div>
  );
}
