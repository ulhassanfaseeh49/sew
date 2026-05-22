import Link from "next/link";
import Breadcrumb from "@/components/ui/Breadcrumb";
export const metadata = { title: "Sewing Guides & Tutorials | SewTools", description: "Free sewing guides, tutorials, and how-to articles for quilters, garment sewists, and crafters." };
export default function Page() {
    const guides = [
        { title: "How to Measure Your Body for Sewing", href: "/body", icon: "", desc: "Complete guide to taking accurate body measurements" },
        { title: "Beginner's Sewing Checklist", href: "/reference/beginner-checklist", icon: "", desc: "Everything you need to start sewing" },
        { title: "Understanding Fabric Weight (GSM)", href: "/fabric-type/gsm-to-oz", icon: "", desc: "What GSM means and how to convert units" },
        { title: "Pressing vs Ironing — What's the Difference?", href: "/reference/pressing-guide", icon: "", desc: "Why pressing matters and how to do it right" },
        { title: "Circle Skirt Math Explained", href: "/skirt/full-circle", icon: "", desc: "The formula behind circle skirt calculations" },
        { title: "How to Price Handmade Items", href: "/pricing/handmade-pricing", icon: "", desc: "Pricing strategies for selling handmade" },
        { title: "Sustainable Sewing Guide", href: "/sustainable", icon: "", desc: "Reduce waste and sew eco-friendly" },
        { title: "Fabric Preparation Guide", href: "/reference/fabric-prep", icon: "", desc: "Pre-washing, pressing, and straightening grain" },
        { title: "Sewing Machine Troubleshooting", href: "/machine/troubleshooting", icon: "", desc: "Fix thread bunching, skipping, and more" },
        { title: "Pattern Reading Tutorial", href: "/reference/pattern-reading", icon: "", desc: "How to read a commercial sewing pattern" },
        { title: "Quilt Size Planning", href: "/quilt", icon: "", desc: "Choose the right quilt size for your bed" },
        { title: "Needle & Thread Selection", href: "/needles-thread", icon: "", desc: "Match needle and thread to your fabric" },
    ];
    return (
        <div className="container" style={{ paddingBottom: "5rem" }}>
            <Breadcrumb items={[{ label: "Guides" }]} />
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                <h1>Sewing Guides & Tutorials</h1>
                <p style={{ fontSize: "1.125rem", color: "var(--color-text-secondary)", maxWidth: "700px", margin: "1rem auto 0" }}>Free guides and tutorials to help you sew with confidence.</p>
            </div>
            <div className="tool-grid">
                {guides.map((g, i) => (
                    <Link key={i} href={g.href} className="tool-card">
                        <div className="tool-card-icon">{g.icon}</div>
                        <div className="tool-card-content">
                            <h3>{g.title}</h3>
                            <p>{g.desc}</p>
                        </div>
                        <span className="tool-card-arrow">→</span>
                    </Link>
                ))}
            </div>
        </div>
    );
}
