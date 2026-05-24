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
    const [activeFaq, setActiveFaq] = useState<number | null>(null);

    const calc = useMemo(() => {
        const sa = 0.5;
        const lW = bagW + bagD + sa * 2;
        const lH = bagH * 2 + bagD + sa * 2;
        const yd = Math.ceil(lW * lH / (44 * 36) * 4) / 4 + 0.125;
        return { lW, lH, yd: Math.ceil(yd * 4) / 4 };
    }, [bagW, bagH, bagD]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Bags", href: "/bag" }, { label: "Bag Lining" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><ShoppingBag size={14} /> Bag #368</span><h1>Bag Lining Calculator</h1><p>Calculate lining fabric for any bag size.</p></div>
                <div className={`glass-card ${styles.calculatorCard}`}>
                    <h2 className={styles.calcTitle}>Bag Dimensions</h2>
                    <div className="calculator-form-row">
                        <div className="input-group"><label className="input-label">Width (in)</label><input type="number" className="input-field" value={bagW} onChange={e => setBagW(parseInt(e.target.value) || 14)} /></div>
                        <div className="input-group"><label className="input-label">Height (in)</label><input type="number" className="input-field" value={bagH} onChange={e => setBagH(parseInt(e.target.value) || 12)} /></div>
                        <div className="input-group"><label className="input-label">Depth (in)</label><input type="number" className="input-field" value={bagD} onChange={e => setBagD(parseInt(e.target.value) || 4)} /></div>
                    </div>
                </div>
                <div className={`glass-card ${styles.calculatorCard}`} style={{ borderLeft: "4px solid hsl(280,50%,45%)" }}>
                    <h2 className={styles.calcTitle}>Lining Fabric</h2>
                    <div style={{ padding: 14, background: "hsl(280,15%,95%)", borderRadius: 10, textAlign: "center", marginBottom: 12 }}>
                        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "hsl(280,40%,35%)" }}>Lining</div>
                        <div style={{ fontSize: 36, fontWeight: 800, color: "hsl(280,50%,30%)" }}>{toFrac(calc.yd)}</div>
                        <div style={{ fontSize: 10 }}>yards</div>
                    </div>
                    <div className={styles.resultDetails}>
                        <div className="result-row"><span>Cut lining panel</span><strong>{calc.lW}&quot; × {calc.lH}&quot;</strong></div>
                    </div>
                </div>
                <div className="toolbar" style={{ marginBottom: 10 }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard.writeText(`Bag lining: ${toFrac(calc.yd)} yd (${calc.lW}" × ${calc.lH}")`)}><ClipboardCopy size={13} /> Copy</button>
                    <button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={13} /> Print</button>
                </div>
                <section className="faq-section"><h2>FAQ</h2><div style={{ marginTop: "1.5rem" }}>{[{ q: "What fabric for bag lining?", a: "Cotton: most common, breathable. Nylon rip-stop: lightweight, strong. Polyester lining: slippery (easy to find items). Laminated cotton: wipeable, great for lunch bags." }].map((f, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/bag/tote-bag" className="related-tool-link">Tote Bag</a><a href="/bag/bag-interfacing" className="related-tool-link">Interfacing</a><a href="/bag" className="related-tool-link">All Bags</a></div></aside></div>
        </div>
    );
}
