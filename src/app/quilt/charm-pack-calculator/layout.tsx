import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Charm Pack Project Calculator — What Can You Make From a Charm Pack?",
    description:
        "Free charm pack calculator. Find out what quilt projects you can make from any number of charm packs. Calculate layout sizes, HSTs, background fabric needs, and how many packs you need for any quilt size.",
    keywords: [
        "charm pack calculator",
        "what can I make with a charm pack",
        "how many charm packs for a quilt",
        "charm pack quilt size calculator",
        "charm square project calculator",
        "charm pack baby quilt calculator",
        "charm pack HST calculator",
    ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
