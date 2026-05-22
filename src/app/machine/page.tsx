import Link from "next/link";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { machineTools } from "@/lib/tools/fabric-needle-machine";
export const metadata = { title: "Sewing Machine Tools — 12 Free Calculators | SewTools", description: "Stitch settings, tension guides, presser feet, and troubleshooting tools." };
export default function Page() {
    return (
        <div className="container" style={{ paddingBottom: "5rem" }}>
            <Breadcrumb items={[{ label: "Machine Tools" }]} />
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                <span className="category-badge" style={{ marginBottom: "1rem", display: "inline-flex" }}><span>🧵</span> Category 26</span>
                <h1>Sewing Machine Tools</h1>
                <p style={{ fontSize: "1.125rem", color: "var(--color-text-secondary)", maxWidth: "700px", margin: "1rem auto 0" }}>12 tools for stitch settings, tension, presser feet, and machine troubleshooting.</p>
            </div>
            <div className="tool-grid">
                {machineTools.map(tool => (<Link key={tool.id} href={`/machine/${tool.slug}`} className="tool-card"><div className="tool-card-icon">{tool.icon}</div><div className="tool-card-content"><h3>{tool.name}</h3><p>{tool.description}</p></div><span className="tool-card-arrow">→</span></Link>))}
            </div>
        </div>
    );
}
