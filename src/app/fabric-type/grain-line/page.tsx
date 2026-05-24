"use client";
import { useState, useMemo } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { Scale, ClipboardCopy, Printer } from "lucide-react";

export default function Page() {
 const [distA, setDistA] = useState("");
 const [distB, setDistB] = useState("");
 const [pLen, setPLen] = useState("");
 const [activeFaq, setActiveFaq] = useState<number | null>(null);

 const calc = useMemo(() =>{
 const a = parseFloat(distA) || 0;
 const b = parseFloat(distB) || 0;
 const l = parseFloat(pLen) || 0;
 if (a <= 0 || b <= 0 || l <= 0) return null;
 const diff = Math.abs(b - a);
 const angle = Math.atan(diff / l) * (180 / Math.PI);
 const onGrain = angle < 1;
 return { diff, angle, onGrain, adjust: onGrain ? "On grain ✓" : `Off by ${angle.toFixed(1)}° — shift ${diff.toFixed(2)}" to correct` };
 }, [distA, distB, pLen]);

 const grainTypes = [
 { name: "Straight Grain", desc: "Parallel to selvage (warp). Strongest, least stretch. Used for most pattern pieces.", dir: "↕" },
 { name: "Cross Grain", desc: "Perpendicular to selvage (weft). Slight stretch. Used for waistbands, some casings.", dir: "↔" },
 { name: "True Bias", desc: "45° to selvage. Maximum stretch and drape. For bias tape, ruffles, bias-cut garments.", dir: "⤢" },
 ];

 return (
 <div className="container">
 <Breadcrumb items={[{ label: "Fabric Type", href: "/fabric-type" }, { label: "Grain Line" }]} />
 <div className="calculator-layout">
 <div className="calculator-main">
 <div className={styles.toolHeader}>
 <span className="category-badge"><Scale size={14} strokeWidth={1.5} />Fabric #423</span>
 <h1>Fabric Grain Line Calculator</h1>
 <p>Check if your pattern piece is on grain and learn about straight grain, cross grain, and bias.</p>
 </div>
 <div className={`glass-card ${styles.calculatorCard}`}>
 <h2 className={styles.calcTitle}>Grain Types</h2>
 {grainTypes.map((g, i) =>(
 <div key={i} style={{ display: "flex", gap: 10, padding: "6px 0", borderBottom: i < grainTypes.length - 1 ? "1px solid hsl(0,0%,92%)" : "none", alignItems: "center" }}>
 <div style={{ fontSize: 24, minWidth: 36, textAlign: "center" }}>{g.dir}</div>
 <div><div style={{ fontSize: 12, fontWeight: 600 }}>{g.name}</div><div style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>{g.desc}</div></div>
 </div>
 ))}
 </div>
 <div className={`glass-card ${styles.calculatorCard}`}>
 <h2 className={styles.calcTitle}>On-Grain Checker</h2>
 <p style={{ fontSize: 11, color: "var(--color-text-secondary)", marginBottom: 8 }}>Measure from selvage to BOTH ends of the grain line arrow on your pattern piece.</p>
 <div className="calculator-form-row">
 <div className="input-group"><label className="input-label">Dist. to end A (in)</label><input type="number" className="input-field" placeholder="e.g. 4" value={distA} onChange={e =>setDistA(e.target.value)} step={0.125} /></div>
 <div className="input-group"><label className="input-label">Dist. to end B (in)</label><input type="number" className="input-field" placeholder="e.g. 4.25" value={distB} onChange={e =>setDistB(e.target.value)} step={0.125} /></div>
 <div className="input-group"><label className="input-label">Arrow length (in)</label><input type="number" className="input-field" placeholder="e.g. 10" value={pLen} onChange={e =>setPLen(e.target.value)} /></div>
 </div>
 </div>
 {calc && (
 <div className={`glass-card ${styles.calculatorCard}`} style={{ borderLeft: `4px solid ${calc.onGrain ? "hsl(160,50%,45%)" : "hsl(40,60%,50%)"}` }}>
 <h2 className={styles.calcTitle}>Result</h2>
 <div style={{ fontSize: 14, fontWeight: 700, color: calc.onGrain ? "hsl(160,50%,35%)" : "hsl(40,60%,40%)" }}>{calc.adjust}</div>
 {!calc.onGrain && <div style={{ fontSize: 11, color: "var(--color-text-secondary)", marginTop: 4 }}>Angle off grain: {calc.angle.toFixed(1)}°. Shift end B {calc.diff.toFixed(2)}&quot; {parseFloat(distB) >parseFloat(distA) ? "closer to" : "away from"} selvage.</div>}
 </div>
 )}
 <div className="toolbar" style={{ marginBottom: 10 }}>
 <button className="btn btn-secondary btn-sm" onClick={() =>navigator.clipboard.writeText(calc?.adjust || "")}><ClipboardCopy size={13} />Copy</button>
 <button className="btn btn-secondary btn-sm" onClick={() =>window.print()}><Printer size={13} />Print</button>
 </div>
 <section className="faq-section"><h2>FAQ</h2><div style={{ marginTop: "1.5rem" }}>{[{ q: "What happens if my pattern is off grain?", a: "Even 5° off grain causes garments to twist after washing. Seams pull, hems hang unevenly, and the garment looks crooked over time. Always check and correct grain before cutting." }, { q: "How do I straighten off-grain fabric?", a: "Pull a thread across the width to find the true cross grain. If fabric is off-grain, pull diagonally from the short corners. Steam pressing on the bias can help. For knits, steam and pin to a gridded mat." }].map((f, i) =>(<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() =>setActiveFaq(activeFaq === i ? null : i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
 </div>
 <aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/fabric-type/weave-guide" className="related-tool-link">Weave Guide</a><a href="/fabric-type" className="related-tool-link">All Fabric Type</a></div></aside>
 </div>
 </div>
 );
}