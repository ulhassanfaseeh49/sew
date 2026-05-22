"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Cylinder, Copy, Printer, ChevronDown, Scissors, Ruler } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const pipingSizeRef = [
    { project: "Dress/garment", cord: '1/8"-1/4"', note: "Subtle definition" },
    { project: "Small cushion", cord: '1/4"', note: "Standard" },
    { project: "Standard cushion", cord: '3/8"', note: "Good definition" },
    { project: "Large cushion", cord: '1/2"', note: "Bold edge" },
    { project: "Upholstery", cord: '1/2"-3/4"', note: "Professional look" },
];

const relatedTools = [
    { name: "Piping from Bias", href: "/bias-binding/piping-from-bias", icon: Scissors },
    { name: "Lace Straight", href: "/lace-trim/lace-straight", icon: Scissors },
    { name: "Ribbon Calc", href: "/lace-trim/ribbon", icon: Ruler },
];
const faqItems = [
    { q: "How much piping do I need for a cushion?", a: "Measure the perimeter: (width + length) x 2. Add 4-6 inches for joining at start/end, plus 10% buffer." },
    { q: "Is it cheaper to make piping or buy it?", a: "For small amounts (under 2 yards), buying pre-made is easier and often cheaper. For larger projects or exact fabric matching, making your own is better value." },
    { q: "What size piping cord for cushions?", a: "3/8\" is most popular for throw cushions. 1/2\" for larger or more dramatic piping. 1/4\" for subtle definition." },
];

export default function PipingCoveragePage() {
    const [edges, setEdges] = useState([{ name: "Cushion perimeter", length: "", qty: "1" }]);
    const [buffer, setBuffer] = useState("10");
    const [activeFaq, setActiveFaq] = useState<number | null>(null); const [copied, setCopied] = useState(false);

    const updateEdge = (i: number, field: string, val: string) => { const e = [...edges]; (e[i] as Record<string, string>)[field] = val; setEdges(e); };

    const rawTotal = edges.reduce((s, e) => s + (parseFloat(e.length) || 0) * (parseInt(e.qty) || 1), 0);
    const bf = parseFloat(buffer) || 0; const withBuffer = rawTotal * (1 + bf / 100);
    const yards = withBuffer / 36; const rounded = Math.ceil(yards * 4) / 4;
    const hasResult = rawTotal > 0;

    const handleCopy = useCallback(() => { navigator.clipboard.writeText(`Piping: ${rounded} yards (${withBuffer.toFixed(0)}")`); setCopied(true); setTimeout(() => setCopied(false), 2000); }, [rounded, withBuffer]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Lace & Trim", href: "/lace-trim" }, { label: "Piping Coverage" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><Cylinder size={14} strokeWidth={1.5} /> Lace and Trim</span><h1>Piping Coverage Calculator</h1><p>Quick piping yardage reference for edge finishing on any project.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Piping Edges</h2>
                    {edges.map((e, i) => (<div key={i} className="calculator-form" style={{ marginBottom: 12, paddingBottom: 12, borderBottom: i < edges.length - 1 ? "1px solid var(--color-border)" : "none" }}>
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Edge</label><input type="text" className="input-field" value={e.name} onChange={ev => updateEdge(i, "name", ev.target.value)} /></div>
                            <div className="input-group"><label className="input-label">Length (in)</label><input type="number" className="input-field input-mono" placeholder="e.g., 68" value={e.length} onChange={ev => updateEdge(i, "length", ev.target.value)} min="0" step="0.5" /></div>
                            <div className="input-group"><label className="input-label">Qty</label><input type="number" className="input-field input-mono" value={e.qty} onChange={ev => updateEdge(i, "qty", ev.target.value)} min="1" style={{ maxWidth: 60 }} /></div>
                        </div>
                    </div>))}
                    <button className="btn btn-secondary btn-sm" onClick={() => setEdges([...edges, { name: "", length: "", qty: "1" }])}>+ Add Edge</button>
                    <div className="input-group" style={{ marginTop: 12 }}><label className="input-label">Buffer %</label><select className="input-field" value={buffer} onChange={e => setBuffer(e.target.value)}><option value="10">10%</option><option value="15">15%</option></select></div>
                    {hasResult && (<div><div className="calculator-divider" />
                        <div className="result-card"><div className="result-prefix">Total Piping</div><div className="result-value">{rounded} yards</div><div className="result-label">{withBuffer.toFixed(0)}&quot; (with {bf}% buffer)</div></div>
                        <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
                    </div>)}
                </div>
                <div className="calculator-card"><h2 className={styles.sectionTitle}>Piping Size Guide</h2>
                    <div className={styles.tableWrap}><table className={styles.convTable}><thead><tr><th>Project</th><th>Cord Size</th><th>Notes</th></tr></thead>
                        <tbody>{pipingSizeRef.map(r => (<tr key={r.project}><td style={{ fontWeight: 600 }}>{r.project}</td><td>{r.cord}</td><td>{r.note}</td></tr>))}</tbody>
                    </table></div>
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}