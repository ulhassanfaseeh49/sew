"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Activity, Copy, Printer, ChevronDown, BarChart3, Ruler } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

function classify(pct: number): { label: string; color: string; verdict: string } {
    if (pct >= 98) return { label: "Excellent", color: "#22c55e", verdict: "Perfect for fitted garments and activewear." };
    if (pct >= 95) return { label: "Good", color: "#84cc16", verdict: "Suitable for most knit projects." };
    if (pct >= 90) return { label: "Fair", color: "#f59e0b", verdict: "OK for casual wear, will bag out slightly." };
    if (pct >= 85) return { label: "Poor", color: "#ef4444", verdict: "Will lose shape. Not suitable for fitted garments." };
    return { label: "Failed", color: "#991b1b", verdict: "Fabric is worn out or unsuitable for stretch projects." };
}

const relatedTools = [
    { name: "Stretch % Calculator", href: "/stretch/percentage-calculator", icon: BarChart3 },
    { name: "Negative Ease Calculator", href: "/stretch/negative-ease", icon: Ruler },
    { name: "Knit Type Comparator", href: "/stretch/knit-type-comparator", icon: Activity },
];

const faqItems = [
    { q: "What is recovery ratio?", a: "Recovery measures how well fabric returns to its original size after being stretched. A 100% recovery means the fabric returns completely — no stretching out. Below 90% means the garment will bag out over time." },
    { q: "How do I test recovery?", a: "Stretch a 4\" swatch to comfortable maximum and hold for 30 seconds. Release, wait 60 seconds, then measure. Divide recovered length by original and multiply by 100." },
    { q: "Why does recovery matter more than stretch?", a: "Stretch tells you how far fabric goes. Recovery tells you if it comes back. Great stretch with poor recovery = a garment that looks great on first wear but bags out immediately." },
];

export default function RecoveryRatioPage() {
    const [relaxed, setRelaxed] = useState("4");
    const [stretched, setStretched] = useState("");
    const [recovered, setRecovered] = useState("");
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const [copied, setCopied] = useState(false);

    const r = parseFloat(relaxed) || 4;
    const s = parseFloat(stretched) || 0;
    const rec = parseFloat(recovered) || 0;
    const stretchPct = s > 0 ? ((s - r) / r * 100) : 0;
    const recoveryPct = rec > 0 ? (r / rec * 100) : 0;
    const permanentGrowth = rec > 0 ? rec - r : 0;
    const cls = classify(recoveryPct);
    const hasResult = s > 0 && rec > 0;

    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(`Recovery: ${recoveryPct.toFixed(1)}% (${cls.label}) | Stretch: ${stretchPct.toFixed(0)}%`);
        setCopied(true); setTimeout(() => setCopied(false), 2000);
    }, [recoveryPct, cls, stretchPct]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Stretch Tools", href: "/stretch" }, { label: "Recovery Ratio" }]} />
            <div className="calculator-layout">
                <div className="calculator-main">
                    <div className={styles.toolHeader}>
                        <span className="category-badge"><Activity size={14} strokeWidth={1.5} /> Stretch Tool</span>
                        <h1>Stretch Recovery Ratio Calculator</h1>
                        <p>Test how well your fabric snaps back after stretching. Critical for fitted garments.</p>
                    </div>
                    <div className="calculator-card">
                        <h2 className={styles.calcTitle}>Recovery Test</h2>
                        <div className="calculator-form">
                            <div className="input-group"><label className="input-label">Original (Relaxed) Length</label><input type="number" className="input-field input-mono" value={relaxed} onChange={e => setRelaxed(e.target.value)} min="1" step="0.5" /><span className="input-helper">Standard test: 4 inches</span></div>
                            <div className="calculator-form-row">
                                <div className="input-group"><label className="input-label">Max Stretched Length</label><input type="number" className="input-field input-mono" placeholder="e.g., 6" value={stretched} onChange={e => setStretched(e.target.value)} min="0" step="0.25" /></div>
                                <div className="input-group"><label className="input-label">Recovered Length (after 60 sec)</label><input type="number" className="input-field input-mono" placeholder="e.g., 4.1" value={recovered} onChange={e => setRecovered(e.target.value)} min="0" step="0.1" /></div>
                            </div>
                        </div>
                        {hasResult && (
                            <div>
                                <div className="calculator-divider" />
                                <div className="result-card" style={{ borderColor: cls.color, borderWidth: 2 }}>
                                    <div className="result-prefix" style={{ color: cls.color }}>{cls.label}</div>
                                    <div className="result-value">{recoveryPct.toFixed(1)}% recovery</div>
                                    <div className="result-label">{stretchPct.toFixed(0)}% stretch | {permanentGrowth.toFixed(2)}&quot; permanent growth</div>
                                </div>
                                <div className={styles.resultDetails} style={{ marginTop: 16 }}>
                                    <div className="result-row"><span className="result-row-label">Original</span><span className="result-row-value">{r}&quot;</span></div>
                                    <div className="result-row"><span className="result-row-label">Stretched</span><span className="result-row-value">{s}&quot;</span></div>
                                    <div className="result-row"><span className="result-row-label">Recovered</span><span className="result-row-value">{rec}&quot;</span></div>
                                    <div className="result-row"><span className="result-row-label">Permanent growth</span><span className="result-row-value">{permanentGrowth.toFixed(2)}&quot;</span></div>
                                </div>
                                <p style={{ marginTop: 12, fontSize: "var(--text-sm)", color: "var(--color-text-tertiary)" }}><strong>Verdict:</strong> {cls.verdict}</p>
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