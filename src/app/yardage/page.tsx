import Link from "next/link";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { yardageTools } from "@/lib/tools/yardage";
import { Scissors, Wrench } from "lucide-react";

export const metadata = {
    title: "Fabric Yardage Calculators — 42 Free Tools | SewTools",
    description: "Calculate how much fabric to buy for any project. Yardage calculators for garments, quilts, home décor, bags, costumes, and more.",
};

export default function YardageHubPage() {
    const subcategories = [...new Set(yardageTools.map(t => t.subcategory))];
    return (
        <div className="container" style={{ paddingBottom: "5rem" }}>
            <Breadcrumb items={[{ label: "Fabric Yardage Calculators" }]} />
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                <span className="category-badge" style={{ marginBottom: "1rem", display: "inline-flex" }}><Scissors size={14} strokeWidth={1.5} /> Category 2</span>
                <h1>Fabric Yardage Calculators</h1>
                <p style={{ fontSize: "1.125rem", color: "var(--color-text-secondary)", maxWidth: "700px", margin: "1rem auto 0" }}>
                    Never buy too much or too little fabric again. 42 specialized calculators for every project type.
                </p>
                <div style={{ display: "flex", gap: "2rem", justifyContent: "center", marginTop: "1.5rem", flexWrap: "wrap" }}>
                    <div className="stat-badge"><Wrench size={13} /> 42 Tools</div>
                    <div className="stat-badge"> 5 Sub-categories</div>
                    <div className="stat-badge"> 100% Free</div>
                </div>
            </div>
            {subcategories.map(sub => (
                <section key={sub} style={{ marginBottom: "3rem" }}>
                    <h2 style={{ marginBottom: "1.5rem", fontSize: "1.5rem" }}>{sub}</h2>
                    <div className="tool-grid">
                        {yardageTools.filter(t => t.subcategory === sub).map(tool => (
                            <Link key={tool.id} href={`/yardage/${tool.slug}`} className="tool-card">
                                <div className="tool-card-icon">{tool.icon}</div>
                                <div className="tool-card-content">
                                    <h3>{tool.name}</h3>
                                    <p>{tool.description}</p>
                                </div>
                                <span className="tool-card-arrow">→</span>
                            </Link>
                        ))}
                    </div>
                </section>
            ))}
        </div>
    );
}
