"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Scissors, Copy, Printer, ChevronDown, BookOpen, Ruler } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const quickWidths = [0.25, 0.375, 0.5, 0.625, 0.75, 1, 1.25, 1.5, 2];
const weightAdj: Record<string, { label: string; add: number }> = {
    light: { label: "Lightweight", add: 0 },
    medium: { label: "Medium weight", add: 0 },
    heavy: { label: "Medium-heavy", add: 0.125 },
    vheavy: { label: "Heavy", add: 0.25 },
};

const relatedTools = [
    { name: "Tape Yardage Calc", href: "/bias-binding/tape-yardage", icon: Ruler },
    { name: "Continuous Bias Calc", href: "/bias-binding/continuous-bias", icon: Scissors },
    { name: "Tape Maker Guide", href: "/bias-binding/maker-guide", icon: BookOpen },
];
const faqItems = [
    { q: "How wide do I cut fabric for 1/2 inch bias tape?", a: "For single fold: cut 2\" wide strips (4x finished width). For double fold: also cut 2\" strips, but the finished visible width will be approximately 1/4\" per side." },
    { q: "What is the difference between single and double fold?", a: "Single fold: both edges folded to center (2 layers). Double fold: single fold tape folded in half again (4 layers). Double fold is standard for binding edges." },
    { q: "What size bias tape maker do I need?", a: "The mm number on tape makers is the OUTPUT width. 12mm makes 1/2\" tape, 25mm makes 1\" tape. Cut strips about 2x the tape maker size." },
];

export default function TapeWidthPage() {
    const [finishedWidth, setFinishedWidth] = useState("0.5"); const [foldType, setFoldType] = useState("double");
    const [weight, setWeight] = useState("medium");
    const [activeFaq, setActiveFaq] = useState<number | null>(null); const [copied, setCopied] = useState(false);

    const fw = parseFloat(finishedWidth) || 0.5; const wa = weightAdj[weight];
    const singleFoldCut = fw * 4 + wa.add; const doubleFoldCut = fw * 8 + wa.add;
    const cutWidth = foldType === "single" ? singleFoldCut : doubleFoldCut;
    const cutMm = cutWidth * 25.4;

    const handleCopy = useCallback(() => { navigator.clipboard.writeText(`${foldType === "single" ? "Single" : "Double"} fold, ${fw}" finished: cut strips ${cutWidth.toFixed(2)}" (${cutMm.toFixed(0)}mm) wide`); setCopied(true); setTimeout(() => setCopied(false), 2000); }, [foldType, fw, cutWidth, cutMm]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Bias Binding", href: "/bias-binding" }, { label: "Tape Width" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><Scissors size={14} strokeWidth={1.5} /> Bias Binding</span><h1>Bias Tape Width Calculator</h1><p>Calculate the cutting width needed to produce bias tape of any desired finished width.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Tape Specifications</h2>
                    <div className="calculator-form">
                        <div className="input-group"><label className="input-label">Desired Finished Width (inches)</label>
                            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>{quickWidths.map(w => (<button key={w} className={`btn btn-sm ${fw === w ? "btn-primary" : "btn-secondary"}`} onClick={() => setFinishedWidth(String(w))} style={{ minWidth: 44 }}>{w}&quot;</button>))}</div>
                            <input type="number" className="input-field input-mono" value={finishedWidth} onChange={e => setFinishedWidth(e.target.value)} min="0.125" step="0.125" />
                        </div>
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Fold Type</label><select className="input-field" value={foldType} onChange={e => setFoldType(e.target.value)}><option value="single">Single Fold</option><option value="double">Double Fold</option></select></div>
                            <div className="input-group"><label className="input-label">Fabric Weight</label><select className="input-field" value={weight} onChange={e => setWeight(e.target.value)}>{Object.entries(weightAdj).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}</select></div>
                        </div>
                    </div>
                    <div className="calculator-divider" />
                    <div className="result-card"><div className="result-prefix">Cut Bias Strips</div><div className="result-value">{cutWidth.toFixed(2)}&quot; wide</div><div className="result-label">{cutMm.toFixed(0)}mm | {foldType === "single" ? "Single fold" : "Double fold"} | Finished: {fw}&quot;</div></div>
                    <div className={styles.resultDetails} style={{ marginTop: 12 }}>
                        <div className="result-row"><span className="result-row-label">Single fold cut width</span><span className="result-row-value">{singleFoldCut.toFixed(2)}&quot;</span></div>
                        <div className="result-row"><span className="result-row-label">Double fold cut width</span><span className="result-row-value">{doubleFoldCut.toFixed(2)}&quot;</span></div>
                        <div className="result-row"><span className="result-row-label">Weight adjustment</span><span className="result-row-value">+{wa.add}&quot;</span></div>
                    </div>
                    <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}