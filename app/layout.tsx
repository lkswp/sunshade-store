import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sunshade",
  description: "Official store for Sunshade Minecraft Server",
  icons: {
    icon: "/logo.png",
  },
};

import { LanguageProvider } from "@/lib/i18n";
import { Toaster } from "sonner";
import { CartProvider } from "@/lib/cart-context";
import AnalyticsTracker from "@/components/analytics-tracker";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LanguageProvider>
          <CartProvider>
            <AnalyticsTracker />
            {children}
            <Toaster position="bottom-right" theme="dark" richColors closeButton />
          </CartProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
