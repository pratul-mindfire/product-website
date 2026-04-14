import axios from "axios";

import { appEnv } from "@/config/env";
import { CMS_CONFIG } from "@/constants/server";

const cmsBaseUrl = appEnv.cmsBaseUrl;

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
