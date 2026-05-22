import Link from "next/link";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { costumeTools } from "@/lib/tools/lace-costume";
import { Drama } from "lucide-react";
export const metadata = { title: "Costume & Cosplay Tools — 17 Free Calculators | SewTools", description: "Corsets, petticoats, capes, armor, foam, and historical costume calculators." };
export default function Page() {
    return (
        <div className="container" style={{ paddingBottom: "5rem" }}>
            <Breadcrumb items={[{ label: "Costume & Cosplay" }]} />
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                <span className="category-badge" style={{ marginBottom: "1rem", display: "inline-flex" }}><Drama size={14} strokeWidth={1.5} /> Category 19</span>
                <h1>Costume & Cosplay Tools</h1>
                <p style={{ fontSize: "1.125rem", color: "var(--color-text-secondary)", maxWidth: "700px", margin: "1rem auto 0" }}>17 calculators for costumes, corsets, capes, armor, and historical garments.</p>
            </div>
            <div className="tool-grid">
                {costumeTools.map(tool => (<Link key={tool.id} href={`/costume/${tool.slug}`} className="tool-card"><div className="tool-card-icon">{tool.icon}</div><div className="tool-card-content"><h3>{tool.name}</h3><p>{tool.description}</p></div><span className="tool-card-arrow">→</span></Link>))}
            </div>
        </div>
    );
}
