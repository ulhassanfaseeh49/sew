import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Blocks Needed for Quilt Size Calculator — How Many Quilt Blocks Do I Need?",
    description:
        "Free calculator: enter your target quilt size and block size to find exactly how many blocks you need. Includes sashing, borders, multiple layout options, and standard bed size presets.",
    keywords: [
        "how many quilt blocks do I need",
        "quilt blocks needed calculator",
        "how many 12 inch blocks for a queen quilt",
        "how many blocks for a throw quilt",
        "quilt block count calculator",
        "resize quilt pattern calculator",
        "quilt layout calculator",
    ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
