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

export type LandingPageViewData = {
  blogPosts: CmsBlogPost[];
  features: CmsFeature[];
  landingPage: CmsLandingPage;
  pricingPlans: CmsPricingPlan[];
};

const STRAPI_ROUTE_MAP: Record<string, string> = {
  "APP_ROUTES.home": APP_ROUTES.home,
  "APP_ROUTES.blog": APP_ROUTES.blog,
  "APP_ROUTES.dashboard": APP_ROUTES.dashboard,
  "APP_ROUTES.login": APP_ROUTES.login,
  "APP_ROUTES.register": APP_ROUTES.register,
};

const defaultFeatures: CmsFeature[] = [
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


export function resolveCmsHref(value?: string) {
  if (!value?.trim()) {
    return "";
  }

  return STRAPI_ROUTE_MAP[value.trim()] ?? value.trim();
}

export function getDefaultFeatures() {
  return defaultFeatures;
}

export function getBlogPostHref(post: CmsBlogPost) {
  return {
    pathname: `${APP_ROUTES.blog}/${post.slug}`,
    query: {
      title: post.title,
      description: post.description,
      publishedAt: post.publishedAt,
      content: JSON.stringify(post.content),
    },
  };
}
