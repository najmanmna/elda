import { NextResponse } from "next/server";

/**
 * Checkout API Route
 *
 * This API endpoint handles order placement for the ecommerce store. It receives checkout data from the client,
 * validates input, checks product stock, creates an order in Sanity CMS, updates inventory, and sends email notifications
 * to both the customer and admin. Key features include:
 *
 * - Validates required fields and prevents duplicate orders within a short time window.
 * - Fetches latest product and variant data from Sanity to ensure accurate stock checks.
 * - Uses Sanity transactions to atomically create the order and update stock quantities.
 * - Sends confirmation emails to the customer and notification emails to the admin.
 * - Returns appropriate HTTP status codes and error messages for validation, stock, and server errors.
 *
 * Usage:
 * - POST request with JSON body containing form data, cart items, total, and shipping cost.
 * - On success, returns order ID and payment method; on error, returns a descriptive message.
 *
 * Dependencies:
 * - Next.js API routes, Sanity backend client, uuid, custom email sender, environment variables for API token.
 */
import { backendClient } from "@/sanity/lib/backendClient";
import { v4 as uuidv4 } from "uuid";
import { sendSubscribeEmail } from "@/lib/sendSubscribeEmail";
export const runtime = "nodejs";

// Shared bank details
const bankDetails = `M.J.M IFHAM
0110290723001
Amana Bank Dehiwala`;

// Customer email template
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
          <th style="padding:8px; border:1px solid #ddd; text-align:left;">Product</th>
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
            <td style="padding:8px; border:1px solid #ddd; text-align:center;">${it.variant?.color || "-"}</td>
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
        <pre style="background:#fff; border:1px solid #ddd; padding:10px; border-radius:4px; font-family:monospace; white-space:pre-wrap;">${bankDetails}</pre>
      </div>`
        : ""
    }

    <div style="text-align: center; margin: 30px 0;">
      <a href="https://elvynstore.com" style="background-color: #ff6f61; color: white; text-decoration: none; padding: 12px 24px; border-radius: 4px; font-weight: bold;">Visit Store</a>
    </div>

    <p style="color: #888; font-size: 12px; text-align: center;">Team ELVYN</p>
  </div>
`;

// Admin email template
const adminOrderTemplate = (
  orderId: string,
  form: any,
  items: any[],
  total: number,
  shippingFee: number,
  paymentMethod: string,
  notes: string = ""
) => `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 640px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
    <h2 style="color: #2c3e50;">New Order Placed</h2>
    <p>Order <strong>#${orderId}</strong> has been placed by <strong>${form.firstName} ${form.lastName}</strong></p>
    <p><strong>Phone:</strong> ${form.phone}</p>
    <p><strong>Email:</strong> ${form.email || "N/A"}</p>
    <p><strong>Address:</strong> ${form.address}, ${form.city}, ${form.district}</p>
    <p><strong>Notes:</strong> ${form.notes}</p>

    <table style="width:100%; border-collapse: collapse; margin: 20px 0;">
      <thead>
        <tr style="background-color:#f9f9f9;">
          <th style="padding:8px; border:1px solid #ddd; text-align:left;">Product</th>
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
            <td style="padding:8px; border:1px solid #ddd; text-align:center;">${it.variant?.color || "-"}</td>
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

    <br>
    <p style="color: #888; font-size: 12px;">Elvyn Store Notification System</p>
  </div>
`;


export async function POST(req: Request) {
  try {
    // ✅ Token check
    if (!process.env.SANITY_API_TOKEN) {
      console.error("❌ Missing SANITY_API_TOKEN");
      return NextResponse.json(
        { error: "Server misconfiguration" },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { form, items, total, shippingCost } = body;

    // ✅ Validate required fields
    if (
      !form?.firstName ||
      !form?.lastName ||
      !form?.address ||
      !form?.district ||
      !form?.city ||
      !form?.phone ||
      !Array.isArray(items) ||
      items.length === 0 ||
      typeof total !== "number"
    ) {
      return NextResponse.json(
        { error: "Missing required checkout fields" },
        { status: 400 }
      );
    }

    // ✅ Generate readable orderId
    const orderId = "ORD-" + Math.floor(100000 + Math.random() * 900000);

    // ✅ Prevent duplicates within 30s (optional)
    const existing = await backendClient.fetch(
      `*[_type == "order" && phone == $phone && total == $total && orderDate > $recent][0]`,
      {
        phone: form.phone,
        total,
        recent: new Date(Date.now() - 1000 * 30).toISOString(),
      }
    );

    if (existing) {
      return NextResponse.json(
        { error: "Duplicate order detected. Please wait a moment." },
        { status: 429 }
      );
    }

    // ✅ Fetch latest product data from Sanity
    const productIds = items.map((it: any) => it.product._id);
const freshProducts = await backendClient.fetch(
  `*[_type=="product" && _id in $ids]{
    _id,
    _rev,
    name,
    images, // ✅ top-level fallback images
    variants[] {
      _key,
      color,
      openingStock,
      stockOut,
      "availableStock": openingStock - coalesce(stockOut, 0), // ✅ always compute live
      images // ✅ include variant images
    }
  }`,
  { ids: productIds }
);

    // ✅ Check stock against cart
    for (const it of items) {
      const fresh = freshProducts.find((p: any) => p._id === it.product._id);
      if (!fresh) {
        return NextResponse.json(
          { error: `Product not found: ${it.product?._id}` },
          { status: 404 }
        );
      }

      const variant = fresh.variants?.find((v: any) => v._key === it.variant?._key);
      if (!variant) {
        return NextResponse.json(
          { error: `Variant not found for ${fresh.name}` },
          { status: 400 }
        );
      }

      if (variant.availableStock < it.quantity) {
        return NextResponse.json(
          {
            error: `Insufficient stock for ${fresh.name} (${it.variant?.color || ""}). Only ${variant.availableStock} left.`,
          },
          { status: 409 }
        );
      }

      // ✅ attach latest _rev to cart item (for ifRevisionId)
      it.product._rev = fresh._rev;
    }

    // ✅ Build order object
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

  const matchedVariant = fresh?.variants?.find(
    (v: any) => v._key === it.variant?._key
  );

  return {
    _type: "orderItem",
    _key: uuidv4(),
    product: { _type: "reference", _ref: it.product._id },

    variant: {
      variantKey: matchedVariant?._key || it.variant?._key,
      color: matchedVariant?.color || it.variant?.color || "",
    },

    quantity: it.quantity,
    price: it.product.price ?? 0,

    productName: fresh?.name || "Unknown",

    // ✅ Snapshot image always: variant > product > none
    productImage:
      matchedVariant?.images?.[0] ||
      fresh?.images?.[0] ||
      undefined,
  };
}),




      subtotal: items.reduce(
        (acc: number, it: any) =>
          acc + (it.product.price ?? 0) * it.quantity,
        0
      ),
      shippingCost: shippingCost ?? 0,
      total,
    };

    // ✅ Use transaction: create order + reduce stock atomically
    const tx = backendClient.transaction();

    // Create order doc
    tx.create(order);

    // Reduce stock for each product (with revision check)
items.forEach((it: any) => {
  if (it.product?._id && it.variant?._key && typeof it.quantity === "number") {
    tx.patch(it.product._id, (p) =>
      p
        .inc({
          [`variants[_key=="${it.variant._key}"].stockOut`]: it.quantity, // ✅ add to stockOut
        })
        .ifRevisionId(it.product._rev) // ✅ optimistic concurrency check
    );
  }
});


    // ✅ Commit transaction and check result
    const result = await tx.commit();

    if (!result || !result.results?.length) {
      console.error("❌ Transaction failed:", result);
      return NextResponse.json(
        { error: "Order could not be processed. Please try again." },
        { status: 500 }
      );
    }
// ✅ Send emails (async, don't block the response)
try {
  // Customer email
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

    }).catch((err) => console.error("Customer email failed:", err));
  }

  // Admin email
  sendSubscribeEmail({
    to: "info@elvynstore.com",
    subject: `New Order ${orderId} Placed`,
   html: adminOrderTemplate(
  orderId,
  form,
  order.items,
  order.subtotal,
  order.shippingCost,
  order.paymentMethod
),

  }).catch((err) => console.error("Admin email failed:", err));
} catch (err) {
  console.error("Email notification error:", err);
}

    return NextResponse.json(
      {
        message: "Order placed successfully!",
        orderId,
        payment: form.payment,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("❌ Checkout API error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
