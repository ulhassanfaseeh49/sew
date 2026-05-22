"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Ruler, Copy, Printer, ChevronDown, Scissors, Grid3X3 } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const presets = [
    { label: "36\" (vintage/specialty)", width: 36 },
    { label: "44/45\" (quilting cotton)", width: 44 },
    { label: "54\" (home decor)", width: 54 },
    { label: "58/60\" (garment)", width: 60 },
    { label: "108\" (quilt backing)", width: 108 },
    { label: "118\" (wide decor)", width: 118 },
];

const refTable = [
    { bolt: "44/45\"", selvage: "1/2\" each", usable: "43\"" },
    { bolt: "54\"", selvage: "1/2\" each", usable: "53\"" },
    { bolt: "60\"", selvage: "1/2\" each", usable: "59\"" },
    { bolt: "108\"", selvage: "3/4\" each", usable: "106.5\"" },
];

const relatedTools = [
    { name: "Strip Cutting", href: "/cutting/strip-calculator", icon: Scissors },
    { name: "Square Cutting", href: "/cutting/square-calculator", icon: Grid3X3 },
    { name: "Waste Minimizer", href: "/cutting/waste-minimizer", icon: Ruler },
];
const faqItems = [
    { q: "Why is usable width different from bolt width?", a: "Bolt width includes the selvage (tightly woven edge) on both sides. Selvage cannot be used in projects, so you must subtract it to get the true usable width." },
    { q: "Does pre-washing affect fabric width?", a: "Yes. Cotton can shrink 1-3% in width after washing. A 44\" bolt may measure 42.5-43\" wide after pre-washing." },
    { q: "Should I always remove selvage before cutting?", a: "Yes. Selvage has a different weave, shrinks differently, and creates bulk in seams. Always cut it off before using fabric." },
];

export default function UsableWidthPage() {
    const [fabWidth, setFabWidth] = useState("44"); const [selvage, setSelvage] = useState("0.5"); const [straighten, setStraighten] = useState("0.5");
    const [activeFaq, setActiveFaq] = useState<number | null>(null); const [copied, setCopied] = useState(false);

    const fw = parseFloat(fabWidth) || 44; const sv = parseFloat(selvage) || 0.5; const st = parseFloat(straighten) || 0;
    const usable = fw - sv * 2 - st;
    const hasResult = usable > 0;
    const strips25 = Math.floor(usable / 2.5); const strips35 = Math.floor(usable / 3.5); const strips45 = Math.floor(usable / 4.5);

    const handleCopy = useCallback(() => { navigator.clipboard.writeText(`Usable width: ${usable.toFixed(1)}\" (from ${fw}\" bolt, ${sv}\" selvage/side)`); setCopied(true); setTimeout(() => setCopied(false), 2000); }, [usable, fw, sv]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Cutting Tools", href: "/cutting" }, { label: "Usable Width" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><Ruler size={14} strokeWidth={1.5} /> Cutting</span><h1>Selvage-to-Selvage Usable Width Calculator</h1><p>Calculate the true usable width after selvage removal -- the starting point for all cutting calculations.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Fabric Details</h2>
                    <div className="calculator-form">
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Bolt/Fabric Width (in)</label><select className="input-field" value={fabWidth} onChange={e => setFabWidth(e.target.value)}>{presets.map(p => (<option key={p.width} value={p.width}>{p.label}</option>))}</select></div>
                            <div className="input-group"><label className="input-label">Selvage per Side (in)</label><input type="number" className="input-field input-mono" value={selvage} onChange={e => setSelvage(e.target.value)} min="0" step="0.25" /></div>
                            <div className="input-group"><label className="input-label">Straightening Cut (in)</label><input type="number" className="input-field input-mono" value={straighten} onChange={e => setStraighten(e.target.value)} min="0" step="0.25" /></div>
                        </div>
                    </div>
                    {hasResult && (<div><div className="calculator-divider" />
                        <div className="result-card"><div className="result-prefix">Your Usable Width</div><div className="result-value">{usable.toFixed(1)}&quot;</div><div className="result-label">From {fw}&quot; bolt</div></div>
                        <div className={styles.resultDetails} style={{ marginTop: 12 }}>
                            <div className="result-row"><span className="result-row-label">Bolt width</span><span className="result-row-value">{fw}&quot;</span></div>
                            <div className="result-row"><span className="result-row-label">Selvage removed</span><span className="result-row-value">-{(sv * 2).toFixed(1)}&quot;</span></div>
                            {st > 0 && <div className="result-row"><span className="result-row-label">Straightening</span><span className="result-row-value">-{st}&quot;</span></div>}
                            <div className="result-row"><span className="result-row-label">2.5&quot; strips across</span><span className="result-row-value">{strips25}</span></div>
                            <div className="result-row"><span className="result-row-label">3.5&quot; strips across</span><span className="result-row-value">{strips35}</span></div>
                            <div className="result-row"><span className="result-row-label">4.5&quot; strips across</span><span className="result-row-value">{strips45}</span></div>
                        </div>
                        <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
                    </div>)}
                </div>
                <div className="calculator-card"><h2 className={styles.sectionTitle}>Common Usable Widths</h2>
                    <div className={styles.tableWrap}><table className={styles.convTable}><thead><tr><th>Bolt Width</th><th>Selvage</th><th>Usable Width</th></tr></thead>
                        <tbody>{refTable.map(r => (<tr key={r.bolt}><td style={{ fontWeight: 600 }}>{r.bolt}</td><td>{r.selvage}</td><td>{r.usable}</td></tr>))}</tbody>
                    </table></div>
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}