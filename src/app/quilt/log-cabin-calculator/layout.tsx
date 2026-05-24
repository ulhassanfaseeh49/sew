import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Log Cabin Block Calculator — Strip Widths, Lengths & Yardage for Log Cabin Quilts",
    description:
        "Free log cabin block calculator. Calculate exact strip widths and lengths for log cabin blocks of any size. Includes courthouse steps, jelly roll log cabin, barn raising layout planner, and complete yardage calculator.",
    keywords: [
        "log cabin block calculator",
        "log cabin quilt strip width calculator",
        "log cabin block cutting size",
        "how to calculate log cabin strips",
        "log cabin quilt yardage calculator",
        "jelly roll log cabin calculator",
        "barn raising quilt layout",
        "courthouse steps quilt calculator",
    ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
