import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Standard Quilt Size Chart — All Bed Sizes, Drop Lengths & Batting Sizes [Free Calculator]",
    description:
        "Complete quilt size reference guide. Find the right quilt size for any bed including US, UK, European, and Australian mattress sizes. Includes drop length calculator, batting size chart, and baby quilt sizes.",
    keywords: [
        "standard quilt sizes",
        "quilt size chart",
        "what size quilt for queen bed",
        "quilt size guide",
        "how big should a quilt be",
        "quilt drop length guide",
        "baby quilt size guide",
        "what size batting for queen quilt",
        "UK quilt sizes",
        "quilt sizes for beds chart",
    ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
