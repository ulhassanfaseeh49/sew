import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Quilt Layout Planner — Free Visual Quilt Design Tool with Color & Fabric Assignment",
    description:
        "Plan your quilt layout visually before cutting. Assign colors and fabric photos to blocks, try different arrangements, check color balance, and export your design. Free online quilt design wall.",
    keywords: [
        "quilt layout planner",
        "online quilt design tool",
        "virtual quilt design wall",
        "quilt block arrangement tool",
        "plan quilt layout online",
        "quilt color planner",
        "free quilt design software online",
        "quilt block color arrangement",
    ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
