import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Binding Strip Length Calculator — How Much Binding Do I Need? Total Length for Any Quilt",
    description:
        "Free binding strip length calculator. Calculate the total binding length needed for any quilt shape — rectangle, hexagon, circle, or irregular. Includes corner mitering, joining overlap, safety margin, and multi-unit results.",
    keywords: [
        "binding strip length calculator",
        "how much binding do I need",
        "quilt binding length",
        "quilt perimeter binding",
        "total binding strip length",
        "binding for hexagon quilt",
        "binding for round quilt",
    ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
