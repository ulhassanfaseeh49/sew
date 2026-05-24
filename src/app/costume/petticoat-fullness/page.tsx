"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { Wand2, ClipboardCopy, Printer } from "lucide-react";

const sizes = [{"k":"subtle","n":"Subtle (2x)","r":2},{"k":"full","n":"Full (3x)","r":3},{"k":"dramatic","n":"Dramatic (4x)","r":4},{"k":"bridal","n":"Bridal (5x)","r":5}];

export default function Page() {
    const [sizeKey, setSizeKey] = useState(sizes[0].k);
    const [qty, setQty] = useState(1);
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const faqItems = [{"q":"How much tulle for a petticoat?","a":"Multiply your waist measurement by the fullness ratio. A 28-inch waist at 3x fullness needs 84 inches of tulle per layer. Most petticoats have 2-4 layers."}];
    const spec = sizes.find((s: typeof sizes[0]) => s.k === sizeKey) || sizes[0];
    const waist=28;const ungathered=waist*spec.r;const yd=Math.ceil(ungathered/36);
    return (<div className="container"><Breadcrumb items={[{ label: "Costume", href: "/costume" }, { label: "Petticoat Fullness Calculator" }]} />
        <div className="calculator-layout"><div className="calculator-main">
            <div className={styles.toolHeader}><span className="category-badge"><Wand2 size={14} /> Costume #336</span><h1>Petticoat Fullness Calculator</h1><p>Calculate tulle/netting for petticoat fullness.</p></div>
            <div className={`glass-card ${styles.calculatorCard}`}>
                <h2 className={styles.calcTitle}>Select Type</h2>
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 8 }}>
                    {sizes.map((s: typeof sizes[0]) => (<button key={s.k} className={`btn btn-sm ${sizeKey === s.k ? "btn-primary" : "btn-ghost"}`} onClick={() => setSizeKey(s.k)} style={{ fontSize: 10 }}>{s.n}</button>))}
                </div>
                
            </div>
            <div className={`glass-card ${styles.calculatorCard}`} style={{ borderLeft: "4px solid hsl(280,50%,45%)" }}>
                <h2 className={styles.calcTitle}>Result</h2>
                <div style={{ padding: 14, background: "hsl(280,15%,95%)", borderRadius: 10, textAlign: "center" }}>
                    <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "hsl(280,40%,35%)" }}>Estimate</div>
                    <div style={{fontSize:36,fontWeight:800,color:"hsl(280,50%,30%)"}}>{ungathered}"</div><div style={{fontSize:10}}>ungathered width ({yd} yd)</div>
                </div>
            </div>
            <div className="toolbar" style={{ marginBottom: 10 }}>
                <button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard.writeText(String(yd))}><ClipboardCopy size={13} /> Copy</button>
                <button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={13} /> Print</button>
            </div>
            <section className="faq-section"><h2>FAQ</h2><div style={{ marginTop: "1.5rem" }}>{faqItems.map((f, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
        </div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/costume" className="related-tool-link">All Costume</a></div></aside></div></div>);
}
