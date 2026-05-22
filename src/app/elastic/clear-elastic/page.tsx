"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Eye, Copy, Printer, ChevronDown, Ruler, BookOpen } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const appTypes = [
    { key: "stabilize", label: "Stabilize (prevent stretch)", ratio: 1.0, note: "Cut SAME length as seam. Do NOT stretch while sewing." },
    { key: "lightStab", label: "Light stabilize (mostly prevent)", ratio: 0.95, note: "Cut 95% of seam length. Minimal gathering." },
    { key: "modGather", label: "Moderate gather", ratio: 0.85, note: "Cut 85% of seam. Subtle gathering effect." },
    { key: "heavyGather", label: "Heavy gather", ratio: 0.75, note: "Cut 75% of seam. Obvious gathering." },
];

const relatedTools = [
    { name: "Waist Elastic Calc", href: "/elastic/waist-calculator", icon: Ruler },
    { name: "Neckline Elastic", href: "/elastic/neckline-calculator", icon: Ruler },
    { name: "Elastic Types Guide", href: "/elastic/types-guide", icon: BookOpen },
];
const faqItems = [
    { q: "What is clear elastic used for?", a: "Two purposes: (1) Stabilizing knit seams (shoulder, neckline) to prevent stretching — cut same length as seam. (2) Gathering (cut shorter) for ruffles and gathered necklines." },
    { q: "Do I stretch clear elastic while sewing for stabilization?", a: "No! For stabilizing, sew the elastic flat at 1:1 ratio. Stretching it while sewing defeats the purpose. Only stretch when intentionally gathering." },
    { q: "Which seams need stabilizing on knit garments?", a: "Shoulder seams (bear garment weight), necklines (prevent growth), and sometimes waistline seams. Side seams usually don't need it." },
];

export default function ClearElasticPage() {
    const [areas, setAreas] = useState([{ name: "Shoulder (left)", length: "", purpose: "stabilize" }, { name: "Shoulder (right)", length: "", purpose: "stabilize" }, { name: "Neckline", length: "", purpose: "stabilize" }]);
    const [activeFaq, setActiveFaq] = useState<number | null>(null); const [copied, setCopied] = useState(false);

    const updateArea = (i: number, field: string, val: string) => { const a = [...areas]; (a[i] as Record<string, string>)[field] = val; setAreas(a); };

    const results = areas.map(a => { const l = parseFloat(a.length) || 0; const app = appTypes.find(t => t.key === a.purpose) || appTypes[0]; return { ...a, seam: l, cut: l * app.ratio, app }; });
    const total = results.reduce((s, r) => s + r.cut, 0);
    const hasResult = results.some(r => r.seam > 0);

    const handleCopy = useCallback(() => { navigator.clipboard.writeText(results.filter(r => r.seam > 0).map(r => `${r.name}: ${r.seam}" seam -> ${r.cut.toFixed(1)}" clear elastic`).join("\n") + `\nTotal: ${total.toFixed(1)}"`); setCopied(true); setTimeout(() => setCopied(false), 2000); }, [results, total]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Elastic", href: "/elastic" }, { label: "Clear Elastic" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><Eye size={14} strokeWidth={1.5} /> Elastic</span><h1>Clear Elastic for Knits Calculator</h1><p>Calculate clear elastic for stabilizing knit seams or creating gathers.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Garment Areas</h2>
                    {areas.map((a, i) => (<div key={i} className="calculator-form" style={{ marginBottom: 12, paddingBottom: 12, borderBottom: i < areas.length - 1 ? "1px solid var(--color-border)" : "none" }}>
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Area</label><input type="text" className="input-field" value={a.name} onChange={e => updateArea(i, "name", e.target.value)} /></div>
                            <div className="input-group"><label className="input-label">Seam Length (inches)</label><input type="number" className="input-field input-mono" placeholder="e.g., 5" value={a.length} onChange={e => updateArea(i, "length", e.target.value)} min="0" step="0.25" /></div>
                            <div className="input-group"><label className="input-label">Purpose</label><select className="input-field" value={a.purpose} onChange={e => updateArea(i, "purpose", e.target.value)}>{appTypes.map(t => <option key={t.key} value={t.key}>{t.label}</option>)}</select></div>
                        </div>
                    </div>))}
                    <button className="btn btn-secondary btn-sm" onClick={() => setAreas([...areas, { name: "", length: "", purpose: "stabilize" }])} style={{ marginTop: 8 }}>+ Add Area</button>
                    {hasResult && (<div><div className="calculator-divider" />
                        <div className={styles.tableWrap}><table className={styles.convTable}><thead><tr><th>Area</th><th>Seam</th><th>Cut Elastic</th><th>Method</th></tr></thead>
                            <tbody>{results.filter(r => r.seam > 0).map((r, i) => (<tr key={i}><td style={{ fontWeight: 600 }}>{r.name}</td><td>{r.seam}&quot;</td><td style={{ fontWeight: 700, color: "var(--color-accent)" }}>{r.cut.toFixed(1)}&quot;</td><td style={{ fontSize: 13 }}>{r.app.note}</td></tr>))}</tbody>
                        </table></div>
                        <div className="result-card" style={{ marginTop: 12 }}><div className="result-prefix">Total Clear Elastic</div><div className="result-value">{total.toFixed(1)}&quot;</div><div className="result-label">Buy {(Math.ceil(total / 36 * 10) / 10).toFixed(1)} yards (+10% buffer)</div></div>
                        <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
                    </div>)}
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}