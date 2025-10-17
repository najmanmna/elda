import { NextResponse } from "next/server";
import { backendClient } from "@/sanity/lib/backendClient";
import { v4 as uuidv4 } from "uuid";
import { sendSubscribeEmail } from "@/lib/sendSubscribeEmail";

export const runtime = "nodejs";

const bankDetails = `M.J.M IFHAM
0110290723001
Amana Bank Dehiwala`;

// ------------------ EMAIL TEMPLATES ------------------ //
const customerOrderTemplate = (
  firstName: string,
  orderId: string,
  items: any[],
  total: number,
  shippingFee: number,
  paymentMethod: string
) => `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 640px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
    <div style="text-align: center;">
      <img src="https://elvynstore.com/logo.png" alt="Elvyn" style="width: 120px; margin-bottom: 20px;">
    </div>
    <h2 style="color: #2c3e50; text-align: center;">Thank you for your order!</h2>
    <p>Hi <strong>${firstName}</strong>,</p>
    <p>Your order <strong>#${orderId}</strong> has been placed successfully.</p>

    <table style="width:100%; border-collapse: collapse; margin: 20px 0;">
      <thead>
        <tr style="background-color:#f9f9f9;">
          <th style="padding:8px; border:1px solid #ddd;">Product</th>
          <th style="padding:8px; border:1px solid #ddd; text-align:center;">Variant</th>
          <th style="padding:8px; border:1px solid #ddd; text-align:center;">Qty</th>
          <th style="padding:8px; border:1px solid #ddd; text-align:right;">Price</th>
        </tr>
      </thead>
      <tbody>
        ${items
          .map(
            (it) => `
          <tr>
            <td style="padding:8px; border:1px solid #ddd;">${it.productName}</td>
            <td style="padding:8px; border:1px solid #ddd; text-align:center;">${it.variant?.variantName || "-"}</td>
            <td style="padding:8px; border:1px solid #ddd; text-align:center;">${it.quantity}</td>
            <td style="padding:8px; border:1px solid #ddd; text-align:right;">LKR ${it.price * it.quantity}</td>
          </tr>`
          )
          .join("")}
      </tbody>
    </table>

    <p><strong>Subtotal:</strong> LKR ${total}</p>
    <p><strong>Shipping Fee:</strong> LKR ${shippingFee}</p>
    <p><strong>Total:</strong> LKR ${total + shippingFee}</p>
    <p><strong>Payment Method:</strong> ${paymentMethod}</p>

    ${
      paymentMethod.toLowerCase().includes("bank")
        ? `
      <div style="background:#fffbea; border:1px solid #fcd34d; border-radius:8px; padding:15px; margin:20px 0;">
        <h3 style="margin:0 0 10px; color:#92400e;">Bank Transfer Instructions</h3>
        <p>Please transfer <strong>LKR ${total + shippingFee}</strong> using your order number <strong>${orderId}</strong> as the payment reference. Your order will be processed once we confirm the payment.</p>
        <pre style="background:#fff; border:1px solid #ddd; padding:10px; border-radius:4px; font-family:monospace;">${bankDetails}</pre>
      </div>`
        : ""
    }

    <div style="text-align: center; margin: 30px 0;">
      <a href="https://elvynstore.com" style="background-color: #ff6f61; color: white; text-decoration: none; padding: 12px 24px; border-radius: 4px; font-weight: bold;">Visit Store</a>
    </div>

    <p style="color: #888; font-size: 12px; text-align: center;">Team ELVYN</p>
  </div>
`;

const adminOrderTemplate = (
  orderId: string,
  form: any,
  items: any[],
  total: number,
  shippingFee: number,
  paymentMethod: string
) => `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 640px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
    <h2 style="color: #2c3e50;">New Order Placed</h2>
    <p>Order <strong>#${orderId}</strong> placed by <strong>${form.firstName} ${form.lastName}</strong></p>
    <p><strong>Phone:</strong> ${form.phone}</p>
    <p><strong>Email:</strong> ${form.email || "N/A"}</p>
    <p><strong>Address:</strong> ${form.address}, ${form.city}, ${form.district}</p>
    <p><strong>Notes:</strong> ${form.notes || "-"}</p>

    <table style="width:100%; border-collapse: collapse; margin: 20px 0;">
      <thead>
        <tr style="background-color:#f9f9f9;">
          <th style="padding:8px; border:1px solid #ddd;">Product</th>
          <th style="padding:8px; border:1px solid #ddd; text-align:center;">Variant</th>
          <th style="padding:8px; border:1px solid #ddd; text-align:center;">Qty</th>
          <th style="padding:8px; border:1px solid #ddd; text-align:right;">Price</th>
        </tr>
      </thead>
      <tbody>
        ${items
          .map(
            (it) => `
          <tr>
            <td style="padding:8px; border:1px solid #ddd;">${it.productName}</td>
            <td style="padding:8px; border:1px solid #ddd; text-align:center;">${it.variant?.variantName || "-"}</td>
            <td style="padding:8px; border:1px solid #ddd; text-align:center;">${it.quantity}</td>
            <td style="padding:8px; border:1px solid #ddd; text-align:right;">LKR ${it.price * it.quantity}</td>
          </tr>`
          )
          .join("")}
      </tbody>
    </table>

    <p><strong>Total:</strong> LKR ${total + shippingFee}</p>
    <p><strong>Payment:</strong> ${paymentMethod}</p>
  </div>
`;

// ------------------ MAIN HANDLER ------------------ //
export async function POST(req: Request) {
  try {
    if (!process.env.SANITY_API_TOKEN)
      return NextResponse.json({ error: "Missing SANITY_API_TOKEN" }, { status: 500 });

    const body = await req.json();
    const { form, items, total, shippingCost } = body;

    if (
      !form?.firstName ||
      !form?.lastName ||
      !form?.address ||
      !form?.district ||
      !form?.city ||
      !form?.phone ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const orderId = "ORD-" + Math.floor(100000 + Math.random() * 900000);

    // ✅ Duplicate check
    const recentOrder = await backendClient.fetch(
      `*[_type == "order" && phone == $phone && total == $total && orderDate > $recent][0]`,
      {
        phone: form.phone,
        total,
        recent: new Date(Date.now() - 30 * 1000).toISOString(),
      }
    );
    if (recentOrder)
      return NextResponse.json({ error: "Duplicate order detected" }, { status: 429 });

    // ✅ Fetch fresh product data
    const productIds = items.map((it: any) => it.product._id);
    const freshProducts = await backendClient.fetch(
      `*[_type == "product" && _id in $ids]{
        _id, _rev, name,
        variants[] {
          _key, variantName, openingStock, stockOut,
          "availableStock": openingStock - coalesce(stockOut, 0),
          images
        }
      }`,
      { ids: productIds }
    );

    // ✅ Validate stock
    for (const it of items) {
      const fresh = freshProducts.find((p: any) => p._id === it.product._id);
      if (!fresh)
        return NextResponse.json({ error: `Product not found: ${it.product?._id}` }, { status: 404 });

    const variant =
  fresh.variants?.find((v: any) => v._key === it.variant?._key) ||
  fresh.variants?.[0]; // fallback to first variant

      if (!variant)
        return NextResponse.json({ error: `Variant missing for ${fresh.name}` }, { status: 400 });

      if (variant.availableStock < it.quantity)
        return NextResponse.json(
          { error: `Insufficient stock for ${fresh.name} (${variant.variantName})` },
          { status: 409 }
        );

      it.product._rev = fresh._rev;
    }

    // ✅ Construct order doc
    const order = {
  _type: "order",
  orderNumber: orderId,
  status: "pending",
  orderDate: new Date().toISOString(),
  customerName: `${form.firstName} ${form.lastName}`,
  phone: form.phone,
  email: form.email || "",
  address: {
    district: form.district,
    city: form.city,
    line1: form.address,
    notes: form.notes || "",
  },
  paymentMethod: form.payment || "COD",
  items: items.map((it: any) => {
    const fresh = freshProducts.find((p: any) => p._id === it.product._id);
    const matchedVariant = fresh?.variants?.find((v: any) => v._key === it.variant?._key);

    return {
      _type: "orderItem",
      _key: uuidv4(),
      product: { _type: "reference", _ref: it.product._id },
      variant: {
        variantKey: matchedVariant?._key || it.variant?._key,
        variantName: matchedVariant?.variantName || it.variant?.variantName || "",
      },
      quantity: it.quantity,
    price: it.finalPrice ?? it.product?.finalPrice ?? it.product?.price ?? 0,

      productName: fresh?.name || "Unknown",
      productImage:
        matchedVariant?.images?.[0]
          ? { _type: "image", asset: { _type: "reference", _ref: matchedVariant.images[0].asset._ref } }
          : undefined,
    };
  }),
  subtotal: items.reduce(
  (acc: number, it: any) =>
    acc + (it.finalPrice ?? it.product?.finalPrice ?? it.product?.price ?? 0) * it.quantity,
  0
),

  shippingCost: shippingCost ?? 0,
  total,
};


    // ✅ Transaction — Create order + update stock
    const tx = backendClient.transaction().create(order);
items.forEach((it: any) => {
  const variantKey = it.variant?._key; // ✅ correct field
  if (!variantKey) throw new Error("Variant key missing for stock update");

  tx.patch(it.product._id, (p) =>
    p
      .inc({ [`variants[_key=="${variantKey}"].stockOut`]: it.quantity })
      .ifRevisionId(it.product._rev)
  );
});


    await tx.commit();

    // ✅ Send confirmation emails asynchronously
    if (form.email) {
      sendSubscribeEmail({
        to: form.email,
        subject: `Your Elvyn Order ${orderId}`,
        html: customerOrderTemplate(
          form.firstName,
          orderId,
          order.items,
          order.subtotal,
          order.shippingCost,
          order.paymentMethod
        ),
      }).catch(console.error);
    }
    sendSubscribeEmail({
      to: "mnanajman@gmail.com",
      subject: `New Order ${orderId} Placed`,
      html: adminOrderTemplate(
        orderId,
        form,
        order.items,
        order.subtotal,
        order.shippingCost,
        order.paymentMethod
      ),
    }).catch(console.error);

    return NextResponse.json({ message: "Order placed successfully", orderId }, { status: 200 });
  } catch (err) {
    console.error("Checkout API Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
