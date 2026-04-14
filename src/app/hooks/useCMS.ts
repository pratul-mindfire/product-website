"use client";

import { useQuery } from "@tanstack/react-query";

import {
  getCmsBlogs,
  getCmsFeatures,
  getCmsLandingPage,
  getCmsPlans,
} from "@/app/api/cms/cms.api";

export function useCMS() {
  const landingPageQuery = useQuery({
    queryKey: ["cms", "landing-page"],
    queryFn: getCmsLandingPage,
    staleTime: 60 * 1000,
  });

  const blogsQuery = useQuery({
    queryKey: ["cms", "blogs"],
    queryFn: getCmsBlogs,
    staleTime: 60 * 1000,
  });

  const plansQuery = useQuery({
    queryKey: ["cms", "plans"],
    queryFn: getCmsPlans,
    staleTime: 60 * 1000,
  });

  const featuresQuery = useQuery({
    queryKey: ["cms", "features"],
    queryFn: async () => getCmsFeatures(),
    staleTime: 60 * 1000,
  });

  return {
    landingPageQuery,
    blogsQuery,
    plansQuery,
    featuresQuery,
  };
}

export function useCmsBlogs() {
  return useQuery({
    queryKey: ["cms", "blogs"],
    queryFn: getCmsBlogs,
    staleTime: 60 * 1000,
  });
}
