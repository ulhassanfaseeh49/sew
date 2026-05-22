import Link from "next/link";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { bagTools } from "@/lib/tools/skirt-bags";
import { ShoppingBag } from "lucide-react";
export const metadata = { title: "Bag & Accessory Tools — 19 Free Calculators | SewTools", description: "Tote bags, pouches, wallets, backpacks, hats, scrunchies, and more." };
export default function Page() {
    return (
        <div className="container" style={{ paddingBottom: "5rem" }}>
            <Breadcrumb items={[{ label: "Bag & Accessory Tools" }]} />
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                <span className="category-badge" style={{ marginBottom: "1rem", display: "inline-flex" }}><ShoppingBag size={14} strokeWidth={1.5} /> Category 21</span>
                <h1>Bag & Accessory Tools</h1>
                <p style={{ fontSize: "1.125rem", color: "var(--color-text-secondary)", maxWidth: "700px", margin: "1rem auto 0" }}>19 calculators for bags, pouches, hats, headbands, and sewing accessories.</p>
            </div>
            <div className="tool-grid">
                {bagTools.map(tool => (<Link key={tool.id} href={`/bags/${tool.slug}`} className="tool-card"><div className="tool-card-icon">{tool.icon}</div><div className="tool-card-content"><h3>{tool.name}</h3><p>{tool.description}</p></div><span className="tool-card-arrow">→</span></Link>))}
            </div>
        </div>
    );
}
