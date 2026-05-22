import Link from "next/link";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { costTools } from "@/lib/tools/cost";
import { DollarSign, Wrench } from "lucide-react";

export const metadata = {
    title: "Fabric Cost Calculators — 16 Free Tools | SewTools",
    description: "Calculate fabric costs, compare prices, estimate project budgets, price handmade items, and track your stash value.",
};

export default function CostHubPage() {
    return (
        <div className="container" style={{ paddingBottom: "5rem" }}>
            <Breadcrumb items={[{ label: "Fabric Cost Calculators" }]} />
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                <span className="category-badge" style={{ marginBottom: "1rem", display: "inline-flex" }}><DollarSign size={14} strokeWidth={1.5} /> Category 3</span>
                <h1>Fabric Cost Calculators</h1>
                <p style={{ fontSize: "1.125rem", color: "var(--color-text-secondary)", maxWidth: "700px", margin: "1rem auto 0" }}>
                    Budget smarter, price accurately, and understand the true cost of every project. 16 specialized cost tools.
                </p>
                <div style={{ display: "flex", gap: "2rem", justifyContent: "center", marginTop: "1.5rem", flexWrap: "wrap" }}>
                    <div className="stat-badge"><Wrench size={13} /> 16 Tools</div>
                    <div className="stat-badge"> 100% Free</div>
                </div>
            </div>
            <div className="tool-grid">
                {costTools.map(tool => (
                    <Link key={tool.id} href={`/cost/${tool.slug}`} className="tool-card">
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
