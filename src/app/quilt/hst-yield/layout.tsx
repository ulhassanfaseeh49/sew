import type { Metadata } from "next";

export const metadata: Metadata = {
    title:
        "HST Yield Calculator — How Many Half-Square Triangles From Your Fabric?",
    description:
        "Free HST yield calculator. Find out how many half-square triangles you can make from any fabric amount — fat quarters, charm squares, layer cakes, or yardage. Compare yield across all HST methods.",
    keywords: [
        "HST yield calculator",
        "how many HSTs from a fat quarter",
        "half square triangle yield calculator",
        "how many HSTs from charm squares",
        "HST fabric yield",
        "how many half square triangles from one yard",
        "fat quarter HST calculator",
        "charm pack HST yield",
        "layer cake HST calculator",
    ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
