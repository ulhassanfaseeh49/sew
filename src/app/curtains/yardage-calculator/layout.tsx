import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Curtain Yardage Calculator — How Much Fabric for Curtains [Free Tool]",
    description:
        "Free curtain yardage calculator. Enter window size, fullness, header style, hem, and pattern repeat to get exact fabric yardage. Supports rod pocket, pinch pleat, eyelet, tab top, and more.",
    keywords: [
        "curtain yardage calculator",
        "how much fabric for curtains",
        "curtain fabric calculator",
        "curtain fullness calculator",
        "pinch pleat curtain fabric",
        "rod pocket curtain yardage",
        "curtain hem allowance",
        "pattern repeat curtain calculator",
    ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
