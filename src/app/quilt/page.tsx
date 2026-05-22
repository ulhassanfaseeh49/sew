import Link from "next/link";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { quiltTools } from "@/lib/tools/quilt";

export const metadata = {
    title: "Quilt Math Tools — 38 Free Calculators | SewTools",
    description: "Quilt size, blocks, binding, sashing, HST, flying geese, pre-cut calculators, and more.",
};

export default function QuiltHubPage() {
    const groups = [
        { title: "Planning & Sizing", tools: quiltTools.filter(t => t.id >= 129 && t.id <= 135) },
        { title: "Backing & Finishing", tools: quiltTools.filter(t => t.id >= 136 && t.id <= 141) },
        { title: "Sashing, Borders & Setting", tools: quiltTools.filter(t => t.id >= 142 && t.id <= 145) },
        { title: "Block Calculators", tools: quiltTools.filter(t => t.id >= 146 && t.id <= 159) },
        { title: "Pre-Cut Fabric", tools: quiltTools.filter(t => t.id >= 160 && t.id <= 166) },
    ];
    return (
        <div className="container" style={{ paddingBottom: "5rem" }}>
            <Breadcrumb items={[{ label: "Quilt Math Tools" }]} />
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                <span className="category-badge" style={{ marginBottom: "1rem", display: "inline-flex" }}><span></span> Category 7</span>
                <h1>Quilt Math Tools</h1>
                <p style={{ fontSize: "1.125rem", color: "var(--color-text-secondary)", maxWidth: "700px", margin: "1rem auto 0" }}>
                    Every calculation a quilter needs. 38 precision tools for planning, cutting, and finishing quilts.
                </p>
                <div style={{ display: "flex", gap: "2rem", justifyContent: "center", marginTop: "1.5rem", flexWrap: "wrap" }}>
                    <div className="stat-badge"> 38 Tools</div>
                    <div className="stat-badge"> 100% Free</div>
                </div>
            </div>
            {groups.map(g => (
                <div key={g.title} style={{ marginBottom: "2.5rem" }}>
                    <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>{g.title}</h2>
                    <div className="tool-grid">
                        {g.tools.map(tool => (
                            <Link key={tool.id} href={`/quilt/${tool.slug}`} className="tool-card">
                                <div className="tool-card-icon">{tool.icon}</div>
                                <div className="tool-card-content">
                                    <h3>{tool.name}</h3>
                                    <p>{tool.description}</p>
                                </div>
                                <span className="tool-card-arrow">→</span>
                            </Link>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
