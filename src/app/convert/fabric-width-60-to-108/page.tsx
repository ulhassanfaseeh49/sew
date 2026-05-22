"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { ArrowRightLeft, Copy, Printer, ChevronDown, BookOpen, Info, Ruler } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../yards-to-meters/page.module.css";

const refTable = [
    { from60: "2 yards", to108: "1⅛ yards", note: "Small quilt backing" },
    { from60: "3 yards", to108: "1⅝ yards", note: "Throw quilt" },
    { from60: "4 yards", to108: "2¼ yards", note: "Twin quilt" },
    { from60: "5 yards", to108: "2¾ yards", note: "Full/queen quilt" },
    { from60: "6 yards", to108: "3⅓ yards", note: "King quilt" },
];

const faqItems = [
    { q: 'When do I need 108" wide fabric?', a: '108"-wide fabric (also called wide-back or quilt backing) is used for quilt backs so you don\'t need to piece seams. Also great for stage curtains, backdrops, and wide bedding.' },
    { q: "How much 108\" fabric do I need for quilt backing?", a: "Divide your 60\"-width yardage by 1.8 (108÷60). For a quilt needing 5 yards of 60\" backing, you'd need about 2¾ yards of 108\" wide-back — seamless!" },
    { q: "Is 108\" fabric more expensive per yard?", a: "Yes, but you need significantly less of it. Wide-back typically costs 50-80% more per yard, but you need ~45% less yardage. The total cost is usually similar or slightly less." },
];

const relatedTools = [
    { name: "Universal Width Converter", href: "/convert/fabric-width-universal", icon: ArrowRightLeft },
    { name: "Quilt Backing Calculator", href: "/quilt/backing-calculator", icon: Ruler },
    { name: '44" to 60" Width', href: "/convert/fabric-width-44-to-60", icon: ArrowRightLeft },
];

export default function FabricWidth60to108Page() {
    const [yardage, setYardage] = useState("");
    const [direction, setDirection] = useState<"60to108" | "108to60">("60to108");
    const [projectType, setProjectType] = useState("quilt");
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const [copied, setCopied] = useState(false);

    const y = parseFloat(yardage) || 0;
    const fromW = direction === "60to108" ? 60 : 108;
    const toW = direction === "60to108" ? 108 : 60;
    const converted = y * (fromW / toW);
    const rounded = Math.ceil(converted * 8) / 8;
    const savings = y - rounded;
    const seams60 = Math.ceil(90 / 60) - 1; // for 90" wide quilt
    const seamless108 = 90 <= 108;

    const handleCopy = useCallback(() => {
        if (y > 0) {
            navigator.clipboard.writeText(`${y} yd of ${fromW}" = ${rounded.toFixed(3)} yd of ${toW}" fabric`);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    }, [y, fromW, toW, rounded]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Conversion Tools", href: "/convert" }, { label: '60" to 108" Width' }]} />
            <div className="calculator-page">
                <div className="calculator-layout">
                    <div className="calculator-main">
                        <div className={styles.toolHeader}>
                            <span className="category-badge"><ArrowRightLeft size={14} strokeWidth={1.5} /> Conversion Tool #13</span>
                            <h1>Fabric Width Converter (60&quot; to 108&quot;)</h1>
                            <p>Convert yardage between 60&quot; and 108&quot;-wide fabric — perfect for quilt backing, bedding, and theatrical backdrops.</p>
                        </div>

                        <div className="calculator-card">
                            <h2 className={styles.calcTitle}>Convert Width</h2>
                            <div className="calculator-form">
                                <div className="input-group">
                                    <label className="input-label">Direction</label>
                                    <select className="input-field" value={direction} onChange={e => setDirection(e.target.value as "60to108" | "108to60")}>
                                        <option value="60to108">60&quot; → 108&quot; (buy less, seamless)</option>
                                        <option value="108to60">108&quot; → 60&quot; (need more, may need seams)</option>
                                    </select>
                                </div>
                                <div className="calculator-form-row">
                                    <div className="input-group">
                                        <label className="input-label" htmlFor="yd">Yardage for {fromW}&quot; fabric</label>
                                        <input id="yd" type="number" className="input-field input-mono" placeholder="e.g., 4" value={yardage} onChange={e => setYardage(e.target.value)} min="0" step="0.125" autoFocus />
                                    </div>
                                    <div className="input-group">
                                        <label className="input-label">Project Type</label>
                                        <select className="input-field" value={projectType} onChange={e => setProjectType(e.target.value)}>
                                            <option value="quilt">Quilt backing</option>
                                            <option value="bedding">Sheet / bedding</option>
                                            <option value="curtain">Curtain / backdrop</option>
                                            <option value="other">General / other</option>
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
                                        <div className="result-row"><span className="result-row-label">{savings > 0 ? "Savings" : "Extra needed"}</span><span className="result-row-value">{Math.abs(savings).toFixed(2)} yd</span></div>
                                    </div>

                                    {projectType === "quilt" && direction === "60to108" && (
                                        <div className="note-tip" style={{ marginTop: 16 }}>
                                            <Info size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />
                                            <strong>Quilt backing bonus:</strong> With 108&quot; fabric, most quilts up to 100&quot; wide can have a <strong>seamless back</strong>. No piecing needed!
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
                            <h2 className={styles.sectionTitle}><BookOpen size={20} strokeWidth={1.5} style={{ color: 'var(--color-accent-primary)' }} /> 60&quot; to 108&quot; Conversion Table</h2>
                            <div className={styles.tableWrap}>
                                <table className={styles.convTable}>
                                    <thead><tr><th>60&quot; Yardage</th><th>108&quot; Equivalent</th><th>Typical Use</th></tr></thead>
                                    <tbody>{refTable.map(r => (<tr key={r.from60}><td>{r.from60}</td><td>{r.to108}</td><td style={{ color: 'var(--color-text-tertiary)' }}>{r.note}</td></tr>))}</tbody>
                                </table>
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
                            <h4>Quick Math</h4>
                            <div className={styles.quickRefItem}><span>60&quot; → 108&quot;</span><strong>≈ 45% less</strong></div>
                            <div className={styles.quickRefItem}><span>108&quot; → 60&quot;</span><strong>≈ 80% more</strong></div>
                            <div className={styles.quickRefItem}><span>Seamless</span><strong>up to 100&quot;</strong></div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
