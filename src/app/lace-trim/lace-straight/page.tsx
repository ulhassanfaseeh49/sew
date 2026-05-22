"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Scissors, Copy, Printer, ChevronDown, Ruler, BookOpen } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const relatedTools = [
    { name: "Gathered Lace", href: "/lace-trim/gathered-lace", icon: Scissors },
    { name: "Lace Insertion", href: "/lace-trim/lace-insertion", icon: Scissors },
    { name: "Rickrack Calc", href: "/lace-trim/rickrack", icon: Ruler },
];
const faqItems = [
    { q: "How much lace do I need for a dress hem?", a: "Measure the hem circumference, add 3-4 inches for joining/overlap, then add 10% safety buffer. For a 60\" hem, buy about 2 yards." },
    { q: "Do I need to pre-wash lace before sewing?", a: "Cotton lace: yes, it can shrink. Polyester lace: generally no. Vintage lace: test a small piece first." },
    { q: "What is galloon lace?", a: "Galloon lace has finished edges on both sides, making it ideal for insertion (sewn between fabric sections). Regular edging lace has one finished edge and one raw header." },
];

export default function LaceStraightPage() {
    const [edges, setEdges] = useState([{ name: "Neckline", length: "", qty: "1" }, { name: "Hem", length: "", qty: "1" }]);
    const [buffer, setBuffer] = useState("10"); const [overlap, setOverlap] = useState("3");
    const [activeFaq, setActiveFaq] = useState<number | null>(null); const [copied, setCopied] = useState(false);

    const updateEdge = (i: number, field: string, val: string) => { const e = [...edges]; (e[i] as Record<string, string>)[field] = val; setEdges(e); };

    const rawTotal = edges.reduce((s, e) => s + (parseFloat(e.length) || 0) * (parseInt(e.qty) || 1), 0);
    const ov = parseFloat(overlap) || 0; const bf = parseFloat(buffer) || 0;
    const withJoins = rawTotal + (edges.filter(e => parseFloat(e.length) > 0).length * ov);
    const withBuffer = withJoins * (1 + bf / 100);
    const totalYards = withBuffer / 36; const roundedYards = Math.ceil(totalYards * 4) / 4;
    const hasResult = rawTotal > 0;

    const handleCopy = useCallback(() => { navigator.clipboard.writeText(`Total lace: ${roundedYards} yards (${withBuffer.toFixed(0)}" including joins and ${bf}% buffer)`); setCopied(true); setTimeout(() => setCopied(false), 2000); }, [roundedYards, withBuffer, bf]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Lace & Trim", href: "/lace-trim" }, { label: "Lace Straight" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><Scissors size={14} strokeWidth={1.5} /> Lace and Trim</span><h1>Lace for Straight Application Calculator</h1><p>Calculate lace yardage for flat application on hems, cuffs, necklines, and edges.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Project Edges</h2>
                    {edges.map((e, i) => (<div key={i} className="calculator-form" style={{ marginBottom: 12, paddingBottom: 12, borderBottom: i < edges.length - 1 ? "1px solid var(--color-border)" : "none" }}>
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Edge Name</label><input type="text" className="input-field" value={e.name} onChange={ev => updateEdge(i, "name", ev.target.value)} /></div>
                            <div className="input-group"><label className="input-label">Length (inches)</label><input type="number" className="input-field input-mono" placeholder="e.g., 22" value={e.length} onChange={ev => updateEdge(i, "length", ev.target.value)} min="0" step="0.5" /></div>
                            <div className="input-group"><label className="input-label">Qty</label><input type="number" className="input-field input-mono" value={e.qty} onChange={ev => updateEdge(i, "qty", ev.target.value)} min="1" style={{ maxWidth: 60 }} /></div>
                        </div>
                    </div>))}
                    <button className="btn btn-secondary btn-sm" onClick={() => setEdges([...edges, { name: "", length: "", qty: "1" }])}>+ Add Edge</button>
                    <div className="calculator-form-row" style={{ marginTop: 12 }}>
                        <div className="input-group"><label className="input-label">Overlap per Join (inches)</label><input type="number" className="input-field input-mono" value={overlap} onChange={e => setOverlap(e.target.value)} min="0" step="0.5" /></div>
                        <div className="input-group"><label className="input-label">Safety Buffer %</label><select className="input-field" value={buffer} onChange={e => setBuffer(e.target.value)}><option value="5">5%</option><option value="10">10%</option><option value="15">15%</option></select></div>
                    </div>
                    {hasResult && (<div><div className="calculator-divider" />
                        <div className="result-card"><div className="result-prefix">Ask For</div><div className="result-value">{roundedYards} yards</div><div className="result-label">{withBuffer.toFixed(0)}&quot; total (edges + joins + {bf}% buffer)</div></div>
                        <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
                    </div>)}
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}