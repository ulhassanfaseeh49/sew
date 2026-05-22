"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Ruler, ArrowRightLeft, Copy, Printer, ChevronDown, BookOpen, Info } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../yards-to-meters/page.module.css";

const refTable = [
    { from: "1 yard", to: "¾ yards", savings: "¼ yard" },
    { from: "1½ yards", to: "1⅛ yards", savings: "⅜ yard" },
    { from: "2 yards", to: "1½ yards", savings: "½ yard" },
    { from: "2½ yards", to: "1⅞ yards", savings: "⅝ yard" },
    { from: "3 yards", to: "2¼ yards", savings: "¾ yard" },
    { from: "4 yards", to: "3 yards", savings: "1 yard" },
    { from: "5 yards", to: "3¾ yards", savings: "1¼ yards" },
];

const faqItems = [
    { q: 'How do I convert 44" fabric yardage to 60" fabric?', a: 'Multiply your yardage by (<source width> ÷ <target width>). For 44" to 60": multiply by 44/60 = 0.733. So 3 yards of 44" fabric ≈ 2.2 yards of 60" fabric. Always round up to the nearest ⅛ yard.' },
    { q: "Will I always need less of a wider fabric?", a: "Yes — wider fabric gives you more cutting area per yard. Going from 44\" to 60\" typically saves about 25-27% on yardage. However, directional prints or complex pattern pieces may reduce the savings." },
    { q: "What if my pattern pieces are very curved?", a: "Curved pieces may not nest as efficiently on wider fabric. For complex patterns, add a 10% safety buffer. For simple rectangular pieces, the formula works precisely." },
    { q: 'Can I convert upholstery fabric (54") to garment fabric (44")?', a: "Yes! Enter your 54\" yardage and set the conversion direction accordingly. Any two widths can be converted using the formula: new yardage = old yardage × (old width ÷ new width)." },
    { q: "Why doesn't the math always work perfectly?", a: "The formula assumes fabric is used efficiently edge to edge. In practice, selvage, pattern matching, directional prints, and oddly shaped pieces all affect how much extra you need." },
];

const relatedTools = [
    { name: "Universal Width Converter", href: "/convert/fabric-width-universal", icon: ArrowRightLeft },
    { name: '60" to 108" Width', href: "/convert/fabric-width-60-to-108", icon: ArrowRightLeft },
    { name: '36" to 44/45" Width', href: "/convert/fabric-width-36-to-45", icon: ArrowRightLeft },
    { name: "Yardage Calculator", href: "/yardage/basic-calculator", icon: Ruler },
];

export default function FabricWidth44to60Page() {
    const [yardage, setYardage] = useState("");
    const [direction, setDirection] = useState<"44to60" | "60to44">("44to60");
    const [patternType, setPatternType] = useState("simple");
    const [buffer, setBuffer] = useState("5");
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const [copied, setCopied] = useState(false);

    const y = parseFloat(yardage) || 0;
    const fromW = direction === "44to60" ? 44.5 : 60;
    const toW = direction === "44to60" ? 60 : 44.5;
    const bufferPct = parseFloat(buffer) || 0;
    const typeMultiplier = patternType === "complex" ? 1.1 : patternType === "moderate" ? 1.05 : 1;
    const converted = y * (fromW / toW) * typeMultiplier;
    const withBuffer = converted * (1 + bufferPct / 100);
    const rounded = Math.ceil(withBuffer * 8) / 8;
    const savings = y - rounded;

    const handleCopy = useCallback(() => {
        if (y > 0) {
            navigator.clipboard.writeText(`${y} yd of ${fromW}" fabric = ${rounded.toFixed(3)} yd of ${toW}" fabric (${savings > 0 ? "saves" : "needs"} ${Math.abs(savings).toFixed(2)} yd)`);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    }, [y, fromW, toW, rounded, savings]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Conversion Tools", href: "/convert" }, { label: '44/45" to 60" Width' }]} />
            <div className="calculator-page">
                <div className="calculator-layout">
                    <div className="calculator-main">
                        <div className={styles.toolHeader}>
                            <span className="category-badge"><ArrowRightLeft size={14} strokeWidth={1.5} /> Conversion Tool</span>
                            <h1>Fabric Width Converter (44/45&quot; to 60&quot;)</h1>
                            <p>Calculate how much 60&quot;-wide fabric to buy when a pattern specifies 44/45&quot; fabric, and vice versa. Save money by using wider fabric.</p>
                        </div>

                        <div className="calculator-card">
                            <h2 className={styles.calcTitle}>Convert Fabric Width</h2>
                            <div className="calculator-form">
                                <div className="input-group">
                                    <label className="input-label">Conversion Direction</label>
                                    <select className="input-field" value={direction} onChange={e => setDirection(e.target.value as "44to60" | "60to44")}>
                                        <option value="44to60">44/45&quot; → 60&quot; (buy less)</option>
                                        <option value="60to44">60&quot; → 44/45&quot; (buy more)</option>
                                    </select>
                                </div>
                                <div className="input-group">
                                    <label className="input-label" htmlFor="yd">Yardage for {fromW}&quot; fabric</label>
                                    <input id="yd" type="number" className="input-field input-mono" placeholder="e.g., 3" value={yardage} onChange={e => setYardage(e.target.value)} min="0" step="0.125" autoFocus />
                                    <span className="input-helper">Enter the yardage listed on your pattern for {fromW}&quot;-wide fabric.</span>
                                </div>
                                <div className="calculator-form-row">
                                    <div className="input-group">
                                        <label className="input-label">Pattern Complexity</label>
                                        <select className="input-field" value={patternType} onChange={e => setPatternType(e.target.value)}>
                                            <option value="simple">Simple (rectangular pieces)</option>
                                            <option value="moderate">Moderate (mixed shapes)</option>
                                            <option value="complex">Complex (many curves)</option>
                                        </select>
                                    </div>
                                    <div className="input-group">
                                        <label className="input-label">Safety Buffer</label>
                                        <select className="input-field" value={buffer} onChange={e => setBuffer(e.target.value)}>
                                            <option value="0">None</option>
                                            <option value="5">5% (recommended)</option>
                                            <option value="10">10% (generous)</option>
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
                                        <div className="result-row"><span className="result-row-label">Exact conversion</span><span className="result-row-value">{converted.toFixed(4)} yd</span></div>
                                        <div className="result-row"><span className="result-row-label">With {bufferPct}% buffer</span><span className="result-row-value">{withBuffer.toFixed(4)} yd</span></div>
                                        <div className="result-row"><span className="result-row-label">Rounded up (⅛ yd)</span><span className="result-row-value" style={{ fontWeight: 700, color: 'var(--color-accent-primary)' }}>{rounded.toFixed(3)} yd</span></div>
                                        <div className="result-row">
                                            <span className="result-row-label">{savings > 0 ? "Savings" : "Extra needed"}</span>
                                            <span className="result-row-value">{Math.abs(savings).toFixed(2)} yd ({Math.abs((1 - rounded / y) * 100).toFixed(1)}%)</span>
                                        </div>
                                    </div>

                                    <div className="note-tip" style={{ marginTop: 16 }}>
                                        <Info size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />
                                        <strong>Formula:</strong> {y} yd × ({fromW}&quot; ÷ {toW}&quot;) = {converted.toFixed(3)} yd
                                        {patternType !== "simple" && <> (+ {patternType} layout adjustment)</>}
                                        {bufferPct > 0 && <> (+ {bufferPct}% buffer)</>}
                                    </div>

                                    <div className="toolbar" style={{ marginTop: 16 }}>
                                        <button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button>
                                        <button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button>
                                        <button className="btn btn-secondary btn-sm" onClick={() => setYardage("")}>Clear</button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="calculator-card">
                            <h2 className={styles.sectionTitle}><BookOpen size={20} strokeWidth={1.5} style={{ color: 'var(--color-accent-primary)' }} /> Common 44/45&quot; to 60&quot; Conversions</h2>
                            <div className={styles.tableWrap}>
                                <table className={styles.convTable}>
                                    <thead><tr><th>44/45&quot; Yardage</th><th>60&quot; Equivalent</th><th>Savings</th></tr></thead>
                                    <tbody>{refTable.map(r => (<tr key={r.from}><td>{r.from}</td><td>{r.to}</td><td style={{ color: 'var(--color-accent-primary)' }}>{r.savings}</td></tr>))}</tbody>
                                </table>
                            </div>
                        </div>

                        <div className="calculator-card">
                            <h2 className={styles.sectionTitle}><BookOpen size={20} strokeWidth={1.5} style={{ color: 'var(--color-accent-primary)' }} /> Understanding Width Conversion</h2>
                            <div className={styles.eduGrid}>
                                <div className={styles.eduItem}>
                                    <h4>Why fabric width matters</h4>
                                    <p>Wider fabric gives you more cutting area per yard. A 60&quot; bolt has about 35% more usable width than a 44&quot; bolt, so you need fewer yards to cut the same pieces.</p>
                                </div>
                                <div className={styles.eduItem}>
                                    <h4>When the formula doesn&apos;t work</h4>
                                    <p>Directional prints, napped fabrics, and one-way designs can&apos;t always use the extra width efficiently. Complex curved pieces may also need more than the formula suggests.</p>
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
                            <h4>Width Rule of Thumb</h4>
                            <div className={styles.quickRefItem}><span>44&quot; → 60&quot;</span><strong>≈ 25% less</strong></div>
                            <div className={styles.quickRefItem}><span>60&quot; → 44&quot;</span><strong>≈ 35% more</strong></div>
                            <div className={styles.quickRefItem}><span>Formula</span><strong>yd × (W₁÷W₂)</strong></div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
