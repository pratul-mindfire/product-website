import { APP_ROUTES } from "@/constants/app";

export type CmsCta = {
  href: string;
  label: string;
};

export type CmsHero = {
  description: string;
  eyebrow: string;
  primaryCta: CmsCta | null;
  secondaryCta: CmsCta | null;
  title: string;
};

export type CmsSectionIntro = {
  description: string;
  title: string;
};

export type CmsFeature = {
  description: string;
  icon: string | null;
  title: string;
};

export type CmsPricingPlan = {
  cta: CmsCta | null;
  description: string;
  features: string[];
  name: string;
  price: string;
  suffix: string | null;
};

export type CmsBlogPost = {
  content: unknown;
  coverImage: string | null;
  description: string;
  publishedAt: string;
  slug: string;
  title: string;
};

export type CmsNewsletter = {
  buttonLabel: string;
  description: string;
  errorMessage: string;
  inputPlaceholder: string;
  successMessage: string;
  title: string;
};

export type CmsLandingPage = {
  blog: CmsSectionIntro;
  features: CmsSectionIntro;
  hero: CmsHero;
  newsletter: CmsNewsletter;
  pricing: CmsSectionIntro;
};

const landingPageContent: CmsLandingPage = {
  hero: {
    eyebrow: "Modern Product Teams",
    title: "Launch polished product experiences without fighting your stack.",
    description:
      "A clean storefront, flexible pricing, helpful blog content, and a simple newsletter flow all working together in one Next.js app.",
    primaryCta: {
      href: APP_ROUTES.blog,
      label: "Read the blog",
    },
    secondaryCta: {
      href: APP_ROUTES.dashboard,
      label: "Open dashboard",
    },
  },
  features: {
    title: "Built for fast-moving teams",
    description:
      "Reusable components and a structured app setup make it easier to grow the product without constant rewrites.",
  },
  pricing: {
    title: "Straightforward pricing",
    description:
      "Simple plan tiers designed for early teams, scaling products, and larger operations.",
  },
  blog: {
    title: "Latest product notes",
    description:
      "Articles, launch updates, and implementation ideas to help your team ship with more confidence.",
  },
  newsletter: {
    title: "Join the product updates list",
    description:
      "Get launch notes, new features, and practical product insights delivered to your inbox.",
    inputPlaceholder: "you@example.com",
    buttonLabel: "Subscribe",
    successMessage: "You are on the list. We will keep you posted.",
    errorMessage: "Something went wrong. Please try again.",
  },
};

const featuresContent: CmsFeature[] = [
  {
    title: "Reusable UI",
    description:
      "Shared buttons, cards, sections, and content blocks keep the experience consistent across pages.",
    icon: "UI",
  },
  {
    title: "Structured Routing",
    description:
      "Public pages, auth flows, dashboard views, and backend endpoints stay organized as the project grows.",
    icon: "ROUTES",
  },
  {
    title: "Integrated Backend",
    description:
      "Authentication and newsletter collection run through app routes and MongoDB without extra boilerplate.",
    icon: "API",
  },
];

const pricingContent: CmsPricingPlan[] = [
  {
    name: "Starter",
    description:
      "A focused setup for small teams validating the first version.",
    price: "$19",
    suffix: "/month",
    features: [
      "Reusable landing page sections",
      "Auth flow included",
      "Newsletter collection",
    ],
    cta: {
      href: APP_ROUTES.register,
      label: "Start now",
    },
  },
  {
    name: "Growth",
    description:
      "For teams expanding content, features, and customer workflows.",
    price: "$59",
    suffix: "/month",
    features: [
      "Blog-ready structure",
      "Protected dashboard area",
      "MongoDB-backed user data",
    ],
    cta: {
      href: APP_ROUTES.register,
      label: "Choose growth",
    },
  },
  {
    name: "Scale",
    description:
      "A stronger foundation for mature teams shipping at higher velocity.",
    price: "$129",
    suffix: "/month",
    features: [
      "Composable codebase structure",
      "Extensible backend services",
      "Production-ready workflows",
    ],
    cta: {
      href: APP_ROUTES.register,
      label: "Talk to us",
    },
  },
];

const blogPosts: CmsBlogPost[] = [
  {
    slug: "designing-a-clean-product-foundation",
    title: "Designing a clean product foundation",
    description:
      "How a tidy route structure and reusable UI components reduce friction as product scope expands.",
    publishedAt: "2026-04-05T00:00:00.000Z",
    coverImage: null,
    content: [
      {
        type: "paragraph",
        children: [
          {
            text: "Strong product work starts with a codebase that can absorb change without becoming chaotic.",
          },
        ],
      },
      {
        type: "heading",
        level: 2,
        children: [{ text: "Why structure matters" }],
      },
      {
        type: "paragraph",
        children: [
          {
            text: "When routes, components, and server logic each have a clear home, teams spend less time untangling context and more time shipping improvements.",
          },
        ],
      },
    ],
  },
  {
    slug: "shipping-auth-with-less-boilerplate",
    title: "Shipping auth with less boilerplate",
    description:
      "A practical look at building register, login, and logout flows with a small but maintainable server layer.",
    publishedAt: "2026-04-02T00:00:00.000Z",
    coverImage: null,
    content: [
      {
        type: "paragraph",
        children: [
          {
            text: "Authentication does not need to dominate the project. A focused session layer and clear actions go a long way.",
          },
        ],
      },
      {
        type: "paragraph",
        children: [
          {
            text: "The key is keeping form handling, persistence, and redirects easy to follow so future changes stay low-risk.",
          },
        ],
      },
    ],
  },
  {
    slug: "turning-a-newsletter-form-into-a-real-workflow",
    title: "Turning a newsletter form into a real workflow",
    description:
      "Collecting subscriber emails is simple. Making the flow reliable and reusable is where the real work happens.",
    publishedAt: "2026-03-28T00:00:00.000Z",
    coverImage: null,
    content: [
      {
        type: "paragraph",
        children: [
          {
            text: "A good newsletter flow validates input, stores subscribers safely, and responds with clear feedback states.",
          },
        ],
      },
      {
        type: "list",
        children: [
          { type: "list-item", children: [{ text: "Validate the email" }] },
          {
            type: "list-item",
            children: [{ text: "Store or deduplicate it" }],
          },
          { type: "list-item", children: [{ text: "Return a useful result" }] },
        ],
      },
    ],
  },
];

export async function getLandingPageContent() {
  return landingPageContent;
}

export async function getFeaturesContent() {
  return featuresContent;
}

export async function getPricingContent() {
  return pricingContent;
}

export async function getBlogPosts() {
  return blogPosts;
}

export async function getBlogPostBySlug(slug: string) {
  return blogPosts.find((post) => post.slug === slug) ?? null;
}

export function getLatestBlogPreview(posts: CmsBlogPost[], limit = 3) {
  return posts.slice(0, limit);
}

export function getBlogPostHref(slug: string) {
  return `${APP_ROUTES.blog}/${slug}`;
}
