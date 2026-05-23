import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Fabric Yardage Calculator — How Much Fabric Do I Need?",
    description:
        "Calculate exactly how much fabric you need for any project. Enter dimensions OR choose a project type. Handles multiple fabrics, shrinkage, and pattern repeats.",
    keywords: [
        "fabric yardage calculator",
        "how much fabric do I need",
        "fabric calculator",
        "yardage calculator",
        "how many yards of fabric",
        "fabric yardage estimator",
    ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
