import Link from "next/link";
import Breadcrumb from "@/components/ui/Breadcrumb";
export const metadata = { title: "Selling & Business Tools Collection | SewTools", description: "Pricing, fees, profit margins, and business tools" };
export default function Page() {
  const links = ["/pricing"];
  return (
    <div className="container" style={{ paddingBottom: "5rem" }}>
      <Breadcrumb items={[{ label: "By Project", href: "/tools-by-project" }, { label: "Selling & Business" }]} />
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <span className="category-badge" style={{ marginBottom: "1rem", display: "inline-flex" }}><span>💰</span> Collection</span>
        <h1>Selling & Business Tools</h1>
        <p style={{ fontSize: "1.125rem", color: "var(--color-text-secondary)", maxWidth: "700px", margin: "1rem auto 0" }}>Pricing, fees, profit margins, and business tools</p>
      </div>
      <div className="tool-grid">
        {links.map((l: string) => (
          <Link key={l} href={l} className="tool-card">
            <div className="tool-card-icon">📂</div>
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