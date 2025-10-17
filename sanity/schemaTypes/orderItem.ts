import { defineType, defineField } from "sanity";

export const orderItemType = defineType({
  name: "orderItem",
  title: "Order Item",
  type: "object",
  fields: [
    // 🔹 Reference to the product
    defineField({
      name: "product",
      title: "Product",
      type: "reference",
      to: [{ type: "product" }],
      validation: (Rule) => Rule.required(),
    }),

    // 🔹 Variant info snapshot
    defineField({
      name: "variant",
      title: "Variant Details",
      type: "object",
      fields: [
        defineField({
          name: "variantName",
          title: "Variant Name",
          type: "string",
        }),
        defineField({
          name: "variantKey",
          title: "Variant Key",
          type: "string",
          description: "The _key of the variant in the product document",
        }),
      ],
    }),

    // 🔹 Quantity and pricing
    defineField({
      name: "quantity",
      title: "Quantity",
      type: "number",
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "price",
      title: "Unit Price (Snapshot)",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),

    // 🔹 Snapshot fields (in case product changes later)
    defineField({
      name: "productName",
      title: "Product Name (Snapshot)",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "productImage",
      title: "Product Image (Snapshot)",
      type: "image",
      options: { hotspot: true },
      description: "First image of the variant or product at time of order",
    }),
  ],

  preview: {
    select: {
      snapName: "productName",
      snapImage: "productImage",
      refName: "product.name",
      refVariants: "product.variants",
      quantity: "quantity",
      price: "price",
      variantName: "variant.variantName",
      variantKey: "variant.variantKey",
    },
    prepare({
      snapName,
      snapImage,
      refName,
      refVariants,
      quantity,
      price,
      variantName,
      variantKey,
    }) {
      const name = snapName || refName || "Unnamed Product";

      // Fallback: use variant image if snapshot missing
      let image = snapImage;
      if (!image && refVariants && variantKey) {
        const matched = refVariants.find((v) => v._key === variantKey);
        image = matched?.images?.[0];
      }

      const total = (price || 0) * (quantity || 0);

      return {
        title: `${quantity || 0} × ${name}`,
        subtitle: `Rs. ${total}${variantName ? ` — ${variantName}` : ""}`,
        media: image,
      };
    },
  },
});
