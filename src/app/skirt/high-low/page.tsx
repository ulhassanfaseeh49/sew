"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { ArrowUpDown, Copy, Printer, ChevronDown, Ruler, Circle } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const relatedTools = [
    { name: "Hem Circumference", href: "/skirt/hem-circumference", icon: Ruler },
    { name: "Full Circle", href: "/skirt/full-circle", icon: Circle },
    { name: "Yardage by Style", href: "/skirt/yardage-by-style", icon: Ruler },
];
const faqItems = [
    { q: "Why does a high-low skirt need as much fabric as the longest point?", a: "Even though the front is short, the BACK panel must be cut to the full back length. You need fabric for the longest measurement." },
    { q: "How do I create the transition curve?", a: "Mark front length on the side seam, mark back length at center back. Connect with a smooth curve using a French curve or flexible ruler." },
    { q: "What transition style looks most elegant?", a: "A gradual sweep gives the most elegant flow. A diagonal transition is simpler to cut. Both work well -- gradual is more formal." },
];

export default function HighLowPage() {
    const [frontLen, setFrontLen] = useState("18"); const [backLen, setBackLen] = useState("42");
    const [skirtStyle, setSkirtStyle] = useState("circle"); const [fabWidth, setFabWidth] = useState("60");
    const [activeFaq, setActiveFaq] = useState<number | null>(null); const [copied, setCopied] = useState(false);

    const fl = parseFloat(frontLen) || 18; const bl = parseFloat(backLen) || 42; const fw = parseFloat(fabWidth) || 60;
    const difference = bl - fl;
    const sideLen = (fl + bl) / 2;
    const hasResult = fl > 0 && bl > fl;

    // Yardage based on back length (longest)
    let yardage = 0;
    if (skirtStyle === "circle") { const r = 28 / (2 * Math.PI); yardage = ((r + bl + 1) * 2) / 36; } // assume 28" waist
    else { yardage = (bl + 2.625) * 2 / 36; }

    const handleCopy = useCallback(() => { navigator.clipboard.writeText(`High-low: front ${fl}", side ${sideLen.toFixed(0)}", back ${bl}". Diff: ${difference}". ~${yardage.toFixed(1)} yd.`); setCopied(true); setTimeout(() => setCopied(false), 2000); }, [fl, sideLen, bl, difference, yardage]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Skirt Calculators", href: "/skirt" }, { label: "High-Low Hem" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><ArrowUpDown size={14} strokeWidth={1.5} /> Skirt</span><h1>High-Low Hem Skirt Calculator</h1><p>Calculate dimensions for asymmetric skirts with shorter front and longer back.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Length Details</h2>
                    <div className="calculator-form">
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Front Length (in)</label><input type="number" className="input-field input-mono" value={frontLen} onChange={e => setFrontLen(e.target.value)} min="1" step="0.5" /></div>
                            <div className="input-group"><label className="input-label">Back Length (in)</label><input type="number" className="input-field input-mono" value={backLen} onChange={e => setBackLen(e.target.value)} min="1" step="0.5" /></div>
                        </div>
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Skirt Body Style</label><select className="input-field" value={skirtStyle} onChange={e => setSkirtStyle(e.target.value)}><option value="circle">Circle skirt base</option><option value="aline">A-line base</option></select></div>
                            <div className="input-group"><label className="input-label">Fabric Width (in)</label><select className="input-field" value={fabWidth} onChange={e => setFabWidth(e.target.value)}><option value="44">44&quot;</option><option value="60">60&quot;</option></select></div>
                        </div>
                    </div>
                    {hasResult && (<div><div className="calculator-divider" />
                        <div className="result-card"><div className="result-prefix">High-Low Dimensions</div><div className="result-value">{fl}&quot; front / {bl}&quot; back</div><div className="result-label">{difference}&quot; difference (side transition: ~{sideLen.toFixed(0)}&quot;)</div></div>
                        <div className={styles.resultDetails} style={{ marginTop: 12 }}>
                            <div className="result-row"><span className="result-row-label">Cut fabric for longest point</span><span className="result-row-value">{bl}&quot;</span></div>
                            <div className="result-row"><span className="result-row-label">Side seam length</span><span className="result-row-value">{sideLen.toFixed(0)}&quot;</span></div>
                            <div className="result-row"><span className="result-row-label">Yardage estimate</span><span className="result-row-value">~{yardage.toFixed(1)} yards</span></div>
                        </div>
                        <p style={{ margin: "12px 0 0", padding: 12, fontSize: "var(--text-sm)", color: "var(--color-warning)", background: "var(--color-surface-hover)", borderRadius: 8, lineHeight: 1.6 }}>Cut to back length first. Trim front to desired length after construction and fitting.</p>
                        <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
                    </div>)}
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}