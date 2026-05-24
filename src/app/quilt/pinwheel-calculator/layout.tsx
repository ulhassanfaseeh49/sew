import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Pinwheel Block Calculator — HST Sizes, Orientation Guide & Yardage",
    description:
        "Free pinwheel block calculator. Get exact HST cutting sizes, learn how to arrange HSTs so your pinwheel spins, master the twirl pressing technique, and calculate yardage for any number of pinwheel blocks.",
    keywords: [
        "pinwheel quilt block calculator",
        "how to make pinwheel quilt block",
        "pinwheel block HST size calculator",
        "how to arrange HSTs for pinwheel",
        "pinwheel block cutting sizes",
        "twirl technique quilting",
        "double pinwheel quilt block",
        "pinwheel block yardage calculator",
    ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
