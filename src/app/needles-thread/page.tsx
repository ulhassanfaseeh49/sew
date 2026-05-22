import Link from "next/link";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { needleThreadTools } from "@/lib/tools/fabric-needle-machine";
export const metadata = { title: "Needle & Thread Selection — 10 Free Tools | SewTools", description: "Needle size guides, thread weight selectors, and sewing needle reference charts." };
export default function Page() {
    return (
        <div className="container" style={{ paddingBottom: "5rem" }}>
            <Breadcrumb items={[{ label: "Needles & Thread" }]} />
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                <span className="category-badge" style={{ marginBottom: "1rem", display: "inline-flex" }}><span>🪡</span> Category 25</span>
                <h1>Needle & Thread Selection</h1>
                <p style={{ fontSize: "1.125rem", color: "var(--color-text-secondary)", maxWidth: "700px", margin: "1rem auto 0" }}>10 tools for needle sizing, thread selection, and sewing needle reference.</p>
            </div>
            <div className="tool-grid">
                {needleThreadTools.map(tool => (<Link key={tool.id} href={`/needles-thread/${tool.slug}`} className="tool-card"><div className="tool-card-icon">{tool.icon}</div><div className="tool-card-content"><h3>{tool.name}</h3><p>{tool.description}</p></div><span className="tool-card-arrow">→</span></Link>))}
            </div>
        </div>
    );
}
