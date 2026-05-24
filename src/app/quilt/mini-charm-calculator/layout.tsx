import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Mini Charm Pack Calculator — What Can You Make From 2.5\" Squares?",
    description:
        "Free mini charm pack calculator. Find out what projects you can make from mini charm packs (2.5\" squares). Calculate doll quilts, mug rugs, four-patch blocks, cornerstones, and how many packs you need.",
    keywords: [
        "mini charm pack calculator",
        "what to make with mini charm pack",
        "2.5 inch square quilt calculator",
        "mini charm doll quilt calculator",
        "candy squares quilt calculator",
        "mini charm cornerstone calculator",
        "mug rug mini charm calculator",
        "how many mini charm packs for a quilt",
    ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
