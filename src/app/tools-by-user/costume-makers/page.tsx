import Link from "next/link";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { Drama } from "lucide-react";
export const metadata = { title: "Tools for Costume Makers | SewTools", description: "Costume and cosplay specialist tools" };
export default function Page() {
  const links = ["/costume","/skirt"];
  return (
    <div className="container" style={{ paddingBottom: "5rem" }}>
      <Breadcrumb items={[{ label: "By User", href: "/tools-by-user" }, { label: "Costume Makers" }]} />
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <span className="category-badge" style={{ marginBottom: "1rem", display: "inline-flex" }}><Drama size={14} strokeWidth={1.5} /> For You</span>
        <h1>Tools for Costume Makers</h1>
        <p style={{ fontSize: "1.125rem", color: "var(--color-text-secondary)", maxWidth: "700px", margin: "1rem auto 0" }}>Costume and cosplay specialist tools</p>
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