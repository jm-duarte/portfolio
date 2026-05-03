import { defineField, defineType } from "sanity";

export default defineType({
  name: "aboutMe",
  title: "About Me",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Full Name",
      type: "string",
    }),
    defineField({
      name: "bio",
      title: "Bio",
      type: "text",
      rows: 5,
    }),
    defineField({
      name: "avatar",
      title: "Profile Photo",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "skills",
      title: "Skills",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "tools",
      title: "Tools",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "experience",
      title: "Experience Timeline",
      type: "array",
      of: [
        {
          type: "object",
          name: "experienceEntry",
          fields: [
            defineField({ name: "company", title: "Company", type: "string" }),
            defineField({ name: "role", title: "Role", type: "string" }),
            defineField({ name: "period", title: "Period (e.g. 2022 – 2024)", type: "string" }),
            defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
          ],
          preview: {
            select: { title: "role", subtitle: "company" },
          },
        },
      ],
    }),
  ],
  preview: {
    select: { title: "name", media: "avatar" },
  },
});
