import { AxiosError } from "axios";

import { cmsAxios, ensureCmsBaseUrl } from "@/app/api/axios";
import {
  getDefaultFeatures,
  resolveCmsHref,
  type CmsBlogPost,
  type CmsCta,
  type CmsLandingPage,
  type CmsNewsletter,
  type CmsPricingPlan,
} from "@/app/features/cms/lib/content";

type LandingPageResponse = {
  data?: {
    hero?: {
      eyebrow?: string;
      title?: string;
      description?: string;
      primaryCta?: {
        href?: string;
        label?: string;
      };
      secondaryCta?: {
        href?: string;
        label?: string;
      };
    };
    features?: {
      title?: string;
      description?: string;
    };
    pricing?: {
      title?: string;
      description?: string;
    };
    blog?: {
      title?: string;
      description?: string;
    };
    newsletter?: {
      title?: string;
      description?: string;
      inputPlaceholder?: string;
      buttonLabel?: string;
      successMessage?: string;
      errorMessage?: string;
    };
  } | null;
};

type BlogsResponse = {
  data?: Array<{
    id: number;
    documentId: string;
    title?: string;
    description?: string;
    createdAt?: string;
    updatedAt?: string;
    publishedAt?: string;
  }>;
};

type PlansResponse = {
  data?: Array<{
    id: number;
    documentId: string;
    name?: string;
    description?: string;
    price?: number | string;
    suffix?: string;
    features?: string[];
    cta?: {
      href?: string;
      label?: string;
    };
  }>;
};

function toErrorMessage(error: unknown, fallbackMessage: string) {
  if (error instanceof AxiosError) {
    const responseData = error.response?.data;

    if (typeof responseData === "string" && responseData.trim()) {
      return responseData;
    }

    if (
      responseData &&
      typeof responseData === "object" &&
      "error" in responseData &&
      typeof responseData.error === "string"
    ) {
      return responseData.error;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallbackMessage;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function mapCta(cta?: { href?: string; label?: string } | null): CmsCta | null {
  if (!cta?.label?.trim() || !cta?.href?.trim()) {
    return null;
  }

  return {
    href: resolveCmsHref(cta.href),
    label: cta.label.trim(),
  };
}

function mapLandingPage(data?: LandingPageResponse["data"]): CmsLandingPage {
  if (!data?.hero?.title?.trim()) {
    throw new Error("Landing page data is missing the hero title.");
  }

  const newsletter: CmsNewsletter = {
    title: data.newsletter?.title?.trim() ?? "",
    description: data.newsletter?.description?.trim() ?? "",
    inputPlaceholder: data.newsletter?.inputPlaceholder?.trim() ?? "",
    buttonLabel: data.newsletter?.buttonLabel?.trim() ?? "Subscribe",
    successMessage:
      data.newsletter?.successMessage?.trim() ??
      "You are on the list. We will keep you posted.",
    errorMessage:
      data.newsletter?.errorMessage?.trim() ??
      "Something went wrong. Please try again.",
  };

  return {
    hero: {
      eyebrow: data.hero.eyebrow?.trim() ?? "",
      title: data.hero.title.trim(),
      description: data.hero.description?.trim() ?? "",
      primaryCta: mapCta(data.hero.primaryCta),
      secondaryCta: mapCta(data.hero.secondaryCta),
    },
    features: {
      title: data.features?.title?.trim() ?? "",
      description: data.features?.description?.trim() ?? "",
    },
    pricing: {
      title: data.pricing?.title?.trim() ?? "",
      description: data.pricing?.description?.trim() ?? "",
    },
    blog: {
      title: data.blog?.title?.trim() ?? "",
      description: data.blog?.description?.trim() ?? "",
    },
    newsletter,
  };
}

function mapBlogs(data?: BlogsResponse["data"]): CmsBlogPost[] {
  return (data ?? [])
    .filter((blog) => blog.title?.trim())
    .map((blog) => ({
      slug: slugify(blog.title!.trim()),
      title: blog.title!.trim(),
      description: blog.description?.trim() ?? "",
      publishedAt: blog.publishedAt ?? blog.updatedAt ?? blog.createdAt ?? "",
      coverImage: null,
      content: [],
    }));
}

function mapPlans(data?: PlansResponse["data"]): CmsPricingPlan[] {
  return (data ?? [])
    .filter((plan) => plan.name?.trim())
    .map((plan) => ({
      name: plan.name!.trim(),
      description: plan.description?.trim() ?? "",
      price:
        typeof plan.price === "number"
          ? `$${plan.price}`
          : `${plan.price ?? ""}`.trim(),
      suffix: plan.suffix?.trim() ?? null,
      features: Array.isArray(plan.features) ? plan.features : [],
      cta: mapCta(plan.cta),
    }));
}

async function getWithFallback<T>(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const candidatePaths = [normalizedPath, `/api${normalizedPath}`];
  let lastError: unknown = null;

  for (const candidatePath of candidatePaths) {
    try {
      return await cmsAxios.get<T>(candidatePath);
    } catch (error) {
      lastError = error;

      if (!(error instanceof AxiosError) || error.response?.status !== 404) {
        throw error;
      }
    }
  }

  throw lastError;
}

export async function getCmsLandingPage() {
  ensureCmsBaseUrl();

  try {
    const landingPageResponse =
      await getWithFallback<LandingPageResponse>("/landing-page");
    return mapLandingPage(landingPageResponse.data.data);
  } catch (error) {
    throw new Error(
      toErrorMessage(error, "Unable to load landing page content."),
    );
  }
}

export async function getCmsBlogs() {
  ensureCmsBaseUrl();

  try {
    const blogsResponse = await getWithFallback<BlogsResponse>("/blogs");
    return mapBlogs(blogsResponse.data.data);
  } catch (error) {
    throw new Error(toErrorMessage(error, "Unable to load blog content."));
  }
}

export async function getCmsPlans() {
  ensureCmsBaseUrl();

  try {
    const plansResponse = await getWithFallback<PlansResponse>("/plans");
    return mapPlans(plansResponse.data.data);
  } catch (error) {
    throw new Error(toErrorMessage(error, "Unable to load pricing plans."));
  }
}

export function getCmsFeatures() {
  return getDefaultFeatures();
}
