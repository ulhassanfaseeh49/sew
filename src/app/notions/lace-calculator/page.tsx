"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Spline, Copy, Printer, ChevronDown, Scissors, Ruler } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const relatedTools = [
    { name: "Ribbon Calculator", href: "/notions/ribbon-calculator", icon: Ruler },
    { name: "Trim Calculator", href: "/notions/trim-calculator", icon: Scissors },
    { name: "Thread Yardage", href: "/notions/thread-yardage", icon: Scissors },
];
const faqItems = [
    { q: "How much extra lace for gathering?", a: "Multiply the finished edge length by your fullness ratio: 2x for light gather, 2.5x for medium, 3x for very full ruffled lace." },
    { q: "What is the difference between lace edging and insertion?", a: "Edging has one finished decorative edge and one raw edge. Insertion has two finished edges and is sewn between fabric pieces." },
    { q: "How do I handle lace at corners?", a: "For flat lace: add 2-3\" per corner for mitering. For gathered lace: corners gather naturally. For insertion: end and restart at corners." },
];

export default function LaceCalcPage() {
    const [appType, setAppType] = useState("straight"); const [edgeLen, setEdgeLen] = useState("60");
    const [fullness, setFullness] = useState("1"); const [corners, setCorners] = useState("0");
    const [activeFaq, setActiveFaq] = useState<number | null>(null); const [copied, setCopied] = useState(false);

    const el = parseFloat(edgeLen) || 0; const f = parseFloat(fullness) || 1; const c = parseInt(corners) || 0;
    const baseLen = el * f;
    const cornerExtra = c * 3; // 3" per corner
    const seamAllowance = 6; // 6" for joining
    const total = baseLen + cornerExtra + seamAllowance;
    const totalYards = total / 36;
    const hasResult = el > 0;

    const handleCopy = useCallback(() => { navigator.clipboard.writeText(`Lace: ~${totalYards.toFixed(1)} yards (${el}" edge x ${f} fullness + corners/seams).`); setCopied(true); setTimeout(() => setCopied(false), 2000); }, [totalYards, el, f]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Notions", href: "/notions" }, { label: "Lace Calculator" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><Spline size={14} strokeWidth={1.5} /> Notions</span><h1>Lace Yardage Calculator</h1><p>Calculate lace yardage for straight, gathered, or insertion applications.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Lace Details</h2>
                    <div className="calculator-form">
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Application</label><select className="input-field" value={appType} onChange={e => { setAppType(e.target.value); setFullness(e.target.value === "gathered" ? "2" : "1"); }}><option value="straight">Straight edge</option><option value="gathered">Gathered/ruffled</option><option value="insertion">Insertion</option></select></div>
                            <div className="input-group"><label className="input-label">Edge Length (in)</label><input type="number" className="input-field input-mono" value={edgeLen} onChange={e => setEdgeLen(e.target.value)} min="1" /></div>
                        </div>
                        <div className="calculator-form-row">
                            {appType === "gathered" && <div className="input-group"><label className="input-label">Fullness Ratio</label><select className="input-field" value={fullness} onChange={e => setFullness(e.target.value)}><option value="1.5">1.5x (light)</option><option value="2">2x (standard)</option><option value="2.5">2.5x (medium-full)</option><option value="3">3x (very full)</option></select></div>}
                            <div className="input-group"><label className="input-label">Number of Corners</label><select className="input-field" value={corners} onChange={e => setCorners(e.target.value)}><option value="0">None</option><option value="2">2 corners</option><option value="4">4 corners</option></select></div>
                        </div>
                    </div>
                    {hasResult && (<div><div className="calculator-divider" />
                        <div className="result-card"><div className="result-prefix">Total Lace</div><div className="result-value">~{totalYards.toFixed(1)} yards</div><div className="result-label">{total.toFixed(0)}&quot; total</div></div>
                        <div className={styles.resultDetails} style={{ marginTop: 12 }}>
                            <div className="result-row"><span className="result-row-label">Base length</span><span className="result-row-value">{baseLen.toFixed(0)}&quot;</span></div>
                            {c > 0 && <div className="result-row"><span className="result-row-label">Corner allowance</span><span className="result-row-value">{cornerExtra}&quot;</span></div>}
                            <div className="result-row"><span className="result-row-label">Join allowance</span><span className="result-row-value">{seamAllowance}&quot;</span></div>
                        </div>
                        <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
                    </div>)}
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}