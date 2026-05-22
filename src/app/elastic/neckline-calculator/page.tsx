"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Ruler, Copy, Printer, ChevronDown, BookOpen } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const infantRef = [
    { age: "Newborn", head: "13-14" }, { age: "3 months", head: "15-16" },
    { age: "6 months", head: "16-17" }, { age: "12 months", head: "17-18" },
    { age: "2 years", head: "18-19" },
];

const relatedTools = [
    { name: "Waist Elastic Calc", href: "/elastic/waist-calculator", icon: Ruler },
    { name: "Cuff Elastic Calc", href: "/elastic/cuff-calculator", icon: Ruler },
    { name: "Elastic Types Guide", href: "/elastic/types-guide", icon: BookOpen },
];
const faqItems = [
    { q: "How do I calculate neckline elastic?", a: "Measure the neckline opening, then cut elastic to 80-90% of that measurement. Always verify the stretched elastic can pass over the head." },
    { q: "Why is head circumference important for necklines?", a: "Unless the garment has button/snap closures, the neckline must stretch over the head. Head circumference is the key constraint, not neck size." },
    { q: "Do infant necklines need special consideration?", a: "Yes -- infants have proportionally large heads relative to their bodies. Always check the head passage or use shoulder snap/envelope necklines." },
];

export default function NecklineElasticPage() {
    const [necklineOpening, setNecklineOpening] = useState(""); const [headCirc, setHeadCirc] = useState("");
    const [appType, setAppType] = useState("casing"); const [fit, setFit] = useState("standard");
    const [activeFaq, setActiveFaq] = useState<number | null>(null); const [copied, setCopied] = useState(false);

    const no = parseFloat(necklineOpening) || 0; const hc = parseFloat(headCirc) || 0;
    const ratio = fit === "snug" ? 0.80 : fit === "relaxed" ? 0.90 : 0.85;
    const cutElastic = no * ratio;
    const maxStretch = cutElastic / 0.5;
    const headPass = hc > 0 ? maxStretch >= hc : null;
    const hasResult = no > 0;

    const handleCopy = useCallback(() => { navigator.clipboard.writeText(`Neckline: ${no}", cut elastic: ${cutElastic.toFixed(1)}" (${appType}, ${fit} fit)`); setCopied(true); setTimeout(() => setCopied(false), 2000); }, [no, cutElastic, appType, fit]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Elastic", href: "/elastic" }, { label: "Neckline Calculator" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><Ruler size={14} strokeWidth={1.5} /> Elastic</span><h1>Neckline Elastic Calculator</h1><p>Calculate elastic length for necklines with head passage verification.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Neckline Details</h2>
                    <div className="calculator-form">
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Neckline Opening (inches)</label><input type="number" className="input-field input-mono" placeholder="e.g., 28" value={necklineOpening} onChange={e => setNecklineOpening(e.target.value)} min="0" step="0.5" /></div>
                            <div className="input-group"><label className="input-label">Head Circumference (inches)</label><input type="number" className="input-field input-mono" placeholder="For passage check" value={headCirc} onChange={e => setHeadCirc(e.target.value)} min="0" step="0.5" /></div>
                        </div>
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Application</label><select className="input-field" value={appType} onChange={e => setAppType(e.target.value)}><option value="casing">In a casing</option><option value="direct">Sewn directly</option><option value="foe">Fold-Over Elastic (FOE)</option></select></div>
                            <div className="input-group"><label className="input-label">Fit</label><select className="input-field" value={fit} onChange={e => setFit(e.target.value)}><option value="snug">Snug (close to neck)</option><option value="standard">Standard (comfortable)</option><option value="relaxed">Relaxed (looser)</option></select></div>
                        </div>
                    </div>
                    {hasResult && (<div><div className="calculator-divider" />
                        <div className="result-card"><div className="result-prefix">Cut Elastic Length</div><div className="result-value">{cutElastic.toFixed(1)}&quot;</div><div className="result-label">{no}&quot; neckline x {(ratio * 100).toFixed(0)}% = {cutElastic.toFixed(1)}&quot;</div></div>
                        {headPass !== null && (<p style={{ marginTop: 12, padding: "12px 16px", borderRadius: 8, fontSize: "var(--text-sm)", fontWeight: 600, background: headPass ? "#dcfce7" : "#fecaca", color: headPass ? "#166534" : "#991b1b" }}>{headPass ? `Head passage OK -- stretches to ${maxStretch.toFixed(1)}" (head: ${hc}")` : `Warning: neckline only stretches to ${maxStretch.toFixed(1)}" but head is ${hc}". Cannot pull garment on!`}</p>)}
                        <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
                    </div>)}
                </div>
                <div className="calculator-card"><h2 className={styles.sectionTitle}>Infant Head Circumference Reference</h2>
                    <div className={styles.tableWrap}><table className={styles.convTable}><thead><tr><th>Age</th><th>Head Circumference</th></tr></thead>
                        <tbody>{infantRef.map(r => (<tr key={r.age}><td style={{ fontWeight: 600 }}>{r.age}</td><td>{r.head}&quot;</td></tr>))}</tbody>
                    </table></div>
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}