import Link from "next/link";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { skirtTools } from "@/lib/tools/skirt-bags";
export const metadata = { title: "Circle & Skirt Calculators — 16 Free Tools | SewTools", description: "Full, half, quarter circle, A-line, pleated, tiered, and wrap skirt calculators." };
export default function Page() {
    return (
        <div className="container" style={{ paddingBottom: "5rem" }}>
            <Breadcrumb items={[{ label: "Skirt Calculators" }]} />
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                <span className="category-badge" style={{ marginBottom: "1rem", display: "inline-flex" }}><span>👗</span> Category 20</span>
                <h1>Circle & Skirt Calculators</h1>
                <p style={{ fontSize: "1.125rem", color: "var(--color-text-secondary)", maxWidth: "700px", margin: "1rem auto 0" }}>16 tools for every skirt style — circle, A-line, pleated, tiered, and more.</p>
            </div>
            <div className="tool-grid">
                {skirtTools.map(tool => (<Link key={tool.id} href={`/skirt/${tool.slug}`} className="tool-card"><div className="tool-card-icon">{tool.icon}</div><div className="tool-card-content"><h3>{tool.name}</h3><p>{tool.description}</p></div><span className="tool-card-arrow">→</span></Link>))}
            </div>
        </div>
    );
}
