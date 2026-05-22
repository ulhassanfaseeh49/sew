import Link from "next/link";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { elasticTools } from "@/lib/tools/elastic-stretch-emb";
export const metadata = { title: "Elastic & Waistband Tools — 9 Free Calculators | SewTools", description: "Elastic length, casing width, recovery, and drawstring calculators." };
export default function Page() {
    return (
        <div className="container" style={{ paddingBottom: "5rem" }}>
            <Breadcrumb items={[{ label: "Elastic & Waistband Tools" }]} />
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                <span className="category-badge" style={{ marginBottom: "1rem", display: "inline-flex" }}><span></span> Category 15</span>
                <h1>Elastic & Waistband Tools</h1>
                <p style={{ fontSize: "1.125rem", color: "var(--color-text-secondary)", maxWidth: "700px", margin: "1rem auto 0" }}>9 tools for elastic sizing, casing, recovery, and drawstrings.</p>
            </div>
            <div className="tool-grid">
                {elasticTools.map(tool => (<Link key={tool.id} href={`/elastic/${tool.slug}`} className="tool-card"><div className="tool-card-icon">{tool.icon}</div><div className="tool-card-content"><h3>{tool.name}</h3><p>{tool.description}</p></div><span className="tool-card-arrow">→</span></Link>))}
            </div>
        </div>
    );
}
