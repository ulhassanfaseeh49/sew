import Link from "next/link";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { embroideryTools } from "@/lib/tools/elastic-stretch-emb";
export const metadata = { title: "Embroidery & Appliqué Tools — 13 Free Calculators | SewTools", description: "Embroidery thread, hoop sizing, cross-stitch, and appliqué calculators." };
export default function Page() {
    return (
        <div className="container" style={{ paddingBottom: "5rem" }}>
            <Breadcrumb items={[{ label: "Embroidery & Appliqué" }]} />
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                <span className="category-badge" style={{ marginBottom: "1rem", display: "inline-flex" }}><span>🪡</span> Category 17</span>
                <h1>Embroidery & Appliqué Tools</h1>
                <p style={{ fontSize: "1.125rem", color: "var(--color-text-secondary)", maxWidth: "700px", margin: "1rem auto 0" }}>13 tools for machine embroidery, cross-stitch, needlepoint, and appliqué.</p>
            </div>
            <div className="tool-grid">
                {embroideryTools.map(tool => (<Link key={tool.id} href={`/embroidery/${tool.slug}`} className="tool-card"><div className="tool-card-icon">{tool.icon}</div><div className="tool-card-content"><h3>{tool.name}</h3><p>{tool.description}</p></div><span className="tool-card-arrow">→</span></Link>))}
            </div>
        </div>
    );
}
