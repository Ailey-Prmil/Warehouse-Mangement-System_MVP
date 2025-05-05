import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/hooks/useAuth";

export const metadata: Metadata = {
  title: "WMS Dashboard",
  description: "Manage stock, orders, and inventory in real time",
  generator: "Next.js",
};

export default function ApiDocLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <div className="flex h-screen">
            <main className="flex-1 overflow-auto bg-gray-50 p-8 ml-4">
              {children}
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
