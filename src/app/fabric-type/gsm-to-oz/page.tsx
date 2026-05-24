"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { Scale, ClipboardCopy, Printer } from "lucide-react";

const presets = [30, 50, 80, 100, 120, 150, 180, 200, 250, 300, 400];
const cats: [number, string, string][] = [
    [50, "Ultra-lightweight", "Chiffon, organza, tulle"],
    [100, "Lightweight", "Voile, lawn, batiste, georgette"],
    [150, "Light-medium", "Quilting cotton, shirting, poplin"],
    [200, "Medium", "Linen, denim shirting, sateen"],
    [270, "Medium-heavy", "Canvas, twill, drapery"],
    [340, "Heavy", "Heavy denim, coating, upholstery"],
    [9999, "Ultra-heavy", "Heavy canvas, industrial"],
];

const faqItems = [
    { q: "What is GSM?", a: "GSM stands for Grams per Square Meter — the international standard for measuring fabric weight. A 10cm × 10cm swatch weighed in grams, then multiplied by 100, gives you the GSM. Higher GSM = heavier fabric." },
    { q: "What is oz/yd²?", a: "Ounces per square yard — the American standard for fabric weight. One square yard of fabric is weighed in ounces. Common in US fabric stores and on bolt ends." },
    { q: "What GSM is quilting cotton?", a: "Typical quilting cotton is 100-150 GSM (about 3-4.5 oz/yd²). This is classified as light-medium weight." },
    { q: "How do I measure my fabric's GSM at home?", a: "Cut a 10cm × 10cm square (use a ruler!). Weigh it on a kitchen/postal scale in grams. Multiply by 100. That's your GSM. For oz/yd²: cut a 12\" × 12\" square, weigh in ounces, multiply by 9." },
    { q: "Why does the same GSM feel different?", a: "Because weight and hand are different. A 150 GSM silk feels completely different from 150 GSM cotton because silk fibers are finer and smoother. Fiber type, weave, and finish all affect hand independently of weight." },
];

export default function Page() {
    const [gsm, setGsm] = useState("");
    const [activeFaq, setActiveFaq] = useState<number | null>(null);

    const g = parseFloat(gsm) || 0;
    const oz = g / 33.906;
    const cat = cats.find(([max]) => g < max);

    const tH = { padding: "5px 8px", borderBottom: "2px solid hsl(0,0%,85%)", textAlign: "left" as const, fontSize: 11, fontWeight: 600 as const };
    const tD = { padding: "4px 8px", borderBottom: "1px solid hsl(0,0%,92%)", fontSize: 11 };

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Fabric Type", href: "/fabric-type" }, { label: "GSM to oz/yd²" }]} />
            <div className="calculator-layout">
                <div className="calculator-main">
                    <div className={styles.toolHeader}>
                        <span className="category-badge"><Scale size={14} strokeWidth={1.5} /> Fabric #415</span>
                        <h1>GSM to oz/yd² Converter</h1>
                        <p>Convert fabric weight from grams per square meter to ounces per square yard. Includes weight classification and fabric examples.</p>
                    </div>

                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>Enter GSM</h2>
                        <div className="input-group" style={{ maxWidth: 200 }}>
                            <label className="input-label">GSM value</label>
                            <input type="number" className="input-field" placeholder="e.g. 150" value={gsm} onChange={e => setGsm(e.target.value)} min={0} />
                        </div>
                        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 6 }}>
                            {presets.map(p => (
                                <button key={p} className={`btn btn-sm ${parseFloat(gsm) === p ? "btn-primary" : "btn-ghost"}`} onClick={() => setGsm(String(p))} style={{ fontSize: 10 }}>{p}</button>
                            ))}
                        </div>
                    </div>

                    {g > 0 && (
                        <div className={`glass-card ${styles.calculatorCard}`} style={{ borderLeft: "4px solid hsl(200,50%,45%)" }}>
                            <h2 className={styles.calcTitle}>Result</h2>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
                                <div style={{ padding: 14, background: "hsl(200,15%,95%)", borderRadius: 10, textAlign: "center" }}>
                                    <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "hsl(200,40%,35%)" }}>oz/yd²</div>
                                    <div style={{ fontSize: 36, fontWeight: 800, color: "hsl(200,50%,30%)" }}>{oz.toFixed(2)}</div>
                                </div>
                                <div style={{ padding: 14, background: "hsl(160,15%,95%)", borderRadius: 10, textAlign: "center" }}>
                                    <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "hsl(160,40%,35%)" }}>Category</div>
                                    <div style={{ fontSize: 18, fontWeight: 800, color: "hsl(160,50%,30%)" }}>{cat?.[1]}</div>
                                    <div style={{ fontSize: 10 }}>{cat?.[2]}</div>
                                </div>
                            </div>
                            <div style={{ fontSize: 11, color: "var(--color-text-tertiary)" }}>Formula: {g} GSM ÷ 33.906 = {oz.toFixed(2)} oz/yd²</div>
                        </div>
                    )}

                    <div className="toolbar" style={{ marginBottom: 10 }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard.writeText(`${g} GSM = ${oz.toFixed(2)} oz/yd² (${cat?.[1]})`)}><ClipboardCopy size={13} /> Copy</button>
                        <button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={13} /> Print</button>
                    </div>

                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>Weight Classification Chart</h2>
                        <div style={{ overflowX: "auto" }}>
                            <table style={{ fontSize: 11, borderCollapse: "collapse", width: "100%" }}>
                                <thead><tr><th style={tH}>GSM Range</th><th style={tH}>oz/yd²</th><th style={tH}>Category</th><th style={tH}>Examples</th></tr></thead>
                                <tbody>
                                    {cats.map(([max, name, ex], i) => {
                                        const prevMax = i > 0 ? cats[i - 1][0] : 0;
                                        const gsmRange = max === 9999 ? `${prevMax}+` : `${prevMax}–${max}`;
                                        const ozLow = (prevMax / 33.906).toFixed(1);
                                        const ozHigh = max === 9999 ? "10+" : (max / 33.906).toFixed(1);
                                        const isMatch = g >= prevMax && g < max;
                                        return (
                                            <tr key={i} style={{ background: isMatch ? "hsl(200,15%,93%)" : undefined }}>
                                                <td style={{ ...tD, fontWeight: isMatch ? 700 : 400 }}>{gsmRange}</td>
                                                <td style={tD}>{ozLow}–{ozHigh}</td>
                                                <td style={{ ...tD, fontWeight: 600 }}>{name}</td>
                                                <td style={tD}>{ex}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <section className="faq-section"><h2>Frequently Asked Questions</h2>
                        <div style={{ marginTop: "1.5rem" }}>{faqItems.map((f, i) => (
                            <div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}>
                                <button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></button>
                                <div className="faq-answer">{f.a}</div>
                            </div>
                        ))}</div>
                    </section>
                </div>
                <aside className="calculator-sidebar">
                    <div className="glass-card related-tools">
                        <h4>Related Tools</h4>
                        <a href="/fabric-type/oz-to-gsm" className="related-tool-link">oz/yd² to GSM</a>
                        <a href="/fabric-type/weight-comparator" className="related-tool-link">Weight Comparator</a>
                        <a href="/fabric-type/selection-guide" className="related-tool-link">Selection Guide</a>
                        <a href="/fabric-type" className="related-tool-link">All Fabric Type</a>
                    </div>
                </aside>
            </div>
        </div>
    );
}