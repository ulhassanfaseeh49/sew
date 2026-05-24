import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Star Block Calculator — Ohio Star, Sawtooth Star & LeMoyne Star Cutting Sizes",
    description:
        "Free star block calculator. Get exact cutting sizes for Ohio Star, Sawtooth Star, LeMoyne Star, Lone Star, and more. Includes Y-seam guide, star point troubleshooting, and complete yardage calculator.",
    keywords: [
        "star block calculator quilting",
        "Ohio star block calculator",
        "sawtooth star quilt block calculator",
        "LeMoyne star quilt block",
        "how to make Ohio star quilt block",
        "star quilt block cutting sizes",
        "eight pointed star quilt calculator",
        "lone star quilt calculator",
        "quilt star block yardage calculator",
        "star point alignment quilting",
    ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
