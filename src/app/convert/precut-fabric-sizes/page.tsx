"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, ChevronDown, Grid3X3, Ruler, ArrowRightLeft } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../yards-to-meters/page.module.css";

const preCuts = [
    { name: "Mini Charm / Candy", size: '2½" × 2½"', pieces: 42, area: "~262 sq in", best: "Postage stamp quilts, tiny blocks" },
    { name: "Charm Pack", size: '5" × 5"', pieces: 42, area: "~1,050 sq in", best: "Charm quilts, small blocks" },
    { name: "Layer Cake", size: '10" × 10"', pieces: 42, area: "~4,200 sq in", best: "Large blocks, turnover triangles" },
    { name: "Jelly Roll", size: '2½" × 44"', pieces: 40, area: "~4,400 sq in", best: "Strip quilts, jelly roll races" },
    { name: "Honey Bun", size: '1½" × 44"', pieces: 40, area: "~2,640 sq in", best: "Narrow strip quilts" },
    { name: "Fat Quarter Bundle", size: '18" × 22"', pieces: "8-40", area: "varies", best: "Versatile quilting, scrappy projects" },
    { name: "Fat Eighth Bundle", size: '9" × 22"', pieces: "8-32", area: "varies", best: "Small blocks, accents" },
    { name: "Dessert Roll", size: '5" × 44"', pieces: 40, area: "~8,800 sq in", best: "Strip blocks, rail fence" },
    { name: "Turnover", size: '6" × 6" (triangle)', pieces: 40, area: "~720 sq in", best: "Half-square triangles" },
];

const faqItems = [
    { q: "What is a jelly roll in quilting?", a: "A jelly roll is a bundle of 40 fabric strips, each 2½\" × 44\". The strips are usually pre-cut from a single fabric collection, giving you coordinated colors for strip quilts." },
    { q: "What's the difference between a charm pack and a layer cake?", a: "Size! Charm packs are 5\" × 5\" squares (42 per pack). Layer cakes are 10\" × 10\" squares (42 per pack). Layer cakes give you four times the area per piece." },
    { q: "Can I substitute pre-cuts for yardage?", a: "Yes, but you need to calculate total area. A jelly roll has ~4,400 sq in, equivalent to about 3 yards of 44\" fabric. However, pre-cuts have fixed dimensions, so large continuous pieces can't be cut." },
    { q: "How many charm squares do I need for a quilt?", a: "Baby quilt: ~72 charm squares. Throw: ~120. Twin: ~180. Queen: ~300. These are estimates — check your specific pattern." },
];

const relatedTools = [
    { name: "Fat Quarter Calculator", href: "/convert/fat-quarter-calculator", icon: Grid3X3 },
    { name: "Fat Eighth Calculator", href: "/convert/fat-eighth-calculator", icon: Grid3X3 },
    { name: "Fabric Cut Comparator", href: "/convert/fabric-cut-comparator", icon: ArrowRightLeft },
    { name: "Yardage Calculator", href: "/yardage/basic-calculator", icon: Ruler },
];

export default function PreCutFabricSizesPage() {
    const [filter, setFilter] = useState("");
    const [activeFaq, setActiveFaq] = useState<number | null>(null);

    const minSize = parseFloat(filter) || 0;

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Conversion Tools", href: "/convert" }, { label: "Pre-Cut Fabric Sizes" }]} />
            <div className="calculator-page">
                <div className="calculator-layout">
                    <div className="calculator-main">
                        <div className={styles.toolHeader}>
                            <span className="category-badge"><Grid3X3 size={14} strokeWidth={1.5} /> Conversion Tool</span>
                            <h1>Pre-Cut Fabric Size Reference</h1>
                            <p>Complete guide to all pre-cut fabric sizes — charm squares, jelly rolls, layer cakes, and more — with dimensions and project ideas.</p>
                        </div>

                        <div className="calculator-card">
                            <h2 className={styles.calcTitle}>Filter by Minimum Piece Size (Optional)</h2>
                            <div className="calculator-form">
                                <div className="input-group">
                                    <label className="input-label" htmlFor="filter">Show pre-cuts with pieces at least X inches</label>
                                    <input id="filter" type="number" className="input-field input-mono" placeholder="e.g., 5 to show 5-inch+ pre-cuts" value={filter} onChange={e => setFilter(e.target.value)} min="0" step="0.5" />
                                </div>
                            </div>
                        </div>

                        <div className="calculator-card">
                            <h2 className={styles.sectionTitle}><BookOpen size={20} strokeWidth={1.5} style={{ color: 'var(--color-accent-primary)' }} /> Complete Pre-Cut Reference</h2>
                            <div className={styles.tableWrap}>
                                <table className={styles.convTable}>
                                    <thead><tr><th>Pre-Cut Type</th><th>Piece Size</th><th>Pieces/Pack</th><th>Total Area</th><th>Best For</th></tr></thead>
                                    <tbody>
                                        {preCuts.map(pc => {
                                            const sizeNum = parseFloat(pc.size) || 0;
                                            if (minSize > 0 && sizeNum < minSize && sizeNum > 0) return null;
                                            return (
                                                <tr key={pc.name}>
                                                    <td style={{ fontWeight: 600 }}>{pc.name}</td>
                                                    <td>{pc.size}</td>
                                                    <td>{pc.pieces}</td>
                                                    <td>{pc.area}</td>
                                                    <td style={{ color: 'var(--color-text-tertiary)' }}>{pc.best}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="calculator-card">
                            <h2 className={styles.sectionTitle}><BookOpen size={20} strokeWidth={1.5} style={{ color: 'var(--color-accent-primary)' }} /> Understanding Pre-Cuts</h2>
                            <div className={styles.eduGrid}>
                                <div className={styles.eduItem}>
                                    <h4>Why use pre-cuts?</h4>
                                    <p>Pre-cuts save cutting time and ensure perfectly coordinated fabrics from a collection. They&apos;re cut with precision rotary cutters at the factory, giving cleaner edges than most home cuts.</p>
                                </div>
                                <div className={styles.eduItem}>
                                    <h4>Choosing the right pre-cut</h4>
                                    <p>Match the pre-cut to your block size: 5&quot; charm squares for 4½&quot; finished blocks, 10&quot; layer cakes for 9½&quot; finished blocks, 2½&quot; jelly roll strips for 2&quot; finished strips.</p>
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
                            <h4>Quick Sizes</h4>
                            <div className={styles.quickRefItem}><span>Charm</span><strong>5&quot; × 5&quot;</strong></div>
                            <div className={styles.quickRefItem}><span>Layer Cake</span><strong>10&quot; × 10&quot;</strong></div>
                            <div className={styles.quickRefItem}><span>Jelly Roll</span><strong>2½&quot; × 44&quot;</strong></div>
                            <div className={styles.quickRefItem}><span>Fat Quarter</span><strong>18&quot; × 22&quot;</strong></div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
