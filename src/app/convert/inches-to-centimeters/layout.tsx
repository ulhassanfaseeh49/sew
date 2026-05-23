import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Inches to Centimeters Converter for Sewing & Fabric | SewTools",
    description:
        "Convert inches to cm for sewing — including fractions like 5/8\", 1/4\", and 3/8\". Seam allowance presets, body measurements, fabric widths, and practical rounding. Free.",
    keywords: [
        "inches to centimeters",
        "inches to cm",
        "convert inches to cm",
        "5/8 inch in cm",
        "1/4 inch in cm",
        "seam allowance inches to cm",
        "fabric measurement inches to cm",
        "body measurements inches to cm",
        "sewing measurement converter",
    ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
