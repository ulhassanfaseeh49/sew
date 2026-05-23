import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Jelly Roll Project Calculator — What Can You Make From a Jelly Roll? | SewTools",
    description:
        "Free jelly roll calculator. Find out what quilt projects you can make from any number of jelly rolls. Calculate layout sizes, nine-patch blocks, log cabin blocks, binding, and background fabric needs.",
    keywords: [
        "jelly roll calculator",
        "what can I make with a jelly roll",
        "how many jelly rolls for a quilt",
        "jelly roll race quilt calculator",
        "jelly roll nine patch calculator",
        "jelly roll quilt size calculator",
        "how many jelly rolls for a throw quilt",
        "jelly roll binding calculator",
    ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
