import { defineType, defineField } from "sanity";

export const orderItemType = defineType({
  name: "orderItem",
  title: "Order Item",
  type: "object",
  fields: [
    defineField({
      name: "product",
      title: "Product",
      type: "reference",
      to: [{ type: "product" }],
    }),
  defineField({
  name: "variant",
  title: "Variant",
  type: "object",
  fields: [
    { name: "color", title: "Color", type: "string" },
    { name: "variantKey", title: "Variant Key", type: "string" }, // 👈 renamed
  ],
}),


    defineField({
      name: "quantity",
      title: "Quantity",
      type: "number",
      validation: (Rule) => Rule.min(1),
    }),
    defineField({
      name: "price",
      title: "Unit Price",
      type: "number",
    }),
    defineField({
      name: "productName",
      title: "Product Name (snapshot)",
      type: "string",
    }),
    defineField({
      name: "productImage",
      title: "Product Image (snapshot)",
      type: "image",
      options: { hotspot: true }, // ✅ make it optional + supports crop
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
      variant: "variant",
    },
prepare({ snapName, snapImage, refName, refVariants, quantity, price, variant }) {
  const name = snapName || refName || "Unknown Product";

  let image = snapImage;

  if (!image && refVariants && variant?.variantKey) {
    const matched = refVariants.find((v: any) => v._key === variant.variantKey);
    image = matched?.images?.[0];
  }

  const total = (price || 0) * (quantity || 0);

  return {
    title: `${quantity || 0} × ${name}`,
    subtitle: `Rs. ${total}${variant?.color ? ` – ${variant.color}` : ""}`,
    media: image || undefined,
  };
},

  },
});
