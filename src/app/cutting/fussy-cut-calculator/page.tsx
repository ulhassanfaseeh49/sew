"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Target, Copy, Printer, ChevronDown, Scissors, Ruler } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const relatedTools = [
    { name: "Strip Cutting", href: "/cutting/strip-calculator", icon: Scissors },
    { name: "Square Cutting", href: "/cutting/square-calculator", icon: Scissors },
    { name: "Waste Minimizer", href: "/cutting/waste-minimizer", icon: Ruler },
];
const faqItems = [
    { q: "How much extra fabric does fussy cutting require?", a: "Typically 50-200% more fabric depending on repeat size and piece size. Larger repeats and smaller pieces waste the most." },
    { q: "How do I measure a pattern repeat?", a: "Find a distinctive motif on the fabric. Measure from that point to the next identical point below it (vertical repeat) or beside it (horizontal repeat)." },
    { q: "Is fussy cutting worth the extra fabric cost?", a: "For center medallions, kaleidoscope blocks, and feature squares, fussy cutting creates a dramatic effect that transforms a project. For small pieces, the cost may outweigh the visual impact." },
];

export default function FussyCutCalcPage() {
    const [pieceW, setPieceW] = useState("5"); const [pieceH, setPieceH] = useState("5"); const [qty, setQty] = useState("12");
    const [repeatV, setRepeatV] = useState("6"); const [repeatH, setRepeatH] = useState("6"); const [fabWidth, setFabWidth] = useState("44");
    const [activeFaq, setActiveFaq] = useState<number | null>(null); const [copied, setCopied] = useState(false);

    const pw = parseFloat(pieceW) || 0; const ph = parseFloat(pieceH) || 0; const q = parseInt(qty) || 0;
    const rv = parseFloat(repeatV) || 1; const rh = parseFloat(repeatH) || 1; const fw = parseFloat(fabWidth) || 44;

    // Standard cutting (no fussy): strip method
    const stdStrips = ph > 0 ? Math.ceil(q / Math.floor(fw / pw)) : 0;
    const stdYardage = (stdStrips * ph) / 36;

    // Fussy cutting: each piece needs its own repeat unit
    const motifsAcross = rh > 0 ? Math.floor(fw / rh) : 1;
    const repeatRows = motifsAcross > 0 ? Math.ceil(q / motifsAcross) : q;
    const fussyLength = repeatRows * rv;
    const fussyYardage = fussyLength / 36;
    const extraYardage = fussyYardage - stdYardage;
    const extraPct = stdYardage > 0 ? ((extraYardage / stdYardage) * 100) : 0;
    const hasResult = pw > 0 && ph > 0 && q > 0;

    const handleCopy = useCallback(() => { navigator.clipboard.writeText(`Fussy cut: ${fussyYardage.toFixed(2)} yd vs standard ${stdYardage.toFixed(2)} yd (+${extraPct.toFixed(0)}%). ${q} pieces of ${pw}"x${ph}".`); setCopied(true); setTimeout(() => setCopied(false), 2000); }, [fussyYardage, stdYardage, extraPct, q, pw, ph]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Cutting Tools", href: "/cutting" }, { label: "Fussy Cut Calculator" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><Target size={14} strokeWidth={1.5} /> Cutting</span><h1>Fussy Cut Calculator</h1><p>Calculate the extra yardage needed when cutting specific motifs from patterned fabric.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Piece and Pattern Details</h2>
                    <div className="calculator-form">
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Piece Width (in)</label><input type="number" className="input-field input-mono" value={pieceW} onChange={e => setPieceW(e.target.value)} min="0.5" step="0.25" /></div>
                            <div className="input-group"><label className="input-label">Piece Height (in)</label><input type="number" className="input-field input-mono" value={pieceH} onChange={e => setPieceH(e.target.value)} min="0.5" step="0.25" /></div>
                            <div className="input-group"><label className="input-label">Quantity Needed</label><input type="number" className="input-field input-mono" value={qty} onChange={e => setQty(e.target.value)} min="1" /></div>
                        </div>
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Vertical Repeat (in)</label><input type="number" className="input-field input-mono" value={repeatV} onChange={e => setRepeatV(e.target.value)} min="1" step="0.5" /></div>
                            <div className="input-group"><label className="input-label">Horizontal Repeat (in)</label><input type="number" className="input-field input-mono" value={repeatH} onChange={e => setRepeatH(e.target.value)} min="1" step="0.5" /></div>
                            <div className="input-group"><label className="input-label">Fabric Width (in)</label><input type="number" className="input-field input-mono" value={fabWidth} onChange={e => setFabWidth(e.target.value)} min="1" /></div>
                        </div>
                    </div>
                    {hasResult && (<div><div className="calculator-divider" />
                        <div className="result-card"><div className="result-prefix">Fussy Cut Yardage</div><div className="result-value">{fussyYardage.toFixed(2)} yards</div><div className="result-label">+{extraPct.toFixed(0)}% more than standard cutting</div></div>
                        <div className={styles.tableWrap} style={{ marginTop: 12 }}><table className={styles.convTable}><thead><tr><th></th><th>Standard</th><th>Fussy Cut</th></tr></thead>
                            <tbody>
                                <tr><td style={{ fontWeight: 600 }}>Yardage</td><td>{stdYardage.toFixed(2)} yd</td><td>{fussyYardage.toFixed(2)} yd</td></tr>
                                <tr><td style={{ fontWeight: 600 }}>Fabric length</td><td>{(stdStrips * ph).toFixed(1)}&quot;</td><td>{fussyLength.toFixed(1)}&quot;</td></tr>
                                <tr><td style={{ fontWeight: 600 }}>Extra needed</td><td>--</td><td>+{extraYardage.toFixed(2)} yd</td></tr>
                            </tbody>
                        </table></div>
                        <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
                    </div>)}
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}