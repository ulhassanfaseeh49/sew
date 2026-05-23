import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Irish Chain Quilt Calculator — Single, Double & Triple Irish Chain Cutting Sizes | SewTools",
    description:
        "Free Irish Chain calculator. Calculate strip sets, block sizes, and yardage for Single, Double, and Triple Irish Chain quilts. Includes complete strip piecing production plan and alternate block explanation.",
    keywords: [
        "Irish Chain quilt calculator",
        "Double Irish Chain calculator",
        "Irish Chain quilt block sizes",
        "Single Irish Chain strip piecing",
        "Triple Irish Chain quilt calculator",
        "Irish Chain alternate block",
        "Irish Chain yardage calculator",
        "Irish Chain strip sets",
    ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
