import Link from "next/link";
import Breadcrumb from "@/components/ui/Breadcrumb";
export const metadata = { title: "Tools by Project Type — Find Your Tools | SewTools", description: "Find sewing tools organized by what you are making." };
export default function Page() {
  const projects = [{"name":"Quilting","slug":"quilting","icon":"🧩","desc":"Quilt sizing, block cutting, binding, and yardage tools","links":["/quilt","/bias-binding","/cutting"]},{"name":"Garment Sewing","slug":"garment-sewing","icon":"👗","desc":"Body measurements, pattern fitting, yardage, and alterations","links":["/body","/pattern","/yardage","/garment"]},{"name":"Home Décor","slug":"home-decor","icon":"🏠","desc":"Curtains, pillows, tablecloths, and upholstery calculators","links":["/home-decor","/yardage"]},{"name":"Costume & Cosplay","slug":"costume-cosplay","icon":"🎭","desc":"Costume yardage, corset, armor, and historical garment tools","links":["/costume"]},{"name":"Bag Making","slug":"bag-making","icon":"👜","desc":"Tote, backpack, pouch, and accessory calculators","links":["/bags"]},{"name":"Baby & Children","slug":"baby-children","icon":"👶","desc":"Baby quilts, clothing, bibs, and children's project tools","links":["/baby-kids"]},{"name":"Embroidery","slug":"embroidery","icon":"🪡","desc":"Thread, hoop, cross-stitch, and appliqué calculators","links":["/embroidery"]},{"name":"Selling & Business","slug":"selling-business","icon":"💰","desc":"Pricing, fees, profit margins, and business tools","links":["/pricing"]},{"name":"Upholstery","slug":"upholstery","icon":"🛋️","desc":"Fabric estimation for furniture reupholstery projects","links":["/home-decor"]},{"name":"Sustainable Sewing","slug":"sustainable","icon":"♻️","desc":"Zero-waste, eco-fabric, upcycling, and carbon footprint tools","links":["/sustainable"]},{"name":"Knit Sewing","slug":"knit-sewing","icon":"🧶","desc":"Stretch percentage, ease, and serger settings for knits","links":["/stretch"]},{"name":"Bridal & Formal","slug":"bridal-formal","icon":"💍","desc":"Gown yardage, veil, and formal wear calculators","links":["/yardage","/skirt"]}];
  return (
    <div className="container" style={{ paddingBottom: "5rem" }}>
      <Breadcrumb items={[{ label: "Tools by Project" }]} />
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <h1>Tools by Project Type</h1>
        <p style={{ fontSize: "1.125rem", color: "var(--color-text-secondary)", maxWidth: "700px", margin: "1rem auto 0" }}>Find tools organized by what you are making.</p>
      </div>
      <div className="tool-grid">
        {projects.map((p: any) => (
          <Link key={p.slug} href={"/tools-by-project/"+p.slug} className="tool-card">
            <div className="tool-card-icon">{p.icon}</div>
            <div className="tool-card-content">
              <h3>{p.name}</h3>
              <p>{p.desc}</p>
            </div>
            <span className="tool-card-arrow">→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}