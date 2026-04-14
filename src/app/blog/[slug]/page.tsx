import { BlogPostDetailContent } from "@/app/features/cms/components/blog-post-detail-content";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;

  return <BlogPostDetailContent slug={slug} />;
}
