import Link from "next/link";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { homeDecorTools } from "@/lib/tools/home-decor";
export const metadata = { title: "Upholstery & Home Décor Tools — 25 Free Calculators | SewTools", description: "Upholstery, cushions, tablecloths, bedding, and home décor sewing calculators." };
export default function Page() {
    return (
        <div className="container" style={{ paddingBottom: "5rem" }}>
            <Breadcrumb items={[{ label: "Home Décor Tools" }]} />
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                <span className="category-badge" style={{ marginBottom: "1rem", display: "inline-flex" }}><span></span> Category 13</span>
                <h1>Upholstery & Home Décor Tools</h1>
                <p style={{ fontSize: "1.125rem", color: "var(--color-text-secondary)", maxWidth: "700px", margin: "1rem auto 0" }}>
                    Upholstery, cushions, table linens, bedding — 25 calculators for home sewing projects.
                </p>
            </div>
            <div className="tool-grid">
                {homeDecorTools.map(tool => (
                    <Link key={tool.id} href={`/home-decor/${tool.slug}`} className="tool-card">
                        <div className="tool-card-icon">{tool.icon}</div>
                        <div className="tool-card-content"><h3>{tool.name}</h3><p>{tool.description}</p></div>
                        <span className="tool-card-arrow">→</span>
                    </Link>
                ))}
            </div>
        </div>
    );
}
