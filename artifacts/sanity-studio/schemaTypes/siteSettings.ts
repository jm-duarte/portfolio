import { defineField, defineType } from "sanity";

export default defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "uxCasePassword",
      title: "UX Case Password",
      type: "string",
      description:
        "Password visitors must enter to unlock the UX Cases section. Change it here to rotate it anytime.",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    prepare() {
      return { title: "Site Settings" };
    },
  },
});
