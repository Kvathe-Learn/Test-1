import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import AuthProvider from "@/components/layout/AuthProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "CONTENTFORGE — AI Content Studio",
  description: "Forge bold content with AI. Text. Images. No limits.",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-forge-black text-forge-white font-body antialiased">
        <AuthProvider>
          {/* Film grain overlay */}
          <div className="grain-overlay" aria-hidden="true" />
          
          {children}
          
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "#1A1A1A",
                color: "#F5F5F0",
                border: "1px solid #2A2A2A",
                fontFamily: "DM Sans, sans-serif",
                fontSize: "14px",
              },
              success: {
                iconTheme: {
                  primary: "#FF4D00",
                  secondary: "#0A0A0A",
                },
              },
              error: {
                iconTheme: {
                  primary: "#FF3333",
                  secondary: "#0A0A0A",
                },
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
