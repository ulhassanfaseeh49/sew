import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Cornerstone Calculator — How Many Cornerstones Does Your Quilt Need?",
    description:
        "Free quilt cornerstone calculator. Calculate exactly how many cornerstone squares your quilt needs, what size to cut them, and how much fabric to buy. Includes pieced cornerstones, pinwheels, HSTs, and scrappy cornerstones.",
    keywords: [
        "quilt cornerstone calculator",
        "how many cornerstones for a quilt",
        "cornerstone quilt block calculator",
        "sashing cornerstone calculator",
        "pieced cornerstone calculator",
        "pinwheel cornerstone quilt",
    ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
