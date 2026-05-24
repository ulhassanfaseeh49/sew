"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { Home, ClipboardCopy, Printer } from "lucide-react";

const sizes = [{k:"twin",n:"Twin (72x102)",w:72,h:102},{k:"full",n:"Full (86x102)",w:86,h:102},{k:"queen",n:"Queen (92x108)",w:92,h:108},{k:"king",n:"King (108x108)",w:108,h:108}];

export default function Page() {
    const [sizeKey, setSizeKey] = useState(sizes[0].k);
    const [qty, setQty] = useState(1);
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const faqItems = [{"q":"Best fabric for sheets?","a":"Percale (200+ thread count): crisp. Sateen: smooth. Linen: breathable. Must be 90+ inches wide."}];
    const spec = sizes.find((s: typeof sizes[0]) => s.k === sizeKey) || sizes[0];
    const cutW=spec.w+4;const cutH=spec.h+8;const yd=Math.ceil(cutH/36*4)/4;
    const resultText = `${cutW}" x ${cutH}" (${yd} yd of 90-108" sheeting)`;
    return (<div className="container"><Breadcrumb items={[{ label: "Home Decor", href: "/home-decor" }, { label: "Flat Sheet Calculator" }]} />
        <div className="calculator-layout"><div className="calculator-main">
            <div className={styles.toolHeader}><span className="category-badge"><Home size={14} /> Home #444</span><h1>Flat Sheet Calculator</h1><p>Calculate fabric for flat sheets.</p></div>
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
