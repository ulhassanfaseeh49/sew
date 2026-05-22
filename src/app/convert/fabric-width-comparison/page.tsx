"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { ArrowRightLeft, Copy, Printer, ChevronDown, Ruler, BarChart3 } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../yards-to-meters/page.module.css";

const widths = [36, 44.5, 54, 60, 72, 90, 108];

const faqItems = [
    { q: "How does this comparison help me save money?", a: "By seeing yardage needed at every width, you can choose the width that minimizes waste. If a store offers 60\" fabric at a lower price per yard, this tells you exactly how much less you'd need." },
    { q: "Why does wider fabric save yardage?", a: "Wider fabric lets you fit more pattern pieces side by side, reducing the total length you need. A 60\" fabric is about 35% wider than 44\", meaning you need roughly 25% less yardage." },
    { q: "What width should I choose for my project?", a: "Match the width to your project: quilting cotton is usually 44/45\", fashion fabrics 45-60\", upholstery 54\", and quilt backing 108\". If multiple widths are available, use this tool to find the best value." },
];

const relatedTools = [
    { name: "Universal Width Converter", href: "/convert/fabric-width-universal", icon: ArrowRightLeft },
    { name: "Yardage Calculator", href: "/yardage/basic-calculator", icon: Ruler },
    { name: "Cost Per Yard", href: "/cost/per-yard", icon: Ruler },
];

export default function FabricWidthComparisonPage() {
    const [yardage, setYardage] = useState("3");
    const [baseWidth, setBaseWidth] = useState("44.5");
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const [copied, setCopied] = useState(false);

    const y = parseFloat(yardage) || 0;
    const bw = parseFloat(baseWidth) || 44.5;

    const results = widths.map(w => {
        const need = y * (bw / w);
        const rounded = Math.ceil(need * 8) / 8;
        const diff = ((need - y) / y * 100);
        return { width: w, exact: need, rounded, diff };
    });

    const handleCopy = useCallback(() => {
        if (y > 0) {
            const t = results.map(r => `${r.width}": ${r.rounded.toFixed(3)} yd`).join('\n');
            navigator.clipboard.writeText(`${y} yd at ${bw}" width:\n${t}`);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    }, [y, bw, results]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Conversion Tools", href: "/convert" }, { label: "Fabric Width Comparison" }]} />
            <div className="calculator-page">
                <div className="calculator-layout">
                    <div className="calculator-main">
                        <div className={styles.toolHeader}>
                            <span className="category-badge"><BarChart3 size={14} strokeWidth={1.5} /> Conversion Tool #16</span>
                            <h1>Fabric Width Comparison Tool</h1>
                            <p>Side-by-side comparison showing how much fabric you need at every standard width — choose the most economical option.</p>
                        </div>

                        <div className="calculator-card">
                            <h2 className={styles.calcTitle}>Compare Widths</h2>
                            <div className="calculator-form">
                                <div className="calculator-form-row">
                                    <div className="input-group">
                                        <label className="input-label" htmlFor="base">Pattern width</label>
                                        <select id="base" className="input-field" value={baseWidth} onChange={e => setBaseWidth(e.target.value)}>
                                            {widths.map(w => (<option key={w} value={w}>{w}&quot;</option>))}
                                        </select>
                                    </div>
                                    <div className="input-group">
                                        <label className="input-label" htmlFor="yd">Required yardage</label>
                                        <input id="yd" type="number" className="input-field input-mono" placeholder="e.g., 3" value={yardage} onChange={e => setYardage(e.target.value)} min="0" step="0.125" autoFocus />
                                    </div>
                                </div>
                            </div>

                            {y > 0 && (
                                <div className={styles.results}>
                                    <div className="calculator-divider" />
                                    <div className={styles.resultDetails}>
                                        {results.map(r => (
                                            <div key={r.width} className="result-row" style={r.width === bw ? { background: 'var(--color-accent-glow)', borderRadius: 8 } : {}}>
                                                <span className="result-row-label">{r.width}&quot; wide {r.width === bw ? "(base)" : ""}</span>
                                                <span className="result-row-value">
                                                    {r.rounded.toFixed(3)} yd
                                                    <span style={{ color: r.diff < 0 ? 'var(--color-accent-primary)' : r.diff > 0 ? '#ef4444' : 'var(--color-text-tertiary)', fontSize: '0.75rem', marginLeft: '0.5rem' }}>
                                                        {r.diff < 0 ? `${Math.abs(r.diff).toFixed(1)}% less` : r.diff > 0 ? `${r.diff.toFixed(1)}% more` : "—"}
                                                    </span>
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="toolbar" style={{ marginTop: 16 }}>
                                        <button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy All"}</button>
                                        <button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <section className="faq-section">
                            <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
                            <div style={{ marginTop: 16 }}>
                                {faqItems.map((faq, i) => (
                                    <div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}>
                                        <button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)} aria-expanded={activeFaq === i}>
                                            {faq.q}<ChevronDown size={16} className="faq-chevron" />
                                        </button>
                                        <div className="faq-answer">{faq.a}</div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    <aside className="calculator-sidebar">
                        <div className="related-tools">
                            <h4>Related Tools</h4>
                            {relatedTools.map((tool) => {
                                const IC = tool.icon; return (
                                    <Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>
                                );
                            })}
                        </div>
                        <div className="quick-reference">
                            <h4>Width Categories</h4>
                            <div className={styles.quickRefItem}><span>Narrow</span><strong>36-45&quot;</strong></div>
                            <div className={styles.quickRefItem}><span>Standard</span><strong>54-60&quot;</strong></div>
                            <div className={styles.quickRefItem}><span>Wide</span><strong>72-108&quot;</strong></div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
