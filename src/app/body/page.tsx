import Link from "next/link";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { bodyTools } from "@/lib/tools/body";

export const metadata = {
    title: "Body Measurement Tools — 16 Free Calculators | SewTools",
    description: "Measure yourself, track changes, convert sizes internationally, and find your perfect pattern size.",
};

export default function BodyHubPage() {
    return (
        <div className="container" style={{ paddingBottom: "5rem" }}>
            <Breadcrumb items={[{ label: "Body Measurement Tools" }]} />
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                <span className="category-badge" style={{ marginBottom: "1rem", display: "inline-flex" }}><span>📏</span> Category 6</span>
                <h1>Body Measurement Tools</h1>
                <p style={{ fontSize: "1.125rem", color: "var(--color-text-secondary)", maxWidth: "700px", margin: "1rem auto 0" }}>
                    Accurate measurements are the foundation of great fit. 16 tools for measuring, tracking, and converting sizes.
                </p>
                <div style={{ display: "flex", gap: "2rem", justifyContent: "center", marginTop: "1.5rem", flexWrap: "wrap" }}>
                    <div className="stat-badge">📏 16 Tools</div>
                    <div className="stat-badge">💯 100% Free</div>
                </div>
            </div>
            <div className="tool-grid">
                {bodyTools.map(tool => (
                    <Link key={tool.id} href={`/body/${tool.slug}`} className="tool-card">
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
