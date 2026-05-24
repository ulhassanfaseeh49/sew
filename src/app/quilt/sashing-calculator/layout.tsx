import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Quilt Sashing Calculator — Yardage, Strip Count & Cutting Dimensions",
    description:
        "Free quilt sashing calculator. Calculate sashing yardage, number of strips to cut, cornerstone count, and cutting dimensions for any quilt layout. Includes cornerstones, scrappy sashing, piano key sashing, and on-point quilts.",
    keywords: [
        "quilt sashing calculator",
        "how much sashing fabric do I need",
        "quilt sashing yardage calculator",
        "sashing with cornerstones calculator",
        "how to calculate quilt sashing",
        "quilt sashing width calculator",
        "piano key sashing calculator",
        "sashing strip count calculator",
    ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
