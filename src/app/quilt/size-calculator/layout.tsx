import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Quilt Size Calculator — Calculate Finished Quilt Dimensions with Blocks, Sashing & Borders",
    description:
        "Free quilt size calculator. Enter your block size, block count, sashing width, and border widths to instantly calculate your finished quilt dimensions. Compare to standard bed sizes.",
    keywords: [
        "quilt size calculator",
        "finished quilt size calculator",
        "how big will my quilt be",
        "quilt blocks sashing border calculator",
        "quilt dimension calculator",
        "how many quilt blocks for a queen size quilt",
        "calculate quilt size with sashing",
    ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
