"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Percent, Copy, Printer, ChevronDown, Droplets, BookOpen } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

function classify(pct: number): { label: string; color: string; bg: string } {
    if (pct < 1) return { label: "Minimal — pre-washing optional", color: "#166534", bg: "#dcfce7" };
    if (pct < 3) return { label: "Low — pre-wash for fitted garments", color: "#1b5e20", bg: "#e8f5e9" };
    if (pct < 5) return { label: "Moderate — pre-washing essential", color: "#854d0e", bg: "#fef9c3" };
    if (pct < 8) return { label: "High — pre-wash absolutely essential", color: "#9a3412", bg: "#fed7aa" };
    if (pct < 12) return { label: "Very High — pre-wash multiple times", color: "#991b1b", bg: "#fecaca" };
    return { label: "Extreme — consult care instructions", color: "#7f1d1d", bg: "#fecaca" };
}

const relatedTools = [
    { name: "Pre-Wash Estimator", href: "/shrinkage/pre-wash-estimator", icon: Droplets },
    { name: "Post-Wash Yardage", href: "/shrinkage/post-wash-yardage", icon: Droplets },
    { name: "Shrinkage Database", href: "/shrinkage/fabric-database", icon: BookOpen },
];
const faqItems = [
    { q: "How do I calculate fabric shrinkage percentage?", a: "Shrinkage % = ((Before - After) / Before) x 100. For example: 10 inch swatch becomes 9.6 inch = (10-9.6)/10 x 100 = 4% shrinkage." },
    { q: "What size swatch should I use for a shrinkage test?", a: "Minimum 6x6 inches with a marked 5x5 square. Larger swatches (10x10) give more accurate results. Always serge/zigzag edges first." },
    { q: "Do I need to wash my test swatch the same way as the finished item?", a: "Yes! Same water temperature, same wash cycle, same drying method. This ensures your test accurately predicts real-world shrinkage." },
];

export default function PercentageCalcPage() {
    const [prLen, setPrLen] = useState(""); const [prWid, setPrWid] = useState("");
    const [poLen, setPoLen] = useState(""); const [poWid, setPoWid] = useState("");
    const [activeFaq, setActiveFaq] = useState<number | null>(null); const [copied, setCopied] = useState(false);

    const pl = parseFloat(prLen) || 0; const pw = parseFloat(prWid) || 0;
    const al = parseFloat(poLen) || 0; const aw = parseFloat(poWid) || 0;
    const lenPct = pl > 0 && al > 0 ? ((pl - al) / pl) * 100 : 0;
    const widPct = pw > 0 && aw > 0 ? ((pw - aw) / pw) * 100 : 0;
    const areaBefore = pl * pw; const areaAfter = al * aw;
    const areaPct = areaBefore > 0 ? ((areaBefore - areaAfter) / areaBefore) * 100 : 0;
    const avgPct = (lenPct + widPct) / 2;
    const hasResult = pl > 0 && al > 0;
    const cls = classify(avgPct);

    const handleCopy = useCallback(() => { navigator.clipboard.writeText(`Shrinkage: ${lenPct.toFixed(1)}% lengthwise, ${widPct.toFixed(1)}% crosswise, ${areaPct.toFixed(1)}% area. ${cls.label}`); setCopied(true); setTimeout(() => setCopied(false), 2000); }, [lenPct, widPct, areaPct, cls]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Shrinkage", href: "/shrinkage" }, { label: "Percentage Calculator" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><Percent size={14} strokeWidth={1.5} /> Shrinkage</span><h1>Shrinkage Percentage Calculator</h1><p>Calculate actual shrinkage percentage from before and after measurements.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Before and After Measurements</h2>
                    <div className="calculator-form">
                        <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", marginBottom: 12 }}>Enter your swatch or fabric measurements before and after washing.</p>
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Pre-Wash Length (inches)</label><input type="number" className="input-field input-mono" placeholder="e.g., 10" value={prLen} onChange={e => setPrLen(e.target.value)} min="0" step="0.1" /></div>
                            <div className="input-group"><label className="input-label">Pre-Wash Width (inches)</label><input type="number" className="input-field input-mono" placeholder="e.g., 10" value={prWid} onChange={e => setPrWid(e.target.value)} min="0" step="0.1" /></div>
                        </div>
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Post-Wash Length (inches)</label><input type="number" className="input-field input-mono" placeholder="e.g., 9.6" value={poLen} onChange={e => setPoLen(e.target.value)} min="0" step="0.1" /></div>
                            <div className="input-group"><label className="input-label">Post-Wash Width (inches)</label><input type="number" className="input-field input-mono" placeholder="e.g., 9.7" value={poWid} onChange={e => setPoWid(e.target.value)} min="0" step="0.1" /></div>
                        </div>
                    </div>
                    {hasResult && (<div><div className="calculator-divider" />
                        <div className="result-card" style={{ background: cls.bg }}><div className="result-prefix" style={{ color: cls.color }}>Average Shrinkage</div><div className="result-value" style={{ color: cls.color }}>{avgPct.toFixed(1)}%</div><div className="result-label" style={{ color: cls.color }}>{cls.label}</div></div>
                        <div className={styles.resultDetails} style={{ marginTop: 12 }}>
                            <div className="result-row"><span className="result-row-label">Lengthwise shrinkage</span><span className="result-row-value">{lenPct.toFixed(1)}%</span></div>
                            <div className="result-row"><span className="result-row-label">Crosswise shrinkage</span><span className="result-row-value">{widPct.toFixed(1)}%</span></div>
                            <div className="result-row"><span className="result-row-label">Area shrinkage</span><span className="result-row-value">{areaPct.toFixed(1)}%</span></div>
                        </div>
                        <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
                    </div>)}
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}