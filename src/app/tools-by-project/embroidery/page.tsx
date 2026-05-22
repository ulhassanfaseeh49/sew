import Link from "next/link";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { Scissors } from "lucide-react";
export const metadata = { title: "Embroidery Tools Collection | SewTools", description: "Thread, hoop, cross-stitch, and appliqué calculators" };
export default function Page() {
  const links = ["/embroidery"];
  return (
    <div className="container" style={{ paddingBottom: "5rem" }}>
      <Breadcrumb items={[{ label: "By Project", href: "/tools-by-project" }, { label: "Embroidery" }]} />
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <span className="category-badge" style={{ marginBottom: "1rem", display: "inline-flex" }}><Scissors size={14} strokeWidth={1.5} /> Collection</span>
        <h1>Embroidery Tools</h1>
        <p style={{ fontSize: "1.125rem", color: "var(--color-text-secondary)", maxWidth: "700px", margin: "1rem auto 0" }}>Thread, hoop, cross-stitch, and appliqué calculators</p>
      </div>
      <div className="tool-grid">
        {links.map((l: string) => (
          <Link key={l} href={l} className="tool-card">
            <div className="tool-card-icon"></div>
            <div className="tool-card-content">
              <h3>{l.replace(/\//g, "").replace(/-/g, " ")}</h3>
              <p>View all tools in this category</p>
            </div>
            <span className="tool-card-arrow">→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}