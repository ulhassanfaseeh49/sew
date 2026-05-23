import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Quilt Color Proportion Tool — Calculate Fabric Proportions, Balance & Yardage",
    description:
        "Free quilt color proportion calculator. Apply the 60-30-10 rule, calculate yardage for each fabric color, check value balance, plan ombre gradients, and compare color scheme options side by side.",
    keywords: [
        "quilt color proportion calculator",
        "how much of each fabric for a quilt",
        "60-30-10 rule quilting",
        "quilt fabric proportion calculator",
        "quilt color balance tool",
        "quilt yardage by color calculator",
    ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
