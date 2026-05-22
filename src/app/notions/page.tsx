import Link from "next/link";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { notionTools } from "@/lib/tools/notions";
export const metadata = { title: "Thread & Notion Calculators — 21 Free Tools | SewTools", description: "Thread, button, zipper, elastic, trim, and notion calculators for sewing projects." };
export default function Page() {
    return (
        <div className="container" style={{ paddingBottom: "5rem" }}>
            <Breadcrumb items={[{ label: "Thread & Notion Tools" }]} />
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                <span className="category-badge" style={{ marginBottom: "1rem", display: "inline-flex" }}><span>🧵</span> Category 9</span>
                <h1>Thread & Notion Calculators</h1>
                <p style={{ fontSize: "1.125rem", color: "var(--color-text-secondary)", maxWidth: "700px", margin: "1rem auto 0" }}>
                    Thread, buttons, zippers, elastic, trim — 21 tools for every notion you need.
                </p>
            </div>
            <div className="tool-grid">
                {notionTools.map(tool => (
                    <Link key={tool.id} href={`/notions/${tool.slug}`} className="tool-card">
                        <div className="tool-card-icon">{tool.icon}</div>
                        <div className="tool-card-content"><h3>{tool.name}</h3><p>{tool.description}</p></div>
                        <span className="tool-card-arrow">→</span>
                    </Link>
                ))}
            </div>
        </div>
    );
}
