"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { BarChart3, Copy, Printer, ChevronDown, Ruler, Info } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

function classify(pct: number): { label: string; color: string; use: string } {
    if (pct < 15) return { label: "Low Stretch", color: "#f59e0b", use: "Simple pull-on garments only" };
    if (pct < 25) return { label: "Moderate Stretch", color: "#84cc16", use: "Most knit garment patterns" };
    if (pct < 50) return { label: "Good Stretch", color: "#22c55e", use: "Fitted garments, activewear" };
    if (pct < 75) return { label: "High Stretch", color: "#06b6d4", use: "Bodycon, swimwear, dance" };
    return { label: "Super Stretch", color: "#8b5cf6", use: "Swimwear, compression garments" };
}

const relatedTools = [
    { name: "Recovery Ratio", href: "/stretch/recovery-ratio", icon: BarChart3 },
    { name: "Negative Ease Calculator", href: "/stretch/negative-ease", icon: Ruler },
    { name: "Knit Type Comparator", href: "/stretch/knit-type-comparator", icon: Info },
    { name: "Pattern Requirement", href: "/stretch/pattern-requirement", icon: Ruler },
];

const faqItems = [
    { q: "How do I measure stretch percentage?", a: "Cut a 4-inch swatch on the stretch grain. Pin one end, stretch the other to comfortable maximum (not forced). Measure the stretched length. Formula: (Stretched - Original) / Original x 100." },
    { q: "What stretch percentage do I need for leggings?", a: "Leggings typically require 50-75% stretch with good recovery. The fabric must stretch enough to contour the body while snapping back to hold its shape." },
    { q: "Does stretch direction matter?", a: "Yes! Most knits stretch more across the grain (width) than along it (length). Check your pattern — it specifies which direction needs the minimum stretch." },
    { q: "What if my fabric doesn't meet pattern requirements?", a: "If stretch is less than required, the garment will be too tight and may restrict movement. You can size up, but the fit will differ from the pattern's design intent." },
];

export default function PercentageCalculatorPage() {
    const [relaxed, setRelaxed] = useState("4");
    const [stretched, setStretched] = useState("");
    const [direction, setDirection] = useState("crossgrain");
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const [copied, setCopied] = useState(false);

    const r = parseFloat(relaxed) || 4;
    const s = parseFloat(stretched) || 0;
    const pct = r > 0 && s > 0 ? ((s - r) / r) * 100 : 0;
    const cls = classify(pct);
    const hasResult = s > 0 && s > r;

    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(`Stretch: ${pct.toFixed(0)}% (${cls.label}) — ${direction === "crossgrain" ? "Cross-grain" : "Lengthwise"}`);
        setCopied(true); setTimeout(() => setCopied(false), 2000);
    }, [pct, cls, direction]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Stretch Tools", href: "/stretch" }, { label: "Stretch % Calculator" }]} />
            <div className="calculator-layout">
                <div className="calculator-main">
                    <div className={styles.toolHeader}>
                        <span className="category-badge"><BarChart3 size={14} strokeWidth={1.5} /> Stretch Tool</span>
                        <h1>Stretch Percentage Calculator</h1>
                        <p>Measure your fabric&apos;s stretch percentage and classify it for pattern matching.</p>
                    </div>
                    <div className="calculator-card">
                        <h2 className={styles.calcTitle}>Swatch Measurements</h2>
                        <div className="calculator-form">
                            <div className="input-group">
                                <label className="input-label">Stretch Direction</label>
                                <select className="input-field" value={direction} onChange={e => setDirection(e.target.value)}>
                                    <option value="crossgrain">Cross-grain (width — most common)</option>
                                    <option value="lengthwise">Lengthwise (length)</option>
                                </select>
                            </div>
                            <div className="calculator-form-row">
                                <div className="input-group">
                                    <label className="input-label">Relaxed Length (inches)</label>
                                    <input type="number" className="input-field input-mono" value={relaxed} onChange={e => setRelaxed(e.target.value)} min="1" step="0.5" />
                                    <span className="input-helper">Standard test swatch: 4 inches</span>
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Stretched Length (inches)</label>
                                    <input type="number" className="input-field input-mono" placeholder="e.g., 6" value={stretched} onChange={e => setStretched(e.target.value)} min="0" step="0.25" />
                                </div>
                            </div>
                        </div>
                        {hasResult && (
                            <div>
                                <div className="calculator-divider" />
                                <div className="result-card" style={{ borderColor: cls.color, borderWidth: 2 }}>
                                    <div className="result-prefix" style={{ color: cls.color }}>{cls.label}</div>
                                    <div className="result-value">{pct.toFixed(0)}%</div>
                                    <div className="result-label">{cls.use}</div>
                                </div>
                                <div className={styles.resultDetails} style={{ marginTop: 16 }}>
                                    <div className="result-row"><span className="result-row-label">Relaxed</span><span className="result-row-value">{r}&quot;</span></div>
                                    <div className="result-row"><span className="result-row-label">Stretched</span><span className="result-row-value">{s}&quot;</span></div>
                                    <div className="result-row"><span className="result-row-label">Gain</span><span className="result-row-value">+{(s - r).toFixed(2)}&quot;</span></div>
                                    <div className="result-row"><span className="result-row-label">Direction</span><span className="result-row-value">{direction === "crossgrain" ? "Cross-grain" : "Lengthwise"}</span></div>
                                </div>
                                <div className="toolbar" style={{ marginTop: 16 }}>
                                    <button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button>
                                    <button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="calculator-card">
                        <h2 className={styles.sectionTitle}>Stretch Classification Guide</h2>
                        <div className={styles.tableWrap}>
                            <table className={styles.convTable}>
                                <thead><tr><th>Range</th><th>Classification</th><th>Suitable For</th></tr></thead>
                                <tbody>
                                    {[{ r: "0-14%", l: "Low Stretch", u: "Pull-on garments, simple tops", c: "#f59e0b" }, { r: "15-24%", l: "Moderate", u: "Most knit patterns", c: "#84cc16" }, { r: "25-49%", l: "Good Stretch", u: "Fitted garments, activewear", c: "#22c55e" }, { r: "50-74%", l: "High Stretch", u: "Bodycon, swimwear, dance", c: "#06b6d4" }, { r: "75%+", l: "Super Stretch", u: "Compression, swimwear", c: "#8b5cf6" }].map(s => (
                                        <tr key={s.r}><td style={{ color: s.c, fontWeight: 600 }}>{s.r}</td><td style={{ fontFamily: "inherit" }}>{s.l}</td><td style={{ fontFamily: "inherit" }}>{s.u}</td></tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
                </div>
                <aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div>
                    <div className="quick-reference"><h4>Quick Test</h4><p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>Cut 4&quot; swatch. Pin one end. Stretch to comfortable max. Measure. Subtract 4, divide by 4, multiply by 100.</p></div>
                </aside>
            </div>
        </div>
    );
}