import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Scrappy Quilt Yardage Estimator — How Much Fabric for a Scrappy Quilt?",
    description:
        "Free scrappy quilt yardage calculator. Calculate how much total scrap fabric you need for any quilt size, assess if your stash is sufficient, plan rainbow and two-value scrappy quilts, and find out what size quilt your scraps will make.",
    keywords: [
        "scrappy quilt yardage calculator",
        "how much fabric for a scrappy quilt",
        "scrap quilt fabric estimator",
        "how much scraps for a throw quilt",
        "scrappy quilt fabric calculator",
        "two value scrappy quilt calculator",
        "rainbow quilt yardage calculator",
        "do I have enough scraps for a quilt",
    ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
