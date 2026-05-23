import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Quilt Block Size Calculator — Finished to Unfinished Size with Seam Allowances",
    description:
        "Free quilt block size calculator. Convert finished block size to unfinished cutting size, calculate all piece sizes for any block type, troubleshoot blocks that aren't the right size, and resize blocks to any dimension.",
    keywords: [
        "quilt block size calculator",
        "finished vs unfinished block size",
        "unfinished block size calculator",
        "quilt block cutting size",
        "quilt block seam allowance",
        "resize quilt block",
    ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
