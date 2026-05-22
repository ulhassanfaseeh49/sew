"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Package, Copy, Printer, ChevronDown, BookOpen, Ruler, Info } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../yards-to-meters/page.module.css";

const boltPresets = [
    { label: "10 yd", value: 10 }, { label: "15 yd", value: 15 }, { label: "20 yd", value: 20 },
    { label: "25 yd", value: 25 }, { label: "30 yd", value: 30 }, { label: "45 yd", value: 45 },
    { label: "50 yd", value: 50 },
];

const boltRefTable = [
    { type: "Quilting cotton", typical: "15 or 25 yd", width: '44/45"' },
    { type: "Fashion fabric", typical: "10-15 yd", width: '45-60"' },
    { type: "Upholstery", typical: "15-25 yd", width: '54"' },
    { type: "Wide backing", typical: "25-30 yd", width: '108"' },
    { type: "Fleece", typical: "15-20 yd", width: '58/60"' },
    { type: "Interfacing", typical: "25-50 yd", width: '20-60"' },
];

const faqItems = [
    { q: "How many yards are on a standard bolt of fabric?", a: "It varies by type: quilting cotton typically comes in 15 or 25-yard bolts, fashion fabric in 10-15 yards, and upholstery in 15-25 yards. Wholesale bolts can be 50-100 yards." },
    { q: "How do I measure fabric remaining on a bolt?", a: "The simplest way is to check the bolt end for a label. If there's no label, carefully unroll and re-roll while measuring, or use the bolt diameter method with our calculator." },
    { q: "Is buying a full bolt cheaper?", a: "Yes, most fabric stores offer 10-20% off when you buy the full remaining bolt. This is called an 'end of bolt' or 'bolt price' discount. Ask the cutting counter!" },
    { q: "How do I track bolt usage for my fabric stash?", a: "Enter the total yards on the bolt, then subtract what you've used. This tool tracks remaining yardage and value. Copy the results to keep in your stash inventory." },
];

const relatedTools = [
    { name: "Bolt to Project Estimator", href: "/convert/bolt-to-project-estimator", icon: Package },
    { name: "Cost Per Yard", href: "/cost/per-yard", icon: Ruler },
    { name: "Yardage Calculator", href: "/yardage/basic-calculator", icon: Ruler },
];

export default function BoltYardageCalculatorPage() {
    const [totalYards, setTotalYards] = useState("");
    const [usedYards, setUsedYards] = useState("");
    const [pricePerYard, setPricePerYard] = useState("");
    const [projectNeed, setProjectNeed] = useState("");
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const [copied, setCopied] = useState(false);

    const total = parseFloat(totalYards) || 0;
    const used = parseFloat(usedYards) || 0;
    const price = parseFloat(pricePerYard) || 0;
    const need = parseFloat(projectNeed) || 0;
    const remaining = Math.max(0, total - used);
    const meters = remaining * 0.9144;
    const usedPct = total > 0 ? (used / total * 100) : 0;
    const remPct = total > 0 ? (remaining / total * 100) : 0;
    const enough = need > 0 && remaining >= need;

    const handleCopy = useCallback(() => {
        if (total > 0) {
            let text = `Bolt: ${total} yd, Used: ${used} yd, Remaining: ${remaining} yd (${meters.toFixed(1)} m)`;
            if (price > 0) text += `\nRemaining value: $${(remaining * price).toFixed(2)}`;
            navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    }, [total, used, remaining, meters, price]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Conversion Tools", href: "/convert" }, { label: "Bolt Yardage Calculator" }]} />
            <div className="calculator-page">
                <div className="calculator-layout">
                    <div className="calculator-main">
                        <div className={styles.toolHeader}>
                            <span className="category-badge"><Package size={14} strokeWidth={1.5} /> Conversion Tool #17</span>
                            <h1>Fabric Bolt Yardage Calculator</h1>
                            <p>Track bolt yardage, calculate remaining fabric, estimate values, and check if you have enough for your next project.</p>
                        </div>

                        <div className="calculator-card">
                            <h2 className={styles.calcTitle}>Bolt Details</h2>
                            <div className="calculator-form">
                                <div className="input-group">
                                    <label className="input-label" htmlFor="total">Total yards on bolt</label>
                                    <input id="total" type="number" className="input-field input-mono" placeholder="e.g., 15" value={totalYards} onChange={e => setTotalYards(e.target.value)} min="0" autoFocus />
                                    <div className={styles.presets} style={{ marginTop: 4 }}>
                                        <span className={styles.presetsLabel}>Standard bolts:</span>
                                        <div className={styles.presetGrid}>
                                            {boltPresets.map(p => (
                                                <button key={p.value} className={`btn btn-ghost btn-sm ${parseFloat(totalYards) === p.value ? styles.presetActive : ""}`} onClick={() => setTotalYards(p.value.toString())}>{p.label}</button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="calculator-form-row">
                                    <div className="input-group">
                                        <label className="input-label" htmlFor="used">Yards used so far</label>
                                        <input id="used" type="number" className="input-field input-mono" placeholder="e.g., 4.5" value={usedYards} onChange={e => setUsedYards(e.target.value)} min="0" step="0.125" />
                                    </div>
                                    <div className="input-group">
                                        <label className="input-label" htmlFor="price">Price per yard ($, optional)</label>
                                        <input id="price" type="number" className="input-field input-mono" placeholder="e.g., 12.99" value={pricePerYard} onChange={e => setPricePerYard(e.target.value)} min="0" step="0.01" />
                                    </div>
                                </div>
                                <div className="input-group">
                                    <label className="input-label" htmlFor="need">Project needs (yards, optional)</label>
                                    <input id="need" type="number" className="input-field input-mono" placeholder="Enter yardage needed for your project" value={projectNeed} onChange={e => setProjectNeed(e.target.value)} min="0" step="0.125" />
                                </div>
                            </div>

                            {total > 0 && (
                                <div className={styles.results}>
                                    <div className="calculator-divider" />
                                    <div className="result-card">
                                        <div className="result-prefix">Remaining</div>
                                        <div className="result-value">{remaining.toFixed(2)} yards</div>
                                        <div className="result-label">of {total} total yards ({meters.toFixed(1)} meters)</div>
                                    </div>
                                    <div className={styles.resultDetails}>
                                        <div className="result-row"><span className="result-row-label">Used</span><span className="result-row-value">{used.toFixed(2)} yd ({usedPct.toFixed(1)}%)</span></div>
                                        <div className="result-row"><span className="result-row-label">Remaining</span><span className="result-row-value" style={{ fontWeight: 700, color: 'var(--color-accent-primary)' }}>{remaining.toFixed(2)} yd ({remPct.toFixed(1)}%)</span></div>
                                        {price > 0 && (<>
                                            <div className="result-row"><span className="result-row-label">Total bolt value</span><span className="result-row-value">${(total * price).toFixed(2)}</span></div>
                                            <div className="result-row"><span className="result-row-label">Remaining value</span><span className="result-row-value">${(remaining * price).toFixed(2)}</span></div>
                                        </>)}
                                    </div>

                                    {need > 0 && (
                                        <div className={enough ? "note-tip" : "note-warning"} style={{ marginTop: 16 }}>
                                            <Info size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />
                                            {enough
                                                ? <><strong>Yes, enough fabric!</strong> You have {(remaining - need).toFixed(2)} yd extra after cutting {need} yd.</>
                                                : <><strong>Not enough fabric.</strong> You need {(need - remaining).toFixed(2)} more yards. Consider buying an additional bolt.</>
                                            }
                                        </div>
                                    )}

                                    <div className="toolbar" style={{ marginTop: 16 }}>
                                        <button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button>
                                        <button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button>
                                        <button className="btn btn-secondary btn-sm" onClick={() => { setTotalYards(""); setUsedYards(""); setPricePerYard(""); setProjectNeed(""); }}>Clear</button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="calculator-card">
                            <h2 className={styles.sectionTitle}><BookOpen size={20} strokeWidth={1.5} style={{ color: 'var(--color-accent-primary)' }} /> Standard Bolt Sizes</h2>
                            <div className={styles.tableWrap}>
                                <table className={styles.convTable}>
                                    <thead><tr><th>Fabric Type</th><th>Typical Bolt Size</th><th>Width</th></tr></thead>
                                    <tbody>{boltRefTable.map(r => (<tr key={r.type}><td>{r.type}</td><td>{r.typical}</td><td>{r.width}</td></tr>))}</tbody>
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
                            <h4>Bolt Basics</h4>
                            <div className={styles.quickRefItem}><span>Cotton bolt</span><strong>15-25 yd</strong></div>
                            <div className={styles.quickRefItem}><span>Fashion bolt</span><strong>10-15 yd</strong></div>
                            <div className={styles.quickRefItem}><span>Upholstery</span><strong>15-25 yd</strong></div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
