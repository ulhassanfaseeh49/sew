"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { AlignVerticalSpaceAround, Copy, Printer, ChevronDown, Scissors, Ruler } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const densityRef = [
    { density: "Sparse", strands: "2-3/inch", look: "Bohemian, casual" },
    { density: "Standard", strands: "4-6/inch", look: "Balanced" },
    { density: "Dense", strands: "8-12/inch", look: "Full, luxurious" },
    { density: "Very dense", strands: "15+/inch", look: "Thick, heavy" },
];

const relatedTools = [
    { name: "Tassel Maker", href: "/lace-trim/tassel-maker", icon: Scissors },
    { name: "Pom-Pom Trim", href: "/lace-trim/pom-pom", icon: Scissors },
    { name: "Ribbon Calc", href: "/lace-trim/ribbon", icon: Ruler },
];
const faqItems = [
    { q: "How much fringe do I need?", a: "Measure the edge length, add 1\" per corner for miter/overlap, plus 10-15% buffer. Fringe on curved items needs 5-10% extra." },
    { q: "How do I attach fringe trim?", a: "Sew through the fringe header (the woven band at the top). Position so the header is hidden under or along the fabric edge." },
    { q: "Can I make fringe from fabric?", a: "Yes. Cut woven fabric to desired depth, pull horizontal threads to create fringe. Works best with loosely woven fabrics like linen." },
];

export default function FringePage() {
    const [edges, setEdges] = useState([{ name: "Shawl edge", length: "", qty: "1" }]);
    const [buffer, setBuffer] = useState("15");
    const [activeFaq, setActiveFaq] = useState<number | null>(null); const [copied, setCopied] = useState(false);

    const updateEdge = (i: number, field: string, val: string) => { const e = [...edges]; (e[i] as Record<string, string>)[field] = val; setEdges(e); };

    const rawTotal = edges.reduce((s, e) => s + (parseFloat(e.length) || 0) * (parseInt(e.qty) || 1), 0);
    const bf = parseFloat(buffer) || 0; const withBuffer = rawTotal * (1 + bf / 100);
    const yards = withBuffer / 36; const rounded = Math.ceil(yards * 4) / 4;
    const hasResult = rawTotal > 0;

    const handleCopy = useCallback(() => { navigator.clipboard.writeText(`Fringe: ${rounded} yards (${withBuffer.toFixed(0)}" with ${bf}% buffer)`); setCopied(true); setTimeout(() => setCopied(false), 2000); }, [rounded, withBuffer, bf]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Lace & Trim", href: "/lace-trim" }, { label: "Fringe" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><AlignVerticalSpaceAround size={14} strokeWidth={1.5} /> Lace and Trim</span><h1>Fringe Calculator</h1><p>Calculate fringe yardage for garments, home decor, and accessories.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Fringe Edges</h2>
                    {edges.map((e, i) => (<div key={i} className="calculator-form" style={{ marginBottom: 12, paddingBottom: 12, borderBottom: i < edges.length - 1 ? "1px solid var(--color-border)" : "none" }}>
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Edge</label><input type="text" className="input-field" value={e.name} onChange={ev => updateEdge(i, "name", ev.target.value)} /></div>
                            <div className="input-group"><label className="input-label">Length (in)</label><input type="number" className="input-field input-mono" placeholder="e.g., 72" value={e.length} onChange={ev => updateEdge(i, "length", ev.target.value)} min="0" step="0.5" /></div>
                            <div className="input-group"><label className="input-label">Qty</label><input type="number" className="input-field input-mono" value={e.qty} onChange={ev => updateEdge(i, "qty", ev.target.value)} min="1" style={{ maxWidth: 60 }} /></div>
                        </div>
                    </div>))}
                    <button className="btn btn-secondary btn-sm" onClick={() => setEdges([...edges, { name: "", length: "", qty: "1" }])}>+ Add Edge</button>
                    <div className="input-group" style={{ marginTop: 12 }}><label className="input-label">Buffer %</label><select className="input-field" value={buffer} onChange={e => setBuffer(e.target.value)}><option value="10">10%</option><option value="15">15%</option></select></div>
                    {hasResult && (<div><div className="calculator-divider" />
                        <div className="result-card"><div className="result-prefix">Total Fringe</div><div className="result-value">{rounded} yards</div><div className="result-label">{withBuffer.toFixed(0)}&quot; (with {bf}% buffer)</div></div>
                        <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
                    </div>)}
                </div>
                <div className="calculator-card"><h2 className={styles.sectionTitle}>Fringe Density Guide</h2>
                    <div className={styles.tableWrap}><table className={styles.convTable}><thead><tr><th>Density</th><th>Strands</th><th>Look</th></tr></thead>
                        <tbody>{densityRef.map(r => (<tr key={r.density}><td style={{ fontWeight: 600 }}>{r.density}</td><td>{r.strands}</td><td>{r.look}</td></tr>))}</tbody>
                    </table></div>
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}