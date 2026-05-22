"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Grid3X3, Copy, Printer, ChevronDown, BookOpen, Ruler, ArrowRightLeft } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../yards-to-meters/page.module.css";

const feW = 22; const feH = 9;
const feArea = feW * feH;
const squarePresets = [2, 2.5, 3, 4, 5, 6];

const faqItems = [
    { q: "What is a fat eighth?", a: "A fat eighth is half of a fat quarter, measuring approximately 9\" × 22\" (23 × 56 cm). It has 198 sq in of fabric — great for small quilt blocks, accent pieces, and scrappy quilts." },
    { q: "Fat eighth vs regular eighth yard?", a: "A regular eighth yard is 4.5\" × 44\" (long and narrow). A fat eighth is 9\" × 22\" (shorter and wider). Same area, but the fat eighth allows larger piece cutting." },
    { q: "What are fat eighths best used for?", a: "Fat eighths are ideal for scrappy quilts requiring many different fabrics, small accent pieces, appliqué, mug rugs, and small utility projects like pincushions." },
];

const relatedTools = [
    { name: "Fat Quarter Calculator", href: "/convert/fat-quarter-calculator", icon: Grid3X3 },
    { name: "Fabric Cut Comparator", href: "/convert/fabric-cut-comparator", icon: ArrowRightLeft },
    { name: "Pre-Cut Sizes", href: "/convert/precut-fabric-sizes", icon: Ruler },
];

export default function FatEighthCalculatorPage() {
    const [squareSize, setSquareSize] = useState("");
    const [rectW, setRectW] = useState("");
    const [rectH, setRectH] = useState("");
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const [copied, setCopied] = useState(false);

    const sq = parseFloat(squareSize) || 0;
    const rw = parseFloat(rectW) || 0;
    const rh = parseFloat(rectH) || 0;

    const sqA = sq > 0 ? Math.floor(feW / sq) : 0;
    const sqD = sq > 0 ? Math.floor(feH / sq) : 0;
    const totalSq = sqA * sqD;
    const rA = rw > 0 ? Math.floor(feW / rw) : 0;
    const rD = rh > 0 ? Math.floor(feH / rh) : 0;
    const totalR = rA * rD;

    const handleCopy = useCallback(() => {
        const text = sq > 0 ? `${totalSq} × ${sq}" squares from 1 fat eighth` : `${totalR} × ${rw}"×${rh}" from 1 fat eighth`;
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }, [sq, totalSq, totalR, rw, rh]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Conversion Tools", href: "/convert" }, { label: "Fat Eighth Calculator" }]} />
            <div className="calculator-page">
                <div className="calculator-layout">
                    <div className="calculator-main">
                        <div className={styles.toolHeader}>
                            <span className="category-badge"><Grid3X3 size={14} strokeWidth={1.5} /> Conversion Tool #19</span>
                            <h1>Fat Eighth Calculator</h1>
                            <p>Calculate cutting possibilities from a fat eighth (9&quot; × 22&quot;) — half a fat quarter, perfect for scrappy quilts.</p>
                        </div>

                        <div className="calculator-card">
                            <h2 className={styles.calcTitle}>Fat Eighth: {feW}&quot; × {feH}&quot; ({feArea} sq in)</h2>
                            <div className="calculator-form">
                                <div className="input-group">
                                    <label className="input-label" htmlFor="sq">Cut squares of size (inches)</label>
                                    <input id="sq" type="number" className="input-field input-mono" placeholder='e.g., 3 for 3" squares' value={squareSize} onChange={e => setSquareSize(e.target.value)} min="0" step="0.25" autoFocus />
                                    <div className={styles.presets} style={{ marginTop: 4 }}>
                                        <span className={styles.presetsLabel}>Common:</span>
                                        <div className={styles.presetGrid}>
                                            {[2.5, 3, 4, 5].map(s => (
                                                <button key={s} className={`btn btn-ghost btn-sm ${parseFloat(squareSize) === s ? styles.presetActive : ""}`} onClick={() => setSquareSize(s.toString())}>{s}&quot;</button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-tertiary)', textAlign: 'center' }}>— or cut rectangles —</p>
                                <div className="calculator-form-row">
                                    <div className="input-group">
                                        <label className="input-label" htmlFor="rw">Width</label>
                                        <input id="rw" type="number" className="input-field input-mono" placeholder="2.5" value={rectW} onChange={e => setRectW(e.target.value)} min="0" step="0.25" />
                                    </div>
                                    <div className="input-group">
                                        <label className="input-label" htmlFor="rh">Height</label>
                                        <input id="rh" type="number" className="input-field input-mono" placeholder="4.5" value={rectH} onChange={e => setRectH(e.target.value)} min="0" step="0.25" />
                                    </div>
                                </div>
                            </div>

                            {(totalSq > 0 || totalR > 0) && (
                                <div className={styles.results}>
                                    <div className="calculator-divider" />
                                    {sq > 0 && <div className="result-card"><div className="result-prefix">Squares</div><div className="result-value">{totalSq} squares</div><div className="result-label">{sq}&quot; × {sq}&quot; ({sqA} across × {sqD} down)</div></div>}
                                    {rw > 0 && rh > 0 && <div className="result-card" style={{ marginTop: 12 }}><div className="result-prefix">Rectangles</div><div className="result-value">{totalR} rectangles</div><div className="result-label">{rw}&quot; × {rh}&quot; ({rA} across × {rD} down)</div></div>}
                                    <div className="toolbar" style={{ marginTop: 16 }}>
                                        <button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button>
                                        <button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="calculator-card">
                            <h2 className={styles.sectionTitle}><BookOpen size={20} strokeWidth={1.5} style={{ color: 'var(--color-accent-primary)' }} /> What Fits in a Fat Eighth</h2>
                            <div className={styles.tableWrap}>
                                <table className={styles.convTable}>
                                    <thead><tr><th>Square Size</th><th>Count</th><th>Layout</th><th>vs Fat Quarter</th></tr></thead>
                                    <tbody>
                                        {squarePresets.map(s => {
                                            const a = Math.floor(feW / s); const d = Math.floor(feH / s);
                                            const fqA = Math.floor(22 / s); const fqD = Math.floor(18 / s);
                                            return <tr key={s}><td>{s}&quot;</td><td>{a * d}</td><td>{a} × {d}</td><td style={{ color: 'var(--color-text-tertiary)' }}>{fqA * fqD} from FQ</td></tr>;
                                        })}
                                    </tbody>
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
                            <h4>Fat Eighth Facts</h4>
                            <div className={styles.quickRefItem}><span>Size</span><strong>9&quot; × 22&quot;</strong></div>
                            <div className={styles.quickRefItem}><span>Area</span><strong>198 sq in</strong></div>
                            <div className={styles.quickRefItem}><span>= ½ Fat Quarter</span><strong>½ × 396</strong></div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
