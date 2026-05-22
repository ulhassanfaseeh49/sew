"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Ruler, Copy, Printer, ChevronDown, Scissors, BookOpen } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const relatedTools = [
    { name: "Tape Width Calc", href: "/bias-binding/tape-width", icon: Scissors },
    { name: "Continuous Bias", href: "/bias-binding/continuous-bias", icon: Scissors },
    { name: "Curves Calculator", href: "/bias-binding/curves", icon: Ruler },
];
const faqItems = [
    { q: "How much bias tape do I need for a neckline?", a: "Measure the neckline edge with a flexible tape measure following the curve. Add 3-4 inches for overlap and joining. Typical adult neckline: 18-24 inches." },
    { q: "Do I need extra tape for curved edges?", a: "Slightly -- curves consume about 3-5% more tape than straight edges. Deep curves or scallops can need 10-15% more." },
    { q: "How much bias tape comes in a store-bought package?", a: "Typically 3 or 4 yards per package. For a full garment with neckline, armholes, and hem, you may need 2-3 packages." },
];

export default function TapeYardagePage() {
    const [edges, setEdges] = useState([{ name: "Neckline", length: "", qty: "1" }, { name: "Armhole", length: "", qty: "2" }]);
    const [buffer, setBuffer] = useState("10"); const [overlap, setOverlap] = useState("3");
    const [activeFaq, setActiveFaq] = useState<number | null>(null); const [copied, setCopied] = useState(false);

    const updateEdge = (i: number, field: string, val: string) => { const e = [...edges]; (e[i] as Record<string, string>)[field] = val; setEdges(e); };

    const rawTotal = edges.reduce((s, e) => s + (parseFloat(e.length) || 0) * (parseInt(e.qty) || 1), 0);
    const ov = parseFloat(overlap) || 0; const bf = parseFloat(buffer) || 0;
    const withOverlap = rawTotal + ov; const withBuffer = withOverlap * (1 + bf / 100);
    const totalYards = withBuffer / 36; const pkgs = Math.ceil(totalYards / 3);
    const hasResult = rawTotal > 0;

    const handleCopy = useCallback(() => { navigator.clipboard.writeText(`Total bias tape: ${withBuffer.toFixed(1)}" (${totalYards.toFixed(2)} yards). Buy ${pkgs} packages (3-yard).`); setCopied(true); setTimeout(() => setCopied(false), 2000); }, [withBuffer, totalYards, pkgs]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Bias Binding", href: "/bias-binding" }, { label: "Tape Yardage" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><Ruler size={14} strokeWidth={1.5} /> Bias Binding</span><h1>Bias Tape Yardage Calculator</h1><p>Calculate how much bias tape you need for any project by adding up all edges.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Project Edges</h2>
                    {edges.map((e, i) => (<div key={i} className="calculator-form" style={{ marginBottom: 12, paddingBottom: 12, borderBottom: i < edges.length - 1 ? "1px solid var(--color-border)" : "none" }}>
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Edge Name</label><input type="text" className="input-field" value={e.name} onChange={ev => updateEdge(i, "name", ev.target.value)} /></div>
                            <div className="input-group"><label className="input-label">Length (inches)</label><input type="number" className="input-field input-mono" placeholder="e.g., 20" value={e.length} onChange={ev => updateEdge(i, "length", ev.target.value)} min="0" step="0.5" /></div>
                            <div className="input-group"><label className="input-label">Qty</label><input type="number" className="input-field input-mono" value={e.qty} onChange={ev => updateEdge(i, "qty", ev.target.value)} min="1" style={{ maxWidth: 60 }} /></div>
                        </div>
                    </div>))}
                    <button className="btn btn-secondary btn-sm" onClick={() => setEdges([...edges, { name: "", length: "", qty: "1" }])}>+ Add Edge</button>
                    <div className="calculator-form-row" style={{ marginTop: 12 }}>
                        <div className="input-group"><label className="input-label">Overlap Allowance (inches)</label><input type="number" className="input-field input-mono" value={overlap} onChange={e => setOverlap(e.target.value)} min="0" step="1" /></div>
                        <div className="input-group"><label className="input-label">Buffer %</label><select className="input-field" value={buffer} onChange={e => setBuffer(e.target.value)}><option value="0">None</option><option value="5">5%</option><option value="10">10%</option><option value="15">15%</option></select></div>
                    </div>
                    {hasResult && (<div><div className="calculator-divider" />
                        <div className="result-card"><div className="result-prefix">Total Bias Tape Needed</div><div className="result-value">{totalYards.toFixed(2)} yards</div><div className="result-label">{withBuffer.toFixed(1)}&quot; total | Buy {pkgs} package{pkgs > 1 ? "s" : ""} (3-yard)</div></div>
                        <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
                    </div>)}
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}