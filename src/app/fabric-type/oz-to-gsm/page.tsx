"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { Scale, ClipboardCopy, Printer } from "lucide-react";

const presets = [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 6, 7, 8, 10, 12, 14, 16];
const cats: [number, string, string][] = [
    [1.5, "Ultra-lightweight", "Chiffon, organza, tulle"],
    [3, "Lightweight", "Voile, lawn, batiste"],
    [4.5, "Light-medium", "Quilting cotton, shirting"],
    [6, "Medium", "Linen, denim shirting"],
    [8, "Medium-heavy", "Canvas, twill"],
    [10, "Heavy", "Heavy denim, coating"],
    [99, "Ultra-heavy", "Heavy canvas, industrial"],
];

const faqItems = [
    { q: "How do I convert oz/yd² to GSM?", a: "Multiply oz/yd² by 33.906 to get GSM. Example: 4 oz/yd² × 33.906 = 135.6 GSM." },
    { q: "What does 4 oz fabric feel like?", a: "4 oz/yd² (~135 GSM) is a typical quilting cotton — medium-light, easy to sew, holds shape well. Heavier than a blouse but lighter than denim." },
    { q: "What weight denim is for jeans?", a: "Classic jeans: 12-14 oz/yd² (400-475 GSM). Lightweight jeans: 8-10 oz. Denim shirts: 4-6 oz. Raw/selvedge denim: 12-21 oz." },
];

export default function Page() {
    const [oz, setOz] = useState("");
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const o = parseFloat(oz) || 0;
    const gsm = o * 33.906;
    const cat = cats.find(([max]) => o < max);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Fabric Type", href: "/fabric-type" }, { label: "oz/yd² to GSM" }]} />
            <div className="calculator-layout">
                <div className="calculator-main">
                    <div className={styles.toolHeader}>
                        <span className="category-badge"><Scale size={14} strokeWidth={1.5} /> Fabric #416</span>
                        <h1>oz/yd² to GSM Converter</h1>
                        <p>Convert fabric weight from ounces per square yard to grams per square meter.</p>
                    </div>
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>Enter oz/yd²</h2>
                        <div className="input-group" style={{ maxWidth: 200 }}>
                            <label className="input-label">oz/yd² value</label>
                            <input type="number" className="input-field" placeholder="e.g. 4" value={oz} onChange={e => setOz(e.target.value)} min={0} step={0.5} />
                        </div>
                        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 6 }}>
                            {presets.map(p => (<button key={p} className={`btn btn-sm ${parseFloat(oz) === p ? "btn-primary" : "btn-ghost"}`} onClick={() => setOz(String(p))} style={{ fontSize: 10 }}>{p}</button>))}
                        </div>
                    </div>
                    {o > 0 && (
                        <div className={`glass-card ${styles.calculatorCard}`} style={{ borderLeft: "4px solid hsl(280,50%,45%)" }}>
                            <h2 className={styles.calcTitle}>Result</h2>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
                                <div style={{ padding: 14, background: "hsl(280,15%,95%)", borderRadius: 10, textAlign: "center" }}>
                                    <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "hsl(280,40%,35%)" }}>GSM</div>
                                    <div style={{ fontSize: 36, fontWeight: 800, color: "hsl(280,50%,30%)" }}>{gsm.toFixed(1)}</div>
                                </div>
                                <div style={{ padding: 14, background: "hsl(160,15%,95%)", borderRadius: 10, textAlign: "center" }}>
                                    <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "hsl(160,40%,35%)" }}>Category</div>
                                    <div style={{ fontSize: 18, fontWeight: 800, color: "hsl(160,50%,30%)" }}>{cat?.[1]}</div>
                                    <div style={{ fontSize: 10 }}>{cat?.[2]}</div>
                                </div>
                            </div>
                            <div style={{ fontSize: 11, color: "var(--color-text-tertiary)" }}>Formula: {o} oz/yd² × 33.906 = {gsm.toFixed(1)} GSM</div>
                        </div>
                    )}
                    <div className="toolbar" style={{ marginBottom: 10 }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard.writeText(`${o} oz/yd² = ${gsm.toFixed(1)} GSM (${cat?.[1]})`)}><ClipboardCopy size={13} /> Copy</button>
                        <button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={13} /> Print</button>
                    </div>
                    <section className="faq-section"><h2>FAQ</h2><div style={{ marginTop: "1.5rem" }}>{faqItems.map((f, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
                </div>
                <aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/fabric-type/gsm-to-oz" className="related-tool-link">GSM to oz/yd²</a><a href="/fabric-type/weight-comparator" className="related-tool-link">Weight Comparator</a><a href="/fabric-type" className="related-tool-link">All Fabric Type</a></div></aside>
            </div>
        </div>
    );
}