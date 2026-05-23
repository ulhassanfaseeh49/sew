import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Dresden Plate Calculator — Blade Size, Angle & Yardage for Any Plate Size",
    description:
        "Free Dresden Plate calculator. Calculate blade dimensions, angles, and yardage for any Dresden Plate size and blade count. Includes Grandmother's Fan calculator, rounded tip instructions, and complete yardage calculator.",
    keywords: [
        "dresden plate calculator",
        "dresden plate blade size calculator",
        "dresden plate template size",
        "how to calculate dresden plate angles",
        "grandmother's fan quilt calculator",
        "dresden plate yardage calculator",
        "how many blades for dresden plate",
    ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
