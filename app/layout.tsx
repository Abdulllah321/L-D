import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Sora } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/toast";
import { CatalogProvider } from "@/context/CatalogContext";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import { Suspense } from "react";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const sora = Sora({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Learning and Development",
  description: "Open learning discovery platform for role-based pathways, skill development, and career advancement.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${plusJakartaSans.variable} ${sora.variable} font-sans antialiased`}
      >
        <Suspense fallback={null}>
          <AnalyticsTracker />
        </Suspense>
        <CatalogProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </CatalogProvider>
      </body>
    </html>
  );
}
