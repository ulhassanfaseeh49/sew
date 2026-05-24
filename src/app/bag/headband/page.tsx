"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { ShoppingBag, ClipboardCopy, Printer } from "lucide-react";

export default function Page() {
    const [width, setWidth] = useState(3);
    const [headCirc, setHeadCirc] = useState(22);
    const [qty, setQty] = useState(1);
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const faqItems = [{ q: "What width headband?", a: "Narrow: 1-2\". Standard wide: 3-4\". Turban style: 5-6\". Wider headbands need elastic at the back for secure fit." }];
    const cutW = width * 2 + 1;
    const cutL = headCirc - 4;
    const elasticLen = 4;
    return (<div className="container"><Breadcrumb items={[{ label: "Bags", href: "/bag" }, { label: "Headband" }]} />
        <div className="calculator-layout"><div className="calculator-main">
            <div className={styles.toolHeader}><span className="category-badge"><ShoppingBag size={14} /> Bag #382</span><h1>Headband Width &amp; Length Calculator</h1><p>Calculate fabric for headbands by width and style.</p></div>
            <div className={`glass-card ${styles.calculatorCard}`}>
                <h2 className={styles.calcTitle}>Details</h2>
                <div className="calculator-form-row">
                    <div className="input-group"><label className="input-label">Finished width</label><div style={{ display: "flex", gap: 3 }}>{[1, 2, 3, 4, 5].map(w => (<button key={w} className={`btn btn-sm ${width === w ? "btn-primary" : "btn-ghost"}`} onClick={() => setWidth(w)} style={{ fontSize: 10 }}>{w}&quot;</button>))}</div></div>
                    <div className="input-group"><label className="input-label">Head circ.</label><input type="number" className="input-field" value={headCirc} onChange={e => setHeadCirc(parseInt(e.target.value) || 22)} style={{ width: 70 }} /></div>
                    <div className="input-group"><label className="input-label">Qty</label><input type="number" className="input-field" value={qty} onChange={e => setQty(Math.max(1, parseInt(e.target.value) || 1))} min={1} style={{ width: 60 }} /></div>
                </div>
            </div>
            <div className={`glass-card ${styles.calculatorCard}`} style={{ borderLeft: "4px solid hsl(320,50%,45%)" }}>
                <h2 className={styles.calcTitle}>Cut Dimensions</h2>
                <div className={styles.resultDetails}>
                    <div className="result-row"><span>Cut fabric strip</span><strong>{cutW}&quot; × {cutL}&quot;</strong></div>
                    <div className="result-row"><span>Elastic (back)</span><strong>{elasticLen}&quot; × {width}&quot;</strong></div>
                    <div className="result-row"><span>For {qty}</span><strong>~{qty <= 4 ? "¼" : "½"} yd</strong></div>
                </div>
            </div>
            <div className="toolbar" style={{ marginBottom: 10 }}>
                <button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard.writeText(`Headband: ${cutW}" x ${cutL}" + ${elasticLen}" elastic`)}><ClipboardCopy size={13} /> Copy</button>
                <button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={13} /> Print</button>
            </div>
            <section className="faq-section"><h2>FAQ</h2><div style={{ marginTop: "1.5rem" }}>{faqItems.map((f, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
        </div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/bag/scrunchie" className="related-tool-link">Scrunchie</a><a href="/bag/hat-size" className="related-tool-link">Hat Size</a><a href="/bag" className="related-tool-link">All Bags</a></div></aside></div></div>);
}
