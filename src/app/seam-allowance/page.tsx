import Link from "next/link";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { seamTools } from "@/lib/tools/seam";

export const metadata = {
    title: "Seam Allowance Tools — 12 Free Calculators | SewTools",
    description: "Convert, add, subtract, and compare seam allowances. Calculators for French seams, flat-felled, Hong Kong finish, and more.",
};

export default function SeamHubPage() {
    return (
        <div className="container" style={{ paddingBottom: "5rem" }}>
            <Breadcrumb items={[{ label: "Seam Allowance Tools" }]} />
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                <span className="category-badge" style={{ marginBottom: "1rem", display: "inline-flex" }}><span>✂️</span> Category 4</span>
                <h1>Seam Allowance Tools</h1>
                <p style={{ fontSize: "1.125rem", color: "var(--color-text-secondary)", maxWidth: "700px", margin: "1rem auto 0" }}>
                    Convert, calculate, and compare seam allowances for every sewing technique. 12 precision tools for perfect seams.
                </p>
                <div style={{ display: "flex", gap: "2rem", justifyContent: "center", marginTop: "1.5rem", flexWrap: "wrap" }}>
                    <div className="stat-badge">✂️ 12 Tools</div>
                    <div className="stat-badge">💯 100% Free</div>
                </div>
            </div>
            <div className="tool-grid">
                {seamTools.map(tool => (
                    <Link key={tool.id} href={`/seam-allowance/${tool.slug}`} className="tool-card">
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
