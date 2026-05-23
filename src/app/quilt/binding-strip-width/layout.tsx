import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Binding Strip Width Calculator — How Wide to Cut Quilt Binding Strips",
    description:
        "Free binding strip width calculator. Enter your desired finished binding width to get the exact cut strip width. Works for double-fold and single-fold binding with seam allowance and quilt thickness adjustments.",
    keywords: [
        "binding strip width calculator",
        "how wide to cut quilt binding",
        "quilt binding cut width",
        "double fold binding strip width",
        "finished binding width calculator",
        "quilt binding width formula",
        "cut binding strips width",
    ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
