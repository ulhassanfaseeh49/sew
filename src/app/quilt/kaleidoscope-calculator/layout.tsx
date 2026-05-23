import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Kaleidoscope Block Calculator — Wedge Sizes, Repeat Matching & Yardage | SewTools",
    description:
        "Free kaleidoscope quilt block calculator. Calculate wedge dimensions and angles for 6, 8, 12, or 16-wedge kaleidoscopes. Includes fabric repeat yardage calculation, template dimensions, and Tumbling Blocks calculator.",
    keywords: [
        "kaleidoscope quilt block calculator",
        "kaleidoscope wedge size calculator",
        "how to cut kaleidoscope quilt wedges",
        "kaleidoscope quilt fabric repeat calculator",
        "8 wedge kaleidoscope calculator",
        "tumbling blocks quilt calculator",
        "kaleidoscope quilt yardage calculator",
        "60 degree kaleidoscope calculator",
        "kaleidoscope quilt template size",
    ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
