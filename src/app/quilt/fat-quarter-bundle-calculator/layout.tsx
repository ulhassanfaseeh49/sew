import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Fat Quarter Bundle Calculator — Blocks, Yardage & Project Planning",
    description:
        "Free fat quarter bundle calculator. Calculate how many blocks you can cut, what size quilts you can make, and how much background fabric you need from any size fat quarter bundle.",
    keywords: [
        "fat quarter bundle calculator",
        "how many blocks from a fat quarter",
        "fat quarter quilt size calculator",
        "what can I make with fat quarters",
        "how many fat quarters for a throw quilt",
        "fat quarter bundle project calculator",
        "how many fat quarters for queen quilt",
    ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
