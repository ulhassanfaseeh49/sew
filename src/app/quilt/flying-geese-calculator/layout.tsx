import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Flying Geese Calculator — Rectangle Size, Sky Squares & No-Waste Method",
    description:
        "Free flying geese calculator. Get exact cutting sizes for flying geese units using traditional and no-waste methods. Includes border planner, yardage calculator, and troubleshooting guide.",
    keywords: [
        "flying geese calculator",
        "flying geese cutting size calculator",
        "no-waste flying geese calculator",
        "flying geese rectangle size",
        "flying geese border calculator",
        "four at a time flying geese calculator",
        "flying geese size chart",
    ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
