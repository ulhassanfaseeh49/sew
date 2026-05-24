import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Quarter-Square Triangle Calculator — QST Cutting Sizes, Hourglass Blocks & Yardage",
    description:
        "Free QST calculator. Calculate cutting sizes for quarter-square triangles and hourglass blocks using all construction methods. Includes formula explanation, QST vs HST comparison, four-color QSTs, and complete yardage.",
    keywords: [
        "quarter square triangle calculator",
        "QST calculator quilting",
        "hourglass block calculator",
        "quarter square triangle formula",
        "QST vs HST difference",
        "how to make quarter square triangles",
        "hourglass quilt block cutting size",
        "Ohio Star QST calculator",
    ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
