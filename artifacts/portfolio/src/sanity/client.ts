import { createClient, type SanityClient } from "@sanity/client";

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID as string | undefined;
const dataset = (import.meta.env.VITE_SANITY_DATASET as string | undefined) ?? "production";

// Only create a real client when a project ID is configured.
// When unconfigured the portfolio falls back to static default data.
export const sanityClient: SanityClient | null = projectId
  ? createClient({
      projectId,
      dataset,
      apiVersion: "2024-01-01",
      useCdn: true,
      perspective: "published",
    })
  : null;
