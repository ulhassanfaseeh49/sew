import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: {
    default: "SewTools — Free Sewing Calculators & Tools",
    template: "%s | SewTools"
  },
  description: "484+ free sewing calculators and tools for quilters, garment sewists, home decorators, and crafters. Yardage calculators, measurement converters, cost estimators, and more.",
  keywords: ["sewing calculator", "fabric yardage calculator", "quilt calculator", "sewing tools", "measurement converter"],
  authors: [{ name: "SewTools" }],
  openGraph: {
    title: "SewTools — Free Sewing Calculators & Tools",
    description: "484+ free sewing calculators and tools for quilters, garment sewists, home decorators, and crafters.",
    type: "website",
    locale: "en_US",
    siteName: "SewTools",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
