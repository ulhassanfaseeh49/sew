"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Ruler, Copy, Printer, ChevronDown, BookOpen, Grid3X3 } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../yards-to-meters/page.module.css";

const panelPresets = [
    { label: '24" × 44"', w: 24, h: 44 }, { label: '36" × 44"', w: 36, h: 44 },
    { label: '24" × 22"', w: 24, h: 22 }, { label: '44" × 44"', w: 44, h: 44 },
];

const faqItems = [
    { q: "What is a fabric panel?", a: "A fabric panel is a printed piece of fabric with a complete design (scene, character, motif) meant to be used as a single piece — often in quilts, wall hangings, or tote bags." },
    { q: "How do I center a panel in a quilt?", a: "Measure the trimmed panel, then cut sashing or border strips to frame it evenly. The cut-to size from this calculator includes seam allowances for easy piecing." },
    { q: "Do I trim the selvage on panels?", a: "Yes — always trim the selvage. Use this calculator to see your exact usable area after selvage removal." },
];

const relatedTools = [
    { name: "Fat Quarter Calculator", href: "/convert/fat-quarter-calculator", icon: Grid3X3 },
    { name: "Fabric Area Calculator", href: "/convert/fabric-area-calculator", icon: Ruler },
    { name: "Quilt Yardage", href: "/quilt/size-calculator", icon: Ruler },
];

export default function FabricPanelCalculatorPage() {
    const [panelW, setPanelW] = useState("");
    const [panelH, setPanelH] = useState("");
    const [selvage, setSelvage] = useState("0.5");
    const [borderTop, setBorderTop] = useState("0");
    const [borderBottom, setBorderBottom] = useState("0");
    const [borderSide, setBorderSide] = useState("0");
    const [seamAllowance, setSeamAllowance] = useState("0.25");
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const [copied, setCopied] = useState(false);

    const pw = parseFloat(panelW) || 0;
    const ph = parseFloat(panelH) || 0;
    const sv = parseFloat(selvage) || 0;
    const bt = parseFloat(borderTop) || 0;
    const bb = parseFloat(borderBottom) || 0;
    const bs = parseFloat(borderSide) || 0;
    const sa = parseFloat(seamAllowance) || 0;

    const usableW = Math.max(0, pw - sv * 2 - bs * 2);
    const usableH = Math.max(0, ph - bt - bb);
    const usableArea = usableW * usableH;
    const cutW = usableW + sa * 2;
    const cutH = usableH + sa * 2;
    const finW = usableW;
    const finH = usableH;

    const handleCopy = useCallback(() => {
        if (pw > 0) {
            navigator.clipboard.writeText(`Panel: ${pw}" × ${ph}" → Usable: ${usableW.toFixed(1)}" × ${usableH.toFixed(1)}" → Cut-to: ${cutW.toFixed(1)}" × ${cutH.toFixed(1)}"`);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    }, [pw, ph, usableW, usableH, cutW, cutH]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Conversion Tools", href: "/convert" }, { label: "Fabric Panel Calculator" }]} />
            <div className="calculator-page">
                <div className="calculator-layout">
                    <div className="calculator-main">
                        <div className={styles.toolHeader}>
                            <span className="category-badge"><Ruler size={14} strokeWidth={1.5} /> Conversion Tool</span>
                            <h1>Fabric Panel Size Calculator</h1>
                            <p>Calculate usable area of a fabric panel after removing selvage, borders, and adding seam allowances.</p>
                        </div>

                        <div className="calculator-card">
                            <h2 className={styles.calcTitle}>Panel Dimensions</h2>
                            <div className="calculator-form">
                                <div className={styles.presets}>
                                    <span className={styles.presetsLabel}>Common panels:</span>
                                    <div className={styles.presetGrid}>
                                        {panelPresets.map(p => (
                                            <button key={p.label} className={`btn btn-ghost btn-sm ${parseFloat(panelW) === p.w && parseFloat(panelH) === p.h ? styles.presetActive : ""}`} onClick={() => { setPanelW(p.w.toString()); setPanelH(p.h.toString()); }}>{p.label}</button>
                                        ))}
                                    </div>
                                </div>
                                <div className="calculator-form-row">
                                    <div className="input-group">
                                        <label className="input-label" htmlFor="pw">Panel width (inches)</label>
                                        <input id="pw" type="number" className="input-field input-mono" placeholder="e.g., 24" value={panelW} onChange={e => setPanelW(e.target.value)} min="0" step="0.5" />
                                    </div>
                                    <div className="input-group">
                                        <label className="input-label" htmlFor="ph">Panel height (inches)</label>
                                        <input id="ph" type="number" className="input-field input-mono" placeholder="e.g., 44" value={panelH} onChange={e => setPanelH(e.target.value)} min="0" step="0.5" />
                                    </div>
                                </div>
                                <div className="calculator-form-row">
                                    <div className="input-group">
                                        <label className="input-label">Selvage width (each side)</label>
                                        <select className="input-field" value={selvage} onChange={e => setSelvage(e.target.value)}>
                                            <option value="0">None</option>
                                            <option value="0.25">¼&quot;</option>
                                            <option value="0.5">½&quot;</option>
                                            <option value="0.75">¾&quot;</option>
                                            <option value="1">1&quot;</option>
                                        </select>
                                    </div>
                                    <div className="input-group">
                                        <label className="input-label">Seam allowance to add</label>
                                        <select className="input-field" value={seamAllowance} onChange={e => setSeamAllowance(e.target.value)}>
                                            <option value="0">None</option>
                                            <option value="0.25">¼&quot;</option>
                                            <option value="0.5">½&quot;</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {pw > 0 && ph > 0 && (
                                <div className={styles.results}>
                                    <div className="calculator-divider" />
                                    <div className="result-card">
                                        <div className="result-prefix">Usable Design Area</div>
                                        <div className="result-value">{usableW.toFixed(1)}&quot; × {usableH.toFixed(1)}&quot;</div>
                                        <div className="result-label">{usableArea.toFixed(0)} sq in usable</div>
                                    </div>
                                    <div className={styles.resultDetails}>
                                        <div className="result-row"><span className="result-row-label">Total panel</span><span className="result-row-value">{pw}&quot; × {ph}&quot;</span></div>
                                        <div className="result-row"><span className="result-row-label">After selvage</span><span className="result-row-value">{usableW.toFixed(1)}&quot; × {usableH.toFixed(1)}&quot;</span></div>
                                        <div className="result-row"><span className="result-row-label">Cut-to size</span><span className="result-row-value" style={{ fontWeight: 700, color: 'var(--color-accent-primary)' }}>{cutW.toFixed(1)}&quot; × {cutH.toFixed(1)}&quot;</span></div>
                                        <div className="result-row"><span className="result-row-label">Finished size</span><span className="result-row-value">{finW.toFixed(1)}&quot; × {finH.toFixed(1)}&quot;</span></div>
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
                            <h4>Common Panels</h4>
                            <div className={styles.quickRefItem}><span>Quilting</span><strong>24&quot; × 44&quot;</strong></div>
                            <div className={styles.quickRefItem}><span>Large</span><strong>36&quot; × 44&quot;</strong></div>
                            <div className={styles.quickRefItem}><span>Half panel</span><strong>24&quot; × 22&quot;</strong></div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
