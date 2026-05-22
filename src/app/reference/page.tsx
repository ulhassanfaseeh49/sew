import Link from "next/link";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { referenceTools } from "@/lib/tools/sustainable-reference";
export const metadata = { title: "Reference & Education — 24 Free Sewing Guides | SewTools", description: "Sewing glossary, fabric encyclopedia, stitch database, size charts, and beginner guides." };
export default function Page() {
    return (
        <div className="container" style={{ paddingBottom: "5rem" }}>
            <Breadcrumb items={[{ label: "Reference & Education" }]} />
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                <span className="category-badge" style={{ marginBottom: "1rem", display: "inline-flex" }}><span>📚</span> Category 28</span>
                <h1>Reference & Education</h1>
                <p style={{ fontSize: "1.125rem", color: "var(--color-text-secondary)", maxWidth: "700px", margin: "1rem auto 0" }}>24 reference guides, glossaries, charts, and beginner tutorials for sewists.</p>
            </div>
            <div className="tool-grid">
                {referenceTools.map(tool => (<Link key={tool.id} href={`/reference/${tool.slug}`} className="tool-card"><div className="tool-card-icon">{tool.icon}</div><div className="tool-card-content"><h3>{tool.name}</h3><p>{tool.description}</p></div><span className="tool-card-arrow">→</span></Link>))}
            </div>
        </div>
    );
}
