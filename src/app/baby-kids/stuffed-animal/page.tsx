"use client";
import { useState, useMemo } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { Baby, ClipboardCopy, Printer } from "lucide-react";

function toFrac(v: number): string {
 if (v <= 0) return "0"; const w = Math.floor(v); const f = v - w;
 const map: [number, string][] = [[0, ""], [0.125, "⅛"], [0.25, "¼"], [0.375, "⅜"], [0.5, "½"], [0.625, "⅝"], [0.75, "¾"], [0.875, "⅞"]];
 let best = map[0], bd = 1;
 for (const [n, s] of map) { const d = Math.abs(f - n); if (d < bd) { bd = d; best = [n, s]; } }
 if (Math.abs(f - 1) < bd) return `${w + 1}`; if (!best[1]) return w >0 ? `${w}` : "0";
 return w >0 ? `${w} ${best[1]}` : `${best[1]}`;
}

type ToySize = "small" | "medium" | "large" | "xlarge";
const toySizes: { key: ToySize; name: string; h: number; mainYd: number; stuffOz: number }[] = [
 { key: "small", name: "Small (6\")", h: 6, mainYd: 0.25, stuffOz: 3 },
 { key: "medium", name: "Medium (10\")", h: 10, mainYd: 0.375, stuffOz: 6 },
 { key: "large", name: "Large (14\")", h: 14, mainYd: 0.625, stuffOz: 12 },
 { key: "xlarge", name: "Extra Large (18\")", h: 18, mainYd: 1, stuffOz: 20 },
];

const faqItems = [
 { q: "How much fabric for a stuffed animal?", a: "Small (6\"): ¼ yard. Medium (10\"): ⅜ yard. Large (14\"): ⅝ yard. XL (18\"): 1 yard. Minky/plush uses more due to nap direction. Add ⅛ yard for contrast fabric (belly, ears)." },
 { q: "How much stuffing for a plush toy?", a: "Small (6\"): 3 oz. Medium (10\"): 6 oz. Large (14\"): 12 oz. Use polyester fiberfill for most toys. Stuff firmly for a plump look — under-stuffed toys look sad." },
 { q: "What are safety eyes?", a: "Plastic eyes with a washer backing that locks securely. For children under 3: DO NOT use safety eyes — embroider eyes instead. Safety eyes should be installed BEFORE stuffing, with washer pushed on firmly." },
 { q: "Best fabric for stuffed animals?", a: "Minky/plush: softest, most toy-like. Fleece: easiest for beginners (no fraying). Cotton: good for simple dolls. Corduroy: adds texture. Felt: great for small details and appliqué features." },
];

export default function Page() {
 const [size, setSize] = useState<ToySize>("medium");
 const [qty, setQty] = useState(1);
 const [useMinky, setUseMinky] = useState(false);
 const [activeFaq, setActiveFaq] = useState<number | null>(null);

 const spec = toySizes.find(s =>s.key === size) || toySizes[1];

 const calc = useMemo(() =>{
 const multi = useMinky ? 1.2 : 1; // minky needs more due to nap
 const mainYd = Math.ceil(spec.mainYd * multi * qty * 4) / 4;
 const contrastYd = Math.ceil(qty * 0.125 * 4) / 4;
 const stuffing = spec.stuffOz * qty;
 const safetyEyes = qty * 2;
 return { mainYd, contrastYd, stuffing, safetyEyes };
 }, [spec, qty, useMinky]);

 return (
 <div className="container">
 <Breadcrumb items={[{ label: "Baby & Kids", href: "/baby-kids" }, { label: "Stuffed Animal" }]} />
 <div className="calculator-layout">
 <div className="calculator-main">
 <div className={styles.toolHeader}>
 <span className="category-badge"><Baby size={14} strokeWidth={1.5} />Baby #398</span>
 <h1>Stuffed Animal / Toy Size Calculator</h1>
 <p>Calculate fabric, stuffing, and safety eyes for soft toys and plushies by size.</p>
 </div>

 <div className={`glass-card ${styles.calculatorCard}`}>
 <h2 className={styles.calcTitle}>Details</h2>
 <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 8 }}>
 {toySizes.map(s =>(<button key={s.key} className={`btn btn-sm ${size === s.key ? "btn-primary" : "btn-ghost"}`} onClick={() =>setSize(s.key)} style={{ fontSize: 10 }}>{s.name}</button>))}
 </div>
 <div className="calculator-form-row">
 <div className="input-group"><label className="input-label">Quantity</label>
 <input type="number" className="input-field" value={qty} onChange={e =>setQty(Math.max(1, parseInt(e.target.value) || 1))} min={1} style={{ width: 60 }} /></div>
 <div className="input-group"><label className="input-label">Fabric</label>
 <div style={{ display: "flex", gap: 3 }}>
 <button className={`btn btn-sm ${!useMinky ? "btn-primary" : "btn-ghost"}`} onClick={() =>setUseMinky(false)} style={{ fontSize: 10 }}>Cotton/Fleece</button>
 <button className={`btn btn-sm ${useMinky ? "btn-primary" : "btn-ghost"}`} onClick={() =>setUseMinky(true)} style={{ fontSize: 10 }}>Minky/Plush</button>
 </div>
 </div>
 </div>
 </div>

 <div className={`glass-card ${styles.calculatorCard}`} style={{ borderLeft: "4px solid hsl(320,50%,45%)" }}>
 <h2 className={styles.calcTitle}>Materials Needed</h2>
 <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 12 }}>
 <div style={{ padding: 12, background: "hsl(320,15%,95%)", borderRadius: 10, textAlign: "center" }}>
 <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "hsl(320,40%,35%)" }}>Main Fabric</div>
 <div style={{ fontSize: 28, fontWeight: 800, color: "hsl(320,50%,30%)" }}>{toFrac(calc.mainYd)}</div>
 <div style={{ fontSize: 10 }}>yards</div>
 </div>
 <div style={{ padding: 12, background: "hsl(40,15%,95%)", borderRadius: 10, textAlign: "center" }}>
 <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "hsl(40,40%,35%)" }}>Stuffing</div>
 <div style={{ fontSize: 28, fontWeight: 800, color: "hsl(40,50%,30%)" }}>{calc.stuffing}</div>
 <div style={{ fontSize: 10 }}>oz fiberfill</div>
 </div>
 <div style={{ padding: 12, background: "hsl(200,15%,95%)", borderRadius: 10, textAlign: "center" }}>
 <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "hsl(200,40%,35%)" }}>Safety Eyes</div>
 <div style={{ fontSize: 28, fontWeight: 800, color: "hsl(200,50%,30%)" }}>{calc.safetyEyes}</div>
 <div style={{ fontSize: 10 }}>pairs</div>
 </div>
 </div>
 <div className={styles.resultDetails}>
 <div className="result-row"><span>Contrast fabric</span><strong>{toFrac(calc.contrastYd)} yd</strong></div>
 </div>
 <div style={{ fontSize: 10, color: "hsl(0,60%,45%)", marginTop: 6 }}>⚠ For children under 3 years: embroider eyes instead of using safety eyes — choking hazard.</div>
 </div>

 <div className="toolbar" style={{ marginBottom: 10 }}>
 <button className="btn btn-secondary btn-sm" onClick={() =>navigator.clipboard.writeText(`${qty} ${spec.name} stuffed toys: ${toFrac(calc.mainYd)} yd, ${calc.stuffing} oz stuffing, ${calc.safetyEyes} eyes.`)}><ClipboardCopy size={13} />Copy</button>
 <button className="btn btn-secondary btn-sm" onClick={() =>window.print()}><Printer size={13} />Print</button>
 </div>

 <section className="faq-section"><h2>FAQ</h2>
 <div style={{ marginTop: "1.5rem" }}>{faqItems.map((f, i) =>(
 <div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}>
 <button className="faq-question" onClick={() =>setActiveFaq(activeFaq === i ? null : i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></button>
 <div className="faq-answer">{f.a}</div>
 </div>
 ))}</div>
 </section>
 </div>
 <aside className="calculator-sidebar">
 <div className="glass-card related-tools">
 <h4>Related Tools</h4>
 <a href="/baby-kids/baby-clothing-yardage" className="related-tool-link">Baby Clothing</a>
 <a href="/baby-kids" className="related-tool-link">All Baby & Kids</a>
 </div>
 </aside>
 </div>
 </div>
 );
}