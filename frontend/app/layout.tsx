import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "BizNest — Find Services & Businesses Near You",
    template: "%s | BizNest",
  },
  description:
    "Discover trusted service providers, local businesses, and products all in one place. Find electricians, plumbers, beauty salons, printing shops, and more.",
  keywords: [
    "local services",
    "businesses near me",
    "service providers",
    "marketplace",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
