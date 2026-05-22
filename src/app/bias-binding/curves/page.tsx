"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Circle, Copy, Printer, ChevronDown, Scissors, Ruler } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const curveTypes: Record<string, { label: string; extra: number }> = {
    gentleConvex: { label: "Gentle convex curve", extra: 3 },
    medConvex: { label: "Medium convex curve", extra: 5 },
    tightConvex: { label: "Tight convex curve", extra: 8 },
    gentleConcave: { label: "Gentle concave curve", extra: 2 },
    medConcave: { label: "Medium concave (armhole)", extra: 4 },
    tightConcave: { label: "Tight concave curve", extra: 7 },
    scalloped: { label: "Scalloped edge", extra: 15 },
    circle: { label: "Full circle", extra: 5 },
};

const relatedTools = [
    { name: "Tape Yardage", href: "/bias-binding/tape-yardage", icon: Ruler },
    { name: "Tape Width Calc", href: "/bias-binding/tape-width", icon: Scissors },
    { name: "Continuous Bias", href: "/bias-binding/continuous-bias", icon: Scissors },
];
const faqItems = [
    { q: "Why do curves need more bias tape?", a: "On convex curves, tape must ease around the outside. On concave curves, tape must stretch into the inside. Both consume slightly more tape than the straight edge measurement." },
    { q: "How do I apply bias tape to scalloped edges?", a: "Clip the concave parts almost to the stitching line. The tape must stretch into the inside curves and ease around the convex bumps. Practice on scrap first." },
    { q: "Should I use narrower tape for tight curves?", a: "Yes. Wide tape won't lie flat on tight curves. For curves with a radius under 2 inches, use 1/4\" or 3/8\" finished tape." },
];

export default function CurvesPage() {
    const [edgeLen, setEdgeLen] = useState(""); const [curveType, setCurveType] = useState("medConvex");
    const [activeFaq, setActiveFaq] = useState<number | null>(null); const [copied, setCopied] = useState(false);

    const el = parseFloat(edgeLen) || 0; const ct = curveTypes[curveType];
    const adjusted = el * (1 + ct.extra / 100); const extra = adjusted - el;
    const withOverlap = adjusted + 3; const yards = withOverlap / 36;
    const hasResult = el > 0;

    const handleCopy = useCallback(() => { navigator.clipboard.writeText(`${ct.label}: ${el}" edge + ${ct.extra}% = ${adjusted.toFixed(1)}" tape (+3" overlap = ${withOverlap.toFixed(1)}")`); setCopied(true); setTimeout(() => setCopied(false), 2000); }, [ct, el, adjusted, withOverlap]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Bias Binding", href: "/bias-binding" }, { label: "Curves" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><Circle size={14} strokeWidth={1.5} /> Bias Binding</span><h1>Bias Tape for Curves Calculator</h1><p>Calculate extra bias tape needed for curved and scalloped edges.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Curved Edge Details</h2>
                    <div className="calculator-form">
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Edge Length (inches)</label><input type="number" className="input-field input-mono" placeholder="e.g., 60" value={edgeLen} onChange={e => setEdgeLen(e.target.value)} min="0" step="0.5" /></div>
                            <div className="input-group"><label className="input-label">Curve Type</label><select className="input-field" value={curveType} onChange={e => setCurveType(e.target.value)}>{Object.entries(curveTypes).map(([k, v]) => <option key={k} value={k}>{v.label} (+{v.extra}%)</option>)}</select></div>
                        </div>
                    </div>
                    {hasResult && (<div><div className="calculator-divider" />
                        <div className="result-card"><div className="result-prefix">Tape Needed</div><div className="result-value">{withOverlap.toFixed(1)}&quot; ({yards.toFixed(2)} yd)</div><div className="result-label">{el}&quot; edge + {extra.toFixed(1)}&quot; curve extra + 3&quot; overlap</div></div>
                        <div className={styles.resultDetails} style={{ marginTop: 12 }}>
                            <div className="result-row"><span className="result-row-label">Straight edge length</span><span className="result-row-value">{el}&quot;</span></div>
                            <div className="result-row"><span className="result-row-label">Curve adjustment (+{ct.extra}%)</span><span className="result-row-value">+{extra.toFixed(1)}&quot;</span></div>
                            <div className="result-row"><span className="result-row-label">Joining overlap</span><span className="result-row-value">+3&quot;</span></div>
                        </div>
                        <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
                    </div>)}
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}