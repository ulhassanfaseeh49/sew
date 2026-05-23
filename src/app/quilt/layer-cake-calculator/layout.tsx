import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Layer Cake Project Calculator — What Can You Make From a Layer Cake? | SewTools",
    description:
        "Free layer cake calculator. Discover what quilt projects you can make from any number of layer cakes. Calculate sizes, sub-cutting to charm squares, HSTs, disappearing patterns, and background fabric needs.",
    keywords: [
        "layer cake calculator quilting",
        "what can I make with a layer cake",
        "how many layer cakes for a quilt",
        "layer cake quilt size calculator",
        "layer cake charm square conversion",
        "disappearing nine patch layer cake",
        "layer cake HST calculator",
        "how many layer cakes for queen quilt",
    ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
