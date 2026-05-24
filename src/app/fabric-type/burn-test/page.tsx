"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { Scale, Printer } from "lucide-react";

const results = [
 { fiber: "Cotton", approach: "Does not shrink or curl", inFlame: "Burns quickly, orange flame", afterFlame: "Continues burning", ash: "Soft gray/black, crushable", smell: "Burning paper/wood" },
 { fiber: "Linen", approach: "Does not shrink", inFlame: "Burns slightly slower", afterFlame: "Continues burning", ash: "Soft gray, slightly brittle", smell: "Burning grass/hay" },
 { fiber: "Wool", approach: "Curls away from flame", inFlame: "Burns slowly, may self-extinguish", afterFlame: "Self-extinguishes", ash: "Black, crushable", smell: "Burning hair (strong)" },
 { fiber: "Silk", approach: "Curls away", inFlame: "Burns slowly", afterFlame: "Self-extinguishes", ash: "Black bead, crushes to powder", smell: "Burning hair (mild)" },
 { fiber: "Polyester", approach: "Melts and shrinks away", inFlame: "Melts, black smoke", afterFlame: "Hard black bead", ash: "Hard, cannot crush", smell: "Chemical/sweet" },
 { fiber: "Nylon", approach: "Melts and shrinks", inFlame: "Melts, drips, burns slowly", afterFlame: "Hard gray/tan bead", ash: "Hard but slightly crushable", smell: "Celery-like chemical" },
 { fiber: "Acrylic", approach: "Melts and shrinks", inFlame: "Burns quickly, sooty, melts/drips", afterFlame: "Hard black bead", ash: "Irregular hard bead", smell: "Chemical/plastic" },
 { fiber: "Rayon", approach: "Does not shrink", inFlame: "Burns quickly like cotton", afterFlame: "Continues burning", ash: "Soft gray ash", smell: "Burning paper" },
 { fiber: "Acetate", approach: "Melts and shrinks", inFlame: "Burns with melting", afterFlame: "Hard irregular bead", ash: "Irregular hard bead", smell: "Vinegar (distinct)" },
];

export default function Page() {
 const [activeFaq, setActiveFaq] = useState<number | null>(null);
 const tH = { padding: "5px 8px", borderBottom: "2px solid hsl(0,0%,85%)", textAlign: "left" as const, fontSize: 10, fontWeight: 600 as const };
 const tD = { padding: "4px 8px", borderBottom: "1px solid hsl(0,0%,92%)", fontSize: 10 };

 return (
 <div className="container">
 <Breadcrumb items={[{ label: "Fabric Type", href: "/fabric-type" }, { label: "Burn Test" }]} />
 <div className="calculator-layout">
 <div className="calculator-main">
 <div className={styles.toolHeader}>
 <span className="category-badge"><Scale size={14} strokeWidth={1.5} />Fabric #425</span>
 <h1>Fabric Burn Test Guide</h1>
 <p>Identify unknown fabric fiber content using the burn test. Step-by-step guide with safety instructions.</p>
 </div>
 <div style={{ padding: 10, background: "hsl(0,30%,95%)", borderRadius: 8, fontSize: 12, marginBottom: 10, color: "hsl(0,60%,35%)", fontWeight: 600, borderLeft: "4px solid hsl(0,60%,50%)" }}>
 <strong>Safety First:</strong>Use metal bowl, tongs, well-ventilated area. Keep water/extinguisher nearby. Never leave flame unattended. Acrylic produces dangerous dripping melt.
 </div>
 <div className={`glass-card ${styles.calculatorCard}`}>
 <h2 className={styles.calcTitle}>Burn Test Reference Chart</h2>
 <div style={{ overflowX: "auto" }}>
 <table style={{ fontSize: 10, borderCollapse: "collapse", width: "100%" }}>
 <thead><tr><th style={tH}>Fiber</th><th style={tH}>Approaching</th><th style={tH}>In Flame</th><th style={tH}>After</th><th style={tH}>Ash</th><th style={tH}>Smell</th></tr></thead>
 <tbody>{results.map((r, i) =>(
 <tr key={i} style={{ background: i % 2 ? "hsl(0,0%,98%)" : undefined }}>
 <td style={{ ...tD, fontWeight: 600 }}>{r.fiber}</td><td style={tD}>{r.approach}</td><td style={tD}>{r.inFlame}</td><td style={tD}>{r.afterFlame}</td><td style={tD}>{r.ash}</td><td style={tD}>{r.smell}</td>
 </tr>
 ))}</tbody>
 </table>
 </div>
 </div>
 <div className={`glass-card ${styles.calculatorCard}`}>
 <h2 className={styles.calcTitle}>Quick Identification Rules</h2>
 <div style={{ fontSize: 12, lineHeight: 2 }}>
 <div><strong>Crushable soft ash</strong>= Natural cellulose (cotton, linen, rayon)</div>
 <div><strong>Hard bead that won&apos;t crush</strong>= Synthetic (polyester, nylon, acrylic)</div>
 <div><strong>Self-extinguishes + hair smell</strong>= Protein fiber (wool, silk)</div>
 <div><strong>Vinegar smell</strong>= Acetate</div>
 </div>
 </div>
 <div className="toolbar" style={{ marginBottom: 10 }}><button className="btn btn-secondary btn-sm" onClick={() =>window.print()}><Printer size={13} />Print Chart</button></div>
 <section className="faq-section"><h2>FAQ</h2><div style={{ marginTop: "1.5rem" }}>{[{ q: "Can burn test identify blends?", a: "Partially. Test warp and weft threads separately. Blends show mixed behaviors — partial melting with some ash, or two distinct smells. For definitive blend analysis, you need a lab test." }, { q: "When doesn't the burn test work?", a: "Heavily finished fabrics, coated fabrics, very tight blends, and fabrics with fire-retardant treatments will give unreliable results." }].map((f, i) =>(<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() =>setActiveFaq(activeFaq === i ? null : i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
 </div>
 <aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/fabric-type/fiber-comparator" className="related-tool-link">Fiber Comparator</a><a href="/fabric-type/care-symbols" className="related-tool-link">Care Symbols</a><a href="/fabric-type" className="related-tool-link">All Fabric Type</a></div></aside>
 </div>
 </div>
 );
}