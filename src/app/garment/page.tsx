import Link from "next/link";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { garmentTools } from "@/lib/tools/garment";
import { Shirt } from "lucide-react";
export const metadata = { title: "Garment Construction Tools — 28 Free Calculators | SewTools", description: "Darts, pleats, hems, waistbands, collars, sleeves, and more garment construction calculators." };
export default function Page() {
    return (
        <div className="container" style={{ paddingBottom: "5rem" }}>
            <Breadcrumb items={[{ label: "Garment Construction Tools" }]} />
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                <span className="category-badge" style={{ marginBottom: "1rem", display: "inline-flex" }}><Shirt size={14} strokeWidth={1.5} /> Category 10</span>
                <h1>Garment Construction Tools</h1>
                <p style={{ fontSize: "1.125rem", color: "var(--color-text-secondary)", maxWidth: "700px", margin: "1rem auto 0" }}>
                    Darts, pleats, hems, waistbands, collars, sleeves — 28 precision garment construction calculators.
                </p>
            </div>
            <div className="tool-grid">
                {garmentTools.map(tool => (
                    <Link key={tool.id} href={`/garment/${tool.slug}`} className="tool-card">
                        <div className="tool-card-icon">{tool.icon}</div>
                        <div className="tool-card-content"><h3>{tool.name}</h3><p>{tool.description}</p></div>
                        <span className="tool-card-arrow">→</span>
                    </Link>
                ))}
            </div>
        </div>
    );
}
