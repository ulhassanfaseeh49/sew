"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { Wand2, ClipboardCopy, Printer } from "lucide-react";

const sizes = [{"k":"small","n":"Small (36\")","dia":36},{"k":"med","n":"Medium (48\")","dia":48},{"k":"large","n":"Large (60\")","dia":60},{"k":"xl","n":"Extra Large (72\")","dia":72}];

export default function Page() {
    const [sizeKey, setSizeKey] = useState(sizes[0].k);
    const [qty, setQty] = useState(1);
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const faqItems = [{"q":"How many hoops do I need?","a":"Short skirt: 2-3 hoops. Knee length: 3-4 hoops. Floor length: 4-6 hoops. Space hoops 6-8 inches apart for smooth silhouette."}];
    const spec = sizes.find((s: typeof sizes[0]) => s.k === sizeKey) || sizes[0];
    const hoops=Math.ceil(40/8);const totalWire=Math.ceil(spec.dia*Math.PI*hoops/12);const yd=totalWire;
    return (<div className="container"><Breadcrumb items={[{ label: "Costume", href: "/costume" }, { label: "Hoop Skirt Diameter Calculator" }]} />
        <div className="calculator-layout"><div className="calculator-main">
            <div className={styles.toolHeader}><span className="category-badge"><Wand2 size={14} /> Costume #339</span><h1>Hoop Skirt Diameter Calculator</h1><p>Calculate hoop sizes for structured skirts.</p></div>
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
                    <div style={{fontSize:36,fontWeight:800,color:"hsl(280,50%,30%)"}}>{hoops}</div><div style={{fontSize:10}}>hoops, {totalWire} ft wire total</div>
                </div>
            </div>
            <div className="toolbar" style={{ marginBottom: 10 }}>
                <button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard.writeText(String(yd))}><ClipboardCopy size={13} /> Copy</button>
                <button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={13} /> Print</button>
            </div>
            <section className="faq-section"><h2>FAQ</h2><div style={{ marginTop: "1.5rem" }}>{faqItems.map((f, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
        </div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/costume" className="related-tool-link">All Costume</a></div></aside></div></div>);
}
