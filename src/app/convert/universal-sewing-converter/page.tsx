"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Ruler, ArrowRightLeft, Copy, Printer, ChevronDown, BookOpen } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../yards-to-meters/page.module.css";

const units = ["yards", "meters", "inches", "centimeters", "millimeters", "feet"] as const;
type Unit = typeof units[number];
const toInches: Record<Unit, number> = { yards: 36, meters: 39.3701, inches: 1, centimeters: 0.393701, millimeters: 0.0393701, feet: 12 };
const fromInches: Record<Unit, number> = { yards: 1 / 36, meters: 0.0254, inches: 1, centimeters: 2.54, millimeters: 25.4, feet: 1 / 12 };
const labels: Record<Unit, string> = { yards: "Yards", meters: "Meters", inches: "Inches", centimeters: "Centimeters", millimeters: "Millimeters", feet: "Feet" };
const abbr: Record<Unit, string> = { yards: "yd", meters: "m", inches: "in", centimeters: "cm", millimeters: "mm", feet: "ft" };
const context: Record<Unit, string> = {
    yards: "For buying fabric yardage",
    meters: "For international patterns/stores",
    inches: "For pattern pieces and seam allowances",
    centimeters: "For European/metric patterns",
    millimeters: "For buttons, hardware, small notions",
    feet: "For room measurements and curtains",
};

const categoryPresets = [
    { name: "Yardage", unit: "yards" as Unit, values: [{ l: "¼ yd", v: 0.25 }, { l: "½ yd", v: 0.5 }, { l: "1 yd", v: 1 }, { l: "1½ yd", v: 1.5 }, { l: "2 yd", v: 2 }, { l: "3 yd", v: 3 }, { l: "5 yd", v: 5 }] },
    { name: "Seam Allowances", unit: "inches" as Unit, values: [{ l: '¼"', v: 0.25 }, { l: '⅜"', v: 0.375 }, { l: '½"', v: 0.5 }, { l: '⅝"', v: 0.625 }, { l: '¾"', v: 0.75 }, { l: '1"', v: 1 }] },
    { name: "Fabric Widths", unit: "inches" as Unit, values: [{ l: '36"', v: 36 }, { l: '44"', v: 44 }, { l: '45"', v: 45 }, { l: '54"', v: 54 }, { l: '60"', v: 60 }] },
    { name: "Notions (mm)", unit: "millimeters" as Unit, values: [{ l: "10mm", v: 10 }, { l: "15mm", v: 15 }, { l: "18mm", v: 18 }, { l: "25mm", v: 25 }, { l: "38mm", v: 38 }, { l: "50mm", v: 50 }] },
];

const faqItems = [
    { q: "What is the most useful conversion for sewists to know?", a: "1 yard = 0.9144 meters is the most frequently needed conversion. Also useful: 1 inch = 2.54 cm, and 5/8\" = 1.59 cm (standard seam allowance in both systems)." },
    { q: "How do I convert yards to meters and inches at the same time?", a: "Enter your measurement in any unit and this tool shows results in ALL units simultaneously. No need to run separate conversions." },
    { q: "Can I save my conversions for later?", a: "Use the Copy button to copy any result to your clipboard. You can paste it into notes, messages, or a shopping list." },
    { q: "What is the difference between this and a regular unit converter?", a: "This converter is designed specifically for sewists. It includes sewing-relevant presets (seam allowances, fabric widths, notion sizes), shows all results simultaneously, and provides sewing context for each unit." },
];

const relatedTools = [
    { name: "Yards to Meters", href: "/convert/yards-to-meters", icon: Ruler },
    { name: "Inches to CM", href: "/convert/inches-to-centimeters", icon: Ruler },
    { name: "MM to Inches", href: "/convert/millimeters-to-inches", icon: Ruler },
    { name: "Fraction / Decimal", href: "/convert/fraction-to-decimal", icon: ArrowRightLeft },
    { name: "Yardage Calculators", href: "/yardage/basic-calculator", icon: Ruler },
];

export default function UniversalConverterPage() {
    const [fromUnit, setFromUnit] = useState<Unit>("yards");
    const [value, setValue] = useState("");
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const [copied, setCopied] = useState<string | null>(null);

    const num = parseFloat(value) || 0;
    const inInches = num * toInches[fromUnit];
    const allResults = units.map(u => ({ unit: u, value: inInches * fromInches[u] }));

    const handleCopyOne = (unit: Unit, val: number) => {
        navigator.clipboard.writeText(`${num} ${abbr[fromUnit]} = ${val.toFixed(4)} ${abbr[unit]}`);
        setCopied(unit);
        setTimeout(() => setCopied(null), 1500);
    };

    const handleCopyAll = useCallback(() => {
        if (num > 0) {
            const text = allResults.map(r => `${r.value.toFixed(4)} ${abbr[r.unit]}`).join("\n");
            navigator.clipboard.writeText(`${num} ${abbr[fromUnit]} =\n${text}`);
            setCopied("all");
            setTimeout(() => setCopied(null), 2000);
        }
    }, [num, fromUnit, allResults]);

    const handlePreset = (unit: Unit, val: number) => {
        setFromUnit(unit);
        setValue(val.toString());
    };

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Conversion Tools", href: "/convert" }, { label: "Universal Sewing Converter" }]} />
            <div className="calculator-page">
                <div className="calculator-layout">
                    <div className="calculator-main">
                        <div className={styles.toolHeader}>
                            <span className="category-badge"><Ruler size={14} strokeWidth={1.5} /> Conversion Tool</span>
                            <h1>All-in-One Sewing Unit Converter</h1>
                            <p>Master converter: enter any measurement and see it in yards, meters, inches, centimeters, millimeters, and feet — all at once.</p>
                        </div>

                        <div className="calculator-card">
                            <h2 className={styles.calcTitle}>Convert Units</h2>
                            <div className="calculator-form">
                                <div className="calculator-form-row">
                                    <div className="input-group" style={{ flex: 1 }}>
                                        <label className="input-label" htmlFor="val">Value</label>
                                        <input id="val" type="number" className="input-field input-mono" placeholder={`Enter ${labels[fromUnit].toLowerCase()}`} value={value} onChange={e => setValue(e.target.value)} min="0" step="0.01" autoFocus />
                                    </div>
                                    <div className="input-group" style={{ flex: 0.6 }}>
                                        <label className="input-label">Unit</label>
                                        <select className="input-field" value={fromUnit} onChange={e => setFromUnit(e.target.value as Unit)}>
                                            {units.map(u => (<option key={u} value={u}>{labels[u]}</option>))}
                                        </select>
                                    </div>
                                </div>

                                {/* Category Presets */}
                                {categoryPresets.map(cat => (
                                    <div key={cat.name} className={styles.presets}>
                                        <span className={styles.presetsLabel}>{cat.name}:</span>
                                        <div className={styles.presetGrid}>
                                            {cat.values.map(p => (
                                                <button key={p.l} className={`btn btn-ghost btn-sm ${fromUnit === cat.unit && parseFloat(value) === p.v ? styles.presetActive : ""}`} onClick={() => handlePreset(cat.unit, p.v)}>{p.l}</button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* All Results */}
                            {num > 0 && (
                                <div className={styles.results}>
                                    <div className="calculator-divider" />
                                    <div className={styles.resultDetails}>
                                        {allResults.map(r => (
                                            <div key={r.unit} className="result-row" style={r.unit === fromUnit ? { opacity: 0.5 } : {}}>
                                                <span className="result-row-label">
                                                    <strong>{labels[r.unit]}</strong>
                                                    <span style={{ fontSize: 12, color: 'var(--color-text-tertiary)', display: 'block' }}>{context[r.unit]}</span>
                                                </span>
                                                <span className="result-row-value" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                    {r.value.toFixed(4)} {abbr[r.unit]}
                                                    {r.unit !== fromUnit && (
                                                        <button className="btn btn-ghost btn-sm" onClick={() => handleCopyOne(r.unit, r.value)} style={{ padding: '2px 6px', minWidth: 0 }}>
                                                            <Copy size={12} />
                                                        </button>
                                                    )}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="toolbar" style={{ marginTop: 16 }}>
                                        <button className="btn btn-secondary btn-sm" onClick={handleCopyAll}>
                                            <Copy size={14} /> {copied === "all" ? "Copied!" : "Copy All"}
                                        </button>
                                        <button className="btn btn-secondary btn-sm" onClick={() => window.print()}>
                                            <Printer size={14} /> Print
                                        </button>
                                        <button className="btn btn-secondary btn-sm" onClick={() => setValue("")}>
                                            Clear
                                        </button>
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
                            <h4>All Converters</h4>
                            {relatedTools.map((tool) => {
                                const IC = tool.icon; return (
                                    <Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>
                                );
                            })}
                        </div>
                        <div className="quick-reference">
                            <h4>Key Conversions</h4>
                            <div className={styles.quickRefItem}><span>1 yard</span><strong>0.9144 m</strong></div>
                            <div className={styles.quickRefItem}><span>1 inch</span><strong>2.54 cm</strong></div>
                            <div className={styles.quickRefItem}><span>1 inch</span><strong>25.4 mm</strong></div>
                            <div className={styles.quickRefItem}><span>1 foot</span><strong>30.48 cm</strong></div>
                            <div className={styles.quickRefItem}><span>⅝&quot;</span><strong>1.59 cm</strong></div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
