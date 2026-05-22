"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Minus, Copy, Printer, ChevronDown, Ruler, Scissors } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const casingRef = [
    { elastic: '1/4" (6mm)', finished: '1/2"', strip: '1" + SA' },
    { elastic: '3/8" (9mm)', finished: '5/8"', strip: '1.25" + SA' },
    { elastic: '1/2" (12mm)', finished: '3/4"', strip: '1.5" + SA' },
    { elastic: '3/4" (18mm)', finished: '1"', strip: '2" + SA' },
    { elastic: '1" (25mm)', finished: '1.25"', strip: '2.5" + SA' },
    { elastic: '1.5" (38mm)', finished: '1.75"', strip: '3.5" + SA' },
    { elastic: '2" (50mm)', finished: '2.25"', strip: '4.5" + SA' },
];
const relatedTools = [
    { name: "Elastic Calculator", href: "/notions/elastic-calculator", icon: Ruler },
    { name: "Waist Elastic", href: "/elastic/waist-calculator", icon: Ruler },
    { name: "Elastic Types", href: "/elastic/types-guide", icon: Scissors },
];
const faqItems = [
    { q: "Why does my elastic twist inside the casing?", a: "The casing is too wide. Reduce the ease slightly. Standard ease is 1/4\" total -- just enough for the elastic to slide but not flip." },
    { q: "What is the formula for casing width?", a: "Finished casing width = elastic width + 1/4\" ease. Cut strip width = finished casing width x 2 + seam allowances." },
    { q: "Can I use the hem fold as the casing?", a: "Yes. The fold allowance = finished casing width + 1/4\" turn-under at the raw edge. This is the standard method for elastic waistbands." },
];

export default function CasingWidthPage() {
    const [elasticWidth, setElasticWidth] = useState("1"); const [ease, setEase] = useState("0.25"); const [seamAllowance, setSA] = useState("0.5");
    const [activeFaq, setActiveFaq] = useState<number | null>(null); const [copied, setCopied] = useState(false);

    const ew = parseFloat(elasticWidth) || 0; const ea = parseFloat(ease) || 0.25; const sa = parseFloat(seamAllowance) || 0.5;
    const finishedCasing = ew + ea;
    const cutStrip = finishedCasing * 2 + sa * 2;
    const foldAllowance = finishedCasing + 0.25; // 1/4" turn-under
    const hasResult = ew > 0;

    const handleCopy = useCallback(() => { navigator.clipboard.writeText(`Elastic ${ew}": finished casing ${finishedCasing.toFixed(2)}", cut strip ${cutStrip.toFixed(2)}", hem fold ${foldAllowance.toFixed(2)}"`); setCopied(true); setTimeout(() => setCopied(false), 2000); }, [ew, finishedCasing, cutStrip, foldAllowance]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Notions", href: "/notions" }, { label: "Casing Width" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><Minus size={14} strokeWidth={1.5} /> Notions</span><h1>Elastic Casing Width Calculator</h1><p>Calculate fabric casing width for any elastic width with ease and seam allowances.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Casing Details</h2>
                    <div className="calculator-form">
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Elastic Width (in)</label><select className="input-field" value={elasticWidth} onChange={e => setElasticWidth(e.target.value)}><option value="0.25">1/4&quot;</option><option value="0.375">3/8&quot;</option><option value="0.5">1/2&quot;</option><option value="0.75">3/4&quot;</option><option value="1">1&quot;</option><option value="1.5">1.5&quot;</option><option value="2">2&quot;</option></select></div>
                            <div className="input-group"><label className="input-label">Ease (in)</label><input type="number" className="input-field input-mono" value={ease} onChange={e => setEase(e.target.value)} min="0.125" step="0.125" /></div>
                            <div className="input-group"><label className="input-label">Seam Allowance (in)</label><input type="number" className="input-field input-mono" value={seamAllowance} onChange={e => setSA(e.target.value)} min="0.25" step="0.25" /></div>
                        </div>
                    </div>
                    {hasResult && (<div><div className="calculator-divider" />
                        <div className="result-card"><div className="result-prefix">Casing Dimensions</div><div className="result-value">{finishedCasing.toFixed(2)}&quot; finished</div><div className="result-label">For {ew}&quot; elastic with {ea}&quot; ease</div></div>
                        <div className={styles.resultDetails} style={{ marginTop: 12 }}>
                            <div className="result-row"><span className="result-row-label">Cut strip width</span><span className="result-row-value">{cutStrip.toFixed(2)}&quot;</span></div>
                            <div className="result-row"><span className="result-row-label">Hem fold allowance</span><span className="result-row-value">{foldAllowance.toFixed(2)}&quot;</span></div>
                        </div>
                        <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
                    </div>)}
                </div>
                <div className="calculator-card"><h2 className={styles.sectionTitle}>Quick Reference</h2>
                    <div className={styles.tableWrap}><table className={styles.convTable}><thead><tr><th>Elastic Width</th><th>Finished Casing</th><th>Cut Strip</th></tr></thead>
                        <tbody>{casingRef.map(c => (<tr key={c.elastic}><td style={{ fontWeight: 600 }}>{c.elastic}</td><td>{c.finished}</td><td>{c.strip}</td></tr>))}</tbody>
                    </table></div>
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}