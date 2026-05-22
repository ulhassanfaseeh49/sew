"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRightLeft, ChevronDown, BookOpen, Grid3X3, Ruler } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../yards-to-meters/page.module.css";

const cuts = [
    { name: "Fat Eighth", dim: '9" × 22"', area: 198, best: "Small blocks, appliqué", maxSq: '9"' },
    { name: "Regular Eighth", dim: '4.5" × 44"', area: 198, best: "Strips, binding", maxSq: '4.5"' },
    { name: "Fat Quarter", dim: '18" × 22"', area: 396, best: "Quilt blocks, versatile", maxSq: '18"' },
    { name: "Regular Quarter", dim: '9" × 44"', area: 396, best: "Strips, borders, sashing", maxSq: '9"' },
    { name: "Half Yard", dim: '18" × 44"', area: 792, best: "Panels, garment pieces", maxSq: '18"' },
    { name: "Full Yard", dim: '36" × 44"', area: 1584, best: "Most garment projects", maxSq: '36"' },
];

const faqItems = [
    { q: "Why does a fat quarter seem bigger than a regular quarter yard?", a: "They have the same area (396 sq in), but different shapes! A fat quarter (18\" × 22\") is squarish, while a regular quarter (9\" × 44\") is long and narrow. The fat quarter FEELS bigger because you can cut larger squares from it." },
    { q: "When should I buy fat quarters vs cutting from the bolt?", a: "Fat quarters are ideal when you need many different fabrics in small amounts (quilting, scrappy projects). Cutting from the bolt is cheaper per yard and better when you need longer continuous pieces." },
    { q: "What's the practical difference for quilters?", a: "Fat quarter: max 18\" square. Regular quarter: max 9\" square. If your blocks need pieces larger than 9\", you MUST use a fat quarter or half yard." },
];

const relatedTools = [
    { name: "Fat Quarter Calculator", href: "/convert/fat-quarter-calculator", icon: Grid3X3 },
    { name: "Fat Eighth Calculator", href: "/convert/fat-eighth-calculator", icon: Grid3X3 },
    { name: "Pre-Cut Sizes", href: "/convert/precut-fabric-sizes", icon: Ruler },
];

export default function FabricCutComparatorPage() {
    const [pieceSize, setPieceSize] = useState("");
    const [activeFaq, setActiveFaq] = useState<number | null>(null);

    const ps = parseFloat(pieceSize) || 0;

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Conversion Tools", href: "/convert" }, { label: "Fabric Cut Comparator" }]} />
            <div className="calculator-page">
                <div className="calculator-layout">
                    <div className="calculator-main">
                        <div className={styles.toolHeader}>
                            <span className="category-badge"><ArrowRightLeft size={14} strokeWidth={1.5} /> Conversion Tool #20</span>
                            <h1>Fabric Cut Comparator</h1>
                            <p>Visual comparison of fat quarter, regular quarter, half yard, and other standard fabric cuts — designed for beginners.</p>
                        </div>

                        <div className="calculator-card">
                            <h2 className={styles.calcTitle}>Check Piece Fit (Optional)</h2>
                            <div className="calculator-form">
                                <div className="input-group">
                                    <label className="input-label" htmlFor="ps">Your piece size (square, inches)</label>
                                    <input id="ps" type="number" className="input-field input-mono" placeholder="e.g., 12 — check which cuts fit a 12-inch piece" value={pieceSize} onChange={e => setPieceSize(e.target.value)} min="0" step="0.5" />
                                    <span className="input-helper">Enter a size to highlight which cuts can fit that square.</span>
                                </div>
                            </div>
                        </div>

                        <div className="calculator-card">
                            <h2 className={styles.sectionTitle}><BookOpen size={20} strokeWidth={1.5} style={{ color: 'var(--color-accent-primary)' }} /> All Standard Fabric Cuts</h2>
                            <div className={styles.tableWrap}>
                                <table className={styles.convTable}>
                                    <thead><tr><th>Cut Type</th><th>Dimensions</th><th>Area</th><th>Max Square</th><th>Best For</th></tr></thead>
                                    <tbody>
                                        {cuts.map(c => {
                                            const maxSqNum = parseFloat(c.maxSq) || 0;
                                            const fits = ps > 0 && maxSqNum >= ps;
                                            return (
                                                <tr key={c.name} style={ps > 0 ? { background: fits ? 'rgba(0,128,96,0.06)' : 'rgba(239,68,68,0.04)' } : {}}>
                                                    <td style={{ fontWeight: 600 }}>{c.name}</td>
                                                    <td>{c.dim}</td>
                                                    <td>{c.area} sq in</td>
                                                    <td>{c.maxSq}
                                                        {ps > 0 && <span style={{ marginLeft: 6, fontSize: 12, color: fits ? 'var(--color-accent-primary)' : '#ef4444' }}>{fits ? "✓" : "✗"}</span>}
                                                    </td>
                                                    <td style={{ color: 'var(--color-text-tertiary)' }}>{c.best}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="calculator-card">
                            <h2 className={styles.sectionTitle}><BookOpen size={20} strokeWidth={1.5} style={{ color: 'var(--color-accent-primary)' }} /> Key Takeaway</h2>
                            <div className={styles.eduGrid}>
                                <div className={styles.eduItem}>
                                    <h4>Same area, different shape</h4>
                                    <p>A fat quarter and a regular quarter have the <strong>same area</strong> (396 sq in) but different shapes. The fat quarter is squarer (18&quot; × 22&quot;), while the regular quarter is long and narrow (9&quot; × 44&quot;). This is why fat quarters are more versatile for quilters.</p>
                                </div>
                                <div className={styles.eduItem}>
                                    <h4>When regular cuts win</h4>
                                    <p>Regular quarter yards are better for long strips (binding, borders, sashing). If you need pieces longer than 22&quot;, a regular cut gives you up to 44&quot; of continuous length.</p>
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
                            <h4>Quick Comparison</h4>
                            <div className={styles.quickRefItem}><span>Fat Quarter</span><strong>18&quot; × 22&quot;</strong></div>
                            <div className={styles.quickRefItem}><span>Reg. Quarter</span><strong>9&quot; × 44&quot;</strong></div>
                            <div className={styles.quickRefItem}><span>Same area</span><strong>396 sq in</strong></div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
