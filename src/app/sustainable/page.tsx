import Link from "next/link";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { sustainableTools } from "@/lib/tools/sustainable-reference";
import { Recycle } from "lucide-react";
export const metadata = { title: "Sustainable & Zero Waste Tools — 11 Free Calculators | SewTools", description: "Fabric waste calculators, eco-fabric comparators, upcycling tools, and sustainability guides." };
export default function Page() {
    return (
        <div className="container" style={{ paddingBottom: "5rem" }}>
            <Breadcrumb items={[{ label: "Sustainable Sewing" }]} />
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                <span className="category-badge" style={{ marginBottom: "1rem", display: "inline-flex" }}><Recycle size={14} strokeWidth={1.5} /> Category 27</span>
                <h1>Sustainable & Zero Waste Tools</h1>
                <p style={{ fontSize: "1.125rem", color: "var(--color-text-secondary)", maxWidth: "700px", margin: "1rem auto 0" }}>11 tools for eco-friendly sewing, zero-waste cutting, and sustainable fabric choices.</p>
            </div>
            <div className="tool-grid">
                {sustainableTools.map(tool => (<Link key={tool.id} href={`/sustainable/${tool.slug}`} className="tool-card"><div className="tool-card-icon">{tool.icon}</div><div className="tool-card-content"><h3>{tool.name}</h3><p>{tool.description}</p></div><span className="tool-card-arrow">→</span></Link>))}
            </div>
        </div>
    );
}
