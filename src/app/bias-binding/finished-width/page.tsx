"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Ruler, Copy, Printer, ChevronDown, Scissors, BookOpen } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const quiltRef = [
    { cut: '2"', method: "Double fold, 1/4\" SA", front: '1/4"', back: "slightly more" },
    { cut: '2-1/4"', method: "Double fold, 1/4\" SA", front: '3/8"', back: '3/8"' },
    { cut: '2-1/2"', method: "Double fold, 1/4\" SA", front: '1/2"', back: '1/2"' },
    { cut: '3"', method: "Double fold, 1/4\" SA", front: '3/4"', back: '3/4"' },
];

const relatedTools = [
    { name: "Tape Width Calc", href: "/bias-binding/tape-width", icon: Scissors },
    { name: "Quilt Binding", href: "/bias-binding/quilt-binding", icon: BookOpen },
    { name: "Fold Comparator", href: "/bias-binding/fold-comparator", icon: Ruler },
];
const faqItems = [
    { q: "Should I cut 2-1/4 or 2-1/2 inch binding strips?", a: "2-1/4\" gives approximately 3/8\" finished width (thin quilts). 2-1/2\" gives approximately 1/2\" finished width (standard). Choose based on quilt thickness and your preference." },
    { q: "Why does my binding width vary?", a: "Inconsistent seam allowance is the most common cause. Even 1/16\" variation changes the visible binding width. Use a consistent 1/4\" SA throughout." },
    { q: "How do I get perfectly even binding on both sides?", a: "Make single fold tape first and press precisely. One side of double fold should be slightly wider (the back), so it catches when you stitch from the front." },
];

export default function FinishedWidthPage() {
    const [mode, setMode] = useState<"toFinished" | "toCut">("toFinished");
    const [cutWidth, setCutWidth] = useState("2.5"); const [desiredFinished, setDesiredFinished] = useState("0.5");
    const [seamAllow, setSeamAllow] = useState("0.25");
    const [activeFaq, setActiveFaq] = useState<number | null>(null); const [copied, setCopied] = useState(false);

    const sa = parseFloat(seamAllow) || 0.25;
    // Mode 1: cut -> finished
    const cw = parseFloat(cutWidth) || 2.5;
    const finishedFront = (cw / 4) - sa / 2;
    const finishedBack = finishedFront + 0.0625; // slightly wider to catch

    // Mode 2: desired finished -> cut
    const df = parseFloat(desiredFinished) || 0.5;
    const neededCut = (df + sa / 2) * 4;

    const handleCopy = useCallback(() => {
        if (mode === "toFinished") navigator.clipboard.writeText(`Cut ${cw}" strips: finished ~${finishedFront.toFixed(3)}" front, ~${finishedBack.toFixed(3)}" back`);
        else navigator.clipboard.writeText(`Desired ${df}" finished: cut strips ${neededCut.toFixed(2)}" wide`);
        setCopied(true); setTimeout(() => setCopied(false), 2000);
    }, [mode, cw, finishedFront, finishedBack, df, neededCut]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Bias Binding", href: "/bias-binding" }, { label: "Finished Width" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><Ruler size={14} strokeWidth={1.5} /> Bias Binding</span><h1>Binding Width to Finished Width Calculator</h1><p>Calculate the relationship between cut strip width and finished visible binding width.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Calculation Direction</h2>
                    <div style={{ display: "flex", gap: 8, marginBottom: 16 }}><button className={`btn btn-sm ${mode === "toFinished" ? "btn-primary" : "btn-secondary"}`} onClick={() => setMode("toFinished")}>Cut to Finished</button><button className={`btn btn-sm ${mode === "toCut" ? "btn-primary" : "btn-secondary"}`} onClick={() => setMode("toCut")}>Finished to Cut</button></div>
                    <div className="calculator-form">
                        {mode === "toFinished" ? (
                            <div className="calculator-form-row">
                                <div className="input-group"><label className="input-label">Cut Strip Width (inches)</label><input type="number" className="input-field input-mono" value={cutWidth} onChange={e => setCutWidth(e.target.value)} min="0.5" step="0.125" /></div>
                                <div className="input-group"><label className="input-label">Seam Allowance</label><select className="input-field" value={seamAllow} onChange={e => setSeamAllow(e.target.value)}><option value="0.25">1/4&quot;</option><option value="0.375">3/8&quot;</option></select></div>
                            </div>
                        ) : (
                            <div className="calculator-form-row">
                                <div className="input-group"><label className="input-label">Desired Finished Width (inches)</label><input type="number" className="input-field input-mono" value={desiredFinished} onChange={e => setDesiredFinished(e.target.value)} min="0.125" step="0.125" /></div>
                                <div className="input-group"><label className="input-label">Seam Allowance</label><select className="input-field" value={seamAllow} onChange={e => setSeamAllow(e.target.value)}><option value="0.25">1/4&quot;</option><option value="0.375">3/8&quot;</option></select></div>
                            </div>
                        )}
                    </div>
                    <div className="calculator-divider" />
                    {mode === "toFinished" ? (
                        <div className="result-card"><div className="result-prefix">Finished Visible Width</div><div className="result-value">~{finishedFront.toFixed(3)}&quot;</div><div className="result-label">Front: ~{finishedFront.toFixed(3)}&quot; | Back: ~{finishedBack.toFixed(3)}&quot; (from {cw}&quot; cut, double fold)</div></div>
                    ) : (
                        <div className="result-card"><div className="result-prefix">Cut Strips</div><div className="result-value">{neededCut.toFixed(2)}&quot; wide</div><div className="result-label">For {df}&quot; finished visible binding (double fold, {sa}&quot; SA)</div></div>
                    )}
                    <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
                </div>
                <div className="calculator-card"><h2 className={styles.sectionTitle}>Common Quilt Binding Reference</h2>
                    <div className={styles.tableWrap}><table className={styles.convTable}><thead><tr><th>Cut Width</th><th>Method</th><th>Front</th><th>Back</th></tr></thead>
                        <tbody>{quiltRef.map(r => (<tr key={r.cut}><td style={{ fontWeight: 600 }}>{r.cut}</td><td>{r.method}</td><td>{r.front}</td><td>{r.back}</td></tr>))}</tbody>
                    </table></div>
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}