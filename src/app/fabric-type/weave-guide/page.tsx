"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { Scale, Printer } from "lucide-react";

const weaves = [
 { name: "Plain Weave", structure: "Over-under alternating", props: "Strongest, most stable, least drape", examples: "Muslin, calico, quilting cotton, poplin, chiffon, voile", sewing: "Easiest to cut and sew. Moderate fraying.", best: "Quilting, structured garments, beginners" },
 { name: "Twill Weave", structure: "Diagonal rib pattern", props: "More drape than plain, strong, diagonal grain", examples: "Denim, tweed, gabardine, chino, flannel", sewing: "Directional. Bias more exaggerated.", best: "Pants, jackets, sturdy garments" },
 { name: "Satin Weave", structure: "Long floats, minimal interlacing", props: "Smooth shiny surface, slippery, fluid drape, snags easily", examples: "Satin, sateen, charmeuse, duchess satin", sewing: "Slippery — use tissue paper. Pins cause damage.", best: "Formal wear, lining, bridal" },
 { name: "Basket Weave", structure: "Groups of threads over/under", props: "Textured, somewhat loose, more drape than plain", examples: "Oxford cloth, monk's cloth, hopsack", sewing: "Can unravel easily. Finish edges quickly.", best: "Shirts, casual wear" },
 { name: "Jacquard", structure: "Complex woven pattern on loom", props: "Design woven in (not printed), often reversible", examples: "Brocade, damask, tapestry, matelassé", sewing: "Thick, heavy, directional patterns.", best: "Formal wear, upholstery, special occasions" },
 { name: "Pile Weave", structure: "Cut or uncut loops on surface", props: "Nap direction critical — must cut all pieces same direction", examples: "Velvet, velveteen, corduroy, terry cloth", sewing: "Most challenging. Special pressing needed.", best: "Eveningwear, towels, cozy items" },
];

const knits = [
 { name: "Jersey (Single Knit)", props: "Smooth one side, textured other. Curls at edges. 2-way stretch.", examples: "T-shirts, dresses, activewear" },
 { name: "Interlock (Double Knit)", props: "Smooth both sides. Stable. Doesn't curl. Medium stretch.", examples: "Baby clothes, structured knit garments" },
 { name: "Rib Knit", props: "Vertical ribs. High stretch and recovery.", examples: "Neckbands, cuffs, waistbands" },
 { name: "French Terry", props: "Smooth outside, looped inside. Medium weight.", examples: "Sweatshirts, casual tops" },
];

export default function Page() {
 const [activeFaq, setActiveFaq] = useState<number | null>(null);

 return (
 <div className="container">
 <Breadcrumb items={[{ label: "Fabric Type", href: "/fabric-type" }, { label: "Weave Guide" }]} />
 <div className="calculator-layout">
 <div className="calculator-main">
 <div className={styles.toolHeader}>
 <span className="category-badge"><Scale size={14} strokeWidth={1.5} />Fabric #426</span>
 <h1>Fabric Weave Type Guide</h1>
 <p>Visual guide to weave structures — plain, twill, satin, jacquard, pile — and knit constructions. Understand how weave affects fabric behavior.</p>
 </div>
 <div className={`glass-card ${styles.calculatorCard}`}>
 <h2 className={styles.calcTitle}>Woven Fabrics</h2>
 {weaves.map((w, i) =>(
 <div key={i} style={{ padding: "8px 0", borderBottom: i < weaves.length - 1 ? "1px solid hsl(0,0%,90%)" : "none" }}>
 <div style={{ fontSize: 13, fontWeight: 700, color: "hsl(200,50%,35%)" }}>{w.name}</div>
 <div style={{ fontSize: 11, color: "var(--color-text-secondary)", marginTop: 2 }}><strong>Structure:</strong>{w.structure}</div>
 <div style={{ fontSize: 11, color: "var(--color-text-secondary)" }}><strong>Properties:</strong>{w.props}</div>
 <div style={{ fontSize: 11, color: "var(--color-text-secondary)" }}><strong>Examples:</strong>{w.examples}</div>
 <div style={{ fontSize: 11, color: "var(--color-text-secondary)" }}><strong>Sewing:</strong>{w.sewing}</div>
 <div style={{ fontSize: 11, color: "hsl(160,40%,35%)" }}>✓ <strong>Best for:</strong>{w.best}</div>
 </div>
 ))}
 </div>
 <div className={`glass-card ${styles.calculatorCard}`}>
 <h2 className={styles.calcTitle}>Knit Constructions</h2>
 {knits.map((k, i) =>(
 <div key={i} style={{ padding: "6px 0", borderBottom: i < knits.length - 1 ? "1px solid hsl(0,0%,92%)" : "none" }}>
 <div style={{ fontSize: 13, fontWeight: 700, color: "hsl(280,50%,35%)" }}>{k.name}</div>
 <div style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>{k.props}</div>
 <div style={{ fontSize: 11, color: "hsl(160,40%,35%)" }}>✓ {k.examples}</div>
 </div>
 ))}
 </div>
 <div className="toolbar" style={{ marginBottom: 10 }}><button className="btn btn-secondary btn-sm" onClick={() =>window.print()}><Printer size={13} />Print</button></div>
 <section className="faq-section"><h2>FAQ</h2><div style={{ marginTop: "1.5rem" }}>{[{ q: "Why does weave type matter?", a: "Same fiber in different weaves behaves completely differently. Plain-woven cotton (quilting cotton) is crisp and stable. Satin-woven cotton (sateen) is smooth and drapey. Weave determines fraying, stretch, and sewing difficulty." }, { q: "What's the difference between woven and knit?", a: "Wovens: threads interlace at right angles. Stable, little stretch. Knits: threads loop together. Stretchy, more flexible. You need different needles, stitches, and techniques for each." }].map((f, i) =>(<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() =>setActiveFaq(activeFaq === i ? null : i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
 </div>
 <aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/fabric-type/grain-line" className="related-tool-link">Grain Line</a><a href="/fabric-type/property-comparator" className="related-tool-link">Property Comparator</a><a href="/fabric-type" className="related-tool-link">All Fabric Type</a></div></aside>
 </div>
 </div>
 );
}