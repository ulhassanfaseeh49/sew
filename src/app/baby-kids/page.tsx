import Link from "next/link";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { babyKidsTools } from "@/lib/tools/baby-pricing";
import { Baby } from "lucide-react";
export const metadata = { title: "Baby & Children Sewing Tools — 14 Free Calculators | SewTools", description: "Baby quilts, clothing, bibs, swaddles, and children's sewing calculators." };
export default function Page() {
    return (
        <div className="container" style={{ paddingBottom: "5rem" }}>
            <Breadcrumb items={[{ label: "Baby & Kids Tools" }]} />
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                <span className="category-badge" style={{ marginBottom: "1rem", display: "inline-flex" }}><Baby size={14} strokeWidth={1.5} /> Category 22</span>
                <h1>Baby & Children Sewing Tools</h1>
                <p style={{ fontSize: "1.125rem", color: "var(--color-text-secondary)", maxWidth: "700px", margin: "1rem auto 0" }}>14 calculators for baby quilts, clothing, bibs, and children's projects.</p>
            </div>
            <div className="tool-grid">
                {babyKidsTools.map(tool => (<Link key={tool.id} href={`/baby-kids/${tool.slug}`} className="tool-card"><div className="tool-card-icon">{tool.icon}</div><div className="tool-card-content"><h3>{tool.name}</h3><p>{tool.description}</p></div><span className="tool-card-arrow">→</span></Link>))}
            </div>
        </div>
    );
}
