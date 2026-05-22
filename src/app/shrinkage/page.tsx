import Link from "next/link";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { shrinkageTools } from "@/lib/tools/shrinkage";
export const metadata = { title: "Fabric Shrinkage Tools — 8 Free Calculators | SewTools", description: "Pre-wash estimators, shrinkage calculators, and fabric care guides." };
export default function Page() {
    return (
        <div className="container" style={{ paddingBottom: "5rem" }}>
            <Breadcrumb items={[{ label: "Shrinkage Tools" }]} />
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                <span className="category-badge" style={{ marginBottom: "1rem", display: "inline-flex" }}><span></span> Category 11</span>
                <h1>Fabric Shrinkage Tools</h1>
                <p style={{ fontSize: "1.125rem", color: "var(--color-text-secondary)", maxWidth: "700px", margin: "1rem auto 0" }}>
                    Pre-wash, estimate, and compensate for fabric shrinkage with 8 dedicated tools.
                </p>
            </div>
            <div className="tool-grid">
                {shrinkageTools.map(tool => (
                    <Link key={tool.id} href={`/shrinkage/${tool.slug}`} className="tool-card">
                        <div className="tool-card-icon">{tool.icon}</div>
                        <div className="tool-card-content"><h3>{tool.name}</h3><p>{tool.description}</p></div>
                        <span className="tool-card-arrow">→</span>
                    </Link>
                ))}
            </div>
        </div>
    );
}
