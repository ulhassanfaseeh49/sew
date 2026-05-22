"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { RefreshCw, Copy, Printer, ChevronDown, BarChart3, Ruler } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const relatedTools = [
    { name: "Stretch % Calculator", href: "/stretch/percentage-calculator", icon: BarChart3 },
    { name: "Negative Ease", href: "/stretch/negative-ease", icon: Ruler },
    { name: "Knit Types", href: "/stretch/knit-type-comparator", icon: RefreshCw },
];

const faqItems = [
    { q: "Can I convert a woven pattern to knit?", a: "Yes, but reduce the pattern pieces by the negative ease percentage. Eliminate darts (knit fabrics conform to body curves). Remove closures like zippers where stretch allows pull-on." },
    { q: "How much smaller should the knit version be?", a: "Typically 5-15% smaller depending on fabric stretch. Higher stretch = more reduction possible. Always check that the neckline and cuffs can stretch over head/hands." },
    { q: "What about darts in the knit version?", a: "Most darts can be eliminated because knit fabric stretches to conform to body curves. Bust darts in very fitted garments may still be needed for proper fit." },
];

export default function WovenToKnitConverterPage() {
    const [wovenMeasure, setWoven] = useState("");
    const [stretchPct, setStretch] = useState("25");
    const [ease, setEase] = useState("-10");
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const [copied, setCopied] = useState(false);

    const wm = parseFloat(wovenMeasure) || 0;
    const sp = parseFloat(stretchPct) || 25;
    const ep = parseFloat(ease) || -10;
    const knitMeasure = wm * (1 + ep / 100);
    const stretchNeeded = wm > 0 ? ((wm - knitMeasure) / knitMeasure * 100) : 0;
    const hasEnough = sp >= stretchNeeded;
    const hasResult = wm > 0;

    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(`Woven ${wm}" → Knit ${knitMeasure.toFixed(1)}" (${ep}% ease, needs ${stretchNeeded.toFixed(0)}% stretch)`);
        setCopied(true); setTimeout(() => setCopied(false), 2000);
    }, [wm, knitMeasure, ep, stretchNeeded]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Stretch Tools", href: "/stretch" }, { label: "Woven to Knit" }]} />
            <div className="calculator-layout">
                <div className="calculator-main">
                    <div className={styles.toolHeader}>
                        <span className="category-badge"><RefreshCw size={14} strokeWidth={1.5} /> Stretch Tool</span>
                        <h1>Woven to Knit Converter</h1>
                        <p>Convert woven pattern measurements to knit pattern measurements with appropriate negative ease.</p>
                    </div>
                    <div className="calculator-card">
                        <h2 className={styles.calcTitle}>Conversion</h2>
                        <div className="calculator-form">
                            <div className="input-group"><label className="input-label">Woven Pattern Measurement (inches)</label><input type="number" className="input-field input-mono" placeholder="e.g., 40" value={wovenMeasure} onChange={e => setWoven(e.target.value)} min="0" step="0.25" /></div>
                            <div className="calculator-form-row">
                                <div className="input-group"><label className="input-label">Negative Ease</label><select className="input-field" value={ease} onChange={e => setEase(e.target.value)}>
                                    <option value="-5">-5% (loose knit)</option><option value="-10">-10% (standard)</option>
                                    <option value="-15">-15% (fitted)</option><option value="-20">-20% (body-hugging)</option>
                                </select></div>
                                <div className="input-group"><label className="input-label">Your Fabric Stretch %</label><input type="number" className="input-field input-mono" placeholder="e.g., 25" value={stretchPct} onChange={e => setStretch(e.target.value)} min="0" step="5" /></div>
                            </div>
                        </div>
                        {hasResult && (
                            <div>
                                <div className="calculator-divider" />
                                <div className="result-card"><div className="result-prefix">Knit Pattern Measurement</div><div className="result-value">{knitMeasure.toFixed(1)}&quot;</div><div className="result-label">Reduced from {wm}&quot; woven ({ep}% ease)</div></div>
                                <div className={styles.resultDetails} style={{ marginTop: 16 }}>
                                    <div className="result-row"><span className="result-row-label">Woven measurement</span><span className="result-row-value">{wm}&quot;</span></div>
                                    <div className="result-row"><span className="result-row-label">Reduction</span><span className="result-row-value">-{(wm - knitMeasure).toFixed(1)}&quot;</span></div>
                                    <div className="result-row"><span className="result-row-label">Knit measurement</span><span className="result-row-value">{knitMeasure.toFixed(1)}&quot;</span></div>
                                    <div className="result-row"><span className="result-row-label">Stretch needed</span><span className="result-row-value">{stretchNeeded.toFixed(0)}%</span></div>
                                    <div className="result-row"><span className="result-row-label">Your fabric</span><span className="result-row-value" style={{ color: hasEnough ? "#22c55e" : "#ef4444" }}>{sp}% — {hasEnough ? "OK" : "NOT enough"}</span></div>
                                </div>
                                <div className="toolbar" style={{ marginTop: 16 }}>
                                    <button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button>
                                    <button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button>
                                </div>
                            </div>
                        )}
                    </div>
                    <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
                </div>
                <aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside>
            </div>
        </div>
    );
}