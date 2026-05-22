"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Link2, Copy, Printer, ChevronDown, Scissors, BookOpen } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const relatedTools = [
    { name: "Continuous Bias", href: "/bias-binding/continuous-bias", icon: Scissors },
    { name: "Tape Yardage", href: "/bias-binding/tape-yardage", icon: Scissors },
    { name: "Tape Width Calc", href: "/bias-binding/tape-width", icon: Scissors },
];
const faqItems = [
    { q: "How much length is lost at each bias tape join?", a: "Approximately 1/2\" to 3/4\" per join (about 2x your seam allowance). For a project needing 5 joins, add 3-4\" extra tape." },
    { q: "What is the correct way to join bias strips?", a: "Place two strips at 90 degrees (right sides together), stitch diagonally across the corner, trim to 1/4\" seam, press open. This creates an invisible angled join." },
    { q: "Can I avoid joins in my bias tape?", a: "Use the continuous bias method to get one long strip with no joins. For shorter needs, cut longer strips from wider fabric." },
];

export default function JoiningPage() {
    const [totalNeeded, setTotalNeeded] = useState(""); const [stripLen, setStripLen] = useState("");
    const [seamAllow, setSeamAllow] = useState("0.25");
    const [activeFaq, setActiveFaq] = useState<number | null>(null); const [copied, setCopied] = useState(false);

    const tn = parseFloat(totalNeeded) || 0; const sl = parseFloat(stripLen) || 0; const sa = parseFloat(seamAllow) || 0.25;
    const stripsNeeded = sl > 0 ? Math.ceil(tn / sl) : 0;
    const joins = stripsNeeded > 1 ? stripsNeeded - 1 : 0;
    const lossPerJoin = sa * 2; const totalLoss = joins * lossPerJoin;
    const adjusted = tn + totalLoss;
    const hasResult = tn > 0 && sl > 0;

    const handleCopy = useCallback(() => { navigator.clipboard.writeText(`${stripsNeeded} strips, ${joins} joins, ${totalLoss.toFixed(1)}" lost. Total to cut: ${adjusted.toFixed(1)}"`); setCopied(true); setTimeout(() => setCopied(false), 2000); }, [stripsNeeded, joins, totalLoss, adjusted]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Bias Binding", href: "/bias-binding" }, { label: "Joining" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><Link2 size={14} strokeWidth={1.5} /> Bias Binding</span><h1>Bias Tape Joining Calculator</h1><p>Calculate extra length needed for joins and how many joins will occur.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Strip Details</h2>
                    <div className="calculator-form">
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Total Tape Needed (inches)</label><input type="number" className="input-field input-mono" placeholder="e.g., 180" value={totalNeeded} onChange={e => setTotalNeeded(e.target.value)} min="0" step="1" /></div>
                            <div className="input-group"><label className="input-label">Individual Strip Length (inches)</label><input type="number" className="input-field input-mono" placeholder="e.g., 44" value={stripLen} onChange={e => setStripLen(e.target.value)} min="0" step="1" /></div>
                        </div>
                        <div className="input-group"><label className="input-label">Seam Allowance at Join</label><select className="input-field" value={seamAllow} onChange={e => setSeamAllow(e.target.value)}><option value="0.25">1/4&quot;</option><option value="0.375">3/8&quot;</option><option value="0.5">1/2&quot;</option></select></div>
                    </div>
                    {hasResult && (<div><div className="calculator-divider" />
                        <div className="result-card"><div className="result-prefix">Strips and Joins</div><div className="result-value">{stripsNeeded} strips, {joins} join{joins !== 1 ? "s" : ""}</div><div className="result-label">{totalLoss.toFixed(1)}&quot; lost to joins. Total to cut: {adjusted.toFixed(1)}&quot;</div></div>
                        <div className={styles.resultDetails} style={{ marginTop: 12 }}>
                            <div className="result-row"><span className="result-row-label">Tape needed</span><span className="result-row-value">{tn}&quot;</span></div>
                            <div className="result-row"><span className="result-row-label">Loss per join</span><span className="result-row-value">{lossPerJoin.toFixed(2)}&quot;</span></div>
                            <div className="result-row"><span className="result-row-label">Total join loss</span><span className="result-row-value">+{totalLoss.toFixed(1)}&quot;</span></div>
                            <div className="result-row"><span className="result-row-label">Adjusted total</span><span className="result-row-value">{adjusted.toFixed(1)}&quot;</span></div>
                        </div>
                        <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
                    </div>)}
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}