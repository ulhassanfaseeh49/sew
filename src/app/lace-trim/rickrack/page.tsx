"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Zap, Copy, Printer, ChevronDown, Scissors, Ruler } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const sizeRef = [
    { size: '3/16" (Baby)', best: "Baby items, fine detail" },
    { size: '1/4" (Small)', best: "Light decoration" },
    { size: '1/2" (Medium)', best: "General use, most projects" },
    { size: '5/8" (Large)', best: "Bold statement, home decor" },
    { size: '1" (Jumbo)', best: "Quilts, large home decor" },
    { size: '1-1/2" (Giant)', best: "Specialty, statement pieces" },
];

const relatedTools = [
    { name: "Ribbon Calc", href: "/lace-trim/ribbon", icon: Scissors },
    { name: "Lace Straight", href: "/lace-trim/lace-straight", icon: Scissors },
    { name: "Pom-Pom Trim", href: "/lace-trim/pom-pom", icon: Ruler },
];
const faqItems = [
    { q: "How much rickrack do I need?", a: "Measure all edges, add 1/2\" to 1\" per corner, plus 10% buffer. Rickrack is forgiving -- it stretches slightly so exact amounts are not critical." },
    { q: "What size rickrack is most common?", a: "Medium (1/2\") is the most popular size for general sewing. It works on garments, bags, quilts, and home decor." },
    { q: "Can rickrack be pre-washed?", a: "Yes, cotton rickrack should be pre-washed before applying to pre-washed garments. Polyester rickrack generally does not need pre-washing." },
];

export default function RickrackPage() {
    const [edges, setEdges] = useState([{ name: "Dress hem", length: "", qty: "1", corners: "0" }]);
    const [buffer, setBuffer] = useState("10");
    const [activeFaq, setActiveFaq] = useState<number | null>(null); const [copied, setCopied] = useState(false);

    const updateEdge = (i: number, field: string, val: string) => { const e = [...edges]; (e[i] as Record<string, string>)[field] = val; setEdges(e); };

    const results = edges.map(e => { const l = parseFloat(e.length) || 0; const q = parseInt(e.qty) || 1; const c = parseInt(e.corners) || 0; return { ...e, l, q, c, total: (l + c * 0.5) * q }; });
    const rawTotal = results.reduce((s, r) => s + r.total, 0); const bf = parseFloat(buffer) || 0;
    const withBuffer = rawTotal * (1 + bf / 100); const yards = withBuffer / 36; const pkgs = Math.ceil(yards / 3);
    const hasResult = rawTotal > 0;

    const handleCopy = useCallback(() => { navigator.clipboard.writeText(`Rickrack: ${yards.toFixed(1)} yards. Buy ${pkgs} package(s) of 3 yards.`); setCopied(true); setTimeout(() => setCopied(false), 2000); }, [yards, pkgs]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Lace & Trim", href: "/lace-trim" }, { label: "Rickrack" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><Zap size={14} strokeWidth={1.5} /> Lace and Trim</span><h1>Rickrack Yardage Calculator</h1><p>Calculate rickrack trim yardage for any project with corner allowances.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Project Edges</h2>
                    {edges.map((e, i) => (<div key={i} className="calculator-form" style={{ marginBottom: 12, paddingBottom: 12, borderBottom: i < edges.length - 1 ? "1px solid var(--color-border)" : "none" }}>
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Edge</label><input type="text" className="input-field" value={e.name} onChange={ev => updateEdge(i, "name", ev.target.value)} /></div>
                            <div className="input-group"><label className="input-label">Length (in)</label><input type="number" className="input-field input-mono" placeholder="e.g., 56" value={e.length} onChange={ev => updateEdge(i, "length", ev.target.value)} min="0" step="0.5" /></div>
                            <div className="input-group"><label className="input-label">Corners</label><input type="number" className="input-field input-mono" value={e.corners} onChange={ev => updateEdge(i, "corners", ev.target.value)} min="0" style={{ maxWidth: 60 }} /></div>
                            <div className="input-group"><label className="input-label">Qty</label><input type="number" className="input-field input-mono" value={e.qty} onChange={ev => updateEdge(i, "qty", ev.target.value)} min="1" style={{ maxWidth: 60 }} /></div>
                        </div>
                    </div>))}
                    <button className="btn btn-secondary btn-sm" onClick={() => setEdges([...edges, { name: "", length: "", qty: "1", corners: "0" }])}>+ Add Edge</button>
                    <div className="input-group" style={{ marginTop: 12 }}><label className="input-label">Buffer %</label><select className="input-field" value={buffer} onChange={e => setBuffer(e.target.value)}><option value="5">5%</option><option value="10">10%</option></select></div>
                    {hasResult && (<div><div className="calculator-divider" />
                        <div className="result-card"><div className="result-prefix">Total Rickrack</div><div className="result-value">{yards.toFixed(1)} yards</div><div className="result-label">Buy {pkgs} package{pkgs > 1 ? "s" : ""} (3-yard)</div></div>
                        <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
                    </div>)}
                </div>
                <div className="calculator-card"><h2 className={styles.sectionTitle}>Rickrack Size Guide</h2>
                    <div className={styles.tableWrap}><table className={styles.convTable}><thead><tr><th>Size</th><th>Best For</th></tr></thead>
                        <tbody>{sizeRef.map(r => (<tr key={r.size}><td style={{ fontWeight: 600 }}>{r.size}</td><td>{r.best}</td></tr>))}</tbody>
                    </table></div>
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}