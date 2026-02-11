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
  title: "Sunshade | A Aventura Espera",
  description: "Junte-se à melhor experiência de Minecraft. Encantamentos personalizados, biomas únicos e uma comunidade que parece casa.",
  icons: {
    icon: "/logo.png",
  },
  openGraph: {
    title: "Sunshade | A Aventura Espera",
    description: "Junte-se à melhor experiência de Minecraft. Encantamentos personalizados, biomas únicos e uma comunidade que parece casa.",
    url: "https://sunshade.com.br",
    siteName: "Sunshade Store",
    images: [
      {
        url: "/hero-bg.png", // Assuming this image exists and is suitable
        width: 1200,
        height: 630,
        alt: "Sunshade Minecraft Server",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sunshade | A Aventura Espera",
    description: "Junte-se à melhor experiência de Minecraft. Encantamentos personalizados, biomas únicos e uma comunidade que parece casa.",
    images: ["/hero-bg.png"],
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
