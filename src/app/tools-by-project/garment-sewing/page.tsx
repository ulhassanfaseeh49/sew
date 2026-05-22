import Link from "next/link";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { Shirt } from "lucide-react";
export const metadata = { title: "Garment Sewing Tools Collection | SewTools", description: "Body measurements, pattern fitting, yardage, and alterations" };
export default function Page() {
  const links = ["/body","/pattern","/yardage","/garment"];
  return (
    <div className="container" style={{ paddingBottom: "5rem" }}>
      <Breadcrumb items={[{ label: "By Project", href: "/tools-by-project" }, { label: "Garment Sewing" }]} />
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <span className="category-badge" style={{ marginBottom: "1rem", display: "inline-flex" }}><Shirt size={14} strokeWidth={1.5} /> Collection</span>
        <h1>Garment Sewing Tools</h1>
        <p style={{ fontSize: "1.125rem", color: "var(--color-text-secondary)", maxWidth: "700px", margin: "1rem auto 0" }}>Body measurements, pattern fitting, yardage, and alterations</p>
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