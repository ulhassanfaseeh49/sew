import Link from "next/link";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { curtainTools } from "@/lib/tools/curtains";
export const metadata = { title: "Curtain & Window Treatment Tools — 17 Free Calculators | SewTools", description: "Curtain yardage, fullness, headers, blinds, valances, and window measurement tools." };
export default function Page() {
 return (
 <div className="container" style={{ paddingBottom: "5rem" }}>
 <Breadcrumb items={[{ label: "Curtain & Window Tools" }]} />
 <div style={{ textAlign: "center", marginBottom: "3rem" }}>
 <span className="category-badge" style={{ marginBottom: "1rem", display: "inline-flex" }}><span></span>Category 12</span>
 <h1>Curtain & Window Treatment Tools</h1>
 <p style={{ fontSize: "1.125rem", color: "var(--color-text-secondary)", maxWidth: "700px", margin: "1rem auto 0" }}>Curtains, blinds, valances, and more — 17 calculators for perfect window treatments.
 </p>
 </div>
 <div className="tool-grid">
 {curtainTools.map(tool =>(
 <Link key={tool.id} href={`/curtains/${tool.slug}`} className="tool-card">
 <div className="tool-card-icon">{tool.icon}</div>
 <div className="tool-card-content"><h3>{tool.name}</h3><p>{tool.description}</p></div>
 <span className="tool-card-arrow">→</span>
 </Link>
 ))}
 </div>
 </div>
 );
}
