import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Quilt Binding Calculator — How Much Binding Do I Need? Yardage, Strips & Width",
    description:
        "Free quilt binding calculator. Calculate binding yardage, number of strips to cut, and finished binding width for any quilt size. Includes double-fold, single-fold, straight grain, bias binding, and scrappy binding calculations.",
    keywords: [
        "quilt binding calculator",
        "how much binding do I need",
        "quilt binding yardage calculator",
        "binding strip width",
        "double fold binding calculator",
        "bias binding calculator",
        "how wide to cut quilt binding",
    ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
