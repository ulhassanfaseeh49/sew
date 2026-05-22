"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { ArrowRightLeft, Copy, Printer, ChevronDown, BookOpen, Info, Ruler } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../yards-to-meters/page.module.css";

const refTable = [
    { from36: "1 yard", to45: "¾ yard" },
    { from36: "1½ yards", to45: "1⅛ yards" },
    { from36: "2 yards", to45: "1½ yards" },
    { from36: "3 yards", to45: "2⅓ yards" },
    { from36: "4 yards", to45: "3 yards" },
    { from36: "5 yards", to45: "3¾ yards" },
];

const faqItems = [
    { q: 'Why is 36" fabric still relevant?', a: 'Many vintage patterns from the 1940s-1960s were designed for 36"-wide fabric, which was the standard before wider looms became common. If you\'re recreating vintage garments or using vintage fabric, you need this conversion.' },
    { q: "How do I adapt a vintage pattern for modern fabric?", a: "First convert the yardage using this tool. Then check if the pattern\'s seam allowances are ⅝\" (already standard) or something else. Vintage patterns may also need sizing adjustments as body proportions have changed." },
    { q: 'Can I still buy 36" wide fabric today?', a: 'Some reproduction fabrics and specialty cottons are still sold in 36" widths. Liberty of London, some Japanese fabrics, and quilting solids sometimes come in this narrower width.' },
    { q: "Will I always need more 36\" fabric than the pattern says for 44\"?", a: "Yes — if your modern pattern specifies 44/45\" fabric but you have 36\" fabric, you'll need approximately 25% more yardage to compensate for the narrower width." },
];

const relatedTools = [
    { name: "Universal Width Converter", href: "/convert/fabric-width-universal", icon: ArrowRightLeft },
    { name: '44" to 60" Width', href: "/convert/fabric-width-44-to-60", icon: ArrowRightLeft },
    { name: "Yardage Calculator", href: "/yardage/basic-calculator", icon: Ruler },
];

export default function FabricWidth36to45Page() {
    const [yardage, setYardage] = useState("");
    const [direction, setDirection] = useState<"36to45" | "45to36">("36to45");
    const [era, setEra] = useState("vintage");
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const [copied, setCopied] = useState(false);

    const y = parseFloat(yardage) || 0;
    const fromW = direction === "36to45" ? 36 : 44.5;
    const toW = direction === "36to45" ? 44.5 : 36;
    const converted = y * (fromW / toW);
    const rounded = Math.ceil(converted * 8) / 8;
    const diff = Math.abs(y - rounded);

    const handleCopy = useCallback(() => {
        if (y > 0) {
            navigator.clipboard.writeText(`${y} yd of ${fromW}" = ${rounded.toFixed(3)} yd of ${toW}" fabric`);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    }, [y, fromW, toW, rounded]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Conversion Tools", href: "/convert" }, { label: '36" to 44/45" Width' }]} />
            <div className="calculator-page">
                <div className="calculator-layout">
                    <div className="calculator-main">
                        <div className={styles.toolHeader}>
                            <span className="category-badge"><ArrowRightLeft size={14} strokeWidth={1.5} /> Conversion Tool #14</span>
                            <h1>Fabric Width Converter (36&quot; to 44/45&quot;)</h1>
                            <p>Convert between vintage 36&quot;-wide fabric and standard 44/45&quot; widths — essential for vintage pattern recreation.</p>
                        </div>

                        <div className="calculator-card">
                            <h2 className={styles.calcTitle}>Convert Width</h2>
                            <div className="calculator-form">
                                <div className="input-group">
                                    <label className="input-label">Direction</label>
                                    <select className="input-field" value={direction} onChange={e => setDirection(e.target.value as "36to45" | "45to36")}>
                                        <option value="36to45">36&quot; vintage → 44/45&quot; modern (need less)</option>
                                        <option value="45to36">44/45&quot; modern → 36&quot; vintage (need more)</option>
                                    </select>
                                </div>
                                <div className="calculator-form-row">
                                    <div className="input-group">
                                        <label className="input-label" htmlFor="yd">Yardage for {fromW}&quot; fabric</label>
                                        <input id="yd" type="number" className="input-field input-mono" placeholder="e.g., 3" value={yardage} onChange={e => setYardage(e.target.value)} min="0" step="0.125" autoFocus />
                                    </div>
                                    <div className="input-group">
                                        <label className="input-label">Pattern Era</label>
                                        <select className="input-field" value={era} onChange={e => setEra(e.target.value)}>
                                            <option value="vintage">Pre-1970 vintage</option>
                                            <option value="modern">Modern pattern</option>
                                            <option value="unknown">Unknown</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {y > 0 && (
                                <div className={styles.results}>
                                    <div className="calculator-divider" />
                                    <div className="result-card">
                                        <div className="result-prefix">You need</div>
                                        <div className="result-value">{rounded.toFixed(3)} yards</div>
                                        <div className="result-label">of {toW}&quot;-wide fabric</div>
                                    </div>
                                    <div className={styles.resultDetails}>
                                        <div className="result-row"><span className="result-row-label">Exact</span><span className="result-row-value">{converted.toFixed(4)} yd</span></div>
                                        <div className="result-row"><span className="result-row-label">Rounded up (⅛ yd)</span><span className="result-row-value" style={{ fontWeight: 700, color: 'var(--color-accent-primary)' }}>{rounded.toFixed(3)} yd</span></div>
                                        <div className="result-row"><span className="result-row-label">Difference</span><span className="result-row-value">{diff.toFixed(2)} yd</span></div>
                                    </div>

                                    {era === "vintage" && (
                                        <div className="note-tip" style={{ marginTop: 16 }}>
                                            <Info size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />
                                            <strong>Vintage tip:</strong> Pre-1970 patterns assumed 36&quot; fabric. Also check whether the pattern uses ⅝&quot; or ½&quot; seam allowances, as vintage seam allowances varied.
                                        </div>
                                    )}

                                    <div className="toolbar" style={{ marginTop: 16 }}>
                                        <button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button>
                                        <button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button>
                                        <button className="btn btn-secondary btn-sm" onClick={() => setYardage("")}>Clear</button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="calculator-card">
                            <h2 className={styles.sectionTitle}><BookOpen size={20} strokeWidth={1.5} style={{ color: 'var(--color-accent-primary)' }} /> 36&quot; to 44/45&quot; Conversion Table</h2>
                            <div className={styles.tableWrap}>
                                <table className={styles.convTable}>
                                    <thead><tr><th>36&quot; Yardage</th><th>44/45&quot; Equivalent</th></tr></thead>
                                    <tbody>{refTable.map(r => (<tr key={r.from36}><td>{r.from36}</td><td>{r.to45}</td></tr>))}</tbody>
                                </table>
                            </div>
                        </div>

                        <div className="calculator-card">
                            <h2 className={styles.sectionTitle}><BookOpen size={20} strokeWidth={1.5} style={{ color: 'var(--color-accent-primary)' }} /> Vintage Fabric History</h2>
                            <div className={styles.eduGrid}>
                                <div className={styles.eduItem}>
                                    <h4>Why did widths change?</h4>
                                    <p>Before the 1960s, most looms produced 36&quot;-wide fabric. As industrial looms grew wider, 44/45&quot; became the new standard. Today, most quilting cotton is 44/45&quot; and fashion fabrics range from 45&quot; to 60&quot;.</p>
                                </div>
                                <div className={styles.eduItem}>
                                    <h4>Other vintage adjustments</h4>
                                    <p>Vintage patterns may also have different seam allowances, use old sizing charts, or assume different garment ease. Always check the pattern envelope and compare with modern size charts.</p>
                                </div>
                            </div>
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
                            <h4>Width History</h4>
                            <div className={styles.quickRefItem}><span>Pre-1960</span><strong>36&quot; standard</strong></div>
                            <div className={styles.quickRefItem}><span>1960s+</span><strong>44/45&quot; standard</strong></div>
                            <div className={styles.quickRefItem}><span>36→45</span><strong>≈ 20% less</strong></div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
