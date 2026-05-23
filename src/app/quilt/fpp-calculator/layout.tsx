import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Foundation Paper Piecing Calculator — FPP Fabric Sizes, Template Verification & Yardage",
    description:
        "Free FPP calculator. Calculate fabric piece sizes for Foundation Paper Piecing, verify your template printed correctly, resize FPP patterns, and calculate yardage for any number of FPP blocks.",
    keywords: [
        "foundation paper piecing calculator",
        "FPP fabric size calculator",
        "how big to cut fabric for paper piecing",
        "FPP template size verification",
        "how to resize FPP pattern",
        "foundation paper piecing yardage",
        "FPP seam allowance calculator",
        "paper piecing fabric cutting size",
    ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
