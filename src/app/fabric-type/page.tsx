import Link from "next/link";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { fabricTypeTools } from "@/lib/tools/fabric-needle-machine";
import { Scale } from "lucide-react";
export const metadata = { title: "Fabric Weight & Type Tools — 13 Free Guides | SewTools", description: "GSM converters, fabric weight comparators, care symbols, and fiber guides." };
export default function Page() {
    return (
        <div className="container" style={{ paddingBottom: "5rem" }}>
            <Breadcrumb items={[{ label: "Fabric Type Tools" }]} />
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                <span className="category-badge" style={{ marginBottom: "1rem", display: "inline-flex" }}><Scale size={14} strokeWidth={1.5} /> Category 24</span>
                <h1>Fabric Weight & Type Tools</h1>
                <p style={{ fontSize: "1.125rem", color: "var(--color-text-secondary)", maxWidth: "700px", margin: "1rem auto 0" }}>13 tools for fabric weight conversion, selection, care symbols, and fiber identification.</p>
            </div>
            <div className="tool-grid">
                {fabricTypeTools.map(tool => (<Link key={tool.id} href={`/fabric-type/${tool.slug}`} className="tool-card"><div className="tool-card-icon">{tool.icon}</div><div className="tool-card-content"><h3>{tool.name}</h3><p>{tool.description}</p></div><span className="tool-card-arrow">→</span></Link>))}
            </div>
        </div>
    );
}
