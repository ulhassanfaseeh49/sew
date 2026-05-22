import Link from "next/link";
import Breadcrumb from "@/components/ui/Breadcrumb";
export const metadata = { title: "Tools by Category — All 26 Categories | SewTools", description: "Browse all sewing tools organized by category." };
export default function Page() {
  const categories = [{"name":"Unit Converters","slug":"/convert","icon":"🔄","count":26},{"name":"Yardage Calculators","slug":"/yardage","icon":"📐","count":32},{"name":"Fabric Cost","slug":"/cost","icon":"💵","count":16},{"name":"Quilt Calculators","slug":"/quilt","icon":"🧩","count":14},{"name":"Cutting & Layout","slug":"/cutting","icon":"✂️","count":16},{"name":"Pattern Tools","slug":"/pattern","icon":"📋","count":14},{"name":"Body Measurement","slug":"/body","icon":"📏","count":16},{"name":"Seam & Stitch","slug":"/seam-allowance","icon":"🧵","count":14},{"name":"Home Décor","slug":"/home-decor","icon":"🏠","count":18},{"name":"Zipper & Closure","slug":"/notions","icon":"🔗","count":10},{"name":"Binding & Bias","slug":"/bias-binding","icon":"🎗️","count":12},{"name":"Alterations","slug":"/garment","icon":"✏️","count":10},{"name":"Elastic & Waistband","slug":"/elastic","icon":"〰️","count":9},{"name":"Knit & Stretch","slug":"/stretch","icon":"🧶","count":10},{"name":"Embroidery","slug":"/embroidery","icon":"🪡","count":13},{"name":"Lace & Trim","slug":"/lace-trim","icon":"🎀","count":11},{"name":"Costume & Cosplay","slug":"/costume","icon":"🎭","count":17},{"name":"Circle & Skirt","slug":"/skirt","icon":"👗","count":16},{"name":"Bag & Accessory","slug":"/bags","icon":"👜","count":19},{"name":"Baby & Children","slug":"/baby-kids","icon":"👶","count":14},{"name":"Pricing & Selling","slug":"/pricing","icon":"💰","count":15},{"name":"Fabric Weight & Type","slug":"/fabric-type","icon":"⚖️","count":13},{"name":"Needle & Thread","slug":"/needles-thread","icon":"🪡","count":10},{"name":"Sewing Machine","slug":"/machine","icon":"🧵","count":12},{"name":"Sustainable","slug":"/sustainable","icon":"♻️","count":11},{"name":"Reference & Education","slug":"/reference","icon":"📚","count":24}];
  const total = categories.reduce((a: number, c: any) => a + c.count, 0);
  return (
    <div className="container" style={{ paddingBottom: "5rem" }}>
      <Breadcrumb items={[{ label: "Tools by Category" }]} />
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <h1>Tools by Category</h1>
        <p style={{ fontSize: "1.125rem", color: "var(--color-text-secondary)", maxWidth: "700px", margin: "1rem auto 0" }}>{total} tools across {categories.length} categories</p>
      </div>
      <div className="tool-grid">
        {categories.map((cat: any, i: number) => (
          <Link key={cat.slug} href={cat.slug} className="tool-card">
            <div className="tool-card-icon">{cat.icon}</div>
            <div className="tool-card-content">
              <h3>{cat.name}</h3>
              <p>{cat.count} tools</p>
            </div>
            <span className="tool-card-arrow">→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}