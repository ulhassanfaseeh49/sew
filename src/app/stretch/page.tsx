import Link from "next/link";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { stretchTools } from "@/lib/tools/elastic-stretch-emb";
import { Scissors } from "lucide-react";
export const metadata = { title: "Knit & Stretch Fabric Tools — 10 Free Calculators | SewTools", description: "Stretch percentage, negative ease, knit comparisons, and serger settings." };
export default function Page() {
    return (
        <div className="container" style={{ paddingBottom: "5rem" }}>
            <Breadcrumb items={[{ label: "Knit & Stretch Tools" }]} />
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                <span className="category-badge" style={{ marginBottom: "1rem", display: "inline-flex" }}><Scissors size={14} strokeWidth={1.5} /> Category 16</span>
                <h1>Knit & Stretch Fabric Tools</h1>
                <p style={{ fontSize: "1.125rem", color: "var(--color-text-secondary)", maxWidth: "700px", margin: "1rem auto 0" }}>10 tools for stretch fabrics, knit sewing, and serger settings.</p>
            </div>
            <div className="tool-grid">
                {stretchTools.map(tool => (<Link key={tool.id} href={`/stretch/${tool.slug}`} className="tool-card"><div className="tool-card-icon">{tool.icon}</div><div className="tool-card-content"><h3>{tool.name}</h3><p>{tool.description}</p></div><span className="tool-card-arrow">→</span></Link>))}
            </div>
        </div>
    );
}
