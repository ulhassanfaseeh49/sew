import Link from "next/link";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { cuttingTools } from "@/lib/tools/cutting";

export const metadata = {
    title: "Quilt Cutting Tools — 13 Free Calculators | SewTools",
    description: "Strip, square, triangle, bias strip, and layout optimization calculators for efficient fabric cutting.",
};

export default function CuttingHubPage() {
    return (
        <div className="container" style={{ paddingBottom: "5rem" }}>
            <Breadcrumb items={[{ label: "Quilt Cutting Tools" }]} />
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                <span className="category-badge" style={{ marginBottom: "1rem", display: "inline-flex" }}><span>✂️</span> Category 8</span>
                <h1>Quilt Cutting Tools</h1>
                <p style={{ fontSize: "1.125rem", color: "var(--color-text-secondary)", maxWidth: "700px", margin: "1rem auto 0" }}>
                    Cut smarter, waste less. 13 calculators for strips, squares, triangles, and optimized layouts.
                </p>
                <div style={{ display: "flex", gap: "2rem", justifyContent: "center", marginTop: "1.5rem", flexWrap: "wrap" }}>
                    <div className="stat-badge">✂️ 13 Tools</div>
                    <div className="stat-badge">💯 100% Free</div>
                </div>
            </div>
            <div className="tool-grid">
                {cuttingTools.map(tool => (
                    <Link key={tool.id} href={`/cutting/${tool.slug}`} className="tool-card">
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
    );
}
