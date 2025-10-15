// schemas/categoryType.ts
import { TagIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const categoryType = defineType({
  name: "category",
  title: "Categories & Subcategories",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "parent",
      title: "Parent Category",
      type: "reference",
      to: [{ type: "category" }],
      description: "Leave empty for a main category. Assign a parent to make this a subcategory.",
      options: {
        filter: "!defined(parent)", // Only allow main categories to be selected as a parent
      },
    }),
  ],
  preview: {
    select: {
      title: "name",
      parent: "parent.name",
    },
    prepare({ title, parent }) {
      return {
        title,
        subtitle: parent ? `Subcategory of ${parent}` : "Main Category",
      };
    },
  },
});