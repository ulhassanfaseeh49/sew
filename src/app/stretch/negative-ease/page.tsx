"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Minimize2, Copy, Printer, ChevronDown, BarChart3, Ruler } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const relatedTools = [
    { name: "Stretch % Calculator", href: "/stretch/percentage-calculator", icon: BarChart3 },
    { name: "Recovery Ratio", href: "/stretch/recovery-ratio", icon: BarChart3 },
    { name: "Pattern Requirement", href: "/stretch/pattern-requirement", icon: Ruler },
];

const faqItems = [
    { q: "What is negative ease?", a: "Negative ease means the garment is smaller than the body measurement. The stretch of the fabric allows it to fit over the body while clinging to form. Example: 32\" body with -10% ease = garment cut at 28.8\"." },
    { q: "How much negative ease for leggings?", a: "Leggings typically use -15% to -25% negative ease depending on fabric stretch and recovery. Higher stretch fabric can handle more negative ease." },
    { q: "What happens with too much negative ease?", a: "Too much negative ease causes fabric to become transparent (stretch shows weave), seams to strain and eventually fail, and uncomfortable constriction for the wearer." },
];

export default function NegativeEasePage() {
    const [bodyMeasure, setBody] = useState("");
    const [easePct, setEase] = useState("-10");
    const [stretchPct, setStretch] = useState("50");
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const [copied, setCopied] = useState(false);

    const body = parseFloat(bodyMeasure) || 0;
    const ease = parseFloat(easePct) || -10;
    const stretch = parseFloat(stretchPct) || 50;
    const garment = body * (1 + ease / 100);
    const stretchNeeded = body > 0 && garment > 0 ? ((body - garment) / garment * 100) : 0;
    const hasEnoughStretch = stretch >= stretchNeeded;
    const hasResult = body > 0;

    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(`Negative Ease: Body ${body}" at ${ease}% = Garment ${garment.toFixed(1)}" (needs ${stretchNeeded.toFixed(0)}% stretch)`);
        setCopied(true); setTimeout(() => setCopied(false), 2000);
    }, [body, ease, garment, stretchNeeded]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Stretch Tools", href: "/stretch" }, { label: "Negative Ease" }]} />
            <div className="calculator-layout">
                <div className="calculator-main">
                    <div className={styles.toolHeader}>
                        <span className="category-badge"><Minimize2 size={14} strokeWidth={1.5} /> Stretch Tool</span>
                        <h1>Negative Ease Calculator</h1>
                        <p>Calculate garment measurements with negative ease and verify your fabric has enough stretch.</p>
                    </div>
                    <div className="calculator-card">
                        <h2 className={styles.calcTitle}>Measurements</h2>
                        <div className="calculator-form">
                            <div className="input-group"><label className="input-label">Body Measurement (inches)</label><input type="number" className="input-field input-mono" placeholder="e.g., 36" value={bodyMeasure} onChange={e => setBody(e.target.value)} min="0" step="0.25" /></div>
                            <div className="calculator-form-row">
                                <div className="input-group"><label className="input-label">Negative Ease %</label><select className="input-field" value={easePct} onChange={e => setEase(e.target.value)}>
                                    <option value="-5">-5% (slight cling)</option><option value="-10">-10% (standard fitted)</option>
                                    <option value="-15">-15% (snug)</option><option value="-20">-20% (body-hugging)</option>
                                    <option value="-25">-25% (compression)</option>
                                </select></div>
                                <div className="input-group"><label className="input-label">Fabric Stretch %</label><input type="number" className="input-field input-mono" placeholder="e.g., 50" value={stretchPct} onChange={e => setStretch(e.target.value)} min="0" step="5" /></div>
                            </div>
                        </div>
                        {hasResult && (
                            <div>
                                <div className="calculator-divider" />
                                <div className="result-card"><div className="result-prefix">Garment Measurement</div><div className="result-value">{garment.toFixed(1)}&quot;</div><div className="result-label">Body {body}&quot; with {ease}% ease</div></div>
                                <div className={styles.resultDetails} style={{ marginTop: 16 }}>
                                    <div className="result-row"><span className="result-row-label">Body measurement</span><span className="result-row-value">{body}&quot;</span></div>
                                    <div className="result-row"><span className="result-row-label">Ease applied</span><span className="result-row-value">{ease}% = {(body - garment).toFixed(1)}&quot;</span></div>
                                    <div className="result-row"><span className="result-row-label">Garment size</span><span className="result-row-value">{garment.toFixed(1)}&quot;</span></div>
                                    <div className="result-row"><span className="result-row-label">Stretch needed</span><span className="result-row-value">{stretchNeeded.toFixed(0)}%</span></div>
                                    <div className="result-row"><span className="result-row-label">Your fabric</span><span className="result-row-value" style={{ color: hasEnoughStretch ? "#22c55e" : "#ef4444" }}>{stretch}% — {hasEnoughStretch ? "Sufficient" : "NOT enough!"}</span></div>
                                </div>
                                <div className="toolbar" style={{ marginTop: 16 }}>
                                    <button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button>
                                    <button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="calculator-card">
                        <h2 className={styles.sectionTitle}>Common Negative Ease by Garment</h2>
                        <div className={styles.tableWrap}>
                            <table className={styles.convTable}>
                                <thead><tr><th>Garment</th><th>Typical Ease</th><th>Min Stretch</th></tr></thead>
                                <tbody>
                                    {[["Fitted T-shirt", "-5% to -10%", "25%"], ["Bodycon dress", "-15% to -20%", "50%"], ["Leggings", "-15% to -25%", "50-75%"], ["Swimwear", "-20% to -30%", "75%+"], ["Sports bra", "-15% to -25%", "50-75%"], ["Compression garment", "-25% to -35%", "75-100%"]].map(([g, e, s]) => (
                                        <tr key={g}><td style={{ fontFamily: "inherit", fontWeight: 500 }}>{g}</td><td>{e}</td><td>{s}</td></tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
                </div>
                <aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside>
            </div>
        </div>
    );
}