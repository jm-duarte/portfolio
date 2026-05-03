import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemaTypes";

const projectId =
  process.env.SANITY_STUDIO_PROJECT_ID ??
  process.env.VITE_SANITY_PROJECT_ID ??
  "";
const dataset =
  process.env.SANITY_STUDIO_DATASET ??
  process.env.VITE_SANITY_DATASET ??
  "production";

export default defineConfig({
  name: "joao-portfolio",
  title: "João's Portfolio",
  projectId,
  dataset,
  basePath: "/studio",
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            S.listItem()
              .title("Projects")
              .child(S.documentTypeList("project").title("Projects")),
            S.listItem()
              .title("UX Cases")
              .child(S.documentTypeList("uxCase").title("UX Cases")),
            S.divider(),
            S.listItem()
              .title("About Me")
              .child(
                S.document()
                  .schemaType("aboutMe")
                  .documentId("aboutMe")
                  .title("About Me")
              ),
            S.listItem()
              .title("Site Settings")
              .child(
                S.document()
                  .schemaType("siteSettings")
                  .documentId("siteSettings")
                  .title("Site Settings")
              ),
          ]),
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
  },
});
