"use client";
import { useState, useMemo } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { Baby, ClipboardCopy, Printer, ChevronDown } from "lucide-react";

function toFrac(v: number): string {
 if (v <= 0) return "0"; const w = Math.floor(v); const f = v - w;
 const map: [number, string][] = [[0, ""], [0.125, "⅛"], [0.25, "¼"], [0.375, "⅜"], [0.5, "½"], [0.625, "⅝"], [0.75, "¾"], [0.875, "⅞"]];
 let best = map[0], bd = 1;
 for (const [n, s] of map) { const d = Math.abs(f - n); if (d < bd) { bd = d; best = [n, s]; } }
 if (Math.abs(f - 1) < bd) return `${w + 1}`; if (!best[1]) return w >0 ? `${w}` : "0";
 return w >0 ? `${w} ${best[1]}` : `${best[1]}`;
}

type ClothStyle = "rectangle" | "contoured" | "diaper" | "large";
const clothSpecs: { key: ClothStyle; name: string; w: number; h: number; desc: string }[] = [
 { key: "rectangle", name: "Standard Rectangle", w: 10, h: 20, desc: "Simple, classic" },
 { key: "contoured", name: "Contoured", w: 10, h: 18, desc: "Wider at ends, narrow center" },
 { key: "diaper", name: "Diaper-Based", w: 10, h: 20, desc: "Prefold diaper + fabric cover" },
 { key: "large", name: "Extra Large", w: 12, h: 20, desc: "Full coverage" },
];

const faqItems = [
 { q: "What size should a burp cloth be?", a: "Standard: 10\" × 20\". This covers the shoulder well and catches spit-up. Contoured shapes (wider at ends, narrow in middle) fit over the shoulder better. Too small is useless — err on the larger side." },
 { q: "How much fabric for burp cloths?", a: "One standard 10\" × 20\" cloth needs about ⅝ yard each of front and back fabric. A set of 5 from 44\" fabric: about 1¾ yards. Terry cloth backing is most absorbent." },
 { q: "What is the best backing for burp cloths?", a: "Terry cloth is the gold standard — most absorbent. Chenille is soft and absorbent. Flannel works but is less absorbent. Minky is soft but not very absorbent. For maximum protection, terry is the best choice." },
 { q: "Can I use prefold diapers as burp cloths?", a: "Yes! Prefold cloth diapers are the most popular base. Buy birdseye or cotton prefold diapers, then sew a decorative fabric strip across the center. This is the fastest and most absorbent burp cloth option." },
 { q: "How many burp cloths does a baby need?", a: "8-12 is ideal for a newborn. Babies spit up frequently, and having enough for multiple changes per day plus laundry rotation is essential. A gift set of 5-6 is very appreciated." },
 { q: "How do I personalize burp cloths?", a: "Embroider before assembly — it's easier to hoop flat fabric. Place embroidery in the center or one end. Iron-on transfers also work well on cotton. Appliqué adds a fun decorative element." },
];

export default function Page() {
 const [clothStyle, setClothStyle] = useState<ClothStyle>("rectangle");
 const [qty, setQty] = useState(5);
 const [fabricWidth, setFabricWidth] = useState(44);
 const [showBulk, setShowBulk] = useState(false);
 const [activeFaq, setActiveFaq] = useState<number | null>(null);

 const spec = clothSpecs.find(c =>c.key === clothStyle) || clothSpecs[0];

 const calc = useMemo(() =>{
 const cutW = spec.w + 1;
 const cutH = spec.h + 1;
 const perRow = Math.floor(fabricWidth / cutW);
 const strips = Math.ceil(qty / Math.max(perRow, 1));
 const frontYd = Math.ceil(strips * cutH / 36 * 4) / 4;
 const backYd = clothStyle === "diaper" ? 0 : frontYd;
 return { cutW, cutH, perRow, frontYd, backYd };
 }, [spec, qty, fabricWidth, clothStyle]);

 const copyText = `${qty} ${spec.name} burp cloths: Front ${toFrac(calc.frontYd)} yd${calc.backYd >0 ? ` + Back ${toFrac(calc.backYd)} yd` : " (diaper-based)"}.`;

 return (
 <div className="container">
 <Breadcrumb items={[{ label: "Baby & Kids", href: "/baby-kids" }, { label: "Burp Cloth Calculator" }]} />
 <div className="calculator-layout">
 <div className="calculator-main">
 <div className={styles.toolHeader}>
 <span className="category-badge"><Baby size={14} strokeWidth={1.5} />Baby #392</span>
 <h1>Burp Cloth Calculator</h1>
 <p>Calculate fabric for standard, contoured, diaper-based, and extra-large burp cloths. Get yardage for sets and bulk production.</p>
 </div>

 <div className={`glass-card ${styles.calculatorCard}`}>
 <h2 className={styles.calcTitle}>① Style &amp; Quantity</h2>
 <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 5, marginBottom: 8 }}>
 {clothSpecs.map(c =>(
 <button key={c.key} className={`btn btn-sm ${clothStyle === c.key ? "btn-primary" : "btn-ghost"}`} onClick={() =>setClothStyle(c.key)} style={{ fontSize: 10, textAlign: "left", padding: "5px 7px", height: "auto" }}>
 <strong>{c.name}</strong><br /><span style={{ fontSize: 8, opacity: 0.7 }}>{c.w}&quot;×{c.h}&quot; — {c.desc}</span>
 </button>
 ))}
 </div>
 <div className="calculator-form-row">
 <div className="input-group"><label className="input-label">Quantity</label>
 <input type="number" className="input-field" value={qty} onChange={e =>setQty(Math.max(1, parseInt(e.target.value) || 1))} min={1} style={{ width: 70 }} /></div>
 <div className="input-group"><label className="input-label">Fabric width</label>
 <div style={{ display: "flex", gap: 3 }}>
 {[44, 54, 60].map(w =>(<button key={w} className={`btn btn-sm ${fabricWidth === w ? "btn-primary" : "btn-ghost"}`} onClick={() =>setFabricWidth(w)} style={{ fontSize: 10 }}>{w}&quot;</button>))}
 </div>
 </div>
 </div>
 </div>

 <div className={`glass-card ${styles.calculatorCard}`} style={{ borderLeft: "4px solid hsl(160,50%,40%)" }}>
 <h2 className={styles.calcTitle}>Your Fabric Needs</h2>
 <div style={{ display: "grid", gridTemplateColumns: calc.backYd >0 ? "1fr 1fr" : "1fr", gap: 10, marginBottom: 12 }}>
 <div style={{ padding: 14, background: "hsl(160,15%,95%)", borderRadius: 10, textAlign: "center" }}>
 <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "hsl(160,40%,35%)" }}>{clothStyle === "diaper" ? "Accent Fabric" : "Front Fabric"}</div>
 <div style={{ fontSize: 32, fontWeight: 800, color: "hsl(160,50%,30%)" }}>{toFrac(calc.frontYd)}</div>
 <div style={{ fontSize: 10 }}>yards</div>
 </div>
 {calc.backYd >0 && (
 <div style={{ padding: 14, background: "hsl(200,15%,95%)", borderRadius: 10, textAlign: "center" }}>
 <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "hsl(200,40%,35%)" }}>Back Fabric (Terry)</div>
 <div style={{ fontSize: 32, fontWeight: 800, color: "hsl(200,50%,30%)" }}>{toFrac(calc.backYd)}</div>
 <div style={{ fontSize: 10 }}>yards</div>
 </div>
 )}
 </div>
 <div className={styles.resultDetails}>
 <div className="result-row"><span>Cut size per cloth</span><strong>{calc.cutW}&quot; × {calc.cutH}&quot;</strong></div>
 <div className="result-row"><span>Cloths per fabric width</span><strong>{calc.perRow}</strong></div>
 {clothStyle === "diaper" && <div className="result-row"><span>Prefold diapers needed</span><strong>{qty}</strong></div>}
 </div>
 </div>

 <div className="toolbar" style={{ marginBottom: 10 }}>
 <button className="btn btn-secondary btn-sm" onClick={() =>navigator.clipboard.writeText(copyText)}><ClipboardCopy size={13} />Copy</button>
 <button className="btn btn-secondary btn-sm" onClick={() =>window.print()}><Printer size={13} />Print</button>
 </div>

 <div className={`glass-card ${styles.calculatorCard}`}>
 <button className="btn btn-sm btn-secondary" style={{ width: "100%", justifyContent: "space-between" }} onClick={() =>setShowBulk(!showBulk)}>Set / Bulk Planning
 <ChevronDown size={14} style={{ transform: showBulk ? "rotate(180deg)" : "none", transition: ".2s" }} />
 </button>
 {showBulk && (
 <div style={{ marginTop: 10, overflowX: "auto" }}>
 <table style={{ fontSize: 11, borderCollapse: "collapse", width: "100%" }}>
 <thead><tr><th style={{ padding: "5px 8px", borderBottom: "2px solid hsl(0,0%,85%)", textAlign: "left", fontSize: 11, fontWeight: 600 }}>Set</th><th style={{ padding: "5px 8px", borderBottom: "2px solid hsl(0,0%,85%)", textAlign: "left", fontSize: 11, fontWeight: 600 }}>Front</th><th style={{ padding: "5px 8px", borderBottom: "2px solid hsl(0,0%,85%)", textAlign: "left", fontSize: 11, fontWeight: 600 }}>Back</th></tr></thead>
 <tbody>{[3, 5, 8, 10, 25].map(q =>{
 const s = Math.ceil(q / Math.max(calc.perRow, 1));
 const y = Math.ceil(s * (spec.h + 1) / 36 * 4) / 4;
 return <tr key={q}><td style={{ padding: "4px 8px", borderBottom: "1px solid hsl(0,0%,92%)", fontSize: 11 }}>{q}</td><td style={{ padding: "4px 8px", borderBottom: "1px solid hsl(0,0%,92%)", fontSize: 11 }}>{toFrac(y)} yd</td><td style={{ padding: "4px 8px", borderBottom: "1px solid hsl(0,0%,92%)", fontSize: 11 }}>{clothStyle === "diaper" ? "—" : toFrac(y) + " yd"}</td></tr>;
 })}</tbody>
 </table>
 </div>
 )}
 </div>

 <section className="faq-section"><h2>Frequently Asked Questions</h2>
 <div style={{ marginTop: "1.5rem" }}>{faqItems.map((f, i) =>(
 <div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}>
 <button className="faq-question" onClick={() =>setActiveFaq(activeFaq === i ? null : i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></button>
 <div className="faq-answer">{f.a}</div>
 </div>
 ))}</div>
 </section>
 </div>
 <aside className="calculator-sidebar">
 <div className="glass-card" style={{ padding: "var(--space-5)", marginBottom: "var(--space-4)" }}>
 <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Shopping List</h4>
 <div style={{ fontSize: 12, lineHeight: 2.2 }}>
 <div>Front: <strong>{toFrac(calc.frontYd)} yd</strong></div>
 {calc.backYd >0 && <div>Terry: <strong>{toFrac(calc.backYd)} yd</strong></div>}
 {clothStyle === "diaper" && <div>Prefolds: <strong>{qty}</strong></div>}
 </div>
 </div>
 <div className="glass-card related-tools">
 <h4>Related Tools</h4>
 <a href="/baby-kids/bib-calculator" className="related-tool-link">Bib Calculator</a>
 <a href="/baby-kids/receiving-blanket" className="related-tool-link">Receiving Blanket</a>
 <a href="/baby-kids" className="related-tool-link">All Baby & Kids</a>
 </div>
 </aside>
 </div>
 </div>
 );
}