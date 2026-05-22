"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Triangle, Copy, Printer, ChevronDown, Scissors, Grid3X3 } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const methodRef = [
    { method: "Traditional (2 per square)", formula: "finished + 7/8\"", perSquare: 2 },
    { method: "2-at-a-time sewn", formula: "finished + 7/8\"", perSquare: 2 },
    { method: "4-at-a-time", formula: "finished + 1-1/4\"", perSquare: 4 },
    { method: "8-at-a-time", formula: "finished + 1-1/2\"", perSquare: 8 },
];

const relatedTools = [
    { name: "Square Cutting", href: "/cutting/square-calculator", icon: Grid3X3 },
    { name: "Strip Cutting", href: "/cutting/strip-calculator", icon: Scissors },
    { name: "Sub-Cut Calc", href: "/cutting/sub-cut-calculator", icon: Scissors },
];
const faqItems = [
    { q: "What size square do I cut for half-square triangles?", a: "For 2-at-a-time method: finished size + 7/8\". For 4-at-a-time: finished + 1-1/4\". For 8-at-a-time: finished + 1-1/2\"." },
    { q: "Why do my triangles have bias edges?", a: "Cutting a square diagonally creates bias on the cut edge. Handle carefully, use spray starch, and sew bias edges to straight-grain edges when possible." },
    { q: "Which cutting method gives the most triangles?", a: "The 8-at-a-time method uses larger starting squares but yields the most units per square. The 4-at-a-time offers a good balance of efficiency and simplicity." },
];

export default function TriangleCalcPage() {
    const [triType, setTriType] = useState("hst");
    const [finishedSize, setFinishedSize] = useState("3");
    const [fabWidth, setFabWidth] = useState("44"); const [fabLength, setFabLength] = useState("36"); const [selvage, setSelvage] = useState("0.5");
    const [activeFaq, setActiveFaq] = useState<number | null>(null); const [copied, setCopied] = useState(false);

    const fin = parseFloat(finishedSize) || 0;
    const fw = parseFloat(fabWidth) || 44; const fl = parseFloat(fabLength) || 36;
    const sv = parseFloat(selvage) || 0.5; const uw = fw - sv * 2;

    // HST: 2-at-a-time method (finished + 7/8)
    const hstCut = fin + 0.875;
    // QST: finished + 1.25
    const qstCut = fin + 1.25;
    const cutSize = triType === "hst" ? hstCut : qstCut;
    const unitsPerSq = triType === "hst" ? 2 : 4;

    const sqPerStrip = cutSize > 0 ? Math.floor(uw / cutSize) : 0;
    const numStrips = cutSize > 0 ? Math.floor(fl / cutSize) : 0;
    const totalSquares = sqPerStrip * numStrips;
    const totalUnits = totalSquares * unitsPerSq;
    const hasResult = fin > 0 && totalUnits > 0;

    const handleCopy = useCallback(() => { navigator.clipboard.writeText(`${totalUnits} ${triType === "hst" ? "HST" : "QST"} units (${fin}" finished). Cut ${totalSquares} squares at ${cutSize.toFixed(3)}".`); setCopied(true); setTimeout(() => setCopied(false), 2000); }, [totalUnits, triType, fin, totalSquares, cutSize]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Cutting Tools", href: "/cutting" }, { label: "Triangle Calculator" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><Triangle size={14} strokeWidth={1.5} /> Cutting</span><h1>Triangle Cutting Calculator</h1><p>Calculate how many HST or QST units from your fabric with cutting formulas.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Triangle Details</h2>
                    <div className="calculator-form">
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Triangle Type</label><select className="input-field" value={triType} onChange={e => setTriType(e.target.value)}><option value="hst">Half-Square Triangle (HST)</option><option value="qst">Quarter-Square Triangle (QST)</option></select></div>
                            <div className="input-group"><label className="input-label">Finished Size (in)</label><input type="number" className="input-field input-mono" value={finishedSize} onChange={e => setFinishedSize(e.target.value)} min="0.5" step="0.25" /></div>
                        </div>
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Fabric Width (in)</label><input type="number" className="input-field input-mono" value={fabWidth} onChange={e => setFabWidth(e.target.value)} min="1" /></div>
                            <div className="input-group"><label className="input-label">Fabric Length (in)</label><input type="number" className="input-field input-mono" value={fabLength} onChange={e => setFabLength(e.target.value)} min="1" /></div>
                            <div className="input-group"><label className="input-label">Selvage/Side (in)</label><input type="number" className="input-field input-mono" value={selvage} onChange={e => setSelvage(e.target.value)} min="0" step="0.25" /></div>
                        </div>
                    </div>
                    {hasResult && (<div><div className="calculator-divider" />
                        <div className="result-card"><div className="result-prefix">Total {triType === "hst" ? "HST" : "QST"} Units</div><div className="result-value">{totalUnits} units</div><div className="result-label">From {totalSquares} squares cut at {cutSize.toFixed(3)}&quot;</div></div>
                        <div className={styles.resultDetails} style={{ marginTop: 12 }}>
                            <div className="result-row"><span className="result-row-label">Starting square (cut)</span><span className="result-row-value">{cutSize.toFixed(3)}&quot;</span></div>
                            <div className="result-row"><span className="result-row-label">Units per square</span><span className="result-row-value">{unitsPerSq}</span></div>
                            <div className="result-row"><span className="result-row-label">Squares per strip</span><span className="result-row-value">{sqPerStrip}</span></div>
                            <div className="result-row"><span className="result-row-label">Number of strips</span><span className="result-row-value">{numStrips}</span></div>
                        </div>
                        <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
                    </div>)}
                </div>
                <div className="calculator-card"><h2 className={styles.sectionTitle}>HST Methods Reference</h2>
                    <div className={styles.tableWrap}><table className={styles.convTable}><thead><tr><th>Method</th><th>Starting Square</th><th>Units/Square</th></tr></thead>
                        <tbody>{methodRef.map(m => (<tr key={m.method}><td style={{ fontWeight: 600 }}>{m.method}</td><td>{m.formula}</td><td>{m.perSquare}</td></tr>))}</tbody>
                    </table></div>
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}