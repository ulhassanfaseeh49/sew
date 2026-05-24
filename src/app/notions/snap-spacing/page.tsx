"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { CircleDot, Copy, Printer, ChevronDown, Pin, Ruler } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const relatedTools = [
    { name: "Hook & Eye", href: "/notions/hook-eye-spacing", icon: Pin },
    { name: "Button Spacing", href: "/notions/button-spacing", icon: Ruler },
    { name: "Elastic Calculator", href: "/elastic/waist-calculator", icon: Ruler },
];
const faqItems = [
    { q: "How far apart should snaps be on baby clothing?", a: "Baby clothing crotch snaps are typically 1/2 to 3/4 inch apart for quick diaper changes. Shoulder snaps use 1-2 snaps spaced about 1 inch." },
    { q: "What is a KAM snap?", a: "KAM snaps are plastic snaps that come in 4 pieces (cap, socket, stud, post). They are applied with snap pliers and are popular for baby clothing, bibs, and cloth diapers." },
    { q: "How many snap sets should I buy?", a: "Buy 10% extra. KAM snaps occasionally fail during application. Having spares prevents project delays." },
];

export default function SnapSpacingPage() {
    const [closureLen, setClosureLen] = useState("10"); const [spacing, setSpacing] = useState("1");
    const [topOff, setTopOff] = useState("0.5"); const [bottomOff, setBottomOff] = useState("0.5");
    const [snapType, setSnapType] = useState("kam");
    const [activeFaq, setActiveFaq] = useState<number | null>(null); const [copied, setCopied] = useState(false);

    const cl = parseFloat(closureLen) || 0; const sp = parseFloat(spacing) || 1;
    const to = parseFloat(topOff) || 0; const bo = parseFloat(bottomOff) || 0;
    const usable = cl - to - bo;
    const numSnaps = usable > 0 && sp > 0 ? Math.floor(usable / sp) + 1 : 0;
    const actualSpacing = numSnaps > 1 ? usable / (numSnaps - 1) : sp;
    const hasResult = cl > 0 && numSnaps > 0;
    const toBuy = Math.ceil(numSnaps * 1.1);
    const kamPieces = snapType === "kam" ? toBuy * 4 : 0;

    const handleCopy = useCallback(() => { navigator.clipboard.writeText(`${numSnaps} snaps, ${actualSpacing.toFixed(2)}" apart. Buy ${toBuy} sets.${kamPieces > 0 ? ` (${kamPieces} KAM pieces total)` : ""}`); setCopied(true); setTimeout(() => setCopied(false), 2000); }, [numSnaps, actualSpacing, toBuy, kamPieces]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Notions", href: "/notions" }, { label: "Snap Spacing" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><CircleDot size={14} strokeWidth={1.5} /> Notions</span><h1>Snap Spacing Calculator</h1><p>Calculate even snap placement with quantity and KAM snap piece counts.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Closure Details</h2>
                    <div className="calculator-form">
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Closure Length (in)</label><input type="number" className="input-field input-mono" value={closureLen} onChange={e => setClosureLen(e.target.value)} min="1" step="0.25" /></div>
                            <div className="input-group"><label className="input-label">Target Spacing (in)</label><select className="input-field" value={spacing} onChange={e => setSpacing(e.target.value)}><option value="0.5">1/2&quot; (baby)</option><option value="0.75">3/4&quot; (tight)</option><option value="1">1&quot; (standard)</option><option value="1.5">1.5&quot;</option><option value="2">2&quot; (decorative)</option></select></div>
                            <div className="input-group"><label className="input-label">Snap Type</label><select className="input-field" value={snapType} onChange={e => setSnapType(e.target.value)}><option value="kam">KAM plastic (T5)</option><option value="metal">Sew-on metal</option><option value="heavy">Heavy-duty</option><option value="magnetic">Magnetic</option></select></div>
                        </div>
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Top Offset (in)</label><input type="number" className="input-field input-mono" value={topOff} onChange={e => setTopOff(e.target.value)} min="0" step="0.25" /></div>
                            <div className="input-group"><label className="input-label">Bottom Offset (in)</label><input type="number" className="input-field input-mono" value={bottomOff} onChange={e => setBottomOff(e.target.value)} min="0" step="0.25" /></div>
                        </div>
                    </div>
                    {hasResult && (<div><div className="calculator-divider" />
                        <div className="result-card"><div className="result-prefix">Snap Sets Needed</div><div className="result-value">{numSnaps} snaps</div><div className="result-label">{actualSpacing.toFixed(2)}&quot; apart (buy {toBuy} sets with extra)</div></div>
                        <div className={styles.resultDetails} style={{ marginTop: 12 }}>
                            <div className="result-row"><span className="result-row-label">Actual spacing</span><span className="result-row-value">{actualSpacing.toFixed(2)}&quot;</span></div>
                            <div className="result-row"><span className="result-row-label">Sets to purchase</span><span className="result-row-value">{toBuy}</span></div>
                            {kamPieces > 0 && <div className="result-row"><span className="result-row-label">KAM pieces (4/snap)</span><span className="result-row-value">{kamPieces} pieces</span></div>}
                        </div>
                        <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
                    </div>)}
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}