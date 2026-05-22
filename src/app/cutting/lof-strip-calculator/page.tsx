"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Scissors, Copy, Printer, ChevronDown, Ruler } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const relatedTools = [
    { name: "WOF Strip Calc", href: "/cutting/wof-strip-calculator", icon: Scissors },
    { name: "Strip Cutting", href: "/cutting/strip-calculator", icon: Scissors },
    { name: "Waste Minimizer", href: "/cutting/waste-minimizer", icon: Ruler },
];
const faqItems = [
    { q: "When should I use LOF instead of WOF strips?", a: "LOF strips are ideal for long borders, sashing, and binding where you want no joins. They run the full fabric length, so a 3-yard purchase gives 108-inch strips." },
    { q: "How does LOF affect my fabric usage?", a: "LOF strips consume fabric width rather than length. After cutting LOF strips, the remaining fabric is narrower but the full yardage long." },
    { q: "Can I mix LOF and WOF strips from the same fabric?", a: "Yes. Cut LOF strips for borders first (from the side), then use the remaining piece for WOF strips." },
];

export default function LofStripCalcPage() {
    const [stripWidth, setStripWidth] = useState("3"); const [yardage, setYardage] = useState("3"); const [fabWidth, setFabWidth] = useState("44"); const [selvage, setSelvage] = useState("0.5");
    const [activeFaq, setActiveFaq] = useState<number | null>(null); const [copied, setCopied] = useState(false);

    const sw = parseFloat(stripWidth) || 0; const yd = parseFloat(yardage) || 3; const fw = parseFloat(fabWidth) || 44; const sv = parseFloat(selvage) || 0.5;
    const uw = fw - sv * 2; const fl = yd * 36;
    const numStrips = sw > 0 ? Math.floor(uw / sw) : 0;
    const widthUsed = numStrips * sw;
    const widthRemaining = uw - widthUsed;
    const hasResult = sw > 0 && numStrips > 0;

    const handleCopy = useCallback(() => { navigator.clipboard.writeText(`${numStrips} LOF strips of ${sw}" x ${fl}" (${yd} yd). Remaining width: ${widthRemaining.toFixed(1)}"`); setCopied(true); setTimeout(() => setCopied(false), 2000); }, [numStrips, sw, fl, yd, widthRemaining]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Cutting Tools", href: "/cutting" }, { label: "LOF Strip Calculator" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><Scissors size={14} strokeWidth={1.5} /> Cutting</span><h1>LOF Strip Calculator</h1><p>Calculate length-of-fabric strips -- longer strips with no joins, ideal for borders and sashing.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Fabric and Strip Details</h2>
                    <div className="calculator-form">
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Yardage</label><input type="number" className="input-field input-mono" value={yardage} onChange={e => setYardage(e.target.value)} min="0.25" step="0.25" /></div>
                            <div className="input-group"><label className="input-label">Fabric Width (in)</label><input type="number" className="input-field input-mono" value={fabWidth} onChange={e => setFabWidth(e.target.value)} min="1" /></div>
                            <div className="input-group"><label className="input-label">Selvage/Side (in)</label><input type="number" className="input-field input-mono" value={selvage} onChange={e => setSelvage(e.target.value)} min="0" step="0.25" /></div>
                        </div>
                        <div className="input-group"><label className="input-label">Strip Width (in)</label><input type="number" className="input-field input-mono" value={stripWidth} onChange={e => setStripWidth(e.target.value)} min="0.5" step="0.25" /></div>
                    </div>
                    {hasResult && (<div><div className="calculator-divider" />
                        <div className="result-card"><div className="result-prefix">LOF Strips</div><div className="result-value">{numStrips} strips</div><div className="result-label">Each {sw}&quot; wide x {fl}&quot; long (no joins)</div></div>
                        <div className={styles.resultDetails} style={{ marginTop: 12 }}>
                            <div className="result-row"><span className="result-row-label">Strip length</span><span className="result-row-value">{fl}&quot; ({yd} yd)</span></div>
                            <div className="result-row"><span className="result-row-label">Width used</span><span className="result-row-value">{widthUsed.toFixed(1)}&quot;</span></div>
                            <div className="result-row"><span className="result-row-label">Width remaining</span><span className="result-row-value">{widthRemaining.toFixed(1)}&quot;</span></div>
                        </div>
                        <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
                    </div>)}
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}