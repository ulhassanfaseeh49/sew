import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Turnover & Triangle Pre-Cut Calculator — HSTs, Pinwheels & Pyramid Quilts",
    description:
        "Free turnover and triangle pre-cut calculator. Calculate HSTs, pinwheels, and hourglass blocks from turnover pre-cuts. Includes equilateral triangle calculator for thousand pyramids quilts and complete project planning.",
    keywords: [
        "turnover pre-cut calculator",
        "triangle pre-cut quilt calculator",
        "what to make with turnovers quilting",
        "turnover HST calculator",
        "how many turnover packs for a quilt",
        "thousand pyramids quilt calculator",
        "equilateral triangle quilt calculator",
        "pre-cut triangle quilt projects",
    ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
