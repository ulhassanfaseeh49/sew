import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Quilt Backing Yardage Calculator — How Much Backing Fabric Do I Need?",
    description:
        "Free quilt backing calculator. Enter your quilt size and fabric width to calculate exactly how much backing fabric to buy. Includes longarm overhang requirements, seam placement options, and wide fabric comparison.",
    keywords: [
        "quilt backing yardage calculator",
        "how much backing fabric for a quilt",
        "quilt backing calculator",
        "queen quilt backing yardage",
        "how much backing for longarm quilting",
        "wide backing fabric calculator",
        "quilt backing seam placement",
        "how to calculate quilt backing",
    ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
