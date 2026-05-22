import Link from "next/link";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { laceTrimTools } from "@/lib/tools/lace-costume";
export const metadata = { title: "Lace & Trim Calculators — 11 Free Tools | SewTools", description: "Lace, ribbon, fringe, piping, and decorative trim calculators." };
export default function Page() {
    return (
        <div className="container" style={{ paddingBottom: "5rem" }}>
            <Breadcrumb items={[{ label: "Lace & Trim Tools" }]} />
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                <span className="category-badge" style={{ marginBottom: "1rem", display: "inline-flex" }}><span>🌸</span> Category 18</span>
                <h1>Lace & Trim Calculators</h1>
                <p style={{ fontSize: "1.125rem", color: "var(--color-text-secondary)", maxWidth: "700px", margin: "1rem auto 0" }}>11 tools for lace, ribbon, fringe, piping, and decorative trims.</p>
            </div>
            <div className="tool-grid">
                {laceTrimTools.map(tool => (<Link key={tool.id} href={`/lace-trim/${tool.slug}`} className="tool-card"><div className="tool-card-icon">{tool.icon}</div><div className="tool-card-content"><h3>{tool.name}</h3><p>{tool.description}</p></div><span className="tool-card-arrow">→</span></Link>))}
            </div>
        </div>
    );
}
