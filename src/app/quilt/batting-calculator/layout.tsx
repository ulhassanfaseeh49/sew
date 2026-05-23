import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Quilt Batting Size Calculator — What Size and Type of Batting Do I Need?",
    description:
        "Free quilt batting calculator. Find the exact batting size needed for your quilt, compare pre-cut batting packages, get batting type recommendations for machine quilting, hand quilting, or longarm quilting.",
    keywords: [
        "quilt batting size calculator",
        "what size batting for queen quilt",
        "how much batting do I need",
        "best batting for machine quilting",
        "cotton vs polyester batting",
        "longarm batting requirements",
        "pre-cut batting sizes",
    ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
