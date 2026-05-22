"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Scissors, Copy, Printer, ChevronDown, Ruler } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const relatedTools = [
    { name: "Strip Cutting", href: "/cutting/strip-calculator", icon: Scissors },
    { name: "Waste Minimizer", href: "/cutting/waste-minimizer", icon: Ruler },
    { name: "Bias Tape Width", href: "/bias-binding/tape-width", icon: Ruler },
];
const faqItems = [
    { q: "How do I calculate bias strip yield?", a: "The diagonal of the fabric determines strip length. For a square, diagonal = side x 1.414. Total yield = (diagonal area / strip width) minus joining losses." },
    { q: "What is the continuous bias method?", a: "A technique using a square of fabric turned into a tube, then cut in a spiral to create one long continuous bias strip with no joins. Much more efficient." },
    { q: "How much fabric do corner waste triangles consume?", a: "Bias cutting wastes two corner triangles. For a 1-yard piece, approximately 15-25% is wasted depending on strip width." },
];

export default function BiasStripCalcPage() {
    const [fabWidth, setFabWidth] = useState("44");
    const [fabLength, setFabLength] = useState("36");
    const [stripWidth, setStripWidth] = useState("2");
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const [copied, setCopied] = useState(false);

    const fw = parseFloat(fabWidth) || 44; const fl = parseFloat(fabLength) || 36; const sw = parseFloat(stripWidth) || 2;
    const diagonal = Math.sqrt(fw * fw + fl * fl);
    const numStrips = sw > 0 ? Math.floor(diagonal / sw) : 0;
    const avgLen = Math.min(fw, fl) * 0.7; // approximate average strip length
    const totalLength = numStrips * avgLen;
    const joinLoss = numStrips > 1 ? (numStrips - 1) * 0.5 : 0;
    const netLength = totalLength - joinLoss;
    const hasResult = sw > 0 && numStrips > 0;

    const handleCopy = useCallback(() => { navigator.clipboard.writeText(`~${numStrips} bias strips of ${sw}" from ${fw}"x${fl}" fabric. ~${(netLength / 36).toFixed(1)} yards total.`); setCopied(true); setTimeout(() => setCopied(false), 2000); }, [numStrips, sw, fw, fl, netLength]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Cutting Tools", href: "/cutting" }, { label: "Bias Strip Calculator" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><Scissors size={14} strokeWidth={1.5} /> Cutting</span><h1>Bias Strip Cutting Calculator</h1><p>Calculate how many bias strips (cut at 45 degrees) and total bias tape yield from your fabric.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Fabric and Strip Details</h2>
                    <div className="calculator-form">
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Fabric Width (in)</label><input type="number" className="input-field input-mono" value={fabWidth} onChange={e => setFabWidth(e.target.value)} min="1" /></div>
                            <div className="input-group"><label className="input-label">Fabric Length (in)</label><input type="number" className="input-field input-mono" value={fabLength} onChange={e => setFabLength(e.target.value)} min="1" /></div>
                        </div>
                        <div className="input-group"><label className="input-label">Bias Strip Width (in)</label><select className="input-field" value={stripWidth} onChange={e => setStripWidth(e.target.value)}><option value="1">1&quot; (1/4&quot; finished)</option><option value="1.25">1.25&quot; (1/2&quot; finished)</option><option value="1.75">1.75&quot; (3/4&quot; finished)</option><option value="2">2&quot; (1&quot; finished)</option><option value="2.5">2.5&quot; (binding)</option></select></div>
                    </div>
                    {hasResult && (<div><div className="calculator-divider" />
                        <div className="result-card"><div className="result-prefix">Estimated Bias Yield</div><div className="result-value">~{(netLength / 36).toFixed(1)} yards</div><div className="result-label">{numStrips} strips of {sw}&quot; width</div></div>
                        <div className={styles.resultDetails} style={{ marginTop: 12 }}>
                            <div className="result-row"><span className="result-row-label">Fabric diagonal</span><span className="result-row-value">{diagonal.toFixed(1)}&quot;</span></div>
                            <div className="result-row"><span className="result-row-label">Joining losses</span><span className="result-row-value">~{joinLoss.toFixed(1)}&quot;</span></div>
                            <div className="result-row"><span className="result-row-label">Net length</span><span className="result-row-value">~{netLength.toFixed(0)}&quot;</span></div>
                        </div>
                        <p style={{ margin: "12px 0 0", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", fontStyle: "italic" }}>For exact yield, use the Continuous Bias Calculator for square fabric.</p>
                        <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
                    </div>)}
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}