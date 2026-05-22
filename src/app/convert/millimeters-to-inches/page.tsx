"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Ruler, ArrowRightLeft, Copy, Printer, ChevronDown, BookOpen } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../yards-to-meters/page.module.css";

const notionPresets = [
    { label: "6mm", value: 6, context: "Bias tape maker" },
    { label: "8mm", value: 8, context: "Small button" },
    { label: "10mm", value: 10, context: "Button / snap" },
    { label: "12mm", value: 12, context: "Button / bias tape maker" },
    { label: "15mm", value: 15, context: "Medium button" },
    { label: "18mm", value: 18, context: "Standard shirt button" },
    { label: "20mm", value: 20, context: "Coat button / elastic" },
    { label: "22mm", value: 22, context: "Large button" },
    { label: "25mm", value: 25, context: "1\" button / webbing" },
    { label: "28mm", value: 28, context: "Large button" },
    { label: "30mm", value: 30, context: "Zipper pull" },
    { label: "38mm", value: 38, context: "Bag strap hardware" },
    { label: "40mm", value: 40, context: "D-ring" },
    { label: "50mm", value: 50, context: "Wide webbing" },
];

const refTable = [
    { mm: 6, inches: '0.24"', frac: '¼"', context: "Bias tape maker — makes ¼\" tape" },
    { mm: 10, inches: '0.39"', frac: '⅜"', context: "Small button, narrow elastic" },
    { mm: 12, inches: '0.47"', frac: '½"', context: "Bias tape maker, medium button" },
    { mm: 15, inches: '0.59"', frac: '⅝"', context: "Medium button" },
    { mm: 18, inches: '0.71"', frac: '¾"', context: "Standard shirt button" },
    { mm: 20, inches: '0.79"', frac: '¾"', context: "Coat button, wide elastic" },
    { mm: 25, inches: '0.98"', frac: '1"', context: "Large coat button, 1\" webbing" },
    { mm: 38, inches: '1.50"', frac: '1½"', context: "Standard bag strap hardware" },
    { mm: 50, inches: '1.97"', frac: '2"', context: "Wide webbing, large buckle" },
];

const faqItems = [
    { q: "What size is an 18mm button in inches?", a: "An 18mm button is approximately ¾ inch (0.709\"). This is a standard shirt button size, commonly used on dress shirts and blouses." },
    { q: "How big is a 25mm button?", a: "A 25mm button is approximately 1 inch (0.984\"). This is considered a large button, commonly used on coats, jackets, and decorative closures." },
    { q: "What does 12mm bias tape maker make?", a: "A 12mm bias tape maker produces approximately ½\" finished bias tape. This is ideal for binding curves, necklines, and armholes on lightweight garments." },
    { q: "How do I convert zipper width from mm to inches?", a: "Divide the mm measurement by 25.4. Common zipper widths: #3 zipper = about 5mm teeth width, #5 = about 6.5mm, #8 = about 8mm. The overall tape width will be wider." },
    { q: "What is a 20mm snap in inches?", a: "A 20mm snap is approximately ¾ inch (0.787\"). This is a medium-large snap size, commonly used on jackets, bags, and heavy-duty applications." },
];

const relatedTools = [
    { name: "Inches to Millimeters", href: "/convert/inches-to-millimeters", icon: ArrowRightLeft },
    { name: "Centimeters to Inches", href: "/convert/centimeters-to-inches", icon: Ruler },
    { name: "Fraction to Decimal", href: "/convert/fraction-to-decimal", icon: Ruler },
];

export default function MillimetersToInchesPage() {
    const [mm, setMm] = useState("");
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const [copied, setCopied] = useState(false);

    const numMm = parseFloat(mm) || 0;
    const inches = numMm / 25.4;
    const cm = numMm / 10;

    const fractionStr = (val: number) => {
        const whole = Math.floor(val);
        const rem = val - whole;
        const sixteenths = Math.round(rem * 16);
        if (sixteenths === 0) return `${whole}"`;
        if (sixteenths === 16) return `${whole + 1}"`;
        const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
        const d = gcd(sixteenths, 16); const n = sixteenths / d; const dn = 16 / d;
        return whole > 0 ? `${whole} ${n}/${dn}"` : `${n}/${dn}"`;
    };

    // Find matching notion context
    const matchedNotion = notionPresets.find(p => p.value === numMm);

    const handleCopy = useCallback(() => {
        if (numMm > 0) {
            navigator.clipboard.writeText(`${numMm} mm = ${fractionStr(inches)} (${inches.toFixed(4)}")${matchedNotion ? ` — ${matchedNotion.context}` : ""}`);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    }, [numMm, inches, matchedNotion]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Conversion Tools", href: "/convert" }, { label: "Millimeters to Inches" }]} />
            <div className="calculator-page">
                <div className="calculator-layout">
                    <div className="calculator-main">
                        <div className={styles.toolHeader}>
                            <span className="category-badge"><Ruler size={14} strokeWidth={1.5} /> Conversion Tool #7</span>
                            <h1>Millimeters to Inches Converter</h1>
                            <p>Convert millimeters to inches with fraction display — specifically for buttons, snaps, zippers, and sewing hardware.</p>
                        </div>

                        <div className="calculator-card">
                            <h2 className={styles.calcTitle}>Enter Millimeters</h2>
                            <div className="calculator-form">
                                <div className="input-group">
                                    <label className="input-label" htmlFor="mm">Millimeters</label>
                                    <input id="mm" type="number" className="input-field input-mono" placeholder="e.g., 18" value={mm} onChange={e => setMm(e.target.value)} min="0" step="0.5" autoFocus />
                                    <span className="input-helper">1 inch = 25.4 mm. Common button sizes: 10, 15, 18, 20, 25 mm.</span>
                                </div>
                                <div className={styles.presets}>
                                    <span className={styles.presetsLabel}>Common notion sizes:</span>
                                    <div className={styles.presetGrid}>
                                        {notionPresets.map(p => (
                                            <button key={p.label} className={`btn btn-ghost btn-sm ${parseFloat(mm) === p.value ? styles.presetActive : ""}`} onClick={() => setMm(p.value.toString())} title={p.context}>{p.label}</button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {numMm > 0 && (
                                <div className={styles.results}>
                                    <div className="calculator-divider" />
                                    <div className="result-card">
                                        <div className="result-prefix">Result</div>
                                        <div className="result-value">{fractionStr(inches)}</div>
                                        <div className="result-label">{numMm} mm = {inches.toFixed(4)} inches</div>
                                    </div>

                                    <div className={styles.resultDetails}>
                                        <div className="result-row"><span className="result-row-label">Decimal inches</span><span className="result-row-value">{inches.toFixed(4)}&quot;</span></div>
                                        <div className="result-row"><span className="result-row-label">Nearest 1/16&quot;</span><span className="result-row-value">{fractionStr(inches)}</span></div>
                                        <div className="result-row"><span className="result-row-label">Nearest ⅛&quot;</span><span className="result-row-value">{(Math.round(inches * 8) / 8).toFixed(3)}&quot;</span></div>
                                        <div className="result-row"><span className="result-row-label">Centimeters</span><span className="result-row-value">{cm.toFixed(2)} cm</span></div>
                                    </div>

                                    {matchedNotion && (
                                        <div className="note-tip" style={{ marginTop: 16 }}>
                                            <strong>Notion context:</strong> {numMm}mm is a common size for <strong>{matchedNotion.context}</strong>.
                                        </div>
                                    )}

                                    <div className="toolbar" style={{ marginTop: 16 }}>
                                        <button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button>
                                        <button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button>
                                        <button className="btn btn-secondary btn-sm" onClick={() => setMm("")}>Clear</button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="calculator-card">
                            <h2 className={styles.sectionTitle}><BookOpen size={20} strokeWidth={1.5} style={{ color: 'var(--color-accent-primary)' }} /> Common Notion Sizes (MM to Inches)</h2>
                            <div className={styles.tableWrap}>
                                <table className={styles.convTable}>
                                    <thead><tr><th>MM</th><th>Inches</th><th>Fraction</th><th>Notion Context</th></tr></thead>
                                    <tbody>
                                        {refTable.map(r => (
                                            <tr key={r.mm}><td>{r.mm} mm</td><td>{r.inches}</td><td>{r.frac}</td><td style={{ color: 'var(--color-text-tertiary)' }}>{r.context}</td></tr>
                                        ))}
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
                            <h4>Button Size Guide</h4>
                            <div className={styles.quickRefItem}><span>Shirt button</span><strong>18mm (¾&quot;)</strong></div>
                            <div className={styles.quickRefItem}><span>Coat button</span><strong>25mm (1&quot;)</strong></div>
                            <div className={styles.quickRefItem}><span>Snap (med)</span><strong>15mm (⅝&quot;)</strong></div>
                            <div className={styles.quickRefItem}><span>D-ring (std)</span><strong>25mm (1&quot;)</strong></div>
                        </div>
                        <Link href="/convert/inches-to-millimeters" className="btn btn-secondary btn-md" style={{ width: '100%', justifyContent: 'center' }}>
                            <ArrowRightLeft size={16} /> Inches → MM
                        </Link>
                    </aside>
                </div>
            </div>
        </div>
    );
}
