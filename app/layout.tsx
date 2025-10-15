import React from "react";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { SanityLive } from "@/sanity/lib/live";
import { Toaster } from "react-hot-toast";
import WhatsAppButton from "@/components/WhatsAppButton";

import "./globals.css";

// Import Google Font (Poppins) with multiple weights
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s - ELDA",
    default: "ELDA",
  },
  description: "ELDA | HOUSE OF BLOCK PRINTS",
  icons: {
    icon: "/favicon.jpg",
    shortcut: "/favicon.jpg",
    apple: "/favicon.jpg",
  },
};

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    
    <html lang="en">
       
      <body className={`${poppins.variable} pt-25 antialiased bg-tech_bg_color relative`}>
       
        {/* Background layer */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/bg-pattern.png')",
            backgroundRepeat: "repeat",
            backgroundSize: "30%",
            backgroundAttachment: "fixed",
            opacity: 0.05, // 5% opacity
          }}
        ></div>

        {/* Content layer */}
        <div className="relative z-10">
          {children}

          {/* Toaster */}
         <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: "12px",
            background: "#333",
            color: "#fff",
            padding: "16px",
            fontWeight: "500",
          },
          success: {
            iconTheme: {
              primary: "#22c55e",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />

          {/* Sanity Live */}
          <SanityLive />

          {/* Floating WhatsApp Button */}
          {/* <WhatsAppButton /> */}
        </div>
      </body>
    </html>
  );
};

export default RootLayout;
