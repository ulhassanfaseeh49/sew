import Link from "next/link";
import Breadcrumb from "@/components/ui/Breadcrumb";
export const metadata = { title: "Tools by User Type — Find Your Tools | SewTools", description: "Find sewing tools organized by who you are." };
export default function Page() {
  const users = [{"name":"Complete Beginners","slug":"beginners","icon":"🌟","desc":"Essential tools for sewists just starting out","links":["/reference","/convert"]},{"name":"Quilters","slug":"quilters","icon":"🧩","desc":"Complete quilting tool suite","links":["/quilt","/bias-binding","/cutting"]},{"name":"Fashion Designers","slug":"fashion-designers","icon":"👗","desc":"Professional fashion design tools","links":["/body","/pattern","/fabric-type"]},{"name":"Costume Makers","slug":"costume-makers","icon":"🎭","desc":"Costume and cosplay specialist tools","links":["/costume","/skirt"]},{"name":"Etsy Sellers","slug":"etsy-sellers","icon":"🏪","desc":"Business and pricing tools for sellers","links":["/pricing"]},{"name":"Parents","slug":"parents","icon":"👶","desc":"Family sewing project tools","links":["/baby-kids"]},{"name":"Upholsterers","slug":"upholsterers","icon":"🛋️","desc":"Upholstery specialist tools","links":["/home-decor","/yardage"]},{"name":"Home Decorators","slug":"home-decorators","icon":"🏠","desc":"Home décor sewing tools","links":["/home-decor"]},{"name":"Professionals","slug":"professionals","icon":"✂️","desc":"Professional-grade tools and calculators","links":["/body","/pattern","/garment","/pricing"]},{"name":"Embroiderers","slug":"embroiderers","icon":"🪡","desc":"Embroidery and needlework tools","links":["/embroidery"]},{"name":"Textile Students","slug":"students","icon":"📚","desc":"Educational tools and references","links":["/reference","/fabric-type","/needles-thread"]}];
  return (
    <div className="container" style={{ paddingBottom: "5rem" }}>
      <Breadcrumb items={[{ label: "Tools by User Type" }]} />
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <h1>Tools by User Type</h1>
        <p style={{ fontSize: "1.125rem", color: "var(--color-text-secondary)", maxWidth: "700px", margin: "1rem auto 0" }}>Find tools curated for your experience level and interests.</p>
      </div>
      <div className="tool-grid">
        {users.map((u: any) => (
          <Link key={u.slug} href={"/tools-by-user/"+u.slug} className="tool-card">
            <div className="tool-card-icon">{u.icon}</div>
            <div className="tool-card-content">
              <h3>{u.name}</h3>
              <p>{u.desc}</p>
            </div>
            <span className="tool-card-arrow">→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}