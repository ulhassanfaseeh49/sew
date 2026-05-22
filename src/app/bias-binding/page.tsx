import Link from "next/link";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { biasBindingTools } from "@/lib/tools/bias-binding";
import { Ribbon } from "lucide-react";
export const metadata = { title: "Bias Tape & Binding Tools — 10 Free Calculators | SewTools", description: "Bias tape width, yardage, continuous strip, and quilt binding calculators." };
export default function Page() {
    return (
        <div className="container" style={{ paddingBottom: "5rem" }}>
            <Breadcrumb items={[{ label: "Bias Tape & Binding" }]} />
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                <span className="category-badge" style={{ marginBottom: "1rem", display: "inline-flex" }}><Ribbon size={14} strokeWidth={1.5} /> Category 14</span>
                <h1>Bias Tape & Binding Tools</h1>
                <p style={{ fontSize: "1.125rem", color: "var(--color-text-secondary)", maxWidth: "700px", margin: "1rem auto 0" }}>
                    10 calculators for bias tape width, yardage, continuous strips, and quilt binding.
                </p>
            </div>
            <div className="tool-grid">
                {biasBindingTools.map(tool => (
                    <Link key={tool.id} href={`/bias-binding/${tool.slug}`} className="tool-card">
                        <div className="tool-card-icon">{tool.icon}</div>
                        <div className="tool-card-content"><h3>{tool.name}</h3><p>{tool.description}</p></div>
                        <span className="tool-card-arrow">→</span>
                    </Link>
                ))}
            </div>
        </div>
    );
}
