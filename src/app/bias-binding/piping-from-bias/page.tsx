"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Cylinder, Copy, Printer, ChevronDown, Scissors, BookOpen } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const cordSizes: Record<string, { label: string; dia: number }> = {
    fine: { label: 'Very fine (1/8" / 3mm)', dia: 0.125 },
    standard: { label: 'Standard (1/4" / 6mm)', dia: 0.25 },
    medium: { label: 'Medium (3/8" / 10mm)', dia: 0.375 },
    large: { label: 'Large (1/2" / 12mm)', dia: 0.5 },
    xlarge: { label: 'Extra large (3/4" / 18mm)', dia: 0.75 },
    custom: { label: "Custom diameter", dia: 0 },
};

const pipingRef = [
    { app: "Lightweight garment", cord: '1/8"', strip: '1"' },
    { app: "Standard garment", cord: '1/4"', strip: '1-1/2"' },
    { app: "Cushion", cord: '3/8"', strip: '1-3/4"' },
    { app: "Large cushion", cord: '1/2"', strip: '2"' },
    { app: "Upholstery", cord: '3/4"', strip: '2-1/2"' },
];

const relatedTools = [
    { name: "Tape Width Calc", href: "/bias-binding/tape-width", icon: Scissors },
    { name: "Tape Yardage", href: "/bias-binding/tape-yardage", icon: Scissors },
    { name: "Continuous Bias", href: "/bias-binding/continuous-bias", icon: BookOpen },
];
const faqItems = [
    { q: "How wide do I cut fabric strips to make piping?", a: "Formula: (cord diameter x pi / 2) + (seam allowance x 2). For 1/4\" cord with 1/4\" SA: (0.25 x 3.14 / 2) + 0.5 = approximately 1.5\" wide." },
    { q: "Do I need to pre-wash piping cord?", a: "Cotton cord: YES -- it shrinks. Pre-wash before making piping. Polyester cord: No pre-washing needed." },
    { q: "What size piping cord for cushions?", a: "3/8\" (10mm) is the most popular for throw cushions. 1/2\" for larger or more dramatic piping. 1/4\" for subtle definition." },
];

export default function PipingFromBiasPage() {
    const [cordKey, setCordKey] = useState("standard"); const [customDia, setCustomDia] = useState("");
    const [seamAllow, setSeamAllow] = useState("0.25"); const [totalLen, setTotalLen] = useState("");
    const [activeFaq, setActiveFaq] = useState<number | null>(null); const [copied, setCopied] = useState(false);

    const cs = cordSizes[cordKey]; const dia = cordKey === "custom" ? (parseFloat(customDia) || 0) : cs.dia;
    const sa = parseFloat(seamAllow) || 0.25; const tl = parseFloat(totalLen) || 0;
    const stripWidth = (dia * Math.PI / 2) + (sa * 2);
    const totalWithBuffer = tl * 1.1; // 10% buffer
    const cordYards = totalWithBuffer / 36;
    const hasResult = dia > 0;

    const handleCopy = useCallback(() => { navigator.clipboard.writeText(`Cord: ${dia}" diameter. Cut bias strips: ${stripWidth.toFixed(2)}" wide. ${tl > 0 ? `Total piping: ${totalWithBuffer.toFixed(0)}" (${cordYards.toFixed(1)} yards cord)` : ""}`); setCopied(true); setTimeout(() => setCopied(false), 2000); }, [dia, stripWidth, tl, totalWithBuffer, cordYards]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Bias Binding", href: "/bias-binding" }, { label: "Piping from Bias" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><Cylinder size={14} strokeWidth={1.5} /> Bias Binding</span><h1>Piping from Bias Tape Calculator</h1><p>Calculate bias strip width to cover piping cord and total piping yardage.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Piping Details</h2>
                    <div className="calculator-form">
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Cord Size</label><select className="input-field" value={cordKey} onChange={e => setCordKey(e.target.value)}>{Object.entries(cordSizes).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}</select></div>
                            {cordKey === "custom" && <div className="input-group"><label className="input-label">Custom Diameter (inches)</label><input type="number" className="input-field input-mono" value={customDia} onChange={e => setCustomDia(e.target.value)} min="0" step="0.0625" /></div>}
                            <div className="input-group"><label className="input-label">Seam Allowance</label><select className="input-field" value={seamAllow} onChange={e => setSeamAllow(e.target.value)}><option value="0.25">1/4&quot;</option><option value="0.375">3/8&quot;</option><option value="0.5">1/2&quot;</option></select></div>
                        </div>
                        <div className="input-group"><label className="input-label">Total Piping Length Needed (inches, optional)</label><input type="number" className="input-field input-mono" placeholder="e.g., 80" value={totalLen} onChange={e => setTotalLen(e.target.value)} min="0" step="1" /></div>
                    </div>
                    {hasResult && (<div><div className="calculator-divider" />
                        <div className="result-card"><div className="result-prefix">Cut Bias Strips</div><div className="result-value">{stripWidth.toFixed(2)}&quot; wide</div><div className="result-label">For {dia}&quot; cord with {sa}&quot; seam allowance</div></div>
                        {tl > 0 && (<div className={styles.resultDetails} style={{ marginTop: 12 }}>
                            <div className="result-row"><span className="result-row-label">Piping needed</span><span className="result-row-value">{tl}&quot;</span></div>
                            <div className="result-row"><span className="result-row-label">With 10% buffer</span><span className="result-row-value">{totalWithBuffer.toFixed(0)}&quot;</span></div>
                            <div className="result-row"><span className="result-row-label">Buy cord</span><span className="result-row-value">{cordYards.toFixed(1)} yards</span></div>
                        </div>)}
                        <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
                    </div>)}
                </div>
                <div className="calculator-card"><h2 className={styles.sectionTitle}>Common Piping Size Reference</h2>
                    <div className={styles.tableWrap}><table className={styles.convTable}><thead><tr><th>Application</th><th>Cord Size</th><th>Strip Width (1/4&quot; SA)</th></tr></thead>
                        <tbody>{pipingRef.map(r => (<tr key={r.app}><td style={{ fontWeight: 600 }}>{r.app}</td><td>{r.cord}</td><td>{r.strip}</td></tr>))}</tbody>
                    </table></div>
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}