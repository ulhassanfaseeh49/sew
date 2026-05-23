import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Full Circle Skirt Calculator — Radius, Yardage & Cutting Diagram",
    description:
        "Calculate your circle skirt radius, yardage, and cutting measurements instantly. Includes visual cutting diagram, fabric width problem detection, step-by-step instructions, and reference chart. Free.",
    keywords: [
        "full circle skirt calculator",
        "circle skirt radius calculator",
        "circle skirt yardage",
        "how much fabric for circle skirt",
        "circle skirt formula",
        "circle skirt cutting diagram",
        "circle skirt fabric calculator",
        "how to cut a circle skirt",
        "circle skirt hem circumference",
    ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
