import axios from "axios";

import { CMS_CONFIG } from "@/constants/server";

const cmsBaseUrl = process.env.NEXT_PUBLIC_STRAPI_URL?.replace(/\/$/, "") ?? "";

export const cmsAxios = axios.create({
  baseURL: cmsBaseUrl || undefined,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export function ensureCmsBaseUrl() {
  if (!cmsBaseUrl) {
    throw new Error(CMS_CONFIG.missingBaseUrlMessage);
  }

  return cmsBaseUrl;
}
