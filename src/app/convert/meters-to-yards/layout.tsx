import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Meters to Yards Converter for Fabric & Sewing — Fraction Display & Buy Amounts",
    description:
        "Convert meters to yards for fabric with sewing fraction display, European & Japanese pattern presets, and a buy-this-much recommendation. Free tool built for sewists.",
    keywords: [
        "meters to yards converter",
        "convert meters to yards fabric",
        "fabric meters to yards",
        "sewing pattern meters to yards",
        "how many yards in a meter",
        "burda pattern meters to yards",
        "japanese sewing pattern fabric conversion",
        "meters to yards for sewing",
    ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
