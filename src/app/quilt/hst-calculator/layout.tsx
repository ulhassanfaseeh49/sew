import type { Metadata } from "next";

export const metadata: Metadata = {
    title:
        "Half-Square Triangle Calculator — HST Cutting Sizes for All Methods (2, 4, 8-at-a-Time)",
    description:
        "Free HST calculator. Get exact cutting sizes for half-square triangles using 2-at-a-time, 4-at-a-time, and 8-at-a-time methods. Calculate yardage for any quantity and compare method efficiency.",
    keywords: [
        "half square triangle calculator",
        "HST calculator",
        "what size to cut half square triangles",
        "HST cutting size chart",
        "2 at a time HST calculator",
        "4 at a time HST method",
        "8 at a time HST method",
        "half square triangle formula",
        "HST size chart",
        "how to calculate half square triangles",
    ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
