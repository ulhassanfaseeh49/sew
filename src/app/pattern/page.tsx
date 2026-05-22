import Link from "next/link";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { patternTools } from "@/lib/tools/pattern";

export const metadata = {
    title: "Pattern Scaling & Grading Tools — 18 Free Calculators | SewTools",
    description: "Scale, grade, adjust, and convert sewing patterns. FBA/SBA calculators, ease tools, PDF printing guides, and more.",
};

export default function PatternHubPage() {
    return (
        <div className="container" style={{ paddingBottom: "5rem" }}>
            <Breadcrumb items={[{ label: "Pattern Scaling & Grading" }]} />
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                <span className="category-badge" style={{ marginBottom: "1rem", display: "inline-flex" }}><span>📐</span> Category 5</span>
                <h1>Pattern Scaling & Grading Tools</h1>
                <p style={{ fontSize: "1.125rem", color: "var(--color-text-secondary)", maxWidth: "700px", margin: "1rem auto 0" }}>
                    Scale patterns, calculate fit adjustments, and grade between sizes. 18 precision tools for perfect fit.
                </p>
                <div style={{ display: "flex", gap: "2rem", justifyContent: "center", marginTop: "1.5rem", flexWrap: "wrap" }}>
                    <div className="stat-badge">📐 18 Tools</div>
                    <div className="stat-badge">💯 100% Free</div>
                </div>
            </div>
            <div className="tool-grid">
                {patternTools.map(tool => (
                    <Link key={tool.id} href={`/pattern/${tool.slug}`} className="tool-card">
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
