import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Virtual Quilt Design Wall — Free Online Quilt Block Arrangement Tool",
    description:
        "Free virtual quilt design wall. Arrange blocks on a digital canvas, try different layouts, check color and value balance, save snapshots of arrangements, and plan your quilt composition. Works for sampler, improv, and regular quilts.",
    keywords: [
        "virtual quilt design wall",
        "online quilt design wall",
        "quilt block arrangement tool",
        "quilt layout planner online",
        "free quilt design software",
        "improv quilt layout tool",
        "sampler quilt layout planner",
    ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
