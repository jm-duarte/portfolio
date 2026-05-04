import { defineField, defineType } from "sanity";

const richTextBlocks = [
  {
    type: "block",
    styles: [
      { title: "Normal", value: "normal" },
      { title: "H1", value: "h1" },
      { title: "H2", value: "h2" },
      { title: "H3", value: "h3" },
      { title: "Quote", value: "blockquote" },
    ],
    marks: {
      decorators: [
        { title: "Bold", value: "strong" },
        { title: "Italic", value: "em" },
        { title: "Code", value: "code" },
      ],
      annotations: [
        {
          name: "link",
          type: "object",
          title: "URL",
          fields: [{ name: "href", type: "url", title: "URL" }],
        },
      ],
    },
  },
  {
    type: "image",
    options: { hotspot: true },
    fields: [
      { name: "alt", type: "string", title: "Alt text" },
      { name: "caption", type: "string", title: "Caption" },
    ],
  },
];

export default defineType({
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    defineField({
      name: "titleI18n",
      title: "Title",
      type: "object",
      description: "Project title in English and Portuguese",
      fields: [
        defineField({ name: "en", title: "English", type: "string" }),
        defineField({ name: "pt", title: "Português", type: "string" }),
      ],
    }),
    defineField({
      name: "title",
      title: "Title (legacy — use field above)",
      type: "string",
      description: "Kept for backwards compatibility. Prefer 'Title (EN/PT)' above.",
      hidden: ({ document }) => !!(document?.titleI18n as { en?: string } | undefined)?.en,
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "published",
      title: "Published",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "orderRank",
      title: "Order",
      type: "number",
      description: "Lower numbers appear first",
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "gradient",
      title: "Gradient (fallback)",
      type: "string",
      description: "CSS gradient used if no cover image is set, e.g. from-purple-500 to-blue-600",
    }),
    defineField({
      name: "roleI18n",
      title: "Role",
      type: "object",
      description: "Role in English and Portuguese",
      fields: [
        defineField({ name: "en", title: "English", type: "string" }),
        defineField({ name: "pt", title: "Português", type: "string" }),
      ],
    }),
    defineField({
      name: "role",
      title: "Role (legacy)",
      type: "string",
      description: "Kept for backwards compatibility. Prefer 'Role (EN/PT)' above.",
      hidden: ({ document }) => !!(document?.roleI18n as { en?: string } | undefined)?.en,
    }),
    defineField({
      name: "year",
      title: "Year",
      type: "string",
    }),
    defineField({
      name: "overviewI18n",
      title: "Short Overview",
      type: "object",
      description: "Brief summary shown on the project card, in both languages",
      fields: [
        defineField({ name: "en", title: "English", type: "text", rows: 3 }),
        defineField({ name: "pt", title: "Português", type: "text", rows: 3 }),
      ],
    }),
    defineField({
      name: "overview",
      title: "Short Overview (legacy)",
      type: "text",
      rows: 3,
      description: "Kept for backwards compatibility. Prefer 'Short Overview (EN/PT)' above.",
      hidden: ({ document }) => !!(document?.overviewI18n as { en?: string } | undefined)?.en,
    }),
    defineField({
      name: "content",
      title: "Project Content — English",
      type: "array",
      of: richTextBlocks,
    }),
    defineField({
      name: "contentPt",
      title: "Project Content — Português",
      type: "array",
      of: richTextBlocks,
    }),
  ],
  preview: {
    select: { titleI18n: "titleI18n", title: "title", media: "coverImage" },
    prepare({ titleI18n, title, media }) {
      const t = (titleI18n as { en?: string } | undefined)?.en ?? title ?? "Untitled";
      return { title: t, media };
    },
  },
});
