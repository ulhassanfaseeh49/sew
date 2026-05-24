"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Grid3X3, Copy, Printer, ChevronDown, BookOpen, Ruler, ArrowRightLeft } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../yards-to-meters/page.module.css";

const fqW = 22; const fqH = 18;
const fqArea = fqW * fqH;

const squarePresets = [2, 2.5, 3, 3.5, 4, 4.5, 5, 6, 7, 8, 9];

const faqItems = [
    { q: "What size is a fat quarter?", a: "A fat quarter is approximately 18\" × 22\" (46 × 56 cm). It's made by cutting a half-yard of 44/45\" fabric in half across the width, giving 396 square inches of fabric." },
    { q: "What's the difference between a fat quarter and a regular quarter yard?", a: "A regular quarter yard is 9\" × 44\" (long and narrow). A fat quarter is 18\" × 22\" (short and wide). Both have the same total area (~396 sq in), but the fat quarter's squarer shape allows cutting larger pieces." },
    { q: "How many fat quarters do I need for a quilt?", a: "It depends on the quilt size and block design. A common baby quilt might use 8-12 fat quarters, a throw/lap quilt 15-20, and a queen-size quilt 25-40 fat quarters." },
    { q: "What is the biggest piece I can cut from a fat quarter?", a: "The largest square is 18\" × 18\". The full rectangle is approximately 18\" × 22\". For rotary cutting, the usable area is slightly smaller after trimming selvage edges." },
    { q: "Can I cut a 9-patch block from a fat quarter?", a: "Yes! For a 9-patch block with 3.5\" unfinished squares, you can cut 30 squares from one fat quarter — enough for three complete 9-patch blocks with squares to spare." },
];

const relatedTools = [
    { name: "Fat Eighth Calculator", href: "/convert/fat-eighth-calculator", icon: Grid3X3 },
    { name: "Fabric Cut Comparator", href: "/convert/fabric-cut-comparator", icon: ArrowRightLeft },
    { name: "Pre-Cut Fabric Sizes", href: "/convert/precut-fabric-sizes", icon: Ruler },
    { name: "Quilt Yardage", href: "/needles-thread/thread-by-fabric", icon: Ruler },
];

export default function FatQuarterCalculatorPage() {
    const [squareSize, setSquareSize] = useState("");
    const [rectW, setRectW] = useState("");
    const [rectH, setRectH] = useState("");
    const [seamAllowance, setSeamAllowance] = useState("0");
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const [copied, setCopied] = useState(false);

    const sa = parseFloat(seamAllowance) || 0;
    const usableW = fqW - sa * 2;
    const usableH = fqH - sa * 2;
    const usableArea = usableW * usableH;

    const sq = parseFloat(squareSize) || 0;
    const rw = parseFloat(rectW) || 0;
    const rh = parseFloat(rectH) || 0;

    const squaresAcross = sq > 0 ? Math.floor(usableW / sq) : 0;
    const squaresDown = sq > 0 ? Math.floor(usableH / sq) : 0;
    const totalSquares = squaresAcross * squaresDown;

    const rectsAcross = rw > 0 ? Math.floor(usableW / rw) : 0;
    const rectsDown = rh > 0 ? Math.floor(usableH / rh) : 0;
    const totalRects = rectsAcross * rectsDown;

    const handleCopy = useCallback(() => {
        const text = sq > 0 ? `${totalSquares} × ${sq}" squares from 1 fat quarter (${squaresAcross}×${squaresDown})` : `${totalRects} × ${rw}"×${rh}" from 1 fat quarter`;
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }, [sq, totalSquares, squaresAcross, squaresDown, totalRects, rw, rh]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Conversion Tools", href: "/convert" }, { label: "Fat Quarter Calculator" }]} />
            <div className="calculator-page">
                <div className="calculator-layout">
                    <div className="calculator-main">
                        <div className={styles.toolHeader}>
                            <span className="category-badge"><Grid3X3 size={14} strokeWidth={1.5} /> Conversion Tool</span>
                            <h1>Fat Quarter Calculator</h1>
                            <p>Calculate how many squares, rectangles, or custom shapes you can cut from a fat quarter (18&quot; × 22&quot;).</p>
                        </div>

                        <div className="calculator-card">
                            <h2 className={styles.calcTitle}>Fat Quarter: {fqW}&quot; × {fqH}&quot; ({fqArea} sq in)</h2>
                            <div className="calculator-form">
                                <div className="input-group">
                                    <label className="input-label">Edge allowance to deduct</label>
                                    <select className="input-field" value={seamAllowance} onChange={e => setSeamAllowance(e.target.value)}>
                                        <option value="0">None (full area)</option>
                                        <option value="0.25">¼&quot; per edge</option>
                                        <option value="0.5">½&quot; per edge</option>
                                    </select>
                                    <span className="input-helper">Usable area: {usableW.toFixed(1)}&quot; × {usableH.toFixed(1)}&quot; = {usableArea.toFixed(0)} sq in</span>
                                </div>

                                <div className="input-group">
                                    <label className="input-label" htmlFor="sq">Cut squares of size (inches)</label>
                                    <input id="sq" type="number" className="input-field input-mono" placeholder='e.g., 5 for 5" charm squares' value={squareSize} onChange={e => setSquareSize(e.target.value)} min="0" step="0.25" autoFocus />
                                    <div className={styles.presets} style={{ marginTop: 4 }}>
                                        <span className={styles.presetsLabel}>Common sizes:</span>
                                        <div className={styles.presetGrid}>
                                            {[2.5, 3, 3.5, 4, 5, 6].map(s => (
                                                <button key={s} className={`btn btn-ghost btn-sm ${parseFloat(squareSize) === s ? styles.presetActive : ""}`} onClick={() => setSquareSize(s.toString())}>{s}&quot;</button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-tertiary)', textAlign: 'center' }}>— or cut rectangles —</p>
                                <div className="calculator-form-row">
                                    <div className="input-group">
                                        <label className="input-label" htmlFor="rw">Width (inches)</label>
                                        <input id="rw" type="number" className="input-field input-mono" placeholder="e.g., 2.5" value={rectW} onChange={e => setRectW(e.target.value)} min="0" step="0.25" />
                                    </div>
                                    <div className="input-group">
                                        <label className="input-label" htmlFor="rh">Height (inches)</label>
                                        <input id="rh" type="number" className="input-field input-mono" placeholder="e.g., 4.5" value={rectH} onChange={e => setRectH(e.target.value)} min="0" step="0.25" />
                                    </div>
                                </div>
                            </div>

                            {(totalSquares > 0 || totalRects > 0) && (
                                <div className={styles.results}>
                                    <div className="calculator-divider" />
                                    {sq > 0 && (
                                        <div className="result-card">
                                            <div className="result-prefix">Squares</div>
                                            <div className="result-value">{totalSquares} squares</div>
                                            <div className="result-label">{sq}&quot; × {sq}&quot; squares ({squaresAcross} across × {squaresDown} down)</div>
                                        </div>
                                    )}
                                    {rw > 0 && rh > 0 && (
                                        <div className="result-card" style={{ marginTop: 12 }}>
                                            <div className="result-prefix">Rectangles</div>
                                            <div className="result-value">{totalRects} rectangles</div>
                                            <div className="result-label">{rw}&quot; × {rh}&quot; ({rectsAcross} across × {rectsDown} down)</div>
                                        </div>
                                    )}
                                    <div className="toolbar" style={{ marginTop: 16 }}>
                                        <button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button>
                                        <button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="calculator-card">
                            <h2 className={styles.sectionTitle}><BookOpen size={20} strokeWidth={1.5} style={{ color: 'var(--color-accent-primary)' }} /> What Fits in a Fat Quarter</h2>
                            <div className={styles.tableWrap}>
                                <table className={styles.convTable}>
                                    <thead><tr><th>Square Size</th><th>Count</th><th>Layout</th></tr></thead>
                                    <tbody>
                                        {squarePresets.map(s => {
                                            const a = Math.floor(fqW / s); const d = Math.floor(fqH / s);
                                            return <tr key={s}><td>{s}&quot;</td><td>{a * d}</td><td>{a} × {d}</td></tr>;
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="calculator-card">
                            <h2 className={styles.sectionTitle}><BookOpen size={20} strokeWidth={1.5} style={{ color: 'var(--color-accent-primary)' }} /> Fat Quarter vs Quarter Yard</h2>
                            <div className={styles.eduGrid}>
                                <div className={styles.eduItem}>
                                    <h4>Fat Quarter (18&quot; × 22&quot;)</h4>
                                    <p>Square-ish shape, 396 sq in. Can cut up to 18&quot; squares. Preferred by quilters for versatile cutting. Sold in bundles of 5-40.</p>
                                </div>
                                <div className={styles.eduItem}>
                                    <h4>Regular Quarter Yard (9&quot; × 44&quot;)</h4>
                                    <p>Long, narrow strip, 396 sq in. Max square is only 9&quot;. Better for borders and sashing strips. Cheaper when bought from the bolt.</p>
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
                            <h4>FQ Quick Facts</h4>
                            <div className={styles.quickRefItem}><span>Size</span><strong>18&quot; × 22&quot;</strong></div>
                            <div className={styles.quickRefItem}><span>Area</span><strong>396 sq in</strong></div>
                            <div className={styles.quickRefItem}><span>Max square</span><strong>18&quot; × 18&quot;</strong></div>
                            <div className={styles.quickRefItem}><span>5&quot; charms</span><strong>12 per FQ</strong></div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
