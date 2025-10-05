import { TrolleyIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";


export const productType = defineType({
  name: "product",
  title: "Products",
  type: "document",
  icon: TrolleyIcon,
  fields: [
    defineField({
      name: "name",
      title: "Product Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),

    // 🔹 Variants: each color has stock + images
    defineField({
      name: "variants",
      title: "Product Variants",
      type: "array",
      of: [
        {
          type: "object",
          name: "variant",
          fields: [
            defineField({
              name: "colorName",
              title: "Color Name",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
           defineField({
  name: "openingStock",
  title: "Opening Stock",
  type: "number",
  validation: (Rule) => Rule.required().min(0),
}),
defineField({
  name: "stockOut",
  title: "Stock Out",
  type: "number",
  // readOnly: true, // automatically managed by checkout logic
  initialValue: 0,
  validation: (Rule) =>
                Rule.min(0).warning("Stock Out cannot be negative"),
}),


            defineField({
              name: "images",
              title: "Images for this color",
              type: "array",
              of: [{ type: "image", options: { hotspot: true } }],
              validation: (Rule) => Rule.required().min(1),
            }),
          ],
          preview: {
            select: {
              title: "colorName",
              opening: "openingStock",
    out: "stockOut",
              media: "images.0.asset",
            },
            prepare({ title, opening, out, media }) {
              const available = (opening || 0) - (out || 0);
              return {
                title,
               subtitle: `Opening: ${opening || 0} | Out: ${out || 0} | Available: ${available}`,
                media,
              };
            },
          },
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),

    

    defineField({
      name: "price",
      title: "Price",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),

    defineField({
      name: "discount",
      title: "Discount",
      type: "number",
      validation: (Rule) => Rule.min(0),
    }),

    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      of: [{ type: "reference", to: { type: "category" } }],
    }),

    defineField({
      name: "status",
      title: "Product Status",
      type: "string",
      options: {
        list: [
          { title: "New Arrival", value: "new" },
          { title: "Hot Selling", value: "hot" },
          { title: "Best Deal", value: "best" },
        ],
      },
    }),

    defineField({
      name: "isFeatured",
      title: "Featured Product",
      type: "boolean",
      description: "Toggle to display in Home Page under EXCLUSIVE COLLECTION",
      initialValue: false,
    }),

    defineField({
  name: "features",
  title: "Features",
  type: "array",
  of: [
    {
      type: "object",
      fields: [
        {
          name: "icon",
          title: "Icon",
          type: "image",
          options: { hotspot: true },
        },
        {
          name: "label",
          title: "Label",
          type: "string",
        },
      ],
      preview: {
        select: { title: "label", media: "icon" },
      },
    },
  ],
  description: "Feature highlights shown above description (with icon + label)",
  initialValue: [], // 
}),
defineField({
  name: "specifications",
  title: "Specifications",
  type: "array",
  of: [
    {
      type: "object",
      fields: [
        {
          name: "icon",
          title: "Icon",
          type: "image",
          options: { hotspot: true },
        },
        {
          name: "value",
          title: "Value",
          type: "string", // e.g. 27 cm, Leather, 15L
          description: "Type with spaces to split words into lines",
         
        },
      ],
      preview: {
        select: { title: "value", subtitle: "value", media: "icon" },
      },
    },
  ],
  description: "Detailed product specifications shown below description",
   initialValue: [], // 
}),
defineField({
  name: "realImages",
  title: "Real Images",
  type: "array",
  of: [{ type: "image", options: { hotspot: true } }],
  description: "Upload real photos of the product",
  initialValue: [], // 
}),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      
    }),
defineField({
  name: "realVideos",
  title: "Real Videos",
  type: "array",
  of: [
    {
      type: "file",
      options: {
        accept: "video/*", // restricts upload to video formats
      },
    },
  ],
  description: "Upload real product videos (mp4, mov, etc.)",
  initialValue: [], // 
}),



  ],

preview: {
  select: {
    title: "name",
    subtitle: "price",
    media: "variants.0.images.0.asset",
  },
  prepare({ title, subtitle, media }) {
    return {
      title,
      subtitle: subtitle ? `LKR ${subtitle.toLocaleString("en-LK")}` : "",
      media: media || TrolleyIcon, // fallback
    };
  },
},

});
