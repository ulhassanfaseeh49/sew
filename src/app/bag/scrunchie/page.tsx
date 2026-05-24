"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { ShoppingBag, ClipboardCopy, Printer } from "lucide-react";

export default function Page() {
    const [size, setSize] = useState<"reg" | "xl">("reg");
    const [qty, setQty] = useState(5);
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const faqItems = [{ q: "How much fabric for a scrunchie?", a: "Standard: 3.5\"×22\" strip. Oversized: 5\"×25\". Fat quarters (18×22\") make 4-5 regular scrunchies. Great scrap project!" }];
    const w = size === "reg" ? 3.5 : 5;
    const l = size === "reg" ? 22 : 25;
    const elastic = size === "reg" ? 8 : 9;
    return (<div className="container"><Breadcrumb items={[{ label: "Bags", href: "/bag" }, { label: "Scrunchie" }]} />
        <div className="calculator-layout"><div className="calculator-main">
            <div className={styles.toolHeader}><span className="category-badge"><ShoppingBag size={14} /> Bag #383</span><h1>Scrunchie Fabric Calculator</h1><p>Calculate fabric strips and elastic for scrunchies.</p></div>
            <div className={`glass-card ${styles.calculatorCard}`}>
                <h2 className={styles.calcTitle}>Size & Quantity</h2>
                <div style={{ display: "flex", gap: 4, marginBottom: 8 }}>
                    <button className={`btn btn-sm ${size === "reg" ? "btn-primary" : "btn-ghost"}`} onClick={() => setSize("reg")} style={{ fontSize: 10 }}>Standard</button>
                    <button className={`btn btn-sm ${size === "xl" ? "btn-primary" : "btn-ghost"}`} onClick={() => setSize("xl")} style={{ fontSize: 10 }}>Oversized</button>
                </div>
                <div className="input-group"><label className="input-label">Qty</label><input type="number" className="input-field" value={qty} onChange={e => setQty(Math.max(1, parseInt(e.target.value) || 1))} min={1} style={{ width: 60 }} /></div>
            </div>
            <div className={`glass-card ${styles.calculatorCard}`} style={{ borderLeft: "4px solid hsl(320,50%,45%)" }}>
                <h2 className={styles.calcTitle}>Materials</h2>
                <div className={styles.resultDetails}>
                    <div className="result-row"><span>Each strip</span><strong>{w}&quot; × {l}&quot;</strong></div>
                    <div className="result-row"><span>Elastic per scrunchie</span><strong>{elastic}&quot; (¼&quot; wide)</strong></div>
                    <div className="result-row"><span>Fabric for {qty}</span><strong>{qty <= 4 ? "1 fat quarter" : qty <= 10 ? "¼ yd" : "½ yd"}</strong></div>
                    <div className="result-row"><span>Total elastic</span><strong>{elastic * qty}&quot;</strong></div>
                </div>
            </div>
            <div className="toolbar" style={{ marginBottom: 10 }}>
                <button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard.writeText(`${qty} scrunchies: ${w}" x ${l}" strips, ${elastic * qty}" elastic`)}><ClipboardCopy size={13} /> Copy</button>
                <button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={13} /> Print</button>
            </div>
            <section className="faq-section"><h2>FAQ</h2><div style={{ marginTop: "1.5rem" }}>{faqItems.map((f, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
        </div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/bag/headband" className="related-tool-link">Headband</a><a href="/bag" className="related-tool-link">All Bags</a></div></aside></div></div>);
}
