import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Snowball Block Calculator — Corner Square Size for Snowball Quilts",
    description:
        "Free snowball block calculator. Calculate corner square sizes for snowball quilt blocks, plan snowball and nine-patch quilts, and get complete yardage. Includes secondary pattern preview and waste triangle calculator.",
    keywords: [
        "snowball quilt block calculator",
        "snowball block corner size calculator",
        "what size corners for snowball block",
        "snowball and nine patch quilt calculator",
        "snowball quilt block yardage",
        "how to make snowball quilt blocks",
        "snowball block cutting size",
        "snowball nine patch quilt planner",
    ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
