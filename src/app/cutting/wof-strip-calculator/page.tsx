"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Scissors, Copy, Printer, ChevronDown, Ruler } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const relatedTools = [
    { name: "LOF Strip Calc", href: "/cutting/lof-strip-calculator", icon: Scissors },
    { name: "Strip Cutting", href: "/cutting/strip-calculator", icon: Scissors },
    { name: "Sub-Cut Calc", href: "/cutting/sub-cut-calculator", icon: Ruler },
];
const faqItems = [
    { q: "What is a WOF strip?", a: "A Width-of-Fabric strip is cut across the fabric from selvage to selvage. Standard quilting practice -- each strip is approximately 42-44 inches long." },
    { q: "How does my fabric compare to a jelly roll?", a: "A jelly roll contains 40 strips of 2.5\" x WOF. One yard of 44\" fabric yields about 14 WOF strips of 2.5\", so you need about 3 yards to match a jelly roll." },
    { q: "Should I fold my fabric when cutting WOF strips?", a: "Most quilters fold selvage-to-selvage. This gives two shorter strips per cut (about 21\" each) instead of one full WOF strip." },
];

export default function WofStripCalcPage() {
    const [stripWidth, setStripWidth] = useState("2.5"); const [yardage, setYardage] = useState("1"); const [fabWidth, setFabWidth] = useState("44"); const [selvage, setSelvage] = useState("0.5");
    const [activeFaq, setActiveFaq] = useState<number | null>(null); const [copied, setCopied] = useState(false);

    const sw = parseFloat(stripWidth) || 0; const yd = parseFloat(yardage) || 1; const fw = parseFloat(fabWidth) || 44; const sv = parseFloat(selvage) || 0.5;
    const fl = yd * 36; const uw = fw - sv * 2;
    const numStrips = sw > 0 ? Math.floor(fl / sw) : 0;
    const remainder = fl - numStrips * sw;
    const jellyRollEquiv = sw === 2.5 ? numStrips : 0;
    const hasResult = sw > 0 && numStrips > 0;

    const handleCopy = useCallback(() => { navigator.clipboard.writeText(`${numStrips} WOF strips of ${sw}" x ${uw.toFixed(1)}" from ${yd} yard(s).`); setCopied(true); setTimeout(() => setCopied(false), 2000); }, [numStrips, sw, uw, yd]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Cutting Tools", href: "/cutting" }, { label: "WOF Strip Calculator" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><Scissors size={14} strokeWidth={1.5} /> Cutting</span><h1>WOF Strip Calculator</h1><p>Calculate how many width-of-fabric strips you can cut from your yardage.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Fabric and Strip Details</h2>
                    <div className="calculator-form">
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Yardage</label><select className="input-field" value={yardage} onChange={e => setYardage(e.target.value)}><option value="0.25">1/4 yard</option><option value="0.5">1/2 yard</option><option value="0.75">3/4 yard</option><option value="1">1 yard</option><option value="1.5">1.5 yards</option><option value="2">2 yards</option><option value="3">3 yards</option></select></div>
                            <div className="input-group"><label className="input-label">Fabric Width (in)</label><input type="number" className="input-field input-mono" value={fabWidth} onChange={e => setFabWidth(e.target.value)} min="1" /></div>
                            <div className="input-group"><label className="input-label">Selvage/Side (in)</label><input type="number" className="input-field input-mono" value={selvage} onChange={e => setSelvage(e.target.value)} min="0" step="0.25" /></div>
                        </div>
                        <div className="input-group"><label className="input-label">Strip Width (in)</label><input type="number" className="input-field input-mono" value={stripWidth} onChange={e => setStripWidth(e.target.value)} min="0.5" step="0.25" /></div>
                    </div>
                    {hasResult && (<div><div className="calculator-divider" />
                        <div className="result-card"><div className="result-prefix">WOF Strips</div><div className="result-value">{numStrips} strips</div><div className="result-label">Each {sw}&quot; wide x {uw.toFixed(1)}&quot; long</div></div>
                        <div className={styles.resultDetails} style={{ marginTop: 12 }}>
                            <div className="result-row"><span className="result-row-label">Usable width</span><span className="result-row-value">{uw.toFixed(1)}&quot;</span></div>
                            <div className="result-row"><span className="result-row-label">Remainder</span><span className="result-row-value">{remainder.toFixed(2)}&quot;</span></div>
                            {jellyRollEquiv > 0 && <div className="result-row"><span className="result-row-label">Jelly roll equiv.</span><span className="result-row-value">{jellyRollEquiv} of 40 strips</span></div>}
                        </div>
                        <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
                    </div>)}
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}