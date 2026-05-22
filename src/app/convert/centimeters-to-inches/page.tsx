"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Ruler, ArrowRightLeft, Copy, Printer, ChevronDown, BookOpen } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../yards-to-meters/page.module.css";

const CM_TO_IN = 0.393701;

const fractionDisplay = (inches: number): string => {
    const whole = Math.floor(inches);
    const remainder = inches - whole;
    const sixteenths = Math.round(remainder * 16);
    if (sixteenths === 0) return `${whole}"`;
    if (sixteenths === 16) return `${whole + 1}"`;
    const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
    const d = gcd(sixteenths, 16);
    const num = sixteenths / d;
    const den = 16 / d;
    return whole > 0 ? `${whole} ${num}/${den}"` : `${num}/${den}"`;
};

const presets = [
    { label: "0.5 cm", value: 0.5 }, { label: "1 cm", value: 1 }, { label: "1.5 cm", value: 1.5 },
    { label: "2 cm", value: 2 }, { label: "2.5 cm", value: 2.5 }, { label: "3 cm", value: 3 },
    { label: "5 cm", value: 5 }, { label: "10 cm", value: 10 }, { label: "15 cm", value: 15 },
    { label: "20 cm", value: 20 }, { label: "25 cm", value: 25 }, { label: "30 cm", value: 30 },
    { label: "50 cm", value: 50 }, { label: "100 cm", value: 100 }, { label: "150 cm", value: 150 },
];

const referenceTable = [
    { cm: "0.5", exact: '0.197"', nearest8: '3/16"', sewing: '1/4"' },
    { cm: "1", exact: '0.394"', nearest8: '3/8"', sewing: '3/8"' },
    { cm: "1.5", exact: '0.591"', nearest8: '5/8"', sewing: '5/8"' },
    { cm: "2", exact: '0.787"', nearest8: '3/4"', sewing: '3/4"' },
    { cm: "2.5", exact: '0.984"', nearest8: '1"', sewing: '1"' },
    { cm: "3", exact: '1.181"', nearest8: '1 3/16"', sewing: '1 1/4"' },
    { cm: "5", exact: '1.969"', nearest8: '2"', sewing: '2"' },
    { cm: "10", exact: '3.937"', nearest8: '4"', sewing: '4"' },
    { cm: "15", exact: '5.906"', nearest8: '5 7/8"', sewing: '6"' },
    { cm: "30", exact: '11.811"', nearest8: '11 7/8"', sewing: '12"' },
    { cm: "100", exact: '39.370"', nearest8: '39 3/8"', sewing: '39 1/2"' },
    { cm: "150", exact: '59.055"', nearest8: '59 1/16"', sewing: '59"' },
];

const faqItems = [
    { q: "How many inches is 1 centimeter?", a: "One centimeter equals approximately 0.3937 inches, or roughly 3/8 of an inch. To convert, divide centimeters by 2.54." },
    { q: "What is 10 cm in inches as a fraction?", a: "10 cm equals approximately 3.937 inches, which rounds to 4 inches (or 3 15/16\" for precision). In sewing, 10 cm is treated as 4 inches." },
    { q: "How do I convert a metric pattern to inches?", a: "Divide all centimeter measurements by 2.54. For seam allowances, use the nearest standard imperial fraction rather than an exact conversion." },
    { q: "What fraction of an inch is 1.5 cm?", a: "1.5 cm equals approximately 0.591 inches, which is closest to 5/8\". This is why 1.5 cm and 5/8\" are often used interchangeably as standard seam allowances." },
    { q: "How do I read a metric tape measure in inches?", a: "Most sewing tape measures have cm on one side and inches on the other. Use the cm side for metric patterns. If your tape only has cm, divide by 2.54 for inches." },
];

const relatedTools = [
    { name: "Inches to Centimeters", href: "/convert/inches-to-centimeters", icon: ArrowRightLeft },
    { name: "Body Measurement Guide", href: "/body/measurement-guide", icon: Ruler },
    { name: "Pattern Scaling Tool", href: "/pattern/scale-calculator", icon: Ruler },
    { name: "Decimal to Fraction", href: "/convert/decimal-to-fraction", icon: Ruler },
];

export default function CentimetersToInchesPage() {
    const [cm, setCm] = useState<string>("");
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const [copied, setCopied] = useState(false);

    const numericCm = parseFloat(cm) || 0;
    const inches = numericCm * CM_TO_IN;
    const mm = numericCm * 10;

    const handleCopy = useCallback(() => {
        if (numericCm > 0) {
            navigator.clipboard.writeText(`${numericCm} cm = ${inches.toFixed(4)}" (${fractionDisplay(inches)})`);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    }, [numericCm, inches]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Conversion Tools", href: "/convert" }, { label: "Centimeters to Inches" }]} />
            <div className="calculator-page">
                <div className="calculator-layout">
                    <div className="calculator-main">
                        <div className={styles.toolHeader}>
                            <span className="category-badge"><Ruler size={14} strokeWidth={1.5} /> Conversion Tool</span>
                            <h1>Centimeters to Inches Converter</h1>
                            <p>Convert centimeters to inches with fraction display for sewing use. See results as nearest 1/16&quot;, 1/8&quot;, and 1/4&quot; fractions.</p>
                        </div>

                        <div className="calculator-card">
                            <h2 className={styles.calcTitle}>Enter Centimeters</h2>
                            <div className="calculator-form">
                                <div className="input-group">
                                    <label className="input-label" htmlFor="cm-input">Centimeters</label>
                                    <input id="cm-input" type="number" className="input-field input-mono" placeholder="Enter centimeters (e.g., 10)" value={cm} onChange={(e) => setCm(e.target.value)} min="0" step="0.1" autoFocus />
                                    <span className="input-helper">1 cm = 0.3937 inches. Divide by 2.54 to convert.</span>
                                </div>
                                <div className={styles.presets}>
                                    <span className={styles.presetsLabel}>Common values:</span>
                                    <div className={styles.presetGrid}>
                                        {presets.map((p) => (
                                            <button key={p.label} className={`btn btn-ghost btn-sm ${parseFloat(cm) === p.value ? styles.presetActive : ""}`} onClick={() => setCm(p.value.toString())}>{p.label}</button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {numericCm > 0 && (
                                <div className={styles.results}>
                                    <div className="calculator-divider" />
                                    <div className="result-card">
                                        <div className="result-prefix">Result</div>
                                        <div className="result-value">{fractionDisplay(inches)}</div>
                                        <div className="result-label">{numericCm} cm = {inches.toFixed(4)} inches</div>
                                    </div>
                                    <div className={styles.resultDetails}>
                                        <div className="result-row"><span className="result-row-label">Decimal inches</span><span className="result-row-value">{inches.toFixed(4)}&quot;</span></div>
                                        <div className="result-row"><span className="result-row-label">Nearest 1/16&quot;</span><span className="result-row-value">{fractionDisplay(inches)}</span></div>
                                        <div className="result-row"><span className="result-row-label">Nearest 1/8&quot;</span><span className="result-row-value">{(Math.round(inches * 8) / 8).toFixed(3)}&quot;</span></div>
                                        <div className="result-row"><span className="result-row-label">Nearest 1/4&quot;</span><span className="result-row-value">{(Math.round(inches * 4) / 4).toFixed(2)}&quot;</span></div>
                                        <div className="result-row"><span className="result-row-label">Millimeters</span><span className="result-row-value">{mm.toFixed(1)} mm</span></div>
                                    </div>
                                    <div className="toolbar" style={{ marginTop: 16 }}>
                                        <button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button>
                                        <button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button>
                                        <button className="btn btn-secondary btn-sm" onClick={() => setCm("")}>Clear</button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="calculator-card">
                            <h2 className={styles.sectionTitle}><BookOpen size={20} strokeWidth={1.5} style={{ color: 'var(--color-accent-primary)' }} /> CM to Inches Reference</h2>
                            <div className={styles.tableWrap}>
                                <table className={styles.convTable}>
                                    <thead><tr><th>CM</th><th>Exact Inches</th><th>Nearest ⅛&quot;</th><th>Nearest Sewing Fraction</th></tr></thead>
                                    <tbody>
                                        {referenceTable.map((r) => (
                                            <tr key={r.cm}><td>{r.cm} cm</td><td>{r.exact}</td><td>{r.nearest8}</td><td>{r.sewing}</td></tr>
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
                            <h4>Key Conversions</h4>
                            <div className={styles.quickRefItem}><span>1 cm</span><strong>0.3937&quot;</strong></div>
                            <div className={styles.quickRefItem}><span>1.5 cm</span><strong>≈ ⅝&quot;</strong></div>
                            <div className={styles.quickRefItem}><span>2.54 cm</span><strong>1&quot;</strong></div>
                            <div className={styles.quickRefItem}><span>100 cm</span><strong>39.37&quot;</strong></div>
                        </div>
                        <Link href="/convert/inches-to-centimeters" className="btn btn-secondary btn-md" style={{ width: '100%', justifyContent: 'center' }}>
                            <ArrowRightLeft size={16} /> Inches → CM
                        </Link>
                    </aside>
                </div>
            </div>
        </div>
    );
}
