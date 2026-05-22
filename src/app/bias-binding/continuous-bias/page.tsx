"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Square, Copy, Printer, ChevronDown, Scissors, BookOpen } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const squareRef = [
    { sq: 12, s1: 5.5, s15: 3.5, s2: 2.5, s25: 2 },
    { sq: 15, s1: 8.5, s15: 5.5, s2: 4, s25: 3 },
    { sq: 18, s1: 12, s15: 8, s2: 6, s25: 4.5 },
    { sq: 20, s1: 15, s15: 10, s2: 7.5, s25: 6 },
    { sq: 24, s1: 21, s15: 14, s2: 10.5, s25: 8.5 },
];

const relatedTools = [
    { name: "Tape Width Calc", href: "/bias-binding/tape-width", icon: Scissors },
    { name: "Tape Yardage", href: "/bias-binding/tape-yardage", icon: Scissors },
    { name: "Joining Calculator", href: "/bias-binding/joining", icon: Scissors },
];
const faqItems = [
    { q: "How much bias tape can I make from a fat quarter?", a: "A fat quarter (18\"x22\") gives an 18\" square. At 2\" strip width, this yields approximately 6 yards of bias tape using the continuous method." },
    { q: "What size square do I need for 5 yards of bias tape?", a: "For 2\" wide strips, an 18\" square yields about 6 yards. For 2.5\" strips, you'd need about a 20\" square for 5+ yards." },
    { q: "How do I make continuous bias tape?", a: "Cut a fabric square, mark diagonal bias lines, join opposite edges offset by one strip width to form a tube, then cut along the marked spiral." },
];

export default function ContinuousBiasPage() {
    const [mode, setMode] = useState<"toTape" | "toSquare">("toTape");
    const [squareSize, setSquareSize] = useState("18"); const [stripWidth, setStripWidth] = useState("2");
    const [targetLen, setTargetLen] = useState("");
    const [activeFaq, setActiveFaq] = useState<number | null>(null); const [copied, setCopied] = useState(false);

    const sw = parseFloat(stripWidth) || 2;

    // Mode 1: square -> tape length
    const sq = parseFloat(squareSize) || 18;
    const area = sq * sq; const tapeLen = area / sw; const tapeYards = tapeLen / 36;
    const usable = tapeYards * 0.92; // ~8% waste

    // Mode 2: target -> square size
    const tl = parseFloat(targetLen) || 0;
    const neededArea = (tl * 36) * sw / 0.92;
    const neededSq = Math.ceil(Math.sqrt(neededArea));

    const handleCopy = useCallback(() => {
        if (mode === "toTape") navigator.clipboard.writeText(`${sq}" square, ${sw}" strips: ~${usable.toFixed(1)} yards usable bias tape`);
        else navigator.clipboard.writeText(`Need ${tl} yards of ${sw}" strips: cut ${neededSq}" x ${neededSq}" square`);
        setCopied(true); setTimeout(() => setCopied(false), 2000);
    }, [mode, sq, sw, usable, tl, neededSq]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Bias Binding", href: "/bias-binding" }, { label: "Continuous Bias" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><Square size={14} strokeWidth={1.5} /> Bias Binding</span><h1>Continuous Bias Strip Calculator</h1><p>Calculate bias tape yield from a fabric square or determine what square size you need.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Calculation Mode</h2>
                    <div style={{ display: "flex", gap: 8, marginBottom: 16 }}><button className={`btn btn-sm ${mode === "toTape" ? "btn-primary" : "btn-secondary"}`} onClick={() => setMode("toTape")}>Square to Tape</button><button className={`btn btn-sm ${mode === "toSquare" ? "btn-primary" : "btn-secondary"}`} onClick={() => setMode("toSquare")}>Tape to Square</button></div>
                    <div className="calculator-form">
                        {mode === "toTape" ? (<>
                            <div className="calculator-form-row">
                                <div className="input-group"><label className="input-label">Square Size (inches)</label><input type="number" className="input-field input-mono" value={squareSize} onChange={e => setSquareSize(e.target.value)} min="6" step="1" /></div>
                                <div className="input-group"><label className="input-label">Strip Width (inches)</label><input type="number" className="input-field input-mono" value={stripWidth} onChange={e => setStripWidth(e.target.value)} min="0.5" step="0.25" /></div>
                            </div>
                        </>) : (<>
                            <div className="calculator-form-row">
                                <div className="input-group"><label className="input-label">Target Tape Length (yards)</label><input type="number" className="input-field input-mono" placeholder="e.g., 5" value={targetLen} onChange={e => setTargetLen(e.target.value)} min="0" step="0.5" /></div>
                                <div className="input-group"><label className="input-label">Strip Width (inches)</label><input type="number" className="input-field input-mono" value={stripWidth} onChange={e => setStripWidth(e.target.value)} min="0.5" step="0.25" /></div>
                            </div>
                        </>)}
                    </div>
                    <div className="calculator-divider" />
                    {mode === "toTape" ? (
                        <div className="result-card"><div className="result-prefix">Usable Bias Tape</div><div className="result-value">~{usable.toFixed(1)} yards</div><div className="result-label">From {sq}&quot; x {sq}&quot; square at {sw}&quot; strip width ({tapeYards.toFixed(1)} yd raw, ~8% waste)</div></div>
                    ) : tl > 0 ? (
                        <div className="result-card"><div className="result-prefix">Cut a Square</div><div className="result-value">{neededSq}&quot; x {neededSq}&quot;</div><div className="result-label">To yield {tl} yards of {sw}&quot; wide bias strips</div></div>
                    ) : null}
                    <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
                </div>
                <div className="calculator-card"><h2 className={styles.sectionTitle}>Common Square Sizes Reference</h2>
                    <div className={styles.tableWrap}><table className={styles.convTable}><thead><tr><th>Square</th><th>1&quot; strips</th><th>1.5&quot; strips</th><th>2&quot; strips</th><th>2.5&quot; strips</th></tr></thead>
                        <tbody>{squareRef.map(r => (<tr key={r.sq}><td style={{ fontWeight: 600 }}>{r.sq}&quot;</td><td>~{r.s1} yd</td><td>~{r.s15} yd</td><td>~{r.s2} yd</td><td>~{r.s25} yd</td></tr>))}</tbody>
                    </table></div>
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}