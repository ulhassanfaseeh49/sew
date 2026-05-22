"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Divide, Copy, Printer, ChevronDown, Ruler, BookOpen } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const relatedTools = [
    { name: "Waist Elastic Calc", href: "/elastic/waist-calculator", icon: Ruler },
    { name: "Cuff Elastic Calc", href: "/elastic/cuff-calculator", icon: Ruler },
    { name: "Elastic Types Guide", href: "/elastic/types-guide", icon: BookOpen },
];
const faqItems = [
    { q: "Why is quartering elastic important?", a: "Without quartering, elastic bunches at seams with insufficient gathering elsewhere. Dividing and pinning ensures perfectly even distribution around the garment." },
    { q: "Should I fold or measure to find marks?", a: "Folding is more accurate and faster. Fold elastic in half to find center, then fold again for quarter marks. No measuring needed." },
    { q: "What if my garment has 4 seams?", a: "Align elastic division marks with garment seams. For 4-seam garments, use quarter marks and pin elastic at each seam intersection." },
];

export default function QuarteringToolPage() {
    const [elasticLen, setElasticLen] = useState(""); const [fabricLen, setFabricLen] = useState("");
    const [divisions, setDivisions] = useState("4");
    const [activeFaq, setActiveFaq] = useState<number | null>(null); const [copied, setCopied] = useState(false);

    const el = parseFloat(elasticLen) || 0; const fl = parseFloat(fabricLen) || 0;
    const n = parseInt(divisions) || 4;
    const eachElastic = el / n; const eachFabric = fl / n;
    const gatherRatio = fl > 0 && el > 0 ? (fl / el).toFixed(2) : "0";
    const hasResult = el > 0;

    const marks = Array.from({ length: n }, (_, i) => ({
        num: i + 1,
        elasticPos: (eachElastic * (i + 1)).toFixed(1),
        fabricPos: (eachFabric * (i + 1)).toFixed(1),
    }));

    const handleCopy = useCallback(() => { navigator.clipboard.writeText(`Elastic: ${el}" / ${n} = ${eachElastic.toFixed(1)}" per section. Fabric: ${fl}" / ${n} = ${eachFabric.toFixed(1)}" per section. Ratio: ${gatherRatio}:1`); setCopied(true); setTimeout(() => setCopied(false), 2000); }, [el, fl, n, eachElastic, eachFabric, gatherRatio]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Elastic", href: "/elastic" }, { label: "Quartering Tool" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><Divide size={14} strokeWidth={1.5} /> Elastic</span><h1>Elastic Division / Quartering Tool</h1><p>Calculate even distribution marks for elastic and fabric alignment.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Division Settings</h2>
                    <div className="calculator-form">
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Elastic Length (inches)</label><input type="number" className="input-field input-mono" placeholder="e.g., 28" value={elasticLen} onChange={e => setElasticLen(e.target.value)} min="0" step="0.5" /></div>
                            <div className="input-group"><label className="input-label">Fabric Circumference (inches)</label><input type="number" className="input-field input-mono" placeholder="e.g., 36" value={fabricLen} onChange={e => setFabricLen(e.target.value)} min="0" step="0.5" /></div>
                        </div>
                        <div className="input-group"><label className="input-label">Number of Divisions</label><select className="input-field" value={divisions} onChange={e => setDivisions(e.target.value)}><option value="3">3 (thirds)</option><option value="4">4 (quarters - most common)</option><option value="6">6 (sixths)</option><option value="8">8 (eighths)</option></select></div>
                    </div>
                    {hasResult && (<div><div className="calculator-divider" />
                        <div className="result-card"><div className="result-prefix">Each Section</div><div className="result-value">{eachElastic.toFixed(1)}&quot; elastic per section</div><div className="result-label">{fl > 0 ? `${eachFabric.toFixed(1)}" fabric per section. Gather ratio: ${gatherRatio}:1` : `${n} equal sections of ${eachElastic.toFixed(1)}"`}</div></div>
                        {fl > 0 && (<div className={styles.tableWrap} style={{ marginTop: 12 }}><table className={styles.convTable}><thead><tr><th>Mark</th><th>Elastic Position</th><th>Fabric Position</th><th>Action</th></tr></thead>
                            <tbody>{marks.map(m => (<tr key={m.num}><td>Mark {m.num}</td><td>{m.elasticPos}&quot;</td><td>{m.fabricPos}&quot;</td><td>{m.num === n ? "Join point" : "Pin here"}</td></tr>))}</tbody>
                        </table></div>)}
                        <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
                    </div>)}
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}