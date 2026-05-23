import type { Metadata } from "next";

export const metadata: Metadata = {
    title:
        "Hexagon Size Calculator (EPP) — Dimensions, Templates & Yardage for English Paper Piecing",
    description:
        "Free hexagon EPP calculator. Calculate hexagon dimensions (width, height, fabric cut size), plan Grandmother's Flower Garden quilts, and calculate yardage for any EPP project.",
    keywords: [
        "hexagon EPP calculator",
        "English paper piecing hexagon size",
        "what size is a 1 inch hexagon",
        "hexagon quilt calculator",
        "grandmother's flower garden quilt calculator",
        "hexagon dimensions calculator",
        "EPP hexagon template size",
        "how many hexagons for a quilt",
        "hexagon fabric cut size calculator",
        "EPP fabric yardage calculator",
    ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
