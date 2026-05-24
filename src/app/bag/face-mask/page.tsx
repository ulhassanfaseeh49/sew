"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { ShoppingBag, ClipboardCopy, Printer } from "lucide-react";

export default function Page() {
    const [size, setSize] = useState<"child" | "adult" | "large">("adult");
    const [qty, setQty] = useState(4);
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const faqItems = [{ q: "What fabric for face masks?", a: "Two layers of tightly woven 100% cotton. Add filter pocket for non-woven insert. Avoid stretchy fabrics." }];
    const dims = { child: { w: 7, h: 5 }, adult: { w: 9, h: 6 }, large: { w: 10, h: 7 } };
    const d = dims[size];
    const cutW = d.w + 1; const cutH = d.h + 1;
    return (<div className="container"><Breadcrumb items={[{ label: "Bags", href: "/bag" }, { label: "Face Mask" }]} />
        <div className="calculator-layout"><div className="calculator-main">
            <div className={styles.toolHeader}><span className="category-badge"><ShoppingBag size={14} /> Bag #384</span><h1>Face Mask Fabric Calculator</h1><p>Calculate fabric for pleated masks with filter pocket.</p></div>
            <div className={`glass-card ${styles.calculatorCard}`}>
                <h2 className={styles.calcTitle}>Size & Qty</h2>
                <div style={{ display: "flex", gap: 4, marginBottom: 8 }}>
                    {(["child", "adult", "large"] as const).map(s => (<button key={s} className={`btn btn-sm ${size === s ? "btn-primary" : "btn-ghost"}`} onClick={() => setSize(s)} style={{ fontSize: 10, textTransform: "capitalize" }}>{s}</button>))}
                </div>
                <div className="input-group"><label className="input-label">Qty</label><input type="number" className="input-field" value={qty} onChange={e => setQty(Math.max(1, parseInt(e.target.value) || 1))} min={1} style={{ width: 60 }} /></div>
            </div>
            <div className={`glass-card ${styles.calculatorCard}`} style={{ borderLeft: "4px solid hsl(200,50%,45%)" }}>
                <h2 className={styles.calcTitle}>Materials</h2>
                <div className={styles.resultDetails}>
                    <div className="result-row"><span>Outer fabric each</span><strong>{cutW}&quot; × {cutH}&quot;</strong></div>
                    <div className="result-row"><span>Lining each</span><strong>{cutW}&quot; × {cutH}&quot;</strong></div>
                    <div className="result-row"><span>Elastic per mask</span><strong>2 × 7&quot;</strong></div>
                    <div className="result-row"><span>Nose wire</span><strong>5&quot;</strong></div>
                    <div className="result-row"><span>Fabric for {qty}</span><strong>{qty <= 6 ? "¼" : "½"} yd each layer</strong></div>
                </div>
            </div>
            <div className="toolbar" style={{ marginBottom: 10 }}>
                <button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard.writeText(`${qty} face masks (${size}): ${cutW}" x ${cutH}" each layer`)}><ClipboardCopy size={13} /> Copy</button>
                <button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={13} /> Print</button>
            </div>
            <section className="faq-section"><h2>FAQ</h2><div style={{ marginTop: "1.5rem" }}>{faqItems.map((f, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
        </div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/bag" className="related-tool-link">All Bags</a></div></aside></div></div>);
}
