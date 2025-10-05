import React from "react";
import { urlFor } from "../lib/image"; // relative path inside sanity/

export function OrderSummaryView(props: any) {
  // Sanity passes {document} inside props
  const data = props?.document?.displayed;

  if (!data) {
    return <p style={{ padding: "1rem" }}>No order data available</p>;
  }

  return (
    <div
      style={{ padding: "1.5rem", fontFamily: "sans-serif", lineHeight: 1.5 }}
    >
      <h2 style={{ marginBottom: "0.5rem" }}>Order #{data.orderNumber}</h2>
      <p>
        <strong>Status:</strong> {data.status}
      </p>
      <p>
        <strong>Date:</strong>{" "}
        {data.orderDate ? new Date(data.orderDate).toLocaleString() : "—"}
      </p>

      <h3 style={{ marginTop: "1.5rem" }}>Customer</h3>
      <p>
        {data.customerName} — {data.phone}
      </p>
      <p>{data.email || "—"}</p>
      <p>
        {data.address?.line1}, {data.address?.city}, {data.address?.district}
      </p>

      {/* ✅ Notes Section */}
      {data.address?.notes && (
        <p style={{ marginTop: "0.5rem", fontStyle: "italic", color: "#ddd" }}>
          <strong>Notes:</strong> {data.address.notes}
        </p>
      )}

      <h3 style={{ marginTop: "1.5rem" }}>Items</h3>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "1rem",
          fontSize: "0.95rem",
        }}
      >
        <thead>
          <tr style={{ borderBottom: "2px solid #ddd" }}>
            <th align="left" style={{ padding: "8px" }}>
              Product
            </th>
            <th align="center" style={{ padding: "8px" }}>
              Qty
            </th>
            <th align="right" style={{ padding: "8px" }}>
              Unit Price
            </th>
            <th align="right" style={{ padding: "8px" }}>
              Total
            </th>
          </tr>
        </thead>
        <tbody>
          {data.items?.map((item: any, i: number) => (
            <tr key={i} style={{ borderBottom: "1px solid #f0f0f0" }}>
              <td
                style={{
                  padding: "8px",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                {item.productImage ? (
                  <img
                    src={urlFor(item.productImage).width(80).height(80).url()}
                    alt={item.productName}
                    style={{
                      width: "40px",
                      height: "40px",
                      objectFit: "cover",
                      borderRadius: "4px",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      background: "#eee",
                      borderRadius: "4px",
                    }}
                  />
                )}
                <div>
                  <strong>{item.productName || "Product"}</strong>
                  {item.variant?.color && (
                    <div style={{ fontSize: "0.8rem", color: "#666" }}>
                      {item.variant.color}
                    </div>
                  )}
                </div>
              </td>
              <td align="center" style={{ padding: "8px" }}>
                {item.quantity}
              </td>
              <td align="right" style={{ padding: "8px" }}>
                Rs. {item.price}
              </td>
              <td align="right" style={{ padding: "8px" }}>
                Rs. {item.price * item.quantity}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ✅ Totals + Payment Section */}
      <div style={{ marginTop: "1.5rem", textAlign: "right" }}>
        <p>
          <strong>Subtotal:</strong> Rs. {data.subtotal ?? 0}
        </p>
        <p>
          <strong>Shipping:</strong> Rs. {data.shippingCost ?? 0}
        </p>
        <h3>Total: Rs. {data.total}</h3>
        <p style={{ marginTop: "0.5rem" }}>
          <strong>Payment Method:</strong> {data.paymentMethod || "—"}
        </p>
      </div>
    </div>
  );
}
