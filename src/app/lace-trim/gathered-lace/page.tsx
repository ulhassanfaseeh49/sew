"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Waves, Copy, Printer, ChevronDown, Scissors, Ruler } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const fullnessRef = [
    { ratio: "1.5x", desc: "Light ruffle", effect: "Gentle, soft", for18: '27"' },
    { ratio: "2x", desc: "Standard", effect: "Classic gathered look", for18: '36"' },
    { ratio: "2.5x", desc: "Fuller", effect: "Romantic, substantial", for18: '45"' },
    { ratio: "3x", desc: "Very full", effect: "Dramatic, heirloom", for18: '54"' },
    { ratio: "4x", desc: "Maximum", effect: "Victorian, very dramatic", for18: '72"' },
];

const relatedTools = [
    { name: "Lace Straight", href: "/lace-trim/lace-straight", icon: Scissors },
    { name: "Lace Insertion", href: "/lace-trim/lace-insertion", icon: Scissors },
    { name: "Ribbon Calc", href: "/lace-trim/ribbon", icon: Ruler },
];
const faqItems = [
    { q: "How much fullness is needed for gathered lace?", a: "2x (double) is standard for a classic gathered look. 1.5x for subtle gathering, 3x for heirloom/Victorian fullness. Always test on a scrap first." },
    { q: "Why does gathered lace use so much more than flat?", a: "Gathering compresses lace to create fullness. At 2x ratio, you need twice the lace of the finished edge. At 3x, triple. It adds up fast on multi-edge garments." },
    { q: "What is the difference between gathered and pre-gathered lace?", a: "Gathered: you buy flat lace and gather it yourself. Pre-gathered: factory-gathered with fullness built in, buy same length as your edge." },
];

export default function GatheredLacePage() {
    const [edges, setEdges] = useState([{ name: "Collar", length: "", ratio: "2", qty: "1" }]);
    const [buffer, setBuffer] = useState("15");
    const [activeFaq, setActiveFaq] = useState<number | null>(null); const [copied, setCopied] = useState(false);

    const updateEdge = (i: number, field: string, val: string) => { const e = [...edges]; (e[i] as Record<string, string>)[field] = val; setEdges(e); };

    const results = edges.map(e => { const len = parseFloat(e.length) || 0; const r = parseFloat(e.ratio) || 2; const q = parseInt(e.qty) || 1; return { ...e, len, r, q, lace: len * r * q }; });
    const rawTotal = results.reduce((s, r) => s + r.lace, 0); const bf = parseFloat(buffer) || 0;
    const withBuffer = rawTotal * (1 + bf / 100); const yards = withBuffer / 36; const rounded = Math.ceil(yards * 4) / 4;
    const hasResult = rawTotal > 0;

    const handleCopy = useCallback(() => { navigator.clipboard.writeText(`Gathered lace: ${rounded} yards (${withBuffer.toFixed(0)}" with ${bf}% buffer)`); setCopied(true); setTimeout(() => setCopied(false), 2000); }, [rounded, withBuffer, bf]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Lace & Trim", href: "/lace-trim" }, { label: "Gathered Lace" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><Waves size={14} strokeWidth={1.5} /> Lace and Trim</span><h1>Gathered Lace Calculator</h1><p>Calculate lace yardage for gathered or ruffled application with fullness ratios.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Gathered Edges</h2>
                    {edges.map((e, i) => (<div key={i} className="calculator-form" style={{ marginBottom: 12, paddingBottom: 12, borderBottom: i < edges.length - 1 ? "1px solid var(--color-border)" : "none" }}>
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Edge</label><input type="text" className="input-field" value={e.name} onChange={ev => updateEdge(i, "name", ev.target.value)} /></div>
                            <div className="input-group"><label className="input-label">Length (inches)</label><input type="number" className="input-field input-mono" placeholder="e.g., 18" value={e.length} onChange={ev => updateEdge(i, "length", ev.target.value)} min="0" step="0.5" /></div>
                            <div className="input-group"><label className="input-label">Fullness</label><select className="input-field" value={e.ratio} onChange={ev => updateEdge(i, "ratio", ev.target.value)}><option value="1.5">1.5x (light)</option><option value="2">2x (standard)</option><option value="2.5">2.5x (full)</option><option value="3">3x (very full)</option><option value="4">4x (Victorian)</option></select></div>
                            <div className="input-group"><label className="input-label">Qty</label><input type="number" className="input-field input-mono" value={e.qty} onChange={ev => updateEdge(i, "qty", ev.target.value)} min="1" style={{ maxWidth: 60 }} /></div>
                        </div>
                    </div>))}
                    <button className="btn btn-secondary btn-sm" onClick={() => setEdges([...edges, { name: "", length: "", ratio: "2", qty: "1" }])}>+ Add Edge</button>
                    <div className="input-group" style={{ marginTop: 12 }}><label className="input-label">Safety Buffer %</label><select className="input-field" value={buffer} onChange={e => setBuffer(e.target.value)}><option value="10">10%</option><option value="15">15%</option><option value="20">20%</option></select></div>
                    {hasResult && (<div><div className="calculator-divider" />
                        <div className="result-card"><div className="result-prefix">Total Gathered Lace</div><div className="result-value">{rounded} yards</div><div className="result-label">{withBuffer.toFixed(0)}&quot; (raw: {rawTotal.toFixed(0)}&quot; + {bf}% buffer)</div></div>
                        <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
                    </div>)}
                </div>
                <div className="calculator-card"><h2 className={styles.sectionTitle}>Fullness Ratio Guide</h2>
                    <div className={styles.tableWrap}><table className={styles.convTable}><thead><tr><th>Ratio</th><th>Description</th><th>Visual Effect</th><th>For 18&quot; Edge</th></tr></thead>
                        <tbody>{fullnessRef.map(r => (<tr key={r.ratio}><td style={{ fontWeight: 600 }}>{r.ratio}</td><td>{r.desc}</td><td>{r.effect}</td><td>{r.for18}</td></tr>))}</tbody>
                    </table></div>
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}