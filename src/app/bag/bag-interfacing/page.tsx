"use client";
import { useState, useMemo } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { ShoppingBag, ClipboardCopy, Printer } from "lucide-react";

function toFrac(v: number): string {
    if (v <= 0) return "0"; const w = Math.floor(v); const f = v - w;
    const map: [number, string][] = [[0, ""], [0.125, "⅛"], [0.25, "¼"], [0.375, "⅜"], [0.5, "½"], [0.625, "⅝"], [0.75, "¾"], [0.875, "⅞"]];
    let best = map[0], bd = 1;
    for (const [n, s] of map) { const d = Math.abs(f - n); if (d < bd) { bd = d; best = [n, s]; } }
    if (Math.abs(f - 1) < bd) return `${w + 1}`; if (!best[1]) return w > 0 ? `${w}` : "0";
    return w > 0 ? `${w} ${best[1]}` : `${best[1]}`;
}

export default function Page() {
    const [bagW, setBagW] = useState(14);
    const [bagH, setBagH] = useState(12);
    const [bagD, setBagD] = useState(4);
    const [panels, setPanels] = useState<"all" | "sides" | "bottom">("all");
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const faqItems = [{ q: "Do I need interfacing for all bag panels?", a: "For structured bags: yes, all panels. For softer bags: sides and bottom only. For unstructured totes: bottom panel only or none." }];
    const calc = useMemo(() => {
        const sa = 0.5; const bW = bagW + sa * 2; const bH = bagH + sa * 2; const bD = bagD + sa * 2;
        let area = 0;
        if (panels === "all") area = (bW * bH * 2) + (bD * bH * 2) + (bW * bD);
        else if (panels === "sides") area = (bW * bH * 2) + (bD * bH * 2);
        else area = bW * bD;
        const yd = Math.ceil(area / (44 * 36) * 4) / 4 + 0.125;
        return { area, yd: Math.ceil(yd * 4) / 4 };
    }, [bagW, bagH, bagD, panels]);
    return (<div className="container"><Breadcrumb items={[{ label: "Bags", href: "/bag" }, { label: "Interfacing" }]} />
        <div className="calculator-layout"><div className="calculator-main">
            <div className={styles.toolHeader}><span className="category-badge"><ShoppingBag size={14} /> Bag #369</span><h1>Bag Interfacing Calculator</h1><p>Calculate fusible interfacing for bag construction.</p></div>
            <div className={`glass-card ${styles.calculatorCard}`}>
                <h2 className={styles.calcTitle}>Bag Size & Coverage</h2>
                <div className="calculator-form-row">
                    <div className="input-group"><label className="input-label">Width</label><input type="number" className="input-field" value={bagW} onChange={e => setBagW(parseInt(e.target.value) || 14)} /></div>
                    <div className="input-group"><label className="input-label">Height</label><input type="number" className="input-field" value={bagH} onChange={e => setBagH(parseInt(e.target.value) || 12)} /></div>
                    <div className="input-group"><label className="input-label">Depth</label><input type="number" className="input-field" value={bagD} onChange={e => setBagD(parseInt(e.target.value) || 4)} /></div>
                </div>
                <div style={{ display: "flex", gap: 4, marginTop: 6 }}>
                    {(["all", "sides", "bottom"] as const).map(p => (<button key={p} className={`btn btn-sm ${panels === p ? "btn-primary" : "btn-ghost"}`} onClick={() => setPanels(p)} style={{ fontSize: 10 }}>{p === "all" ? "All panels" : p === "sides" ? "Sides only" : "Bottom only"}</button>))}
                </div>
            </div>
            <div className={`glass-card ${styles.calculatorCard}`} style={{ borderLeft: "4px solid hsl(160,50%,40%)" }}>
                <h2 className={styles.calcTitle}>Interfacing</h2>
                <div style={{ padding: 14, background: "hsl(160,15%,95%)", borderRadius: 10, textAlign: "center" }}>
                    <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "hsl(160,40%,35%)" }}>Interfacing</div>
                    <div style={{ fontSize: 36, fontWeight: 800, color: "hsl(160,50%,30%)" }}>{toFrac(calc.yd)}</div>
                    <div style={{ fontSize: 10 }}>yards (20&quot; wide fusible)</div>
                </div>
            </div>
            <div className="toolbar" style={{ marginBottom: 10 }}>
                <button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard.writeText(`Bag interfacing: ${toFrac(calc.yd)} yd`)}><ClipboardCopy size={13} /> Copy</button>
                <button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={13} /> Print</button>
            </div>
            <section className="faq-section"><h2>FAQ</h2><div style={{ marginTop: "1.5rem" }}>{faqItems.map((f, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
        </div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/bag/tote-bag" className="related-tool-link">Tote Bag</a><a href="/bag/bag-lining" className="related-tool-link">Lining</a><a href="/bag" className="related-tool-link">All Bags</a></div></aside></div></div>);
}