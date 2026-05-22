"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Repeat, Copy, Printer, ChevronDown, Circle, Ruler } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const relatedTools = [
    { name: "A-Line", href: "/skirt/a-line", icon: Ruler },
    { name: "Full Circle", href: "/skirt/full-circle", icon: Circle },
    { name: "Yardage by Style", href: "/skirt/yardage-by-style", icon: Ruler },
];
const faqItems = [
    { q: "How much overlap do I need?", a: "Minimum 8-10\" for walking without gaping. 12\"+ for generous coverage. Add a snap at the overlap edge for extra security." },
    { q: "How long should wrap ties be?", a: "Each tie = waist circumference + 12-18\" for a bow. For wrap-around ties: waist x 2 + 18-24\"." },
    { q: "Can I make a wrap skirt reversible?", a: "Yes. Use two fabric layers sewn together. Ties are enclosed. No separate hem needed. Doubles fabric requirement." },
];

export default function WrapSkirtPage() {
    const [hip, setHip] = useState("38"); const [length, setLength] = useState("24"); const [overlap, setOverlap] = useState("10");
    const [tieLen, setTieLen] = useState("wrap"); const [fabWidth, setFabWidth] = useState("60");
    const [activeFaq, setActiveFaq] = useState<number | null>(null); const [copied, setCopied] = useState(false);

    const h = parseFloat(hip) || 38; const l = parseFloat(length) || 24; const ov = parseFloat(overlap) || 10; const fw = parseFloat(fabWidth) || 60;
    const panelWidth = h + ov + 1.25; // SA
    const panelLen = l + 2.625; // hem + waist SA
    const tieLenCalc = tieLen === "wrap" ? h * 2 + 24 : h + 18;
    const tieW = 3; // cut width for 1.25" finished
    const totalTieFabric = (tieLenCalc * tieW * 2) / (fw * 36); // 2 ties
    const needsSeam = panelWidth > fw;
    const panelYardage = needsSeam ? (panelLen * 2) / 36 : panelLen / 36;
    const totalYardage = panelYardage + totalTieFabric;
    const fitRange = `${h - ov / 2}" to ${h + ov / 2}"`;
    const hasResult = h > 0 && l > 0;

    const handleCopy = useCallback(() => { navigator.clipboard.writeText(`Wrap skirt: panel ${panelWidth.toFixed(0)}" x ${panelLen.toFixed(1)}". Ties: ${tieLenCalc}". Total: ~${totalYardage.toFixed(1)} yd. Fits hip ${fitRange}.`); setCopied(true); setTimeout(() => setCopied(false), 2000); }, [panelWidth, panelLen, tieLenCalc, totalYardage, fitRange]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Skirt Calculators", href: "/skirt" }, { label: "Wrap Skirt" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><Repeat size={14} strokeWidth={1.5} /> Skirt</span><h1>Wrap Skirt Calculator</h1><p>Calculate panel width, tie lengths, and yardage for a no-zipper wrap skirt.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Measurements</h2>
                    <div className="calculator-form">
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Hip (in)</label><input type="number" className="input-field input-mono" value={hip} onChange={e => setHip(e.target.value)} min="1" step="0.5" /></div>
                            <div className="input-group"><label className="input-label">Length (in)</label><input type="number" className="input-field input-mono" value={length} onChange={e => setLength(e.target.value)} min="1" step="0.5" /></div>
                            <div className="input-group"><label className="input-label">Overlap (in)</label><select className="input-field" value={overlap} onChange={e => setOverlap(e.target.value)}><option value="6">6&quot; (minimum)</option><option value="8">8&quot; (standard)</option><option value="10">10&quot; (generous)</option><option value="12">12&quot; (full coverage)</option></select></div>
                        </div>
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Tie Style</label><select className="input-field" value={tieLen} onChange={e => setTieLen(e.target.value)}><option value="bow">Side bow</option><option value="wrap">Wrap-around</option></select></div>
                            <div className="input-group"><label className="input-label">Fabric Width (in)</label><select className="input-field" value={fabWidth} onChange={e => setFabWidth(e.target.value)}><option value="44">44&quot;</option><option value="54">54&quot;</option><option value="60">60&quot;</option></select></div>
                        </div>
                    </div>
                    {hasResult && (<div><div className="calculator-divider" />
                        <div className="result-card"><div className="result-prefix">Wrap Skirt Fabric</div><div className="result-value">~{totalYardage.toFixed(1)} yards</div><div className="result-label">Panel: {panelWidth.toFixed(0)}&quot; x {panelLen.toFixed(1)}&quot;</div></div>
                        <div className={styles.resultDetails} style={{ marginTop: 12 }}>
                            <div className="result-row"><span className="result-row-label">Fits on {fw}&quot;?</span><span className="result-row-value">{needsSeam ? "No -- needs joining seam" : "Yes"}</span></div>
                            <div className="result-row"><span className="result-row-label">Each tie length</span><span className="result-row-value">{tieLenCalc}&quot;</span></div>
                            <div className="result-row"><span className="result-row-label">Fits hip range</span><span className="result-row-value">{fitRange}</span></div>
                        </div>
                        <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
                    </div>)}
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}