"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { ArrowUpDown, Copy, Printer, ChevronDown, Pin, Scissors } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const boningTypes = [
    { type: "Spiral steel", flex: "All directions", best: "Curved seams, corsets", width: "6-12mm" },
    { type: "Flat steel", flex: "Forward/back only", best: "Straight seams, heavy structure", width: "6-12mm" },
    { type: "Plastic (Rigilene)", flex: "Very flexible", best: "Strapless gowns, light support", width: "6-12mm" },
    { type: "Spring steel", flex: "Very firm", best: "Traditional corsetry", width: "6-12mm" },
    { type: "Cable ties (DIY)", flex: "Moderate", best: "Budget alternative, costumes", width: "4-8mm" },
];
const relatedTools = [
    { name: "Hook & Eye", href: "/notions/hook-eye-spacing", icon: Pin },
    { name: "Snap Spacing", href: "/notions/snap-spacing", icon: Pin },
    { name: "Thread Yardage", href: "/notions/thread-yardage", icon: Scissors },
];
const faqItems = [
    { q: "How long should boning be?", a: "Seam length minus 1/4\" to 1/2\" at each end. This prevents boning from poking through the fabric at top and bottom edges." },
    { q: "When should I use spiral vs flat steel?", a: "Spiral steel for curved seams (most corset seams). Flat steel for straight vertical seams and center front/back bones." },
    { q: "How do I finish boning ends?", a: "Options: heat-shrink tubing (cleanest), fabric caps, tape caps, or file the ends smooth. Never leave raw steel ends -- they will poke through." },
];

export default function BoningCalcPage() {
    const [numSeams, setNumSeams] = useState("8"); const [seamLen, setSeamLen] = useState("12"); const [endTrim, setEndTrim] = useState("0.5");
    const [activeFaq, setActiveFaq] = useState<number | null>(null); const [copied, setCopied] = useState(false);

    const ns = parseInt(numSeams) || 0; const sl = parseFloat(seamLen) || 0; const et = parseFloat(endTrim) || 0.5;
    const boneLen = sl - et * 2;
    const totalLen = boneLen * ns;
    const totalYards = totalLen / 36;
    const channelLen = sl * ns;
    const hasResult = ns > 0 && sl > 0 && boneLen > 0;

    const handleCopy = useCallback(() => { navigator.clipboard.writeText(`${ns} bones at ${boneLen.toFixed(1)}" each. Total: ${totalYards.toFixed(1)} yards boning + ${(channelLen / 36).toFixed(1)} yards channel.`); setCopied(true); setTimeout(() => setCopied(false), 2000); }, [ns, boneLen, totalYards, channelLen]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Notions", href: "/notions" }, { label: "Boning Calculator" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><ArrowUpDown size={14} strokeWidth={1.5} /> Notions</span><h1>Boning Length and Type Calculator</h1><p>Calculate boning lengths, quantities, and channel requirements for corsets and structured garments.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Garment Details</h2>
                    <div className="calculator-form">
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Number of Bones</label><input type="number" className="input-field input-mono" value={numSeams} onChange={e => setNumSeams(e.target.value)} min="1" /></div>
                            <div className="input-group"><label className="input-label">Seam Length (in)</label><input type="number" className="input-field input-mono" value={seamLen} onChange={e => setSeamLen(e.target.value)} min="1" step="0.25" /></div>
                            <div className="input-group"><label className="input-label">End Trim Each Side (in)</label><input type="number" className="input-field input-mono" value={endTrim} onChange={e => setEndTrim(e.target.value)} min="0.25" step="0.25" /></div>
                        </div>
                    </div>
                    {hasResult && (<div><div className="calculator-divider" />
                        <div className="result-card"><div className="result-prefix">Total Boning</div><div className="result-value">{totalYards.toFixed(1)} yards</div><div className="result-label">{ns} bones at {boneLen.toFixed(1)}&quot; each</div></div>
                        <div className={styles.resultDetails} style={{ marginTop: 12 }}>
                            <div className="result-row"><span className="result-row-label">Bone length (each)</span><span className="result-row-value">{boneLen.toFixed(1)}&quot;</span></div>
                            <div className="result-row"><span className="result-row-label">Total boning</span><span className="result-row-value">{totalLen.toFixed(1)}&quot;</span></div>
                            <div className="result-row"><span className="result-row-label">Channel tape needed</span><span className="result-row-value">{(channelLen / 36).toFixed(1)} yards</span></div>
                        </div>
                        <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
                    </div>)}
                </div>
                <div className="calculator-card"><h2 className={styles.sectionTitle}>Boning Type Comparison</h2>
                    <div className={styles.tableWrap}><table className={styles.convTable}><thead><tr><th>Type</th><th>Flex</th><th>Best For</th><th>Width</th></tr></thead>
                        <tbody>{boningTypes.map(b => (<tr key={b.type}><td style={{ fontWeight: 600 }}>{b.type}</td><td>{b.flex}</td><td>{b.best}</td><td>{b.width}</td></tr>))}</tbody>
                    </table></div>
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}