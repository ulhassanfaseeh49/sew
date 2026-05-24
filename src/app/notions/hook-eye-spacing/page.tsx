"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Pin, Copy, Printer, ChevronDown, Scissors, Ruler } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const relatedTools = [
    { name: "Snap Spacing", href: "/notions/snap-spacing", icon: Ruler },
    { name: "Button Spacing", href: "/notions/button-spacing", icon: Ruler },
    { name: "Boning Calculator", href: "/costume/boning-calculator", icon: Scissors },
];
const faqItems = [
    { q: "How close should hooks be on a corset?", a: "Corset hooks are typically 1/2 inch apart for modesty panels. Bridal gowns use 3/4 to 1 inch spacing. Waistbands usually need just 1-2 hooks." },
    { q: "What size hook and eye should I use?", a: "Size 0-1 for lightweight fabrics (lingerie). Size 2-3 for medium garments (dresses). Size 3+ for heavy use (corsets, waistbands)." },
    { q: "Should I buy extra hooks and eyes?", a: "Yes -- buy 10% more than calculated. Hooks can bend during application, and having spares prevents project delays." },
];

export default function HookEyeSpacingPage() {
    const [closureLen, setClosureLen] = useState("12"); const [spacing, setSpacing] = useState("0.75");
    const [topOff, setTopOff] = useState("0.5"); const [bottomOff, setBottomOff] = useState("0.5");
    const [activeFaq, setActiveFaq] = useState<number | null>(null); const [copied, setCopied] = useState(false);

    const cl = parseFloat(closureLen) || 0; const sp = parseFloat(spacing) || 0.75;
    const to = parseFloat(topOff) || 0; const bo = parseFloat(bottomOff) || 0;
    const usable = cl - to - bo;
    const numHooks = usable > 0 && sp > 0 ? Math.floor(usable / sp) + 1 : 0;
    const actualSpacing = numHooks > 1 ? usable / (numHooks - 1) : sp;
    const hasResult = cl > 0 && numHooks > 0;
    const toBuy = Math.ceil(numHooks * 1.1);
    const positions: number[] = [];
    for (let i = 0; i < numHooks; i++) { positions.push(to + i * actualSpacing); }

    const handleCopy = useCallback(() => { navigator.clipboard.writeText(`${numHooks} hooks, ${actualSpacing.toFixed(2)}" apart across ${cl}" closure. Buy ${toBuy} sets.`); setCopied(true); setTimeout(() => setCopied(false), 2000); }, [numHooks, actualSpacing, cl, toBuy]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Notions", href: "/notions" }, { label: "Hook & Eye Spacing" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><Pin size={14} strokeWidth={1.5} /> Notions</span><h1>Hook and Eye Spacing Calculator</h1><p>Calculate even hook-and-eye placement for corsets, bodices, waistbands, and bridal wear.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Closure Details</h2>
                    <div className="calculator-form">
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Closure Length (in)</label><input type="number" className="input-field input-mono" value={closureLen} onChange={e => setClosureLen(e.target.value)} min="1" step="0.25" /></div>
                            <div className="input-group"><label className="input-label">Target Spacing (in)</label><select className="input-field" value={spacing} onChange={e => setSpacing(e.target.value)}><option value="0.5">1/2&quot; (tight -- corset)</option><option value="0.75">3/4&quot; (bridal)</option><option value="1">1&quot; (standard)</option><option value="1.5">1.5&quot; (loose)</option></select></div>
                        </div>
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Top Offset (in)</label><input type="number" className="input-field input-mono" value={topOff} onChange={e => setTopOff(e.target.value)} min="0" step="0.25" /></div>
                            <div className="input-group"><label className="input-label">Bottom Offset (in)</label><input type="number" className="input-field input-mono" value={bottomOff} onChange={e => setBottomOff(e.target.value)} min="0" step="0.25" /></div>
                        </div>
                    </div>
                    {hasResult && (<div><div className="calculator-divider" />
                        <div className="result-card"><div className="result-prefix">Hooks Needed</div><div className="result-value">{numHooks} sets</div><div className="result-label">{actualSpacing.toFixed(2)}&quot; apart (buy {toBuy} sets with 10% extra)</div></div>
                        <div className={styles.tableWrap} style={{ marginTop: 12 }}><table className={styles.convTable}><thead><tr><th>Hook #</th><th>From Top</th></tr></thead>
                            <tbody>{positions.map((p, i) => (<tr key={i}><td style={{ fontWeight: 600 }}>#{i + 1}</td><td>{p.toFixed(2)}&quot;</td></tr>))}</tbody>
                        </table></div>
                        <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
                    </div>)}
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}