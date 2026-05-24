"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { Home, ClipboardCopy, Printer } from "lucide-react";

const sizes = [{k:"entry",n:"Entry (36x14x2)",w:36,h:14,d:2},{k:"window",n:"Window (48x18x3)",w:48,h:18,d:3},{k:"piano",n:"Piano (32x14x2)",w:32,h:14,d:2}];

export default function Page() {
    const [sizeKey, setSizeKey] = useState(sizes[0].k);
    const [qty, setQty] = useState(1);
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const faqItems = [{"q":"DIY bench cushion?","a":"Use 2-3 inch foam. Wrap in batting. Sew zippered cover with boxing strip. Add ties."}];
    const spec = sizes.find((s: typeof sizes[0]) => s.k === sizeKey) || sizes[0];
    const topW=spec.w+1;const topH=spec.h+1;const perim=(spec.w+spec.h)*2;const boxH=spec.d+1;const yd=Math.ceil((topW*topH*2+perim*boxH)/(54*36)*4)/4;
    const resultText = `Top: ${topW}" x ${topH}", ${yd} yd`;
    return (<div className="container"><Breadcrumb items={[{ label: "Home Decor", href: "/home-decor" }, { label: "Bench Upholstery Calculator" }]} />
        <div className="calculator-layout"><div className="calculator-main">
            <div className={styles.toolHeader}><span className="category-badge"><Home size={14} /> Home #451</span><h1>Bench Upholstery Calculator</h1><p>Fabric for bench seat cushions.</p></div>
            <div className={`glass-card ${styles.calculatorCard}`}>
                <h2 className={styles.calcTitle}>Select Size</h2>
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 8 }}>
                    {sizes.map((s: typeof sizes[0]) => (<button key={s.k} className={`btn btn-sm ${sizeKey === s.k ? "btn-primary" : "btn-ghost"}`} onClick={() => setSizeKey(s.k)} style={{ fontSize: 10 }}>{s.n}</button>))}
                </div>
                <div className="input-group"><label className="input-label">Qty</label><input type="number" className="input-field" value={qty} onChange={e => setQty(Math.max(1, parseInt(e.target.value) || 1))} min={1} style={{ width: 60 }} /></div>
            </div>
            <div className={`glass-card ${styles.calculatorCard}`} style={{ borderLeft: "4px solid hsl(200,50%,45%)" }}>
                <h2 className={styles.calcTitle}>Result</h2>
                <div style={{ padding: 14, background: "hsl(200,15%,95%)", borderRadius: 10, textAlign: "center" }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "hsl(200,50%,30%)" }}>{resultText}</div>
                </div>
            </div>
            <div className="toolbar" style={{ marginBottom: 10 }}>
                <button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard.writeText(resultText)}><ClipboardCopy size={13} /> Copy</button>
                <button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={13} /> Print</button>
            </div>
            <section className="faq-section"><h2>FAQ</h2><div style={{ marginTop: "1.5rem" }}>{faqItems.map((f, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
        </div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/home-decor" className="related-tool-link">All Home Decor</a></div></aside></div></div>);
}
