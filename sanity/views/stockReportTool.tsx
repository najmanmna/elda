import React, { useEffect, useState } from "react";
import { definePlugin } from "sanity";
import { useClient } from "sanity";

export const stockReportTool = definePlugin({
  name: "stock-report",
  tools: [
    {
      name: "stock-report",
      title: "Stock Report",
      component: StockReport,
    },
  ],
});

function StockReport() {
  const client = useClient({ apiVersion: "2025-01-01" });
  const [products, setProducts] = useState<any[]>([]);
  const [filterOutOfStock, setFilterOutOfStock] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    client
      .fetch(
        `*[_type == "product"]{
          _id,
          name,
          variants[]{
            _key,
            colorName,
            openingStock,
            stockOut
          }
        }`
      )
      .then(setProducts);
  }, [client]);

  const filteredProducts = products
    .map((p) => ({
      ...p,
      variants: p.variants?.filter(
        (v: any) =>
          !filterOutOfStock || (v.openingStock || 0) - (v.stockOut || 0) <= 0
      ),
    }))
    .filter((p) => p.variants?.length > 0)
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  // Calculate totals
  const totals = filteredProducts.reduce(
    (acc, p) => {
      p.variants?.forEach((v: any) => {
        acc.openingStock += v.openingStock || 0;
        acc.stockOut += v.stockOut || 0;
        acc.available += (v.openingStock || 0) - (v.stockOut || 0);
      });
      return acc;
    },
    { openingStock: 0, stockOut: 0, available: 0 }
  );

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ fontSize: "22px", marginBottom: "20px" }}>📦 Stock Report</h1>

      <div
        style={{
          marginBottom: "15px",
          display: "flex",
          gap: "10px",
          alignItems: "center",
        }}
      >
        <input
          type="text"
          placeholder="Search product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: "6px", flex: 1 }}
        />
        <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <input
            type="checkbox"
            checked={filterOutOfStock}
            onChange={(e) => setFilterOutOfStock(e.target.checked)}
          />
          Show only out-of-stock
        </label>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={thStyle}>Product</th>
            <th style={thStyle}>Variant</th>
            <th style={thStyle}>Opening Stock</th>
            <th style={thStyle}>Stock Out</th>
            <th style={thStyle}>Available</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((p) =>
            p.variants?.map((v: any) => {
              const available = (v.openingStock || 0) - (v.stockOut || 0);
              return (
                <tr
                  key={v._key}
                  style={{ background: available <= 0 ? "#EF9A9A" : "transparent" }}
                >
                  <td style={tdStyle}>{p.name}</td>
                  <td style={tdStyle}>{v.colorName}</td>
                  <td style={tdStyle}>{v.openingStock || 0}</td>
                  <td style={tdStyle}>{v.stockOut || 0}</td>
                  <td style={tdStyle}>{available}</td>
                </tr>
              );
            })
          )}

          {/* Totals row */}
          <tr style={{ fontWeight: "bold", background: "" }}>
            <td style={tdStyle} colSpan={2}>
              Total
            </td>
            <td style={tdStyle}>{totals.openingStock}</td>
            <td style={tdStyle}>{totals.stockOut}</td>
            <td style={tdStyle}>{totals.available}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}


const thStyle = {
  border: "1px solid #dd",
  padding: "8px",
  background: "#f3f3f",
  textAlign: "left" as const,
};

const tdStyle = {
  border: "1px solid #ddd",
  padding: "8px",
};
