import Link from "next/link";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { pricingTools } from "@/lib/tools/baby-pricing";
export const metadata = { title: "Pricing & Selling Tools — 15 Free Calculators | SewTools", description: "Handmade pricing, Etsy fees, profit margins, and business calculators for sewists." };
export default function Page() {
    return (
        <div className="container" style={{ paddingBottom: "5rem" }}>
            <Breadcrumb items={[{ label: "Pricing & Selling" }]} />
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                <span className="category-badge" style={{ marginBottom: "1rem", display: "inline-flex" }}><span>💰</span> Category 23</span>
                <h1>Pricing & Selling Tools</h1>
                <p style={{ fontSize: "1.125rem", color: "var(--color-text-secondary)", maxWidth: "700px", margin: "1rem auto 0" }}>15 tools for pricing handmade items, calculating fees, and running your sewing business.</p>
            </div>
            <div className="tool-grid">
                {pricingTools.map(tool => (<Link key={tool.id} href={`/pricing/${tool.slug}`} className="tool-card"><div className="tool-card-icon">{tool.icon}</div><div className="tool-card-content"><h3>{tool.name}</h3><p>{tool.description}</p></div><span className="tool-card-arrow">→</span></Link>))}
            </div>
        </div>
    );
}
