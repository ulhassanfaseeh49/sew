import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Nine-Patch Block Calculator — Strip Widths, Yardage & Strip Piecing Instructions",
    description:
        "Free nine-patch block calculator. Get exact strip widths and square cut sizes for nine-patch blocks of any size. Includes strip piecing method with step-by-step instructions, yardage calculator, and double nine-patch calculator.",
    keywords: [
        "nine patch block calculator",
        "nine patch strip piecing calculator",
        "what size strips for nine patch block",
        "nine patch block cutting size",
        "strip piecing nine patch",
        "nine patch quilt yardage calculator",
        "double nine patch calculator",
        "scrappy nine patch calculator",
    ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
