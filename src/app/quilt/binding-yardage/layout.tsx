import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Binding Yardage Calculator — How Much Fabric to Buy for Quilt Binding",
    description:
        "Free binding yardage calculator. Enter your binding length to get exact fabric yardage, number of strips to cut, and a shopping list. Works for scrappy binding, fat quarters, jelly rolls, and pre-cut fabrics.",
    keywords: [
        "quilt binding yardage calculator",
        "how much fabric for quilt binding",
        "binding fabric yardage",
        "how many binding strips from one yard",
        "fat quarter binding calculator",
        "jelly roll binding calculator",
        "scrappy binding yardage",
    ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
