"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Target, Copy, Printer, ChevronDown, DollarSign, Calculator } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const relatedTools = [
    { name: "Profit Margin", href: "/pricing/profit-margin", icon: DollarSign },
    { name: "Craft Fair", href: "/pricing/craft-fair", icon: Calculator },
    { name: "Hourly Rate", href: "/pricing/hourly-rate", icon: Calculator },
];
const faqItems = [
    { q: "What is a break-even point?", a: "The number of units you must sell before you start making a profit. Below break-even, your fixed costs exceed your revenue." },
    { q: "How do I lower my break-even point?", a: "Three ways: reduce fixed costs, increase price per unit, or decrease variable cost per unit. This analysis helps identify the best lever." },
    { q: "Should I include my time as a fixed cost?", a: "Yes, if you pay yourself a salary. If you pay yourself per-item, include it in variable costs instead." },
];

export default function BreakEvenPage() {
    const [fixedCosts, setFixedCosts] = useState(""); const [pricePerUnit, setPricePerUnit] = useState(""); const [costPerUnit, setCostPerUnit] = useState("");
    const [activeFaq, setActiveFaq] = useState<number | null>(null); const [copied, setCopied] = useState(false);

    const fc = parseFloat(fixedCosts) || 0; const ppu = parseFloat(pricePerUnit) || 0; const cpu = parseFloat(costPerUnit) || 0;
    const contribution = ppu - cpu;
    const breakEvenUnits = contribution > 0 ? Math.ceil(fc / contribution) : 0;
    const breakEvenRevenue = breakEvenUnits * ppu;
    const hasResult = fc > 0 && ppu > 0 && ppu > cpu;

    const unitRange = hasResult ? [1, 5, 10, breakEvenUnits, breakEvenUnits + 5, breakEvenUnits + 10, breakEvenUnits * 2].filter((v, i, a) => a.indexOf(v) === i).sort((a, b) => a - b) : [];

    const handleCopy = useCallback(() => { navigator.clipboard.writeText(`Break-even: ${breakEvenUnits} units ($${breakEvenRevenue.toFixed(0)} revenue). Fixed: $${fc}, contribution/unit: $${contribution.toFixed(2)}.`); setCopied(true); setTimeout(() => setCopied(false), 2000); }, [breakEvenUnits, breakEvenRevenue, fc, contribution]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Pricing", href: "/pricing" }, { label: "Break-Even" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><Target size={14} strokeWidth={1.5} /> Pricing</span><h1>Break-Even Calculator</h1><p>Find out exactly how many items you need to sell to cover all your costs and start profiting.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Costs and Revenue</h2>
                    <div className="calculator-form"><div className="calculator-form-row">
                        <div className="input-group"><label className="input-label">Fixed Costs ($)</label><input type="number" className="input-field input-mono" placeholder="e.g., 500" value={fixedCosts} onChange={e => setFixedCosts(e.target.value)} min="0" /><span style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>Rent, equipment, booth fee, etc.</span></div>
                        <div className="input-group"><label className="input-label">Selling Price / Unit ($)</label><input type="number" className="input-field input-mono" placeholder="e.g., 45" value={pricePerUnit} onChange={e => setPricePerUnit(e.target.value)} min="0" step="0.01" /></div>
                        <div className="input-group"><label className="input-label">Variable Cost / Unit ($)</label><input type="number" className="input-field input-mono" placeholder="e.g., 18" value={costPerUnit} onChange={e => setCostPerUnit(e.target.value)} min="0" step="0.01" /><span style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>Materials + labor per item</span></div>
                    </div></div>
                    {hasResult && (<div><div className="calculator-divider" />
                        <div className="result-card"><div className="result-prefix">Break-Even Point</div><div className="result-value">{breakEvenUnits} units</div><div className="result-label">${breakEvenRevenue.toFixed(0)} revenue needed (contribution: ${contribution.toFixed(2)}/unit)</div></div>
                        <div className={styles.tableWrap} style={{ marginTop: 12 }}><table className={styles.convTable}><thead><tr><th>Units</th><th>Revenue</th><th>Total Cost</th><th>Profit</th></tr></thead>
                            <tbody>{unitRange.map(u => { const rev = u * ppu; const cost = fc + u * cpu; const prof = rev - cost; return (<tr key={u} style={{ background: u === breakEvenUnits ? "var(--color-surface-hover)" : undefined, color: prof < 0 ? "var(--color-error)" : undefined }}><td style={{ fontWeight: 600 }}>{u}{u === breakEvenUnits ? " (BE)" : ""}</td><td>${rev.toFixed(0)}</td><td>${cost.toFixed(0)}</td><td>{prof >= 0 ? "$" : "-$"}{Math.abs(prof).toFixed(0)}</td></tr>); })}</tbody>
                        </table></div>
                        <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
                    </div>)}
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}