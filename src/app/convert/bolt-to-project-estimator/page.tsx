"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Package, Copy, Printer, ChevronDown, BookOpen, Ruler, Info } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../yards-to-meters/page.module.css";

const projectPresets = [
    { name: "Tote bag", yardage: 1 }, { name: "Pillow cover 18\"", yardage: 0.5 },
    { name: "Pillowcase (standard)", yardage: 0.625 }, { name: "Quilt block 12\"", yardage: 0.125 },
    { name: "Apron", yardage: 1.5 }, { name: "Simple dress (size S)", yardage: 3 },
    { name: "Zipper pouch", yardage: 0.25 }, { name: "Table runner", yardage: 1.5 },
];

const faqItems = [
    { q: "How do I calculate items per bolt?", a: "Divide the bolt yardage by the per-item yardage: 15 yd bolt ÷ 1 yd per tote = 15 totes. Then subtract waste (5-10% is typical) to get a realistic count." },
    { q: "Is buying a full bolt worth it?", a: "Yes, if you're making multiple items! Most stores offer 10-20% off for end-of-bolt purchases. Plus, you guarantee dye-lot consistency across all your items." },
    { q: "How do I account for waste?", a: "Add 5% for simple rectangular projects, 10% for curved or complex items. This covers cutting waste, selvage trimming, and occasional mistakes." },
];

const relatedTools = [
    { name: "Bolt Yardage Calculator", href: "/convert/bolt-yardage-calculator", icon: Package },
    { name: "Cost Per Yard", href: "/cost/per-yard", icon: Ruler },
    { name: "Yardage Calculator", href: "/yardage/basic-calculator", icon: Ruler },
];

export default function BoltToProjectEstimatorPage() {
    const [boltYardage, setBoltYardage] = useState("");
    const [projectYardage, setProjectYardage] = useState("");
    const [projectName, setProjectName] = useState("");
    const [waste, setWaste] = useState("5");
    const [sellPrice, setSellPrice] = useState("");
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const [copied, setCopied] = useState(false);

    const bolt = parseFloat(boltYardage) || 0;
    const perItem = parseFloat(projectYardage) || 0;
    const wastePct = parseFloat(waste) || 0;
    const price = parseFloat(sellPrice) || 0;

    const effectiveYardage = bolt * (1 - wastePct / 100);
    const maxItems = perItem > 0 ? Math.floor(effectiveYardage / perItem) : 0;
    const usedYardage = maxItems * perItem;
    const leftover = bolt - usedYardage;
    const revenue = price > 0 ? maxItems * price : 0;

    const handlePreset = (p: typeof projectPresets[0]) => {
        setProjectName(p.name);
        setProjectYardage(p.yardage.toString());
    };

    const handleCopy = useCallback(() => {
        if (maxItems > 0) {
            navigator.clipboard.writeText(`${bolt} yd bolt → ${maxItems} × ${projectName || "items"} (${perItem} yd each, ${wastePct}% waste)`);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    }, [bolt, maxItems, projectName, perItem, wastePct]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Conversion Tools", href: "/convert" }, { label: "Bolt to Project Estimator" }]} />
            <div className="calculator-page">
                <div className="calculator-layout">
                    <div className="calculator-main">
                        <div className={styles.toolHeader}>
                            <span className="category-badge"><Package size={14} strokeWidth={1.5} /> Conversion Tool</span>
                            <h1>Bolt to Project Estimator</h1>
                            <p>How many tote bags, pillows, or dresses from one bolt? Calculate project counts for batch crafting and selling.</p>
                        </div>

                        <div className="calculator-card">
                            <h2 className={styles.calcTitle}>Estimate Items</h2>
                            <div className="calculator-form">
                                <div className="input-group">
                                    <label className="input-label" htmlFor="bolt">Total bolt yardage</label>
                                    <input id="bolt" type="number" className="input-field input-mono" placeholder="e.g., 15" value={boltYardage} onChange={e => setBoltYardage(e.target.value)} min="0" autoFocus />
                                </div>

                                <div className={styles.presets}>
                                    <span className={styles.presetsLabel}>Choose a project:</span>
                                    <div className={styles.presetGrid}>
                                        {projectPresets.map(p => (
                                            <button key={p.name} className={`btn btn-ghost btn-sm ${projectName === p.name ? styles.presetActive : ""}`} onClick={() => handlePreset(p)}>{p.name}</button>
                                        ))}
                                    </div>
                                </div>

                                <div className="calculator-form-row">
                                    <div className="input-group">
                                        <label className="input-label" htmlFor="perItem">Yardage per item</label>
                                        <input id="perItem" type="number" className="input-field input-mono" placeholder="e.g., 1" value={projectYardage} onChange={e => setProjectYardage(e.target.value)} min="0" step="0.125" />
                                    </div>
                                    <div className="input-group">
                                        <label className="input-label">Waste factor</label>
                                        <select className="input-field" value={waste} onChange={e => setWaste(e.target.value)}>
                                            <option value="0">None</option>
                                            <option value="5">5% (standard)</option>
                                            <option value="10">10% (generous)</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="input-group">
                                    <label className="input-label" htmlFor="sell">Selling price per item ($, optional)</label>
                                    <input id="sell" type="number" className="input-field input-mono" placeholder="e.g., 25.00" value={sellPrice} onChange={e => setSellPrice(e.target.value)} min="0" step="0.01" />
                                </div>
                            </div>

                            {maxItems > 0 && (
                                <div className={styles.results}>
                                    <div className="calculator-divider" />
                                    <div className="result-card">
                                        <div className="result-prefix">You can make</div>
                                        <div className="result-value">{maxItems} {projectName || "items"}</div>
                                        <div className="result-label">from a {bolt} yard bolt ({wastePct}% waste factored)</div>
                                    </div>
                                    <div className={styles.resultDetails}>
                                        <div className="result-row"><span className="result-row-label">Fabric used</span><span className="result-row-value">{usedYardage.toFixed(2)} yd</span></div>
                                        <div className="result-row"><span className="result-row-label">Leftover</span><span className="result-row-value">{leftover.toFixed(2)} yd</span></div>
                                        {price > 0 && (
                                            <div className="result-row"><span className="result-row-label">Potential revenue</span><span className="result-row-value" style={{ fontWeight: 700, color: 'var(--color-accent-primary)' }}>${revenue.toFixed(2)}</span></div>
                                        )}
                                    </div>
                                    <div className="toolbar" style={{ marginTop: 16 }}>
                                        <button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button>
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
                            <h4>Quick Estimates (15yd bolt)</h4>
                            <div className={styles.quickRefItem}><span>Tote bags</span><strong>~14</strong></div>
                            <div className={styles.quickRefItem}><span>Pillowcases</span><strong>~22</strong></div>
                            <div className={styles.quickRefItem}><span>Dresses (S)</span><strong>~4</strong></div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
