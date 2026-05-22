"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Ruler, Copy, Printer, ChevronDown, BookOpen, Grid3X3, ArrowRightLeft } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../yards-to-meters/page.module.css";

const shapes = ["rectangle", "triangle", "circle"] as const;
type Shape = typeof shapes[number];

const faqItems = [
    { q: "How do I calculate the area of fabric?", a: "For rectangles: width × length. For triangles: ½ × base × height. For circles: π × radius². This tool handles all the math and converts to every unit." },
    { q: "How many square inches are in a yard of 44\" fabric?", a: "1 yard of 44\"-wide fabric = 36\" × 44\" = 1,584 square inches. A yard of 60\" fabric = 36\" × 60\" = 2,160 square inches." },
    { q: "How do I price fabric remnants by area?", a: "Measure the remnant dimensions, calculate the area with this tool, then divide by the price. Compare the per-square-inch cost to new fabric to see if it's a good deal." },
    { q: "What is the area of a fat quarter?", a: "A fat quarter (18\" × 22\") = 396 square inches, which equals about 2.75 square feet or 0.31 square yards." },
    { q: "How do I convert square inches to square yards?", a: "Divide square inches by 1,296 (since 36\" × 36\" = 1,296 sq in per sq yd). This tool does this automatically." },
];

const relatedTools = [
    { name: "Fat Quarter Calculator", href: "/convert/fat-quarter-calculator", icon: Grid3X3 },
    { name: "Fabric Width Converter", href: "/convert/fabric-width-universal", icon: ArrowRightLeft },
    { name: "Yardage Calculator", href: "/yardage/basic-calculator", icon: Ruler },
];

export default function FabricAreaCalculatorPage() {
    const [shape, setShape] = useState<Shape>("rectangle");
    const [w, setW] = useState(""); const [h, setH] = useState(""); // rectangle
    const [base, setBase] = useState(""); const [triH, setTriH] = useState(""); // triangle
    const [diameter, setDiameter] = useState(""); // circle
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const [copied, setCopied] = useState(false);

    let sqIn = 0;
    if (shape === "rectangle") sqIn = (parseFloat(w) || 0) * (parseFloat(h) || 0);
    else if (shape === "triangle") sqIn = 0.5 * (parseFloat(base) || 0) * (parseFloat(triH) || 0);
    else if (shape === "circle") { const r = (parseFloat(diameter) || 0) / 2; sqIn = Math.PI * r * r; }

    const sqFt = sqIn / 144;
    const sqYd = sqIn / 1296;
    const sqCm = sqIn * 6.4516;
    const sqM = sqCm / 10000;
    const equivYards44 = sqIn / 1584;

    const handleCopy = useCallback(() => {
        if (sqIn > 0) {
            navigator.clipboard.writeText(`Area: ${sqIn.toFixed(1)} sq in (${sqFt.toFixed(2)} sq ft, ${sqYd.toFixed(3)} sq yd, ${sqCm.toFixed(0)} sq cm)`);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    }, [sqIn, sqFt, sqYd, sqCm]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Conversion Tools", href: "/convert" }, { label: "Fabric Area Calculator" }]} />
            <div className="calculator-page">
                <div className="calculator-layout">
                    <div className="calculator-main">
                        <div className={styles.toolHeader}>
                            <span className="category-badge"><Ruler size={14} strokeWidth={1.5} /> Conversion Tool #24</span>
                            <h1>Fabric Area Calculator</h1>
                            <p>Calculate fabric area for rectangles, triangles, and circles — with results in all units plus yardage equivalents.</p>
                        </div>

                        <div className="calculator-card">
                            <h2 className={styles.calcTitle}>Calculate Area</h2>
                            <div className="calculator-form">
                                <div className="input-group">
                                    <label className="input-label">Shape</label>
                                    <div className={styles.presetGrid}>
                                        {shapes.map(s => (
                                            <button key={s} className={`btn btn-ghost btn-sm ${shape === s ? styles.presetActive : ""}`} onClick={() => setShape(s)} style={{ textTransform: 'capitalize' }}>{s}</button>
                                        ))}
                                    </div>
                                </div>

                                {shape === "rectangle" && (
                                    <div className="calculator-form-row">
                                        <div className="input-group">
                                            <label className="input-label" htmlFor="rw">Width (inches)</label>
                                            <input id="rw" type="number" className="input-field input-mono" placeholder="e.g., 44" value={w} onChange={e => setW(e.target.value)} min="0" step="0.5" autoFocus />
                                        </div>
                                        <div className="input-group">
                                            <label className="input-label" htmlFor="rh">Length (inches)</label>
                                            <input id="rh" type="number" className="input-field input-mono" placeholder="e.g., 36" value={h} onChange={e => setH(e.target.value)} min="0" step="0.5" />
                                        </div>
                                    </div>
                                )}
                                {shape === "triangle" && (
                                    <div className="calculator-form-row">
                                        <div className="input-group">
                                            <label className="input-label" htmlFor="tb">Base (inches)</label>
                                            <input id="tb" type="number" className="input-field input-mono" placeholder="e.g., 10" value={base} onChange={e => setBase(e.target.value)} min="0" step="0.5" autoFocus />
                                        </div>
                                        <div className="input-group">
                                            <label className="input-label" htmlFor="th">Height (inches)</label>
                                            <input id="th" type="number" className="input-field input-mono" placeholder="e.g., 10" value={triH} onChange={e => setTriH(e.target.value)} min="0" step="0.5" />
                                        </div>
                                    </div>
                                )}
                                {shape === "circle" && (
                                    <div className="input-group">
                                        <label className="input-label" htmlFor="cd">Diameter (inches)</label>
                                        <input id="cd" type="number" className="input-field input-mono" placeholder="e.g., 12" value={diameter} onChange={e => setDiameter(e.target.value)} min="0" step="0.5" autoFocus />
                                    </div>
                                )}
                            </div>

                            {sqIn > 0 && (
                                <div className={styles.results}>
                                    <div className="calculator-divider" />
                                    <div className="result-card">
                                        <div className="result-prefix">Total Area</div>
                                        <div className="result-value">{sqIn.toFixed(1)} sq in</div>
                                        <div className="result-label">{sqFt.toFixed(2)} sq ft</div>
                                    </div>
                                    <div className={styles.resultDetails}>
                                        <div className="result-row"><span className="result-row-label">Square inches</span><span className="result-row-value">{sqIn.toFixed(1)}</span></div>
                                        <div className="result-row"><span className="result-row-label">Square feet</span><span className="result-row-value">{sqFt.toFixed(2)}</span></div>
                                        <div className="result-row"><span className="result-row-label">Square yards</span><span className="result-row-value">{sqYd.toFixed(3)}</span></div>
                                        <div className="result-row"><span className="result-row-label">Square centimeters</span><span className="result-row-value">{sqCm.toFixed(0)}</span></div>
                                        <div className="result-row"><span className="result-row-label">Square meters</span><span className="result-row-value">{sqM.toFixed(4)}</span></div>
                                        <div className="result-row">
                                            <span className="result-row-label">≈ yards of 44&quot; fabric</span>
                                            <span className="result-row-value" style={{ fontWeight: 700, color: 'var(--color-accent-primary)' }}>{equivYards44.toFixed(2)} yd</span>
                                        </div>
                                    </div>
                                    <div className="toolbar" style={{ marginTop: 16 }}>
                                        <button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button>
                                        <button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="calculator-card">
                            <h2 className={styles.sectionTitle}><BookOpen size={20} strokeWidth={1.5} style={{ color: 'var(--color-accent-primary)' }} /> Reference Points</h2>
                            <div className={styles.tableWrap}>
                                <table className={styles.convTable}>
                                    <thead><tr><th>Reference</th><th>Area</th></tr></thead>
                                    <tbody>
                                        <tr><td>1 sq yard</td><td>1,296 sq in</td></tr>
                                        <tr><td>1 fat quarter</td><td>396 sq in</td></tr>
                                        <tr><td>1 yard of 44&quot; fabric</td><td>1,584 sq in</td></tr>
                                        <tr><td>1 yard of 60&quot; fabric</td><td>2,160 sq in</td></tr>
                                        <tr><td>1 sq meter</td><td>1,550 sq in</td></tr>
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
                            <h4>Quick Conversions</h4>
                            <div className={styles.quickRefItem}><span>1 sq yd</span><strong>1,296 sq in</strong></div>
                            <div className={styles.quickRefItem}><span>1 sq ft</span><strong>144 sq in</strong></div>
                            <div className={styles.quickRefItem}><span>1 sq m</span><strong>10,000 sq cm</strong></div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
