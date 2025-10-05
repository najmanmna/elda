// src/sanity/tools/ordersSummaryTool.tsx
import React, { useEffect, useState } from "react";
import { definePlugin } from "sanity";
import { useClient } from "sanity";

export const ordersSummaryTool = definePlugin({
  name: "orders-summary",
  tools: [
    {
      name: "orders-summary",
      title: "Orders Summary",
      component: OrdersSummary,
    },
  ],
});

interface OrderItem {
  productName: string;
  variant?: { color?: string };
  quantity?: number;
  price?: number;
}

interface Order {
  _id: string;
  orderNumber: string;
  customerName: string;
  status?: string;
  total?: number;
  orderDate?: string;
  items?: OrderItem[];
}

function OrdersSummary() {
  const client = useClient({ apiVersion: "2025-01-01" });
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    client
      .fetch(
        `*[_type == "order"]{
          _id,
          orderNumber,
          customerName,
          status,
          total,
          orderDate,
          items[]{
            productName,
            quantity,
            price,
            variant
          }
        } | order(orderDate desc)`
      )
      .then(setOrders)
      .catch(console.error);
  }, [client]);

  const filteredOrders = orders
    .filter((o) =>
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.orderNumber.toLowerCase().includes(search.toLowerCase())
    )
    .filter((o) => !filterStatus || o.status === filterStatus);

  // High-contrast colors that work in both light/dark
  const statusColors: Record<string, string> = {
    pending: "#FFF59D",     // soft yellow
    processing: "#90CAF9",  // light blue
    shipped: "#A5D6A7",     // light green
    delivered: "#66BB6A",   // stronger green
    cancelled: "#EF9A9A",   // soft red
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ fontSize: "22px", marginBottom: "20px" }}>📝 Orders Summary</h1>

      <div style={{ marginBottom: "15px", display: "flex", gap: "10px", alignItems: "center" }}>
        <input
          type="text"
          placeholder="Search by order # or customer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: "6px", flex: 1 }}
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{ padding: "6px" }}
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={thStyle}>Order #</th>
            <th style={thStyle}>Customer</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Total</th>
            <th style={thStyle}>Date</th>
            <th style={thStyle}>Items</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((o) => (
            <tr
              key={o._id}
              style={{
                background: statusColors[o.status || ""] || "transparent",
              }}
            >
              <td style={tdStyle}>{o.orderNumber}</td>
              <td style={tdStyle}>{o.customerName}</td>
              <td style={tdStyle}>{o.status}</td>
              <td style={tdStyle}>Rs. {o.total ?? 0}</td>
              <td style={tdStyle}>
                {o.orderDate ? new Date(o.orderDate).toLocaleString() : "—"}
              </td>
              <td style={tdStyle}>
                {o.items?.map((item, idx) => (
                  <div key={idx}>
                    {item.quantity} × {item.productName}{" "}
                    {item.variant?.color ? `(${item.variant.color})` : ""}
                  </div>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const thStyle = {
  border: "1px solid #ddd",
  padding: "8px",
  background: "#f3f3f3",
  textAlign: "left" as const,
};

const tdStyle = {
  border: "1px solid #ddd",
  padding: "8px",
};
