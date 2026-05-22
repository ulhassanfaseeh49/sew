"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Activity, Copy, Printer, ChevronDown, Ruler, BookOpen } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

function classify(pct: number): { label: string; color: string; bg: string } {
    if (pct >= 95) return { label: "Excellent -- elastic is in great condition", color: "#166534", bg: "#dcfce7" };
    if (pct >= 90) return { label: "Good -- suitable for most garments", color: "#1b5e20", bg: "#e8f5e9" };
    if (pct >= 85) return { label: "Fair -- acceptable for casual wear only", color: "#854d0e", bg: "#fef9c3" };
    if (pct >= 80) return { label: "Poor -- replace before using in new project", color: "#9a3412", bg: "#fed7aa" };
    return { label: "Failed -- not suitable for any use", color: "#991b1b", bg: "#fecaca" };
}

const lifespanRef = [
    { type: "Woven", lifespan: "3-5 years", note: "Most durable" },
    { type: "Knitted", lifespan: "2-4 years", note: "Good all-rounder" },
    { type: "Braided", lifespan: "2-3 years", note: "Deteriorates faster" },
    { type: "Clear/Poly", lifespan: "1-3 years", note: "Heat sensitive" },
    { type: "Swimwear", lifespan: "1-2 seasons", note: "Chlorine degradation" },
];

const relatedTools = [
    { name: "Waist Elastic Calc", href: "/elastic/waist-calculator", icon: Ruler },
    { name: "Elastic Types Guide", href: "/elastic/types-guide", icon: BookOpen },
    { name: "Quartering Tool", href: "/elastic/quartering-tool", icon: Ruler },
];
const faqItems = [
    { q: "How do I test elastic quality?", a: "Cut a 10\" piece. Stretch firmly (don't overextend) and measure. Hold 30 seconds, release, wait 60 seconds. Measure recovered length. 95%+ recovery = excellent." },
    { q: "Why does elastic stop working?", a: "Heat (dryers), UV light, chlorine, body oils, and age degrade rubber/spandex fibers. Tumble drying is the biggest offender." },
    { q: "When should I replace elastic in a garment?", a: "When the waistband no longer holds up properly, when elastic stays stretched after washing, or when recovery drops below 85% in testing." },
];

export default function RecoveryCalcPage() {
    const [relaxLen, setRelaxLen] = useState(""); const [stretchLen, setStretchLen] = useState("");
    const [recoveredLen, setRecoveredLen] = useState("");
    const [activeFaq, setActiveFaq] = useState<number | null>(null); const [copied, setCopied] = useState(false);

    const rl = parseFloat(relaxLen) || 0; const sl = parseFloat(stretchLen) || 0; const rcl = parseFloat(recoveredLen) || 0;
    const stretchPct = rl > 0 && sl > 0 ? ((sl - rl) / rl) * 100 : 0;
    const recoveryPct = rl > 0 && rcl > 0 ? (rcl / rl) * 100 : 0;
    const recoveryQuality = rl > 0 && rcl > 0 ? ((rl - Math.abs(rcl - rl)) / rl) * 100 : 0;
    const cls = classify(recoveryQuality);
    const hasResult = rl > 0 && sl > 0 && rcl > 0;

    const handleCopy = useCallback(() => { navigator.clipboard.writeText(`Elastic test: ${stretchPct.toFixed(1)}% stretch, ${recoveryQuality.toFixed(1)}% recovery. ${cls.label}`); setCopied(true); setTimeout(() => setCopied(false), 2000); }, [stretchPct, recoveryQuality, cls]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Elastic", href: "/elastic" }, { label: "Recovery Calculator" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><Activity size={14} strokeWidth={1.5} /> Elastic</span><h1>Elastic Recovery Calculator</h1><p>Test elastic stretch and recovery to evaluate quality and determine replacement needs.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Elastic Test Measurements</h2>
                    <div className="calculator-form">
                        <div className="input-group"><label className="input-label">Relaxed Length (inches)</label><input type="number" className="input-field input-mono" placeholder="e.g., 10" value={relaxLen} onChange={e => setRelaxLen(e.target.value)} min="0" step="0.1" /><span className="input-helper">Cut a 10&quot; piece for accurate testing</span></div>
                        <div className="input-group"><label className="input-label">Maximum Stretch Length (inches)</label><input type="number" className="input-field input-mono" placeholder="e.g., 16" value={stretchLen} onChange={e => setStretchLen(e.target.value)} min="0" step="0.1" /><span className="input-helper">Stretch firmly but don&apos;t overextend</span></div>
                        <div className="input-group"><label className="input-label">Recovered Length (after 60 sec rest)</label><input type="number" className="input-field input-mono" placeholder="e.g., 10.2" value={recoveredLen} onChange={e => setRecoveredLen(e.target.value)} min="0" step="0.1" /><span className="input-helper">Hold stretch 30 sec, release, wait 60 sec, measure</span></div>
                    </div>
                    {hasResult && (<div><div className="calculator-divider" />
                        <div className="result-card" style={{ background: cls.bg }}><div className="result-prefix" style={{ color: cls.color }}>Recovery Quality</div><div className="result-value" style={{ color: cls.color }}>{recoveryQuality.toFixed(1)}%</div><div className="result-label" style={{ color: cls.color }}>{cls.label}</div></div>
                        <div className={styles.resultDetails} style={{ marginTop: 12 }}>
                            <div className="result-row"><span className="result-row-label">Stretch percentage</span><span className="result-row-value">{stretchPct.toFixed(1)}%</span></div>
                            <div className="result-row"><span className="result-row-label">Recovery percentage</span><span className="result-row-value">{recoveryQuality.toFixed(1)}%</span></div>
                            <div className="result-row"><span className="result-row-label">Permanent stretch</span><span className="result-row-value">{Math.abs(rcl - rl).toFixed(2)}&quot;</span></div>
                        </div>
                        <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
                    </div>)}
                </div>
                <div className="calculator-card"><h2 className={styles.sectionTitle}>Expected Lifespan by Elastic Type</h2>
                    <div className={styles.tableWrap}><table className={styles.convTable}><thead><tr><th>Type</th><th>Lifespan</th><th>Notes</th></tr></thead>
                        <tbody>{lifespanRef.map(r => (<tr key={r.type}><td style={{ fontWeight: 600 }}>{r.type}</td><td>{r.lifespan}</td><td>{r.note}</td></tr>))}</tbody>
                    </table></div>
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}