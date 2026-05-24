import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Quilt Setting Triangle Calculator — Side & Corner Triangle Sizes for On-Point Quilts",
    description:
        "Free setting triangle calculator for on-point quilts. Calculate exact square sizes for side and corner setting triangles, get piece counts and yardage, and learn why cutting method matters for straight quilt edges.",
    keywords: [
        "quilt setting triangle calculator",
        "on-point quilt triangle sizes",
        "setting triangle size calculator",
        "side setting triangle formula",
        "corner setting triangle formula",
        "on-point quilt calculator",
        "quarter square triangle setting",
        "how to calculate setting triangles",
        "diagonal quilt setting triangle size",
    ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
