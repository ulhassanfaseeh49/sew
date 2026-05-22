"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Layers, Copy, Printer, ChevronDown, Scissors, Ruler } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const relatedTools = [
    { name: "Lace Straight", href: "/lace-trim/lace-straight", icon: Scissors },
    { name: "Gathered Lace", href: "/lace-trim/gathered-lace", icon: Scissors },
    { name: "Ribbon Calc", href: "/lace-trim/ribbon", icon: Ruler },
];
const faqItems = [
    { q: "What is lace insertion?", a: "Insertion is lace sewn between two fabric sections, with fabric cut away beneath to show the lace through. It requires galloon lace (finished on both edges)." },
    { q: "Does lace insertion change garment size?", a: "Yes! Each row of insertion adds its width to the garment dimension. Three rows of 3/4\" insertion adds 2-1/4\" to the width. Adjust your pattern accordingly." },
    { q: "Can I use regular edging lace for insertion?", a: "No. Insertion requires galloon lace with finished edges on both sides. Edging lace has one raw header edge which cannot be used for insertion." },
];

export default function LaceInsertionPage() {
    const [rows, setRows] = useState([{ name: "Bodice front", length: "", numRows: "1", insertWidth: "0.75" }]);
    const [buffer, setBuffer] = useState("15");
    const [activeFaq, setActiveFaq] = useState<number | null>(null); const [copied, setCopied] = useState(false);

    const updateRow = (i: number, field: string, val: string) => { const r = [...rows]; (r[i] as Record<string, string>)[field] = val; setRows(r); };

    const results = rows.map(r => { const len = parseFloat(r.length) || 0; const nr = parseInt(r.numRows) || 1; const iw = parseFloat(r.insertWidth) || 0.75; const perRow = len + 3; return { ...r, len, nr, iw, perRow, total: perRow * nr, dimAdd: iw * nr }; });
    const rawTotal = results.reduce((s, r) => s + r.total, 0); const bf = parseFloat(buffer) || 0;
    const withBuffer = rawTotal * (1 + bf / 100); const yards = withBuffer / 36; const rounded = Math.ceil(yards * 4) / 4;
    const hasResult = rawTotal > 0;

    const handleCopy = useCallback(() => { navigator.clipboard.writeText(`Insertion lace: ${rounded} yards. ${results.filter(r => r.len > 0).map(r => `${r.name}: ${r.dimAdd.toFixed(2)}" added to dimension`).join(". ")}`); setCopied(true); setTimeout(() => setCopied(false), 2000); }, [rounded, results]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Lace & Trim", href: "/lace-trim" }, { label: "Lace Insertion" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><Layers size={14} strokeWidth={1.5} /> Lace and Trim</span><h1>Lace Insertion Calculator</h1><p>Calculate galloon lace for heirloom insertion rows with garment dimension impact.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Insertion Rows</h2>
                    {rows.map((r, i) => (<div key={i} className="calculator-form" style={{ marginBottom: 12, paddingBottom: 12, borderBottom: i < rows.length - 1 ? "1px solid var(--color-border)" : "none" }}>
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Location</label><input type="text" className="input-field" value={r.name} onChange={ev => updateRow(i, "name", ev.target.value)} /></div>
                            <div className="input-group"><label className="input-label">Seam Length (in)</label><input type="number" className="input-field input-mono" placeholder="e.g., 14" value={r.length} onChange={ev => updateRow(i, "length", ev.target.value)} min="0" step="0.5" /></div>
                            <div className="input-group"><label className="input-label">Rows</label><select className="input-field" value={r.numRows} onChange={ev => updateRow(i, "numRows", ev.target.value)}><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option></select></div>
                            <div className="input-group"><label className="input-label">Lace Width</label><select className="input-field" value={r.insertWidth} onChange={ev => updateRow(i, "insertWidth", ev.target.value)}><option value="0.25">1/4&quot;</option><option value="0.5">1/2&quot;</option><option value="0.75">3/4&quot;</option><option value="1">1&quot;</option><option value="1.5">1-1/2&quot;</option></select></div>
                        </div>
                    </div>))}
                    <button className="btn btn-secondary btn-sm" onClick={() => setRows([...rows, { name: "", length: "", numRows: "1", insertWidth: "0.75" }])}>+ Add Location</button>
                    <div className="input-group" style={{ marginTop: 12 }}><label className="input-label">Safety Buffer %</label><select className="input-field" value={buffer} onChange={e => setBuffer(e.target.value)}><option value="10">10%</option><option value="15">15%</option></select></div>
                    {hasResult && (<div><div className="calculator-divider" />
                        <div className="result-card"><div className="result-prefix">Total Insertion Lace</div><div className="result-value">{rounded} yards</div><div className="result-label">{withBuffer.toFixed(0)}&quot; total (with {bf}% buffer)</div></div>
                        {results.filter(r => r.len > 0).map((r, i) => (<p key={i} style={{ margin: "4px 0", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>{r.name}: {r.nr} row{r.nr > 1 ? "s" : ""} adds {r.dimAdd.toFixed(2)}&quot; to garment dimension</p>))}
                        <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
                    </div>)}
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}