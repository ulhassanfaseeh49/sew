import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Quilt Border Calculator — Width, Yardage & Cutting Instructions for Butted & Mitered Corners",
    description:
        "Free quilt border calculator. Calculate border yardage, strip count, and cutting dimensions for any quilt. Handles butted corners, mitered corners, multiple borders, and length-of-grain cutting.",
    keywords: [
        "quilt border calculator",
        "quilt border yardage calculator",
        "how much fabric for quilt border",
        "mitered corner quilt border calculator",
        "butted corner border calculator",
        "multiple border quilt calculator",
        "quilt border width to reach target size",
    ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
