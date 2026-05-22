"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { ArrowRightLeft, Copy, Printer, ChevronDown, BookOpen, Ruler, Info } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../yards-to-meters/page.module.css";

const commonWidths = [
    { label: '36"', value: 36 }, { label: '44/45"', value: 44.5 }, { label: '54"', value: 54 },
    { label: '58/60"', value: 59 }, { label: '72"', value: 72 }, { label: '90"', value: 90 },
    { label: '108"', value: 108 }, { label: '118"', value: 118 },
];

const faqItems = [
    { q: "How do I convert any fabric width to any other width?", a: "Use the formula: New Yardage = Original Yardage × (Original Width ÷ New Width). This tool handles the math and rounds up to the nearest ⅛ yard for buying." },
    { q: "Is a simple formula enough or do I need to adjust for curved pieces?", a: "The formula works well for rectangular piecing and simple garments. For complex curved patterns, add 5-10% extra. For directional fabrics, add 10-15%." },
    { q: "What fabric widths are common for different project types?", a: "Quilting cotton: 44/45\". Fashion fabric: 45-60\". Fleece: 58-60\". Upholstery: 54\". Sheeting: 90-108\". Quilt backing: 108\". Drapery: 54-60\". Linen: 54-60\"." },
    { q: "Does fabric width affect drape or project quality?", a: "Width itself doesn't affect drape — that's determined by fiber content and weave. However, wider bolts may have different selvedge characteristics. Always check the fabric hand regardless of width." },
];

const relatedTools = [
    { name: '44" to 60" Converter', href: "/convert/fabric-width-44-to-60", icon: ArrowRightLeft },
    { name: '60" to 108" Converter', href: "/convert/fabric-width-60-to-108", icon: ArrowRightLeft },
    { name: "Width Comparison", href: "/convert/fabric-width-comparison", icon: Ruler },
    { name: "Yardage Calculator", href: "/yardage/basic-calculator", icon: Ruler },
];

export default function FabricWidthUniversalPage() {
    const [origWidth, setOrigWidth] = useState<string>("44.5");
    const [newWidth, setNewWidth] = useState<string>("60");
    const [origYardage, setOrigYardage] = useState<string>("");
    const [complexity, setComplexity] = useState("simple");
    const [buffer, setBuffer] = useState("5");
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const [copied, setCopied] = useState(false);

    const ow = parseFloat(origWidth) || 0;
    const nw = parseFloat(newWidth) || 0;
    const oy = parseFloat(origYardage) || 0;
    const complexMult = complexity === "complex" ? 1.1 : complexity === "moderate" ? 1.05 : 1;
    const bufferPct = parseFloat(buffer) || 0;
    const rawConversion = ow > 0 && nw > 0 ? oy * (ow / nw) : 0;
    const withComplexity = rawConversion * complexMult;
    const withBuffer = withComplexity * (1 + bufferPct / 100);
    const rounded = Math.ceil(withBuffer * 8) / 8;
    const savings = oy - rounded;
    const savingsPercent = oy > 0 ? (savings / oy) * 100 : 0;

    // All-widths comparison
    const allWidthsResults = commonWidths.map(w => ({
        ...w,
        yardage: oy > 0 && ow > 0 ? Math.ceil(oy * (ow / w.value) * 8) / 8 : 0,
        diff: oy > 0 && ow > 0 ? ((oy * (ow / w.value) - oy) / oy) * 100 : 0,
    }));

    const handleCopy = useCallback(() => {
        if (rounded > 0) {
            navigator.clipboard.writeText(`${oy} yd of ${ow}" → ${rounded.toFixed(3)} yd of ${nw}" (${savings >= 0 ? "saves" : "needs"} ${Math.abs(savingsPercent).toFixed(1)}%)`);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    }, [oy, ow, nw, rounded, savings, savingsPercent]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Conversion Tools", href: "/convert" }, { label: "Universal Fabric Width Converter" }]} />
            <div className="calculator-page">
                <div className="calculator-layout">
                    <div className="calculator-main">
                        <div className={styles.toolHeader}>
                            <span className="category-badge"><ArrowRightLeft size={14} strokeWidth={1.5} /> Conversion Tool #15</span>
                            <h1>Universal Fabric Width Converter</h1>
                            <p>Convert yardage between ANY two fabric widths with custom inputs. Includes a simultaneous all-widths comparison table.</p>
                        </div>

                        <div className="calculator-card">
                            <h2 className={styles.calcTitle}>Width Conversion</h2>
                            <div className="calculator-form">
                                <div className="calculator-form-row">
                                    <div className="input-group">
                                        <label className="input-label" htmlFor="orig-width">Pattern Width (inches)</label>
                                        <input id="orig-width" type="number" className="input-field input-mono" placeholder='e.g., 44.5' value={origWidth} onChange={(e) => setOrigWidth(e.target.value)} min="1" step="0.5" />
                                        <div className={styles.presetGrid} style={{ marginTop: '0.5rem' }}>
                                            {commonWidths.map(w => (
                                                <button key={`o${w.value}`} className={`btn btn-ghost btn-sm ${parseFloat(origWidth) === w.value ? styles.presetActive : ""}`} onClick={() => setOrigWidth(w.value.toString())}>{w.label}</button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="input-group">
                                        <label className="input-label" htmlFor="new-width">Your Fabric Width (inches)</label>
                                        <input id="new-width" type="number" className="input-field input-mono" placeholder='e.g., 60' value={newWidth} onChange={(e) => setNewWidth(e.target.value)} min="1" step="0.5" />
                                        <div className={styles.presetGrid} style={{ marginTop: '0.5rem' }}>
                                            {commonWidths.map(w => (
                                                <button key={`n${w.value}`} className={`btn btn-ghost btn-sm ${parseFloat(newWidth) === w.value ? styles.presetActive : ""}`} onClick={() => setNewWidth(w.value.toString())}>{w.label}</button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="input-group">
                                    <label className="input-label" htmlFor="orig-yardage">Pattern Yardage</label>
                                    <input id="orig-yardage" type="number" className="input-field input-mono" placeholder="Enter yardage from pattern (e.g., 3)" value={origYardage} onChange={(e) => setOrigYardage(e.target.value)} min="0" step="0.125" autoFocus />
                                </div>
                                <div className="calculator-form-row">
                                    <div className="input-group">
                                        <label className="input-label">Complexity</label>
                                        <select className="input-field" value={complexity} onChange={e => setComplexity(e.target.value)}>
                                            <option value="simple">Simple (rectangular)</option>
                                            <option value="moderate">Moderate (mixed)</option>
                                            <option value="complex">Complex (curved)</option>
                                        </select>
                                    </div>
                                    <div className="input-group">
                                        <label className="input-label">Buffer</label>
                                        <select className="input-field" value={buffer} onChange={e => setBuffer(e.target.value)}>
                                            <option value="0">None</option>
                                            <option value="5">5%</option>
                                            <option value="10">10%</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {rounded > 0 && (
                                <div className={styles.results}>
                                    <div className="calculator-divider" />
                                    <div className="result-card">
                                        <div className="result-prefix">You need</div>
                                        <div className="result-value">{rounded.toFixed(3)} yards</div>
                                        <div className="result-label">of {nw}&quot;-wide fabric (rounded up to ⅛ yd)</div>
                                    </div>
                                    <div className={styles.resultDetails}>
                                        <div className="result-row"><span className="result-row-label">Exact</span><span className="result-row-value">{rawConversion.toFixed(4)} yd</span></div>
                                        <div className="result-row"><span className="result-row-label">In meters</span><span className="result-row-value">{(rounded * 0.9144).toFixed(2)} m</span></div>
                                        <div className="result-row">
                                            <span className="result-row-label">{savings >= 0 ? "Fabric saved" : "Extra needed"}</span>
                                            <span className="result-row-value" style={{ color: savings >= 0 ? 'var(--color-accent-primary)' : '#ef4444' }}>
                                                {Math.abs(savings).toFixed(2)} yd ({Math.abs(savingsPercent).toFixed(1)}%)
                                            </span>
                                        </div>
                                        <div className="result-row"><span className="result-row-label">Width ratio</span><span className="result-row-value">{(ow / nw).toFixed(4)}</span></div>
                                    </div>
                                    <div className="toolbar" style={{ marginTop: 16 }}>
                                        <button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button>
                                        <button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button>
                                        <button className="btn btn-ghost btn-sm" onClick={() => { setOrigWidth(newWidth); setNewWidth(origWidth); }}><ArrowRightLeft size={14} /> Swap</button>
                                        <button className="btn btn-secondary btn-sm" onClick={() => setOrigYardage("")}>Clear</button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* All widths comparison */}
                        {oy > 0 && (
                            <div className="calculator-card">
                                <h2 className={styles.sectionTitle}><BookOpen size={20} strokeWidth={1.5} style={{ color: 'var(--color-accent-primary)' }} /> All Widths Comparison</h2>
                                <div className={styles.tableWrap}>
                                    <table className={styles.convTable}>
                                        <thead><tr><th>Width</th><th>Yardage Needed</th><th>vs Pattern</th></tr></thead>
                                        <tbody>
                                            {allWidthsResults.map(r => (
                                                <tr key={r.value} style={r.value === ow ? { background: 'var(--color-accent-glow)' } : {}}>
                                                    <td>{r.label} {r.value === ow ? "(base)" : ""}</td>
                                                    <td>{r.yardage.toFixed(3)} yd</td>
                                                    <td style={{ color: r.diff < 0 ? 'var(--color-accent-primary)' : r.diff > 0 ? '#ef4444' : 'var(--color-text-tertiary)' }}>
                                                        {r.diff < 0 ? `${Math.abs(r.diff).toFixed(1)}% less` : r.diff > 0 ? `${r.diff.toFixed(1)}% more` : "—"}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

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
                            <h4>Common Widths</h4>
                            <div className={styles.quickRefItem}><span>Quilting</span><strong>44/45&quot;</strong></div>
                            <div className={styles.quickRefItem}><span>Fashion</span><strong>58/60&quot;</strong></div>
                            <div className={styles.quickRefItem}><span>Upholstery</span><strong>54&quot;</strong></div>
                            <div className={styles.quickRefItem}><span>Backing</span><strong>108&quot;</strong></div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
