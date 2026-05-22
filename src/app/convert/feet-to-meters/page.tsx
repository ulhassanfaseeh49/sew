"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Ruler, ArrowRightLeft, Copy, Printer, ChevronDown, BookOpen, Info } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../yards-to-meters/page.module.css";

const presets = [
    { label: "1 ft", ft: 1, inVal: 0 }, { label: "2 ft", ft: 2, inVal: 0 },
    { label: "3 ft", ft: 3, inVal: 0 }, { label: "4 ft", ft: 4, inVal: 0 },
    { label: "5 ft", ft: 5, inVal: 0 }, { label: "6 ft", ft: 6, inVal: 0 },
    { label: "7 ft", ft: 7, inVal: 0 }, { label: "8 ft", ft: 8, inVal: 0 },
    { label: "9 ft", ft: 9, inVal: 0 }, { label: "10 ft", ft: 10, inVal: 0 },
    { label: "12 ft", ft: 12, inVal: 0 }, { label: "15 ft", ft: 15, inVal: 0 },
    { label: "20 ft", ft: 20, inVal: 0 },
];

const roomPresets = [
    { label: "8 ft ceiling", ft: 8, inVal: 0 },
    { label: "9 ft ceiling", ft: 9, inVal: 0 },
    { label: "10 ft ceiling", ft: 10, inVal: 0 },
    { label: "6 ft table", ft: 6, inVal: 0 },
    { label: "8 ft table", ft: 8, inVal: 0 },
];

const refTable = [
    { ft: 1, m: "0.30", cm: "30.5" }, { ft: 2, m: "0.61", cm: "61.0" },
    { ft: 3, m: "0.91", cm: "91.4" }, { ft: 4, m: "1.22", cm: "121.9" },
    { ft: 5, m: "1.52", cm: "152.4" }, { ft: 6, m: "1.83", cm: "182.9" },
    { ft: 7, m: "2.13", cm: "213.4" }, { ft: 8, m: "2.44", cm: "243.8" },
    { ft: 9, m: "2.74", cm: "274.3" }, { ft: 10, m: "3.05", cm: "304.8" },
];

const faqItems = [
    { q: "How many meters is 8 feet?", a: "8 feet equals 2.4384 meters (243.84 cm). This is the standard ceiling height in most US homes, useful for curtain calculations." },
    { q: "How do I convert a room measurement to meters for curtains?", a: "Measure window height in feet and inches, then use this converter. For curtains, add 4-6 inches above the rod and 1-2 inches for puddle effect, then convert the total." },
    { q: "What is 6 feet in meters and centimeters?", a: "6 feet equals 1.8288 meters or 182.88 centimeters. This is approximately the height of a standard table or a tall person." },
    { q: "How do I measure ceiling height for curtains?", a: "Measure from floor to ceiling in feet and inches. Standard US ceilings are 8 ft (2.44m). Curtain rods are typically mounted 4-6 inches below the ceiling or at the top of the window frame." },
];

const relatedTools = [
    { name: "Meters to Feet", href: "/convert/meters-to-feet", icon: ArrowRightLeft },
    { name: "Yards to Meters", href: "/convert/yards-to-meters", icon: Ruler },
    { name: "Curtain Yardage Calculator", href: "/curtains/yardage-calculator", icon: Ruler },
    { name: "Universal Converter", href: "/convert/universal-sewing-converter", icon: Ruler },
];

export default function FeetToMetersPage() {
    const [feet, setFeet] = useState("");
    const [extraInches, setExtraInches] = useState("");
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const [copied, setCopied] = useState(false);

    const totalInches = (parseFloat(feet) || 0) * 12 + (parseFloat(extraInches) || 0);
    const meters = totalInches * 0.0254;
    const cm = meters * 100;
    const yards = totalInches / 36;
    const hasResult = totalInches > 0;

    const handlePreset = (ft: number, inV: number) => { setFeet(ft.toString()); setExtraInches(inV.toString()); };

    const handleCopy = useCallback(() => {
        if (hasResult) {
            navigator.clipboard.writeText(`${feet || 0}' ${extraInches || 0}" = ${meters.toFixed(4)} m (${cm.toFixed(1)} cm)`);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    }, [hasResult, feet, extraInches, meters, cm]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Conversion Tools", href: "/convert" }, { label: "Feet to Meters" }]} />
            <div className="calculator-page">
                <div className="calculator-layout">
                    <div className="calculator-main">
                        <div className={styles.toolHeader}>
                            <span className="category-badge"><Ruler size={14} strokeWidth={1.5} /> Conversion Tool #5</span>
                            <h1>Feet to Meters Converter</h1>
                            <p>Convert feet and inches to meters for large fabric measurements, room dimensions, and home décor projects.</p>
                        </div>

                        <div className="calculator-card">
                            <h2 className={styles.calcTitle}>Enter Feet &amp; Inches</h2>
                            <div className="calculator-form">
                                <div className="calculator-form-row">
                                    <div className="input-group">
                                        <label className="input-label" htmlFor="feet">Feet</label>
                                        <input id="feet" type="number" className="input-field input-mono" placeholder="e.g., 8" value={feet} onChange={e => setFeet(e.target.value)} min="0" autoFocus />
                                    </div>
                                    <div className="input-group">
                                        <label className="input-label" htmlFor="in">Inches</label>
                                        <input id="in" type="number" className="input-field input-mono" placeholder="e.g., 6" value={extraInches} onChange={e => setExtraInches(e.target.value)} min="0" max="11" step="0.5" />
                                    </div>
                                </div>

                                <div className={styles.presets}>
                                    <span className={styles.presetsLabel}>Quick presets:</span>
                                    <div className={styles.presetGrid}>
                                        {presets.map((p) => (
                                            <button key={p.label} className={`btn btn-ghost btn-sm ${parseFloat(feet) === p.ft && (!extraInches || extraInches === "0") ? styles.presetActive : ""}`} onClick={() => handlePreset(p.ft, p.inVal)}>{p.label}</button>
                                        ))}
                                    </div>
                                </div>

                                <div className={styles.presets}>
                                    <span className={styles.presetsLabel}>Room-specific presets:</span>
                                    <div className={styles.presetGrid}>
                                        {roomPresets.map((p) => (
                                            <button key={p.label} className="btn btn-ghost btn-sm" onClick={() => handlePreset(p.ft, p.inVal)}>{p.label}</button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {hasResult && (
                                <div className={styles.results}>
                                    <div className="calculator-divider" />
                                    <div className="result-card">
                                        <div className="result-prefix">Result</div>
                                        <div className="result-value">{meters.toFixed(2)} m</div>
                                        <div className="result-label">{feet || 0} ft {extraInches || 0} in = {meters.toFixed(4)} meters</div>
                                    </div>
                                    <div className={styles.resultDetails}>
                                        <div className="result-row"><span className="result-row-label">Meters (exact)</span><span className="result-row-value">{meters.toFixed(4)} m</span></div>
                                        <div className="result-row"><span className="result-row-label">Centimeters</span><span className="result-row-value">{cm.toFixed(1)} cm</span></div>
                                        <div className="result-row"><span className="result-row-label">Total inches</span><span className="result-row-value">{totalInches.toFixed(1)}&quot;</span></div>
                                        <div className="result-row"><span className="result-row-label">Yards</span><span className="result-row-value">{yards.toFixed(4)} yd</span></div>
                                    </div>

                                    {parseFloat(feet) >= 7 && parseFloat(feet) <= 10 && (
                                        <div className="note-tip" style={{ marginTop: 16 }}>
                                            <Info size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />
                                            <strong>Curtain tip:</strong> For {feet}-foot ceilings, curtains typically hang 4-6 inches higher than the window frame. Factor in 2-3 inches for hemming when ordering fabric.
                                        </div>
                                    )}

                                    <div className="toolbar" style={{ marginTop: 16 }}>
                                        <button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button>
                                        <button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button>
                                        <button className="btn btn-secondary btn-sm" onClick={() => { setFeet(""); setExtraInches(""); }}>Clear</button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="calculator-card">
                            <h2 className={styles.sectionTitle}><BookOpen size={20} strokeWidth={1.5} style={{ color: 'var(--color-accent-primary)' }} /> Reference Table</h2>
                            <div className={styles.tableWrap}>
                                <table className={styles.convTable}>
                                    <thead><tr><th>Feet</th><th>Meters</th><th>CM</th></tr></thead>
                                    <tbody>{refTable.map((r) => (<tr key={r.ft}><td>{r.ft} ft</td><td>{r.m} m</td><td>{r.cm} cm</td></tr>))}</tbody>
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
                            <h4>Key Conversions</h4>
                            <div className={styles.quickRefItem}><span>1 foot</span><strong>0.3048 m</strong></div>
                            <div className={styles.quickRefItem}><span>1 foot</span><strong>30.48 cm</strong></div>
                            <div className={styles.quickRefItem}><span>8 feet</span><strong>2.44 m</strong></div>
                            <div className={styles.quickRefItem}><span>10 feet</span><strong>3.05 m</strong></div>
                        </div>
                        <Link href="/convert/meters-to-feet" className="btn btn-secondary btn-md" style={{ width: '100%', justifyContent: 'center' }}>
                            <ArrowRightLeft size={16} /> Meters → Feet
                        </Link>
                    </aside>
                </div>
            </div>
        </div>
    );
}
