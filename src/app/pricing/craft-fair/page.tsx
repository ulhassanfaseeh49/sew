"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Store, Copy, Printer, ChevronDown, DollarSign, Calculator } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const relatedTools = [
    { name: "Handmade Pricing", href: "/pricing/handmade-pricing", icon: DollarSign },
    { name: "Etsy Fees", href: "/pricing/etsy-fees", icon: DollarSign },
    { name: "Break-Even", href: "/pricing/break-even", icon: Calculator },
];
const faqItems = [
    { q: "How many items should I bring to a craft fair?", a: "3-5x what you hope to sell. If you want to sell 20 items, bring 60-100. A full booth looks more professional and attracts more buyers." },
    { q: "How do I know if a craft fair is worth attending?", a: "Calculate total costs (booth + travel + time). If potential revenue is less than 3x your costs, it may not be worth it." },
    { q: "Should I offer discounts at the end of the day?", a: "Avoid deep discounts -- they devalue your work. Small bundles or 10% for multiple purchases are better strategies." },
];

export default function CraftFairPage() {
    const [boothCost, setBoothCost] = useState(""); const [travel, setTravel] = useState("0"); const [display, setDisplay] = useState("0");
    const [avgPrice, setAvgPrice] = useState(""); const [avgCost, setAvgCost] = useState("");
    const [hoursAtFair, setHoursAtFair] = useState("8"); const [hourlyRate, setHourlyRate] = useState("25");
    const [activeFaq, setActiveFaq] = useState<number | null>(null); const [copied, setCopied] = useState(false);

    const bc = parseFloat(boothCost) || 0; const tv = parseFloat(travel) || 0; const dp = parseFloat(display) || 0;
    const ap = parseFloat(avgPrice) || 0; const ac = parseFloat(avgCost) || 0; const hf = parseFloat(hoursAtFair) || 8; const hr = parseFloat(hourlyRate) || 25;
    const fixedCosts = bc + tv + dp;
    const timeCost = hf * hr;
    const totalCosts = fixedCosts + timeCost;
    const profitPerItem = ap - ac;
    const breakEven = profitPerItem > 0 ? Math.ceil(totalCosts / profitPerItem) : 0;
    const hasResult = bc > 0 && ap > 0;

    const salesScenarios = [5, 10, 15, 20, 30].map(n => ({ units: n, revenue: n * ap, costs: totalCosts + n * ac, profit: n * ap - totalCosts - n * ac }));

    const handleCopy = useCallback(() => { navigator.clipboard.writeText(`Craft fair: $${fixedCosts} fixed costs + $${timeCost} labor. Break-even: ${breakEven} items at $${ap} avg price.`); setCopied(true); setTimeout(() => setCopied(false), 2000); }, [fixedCosts, timeCost, breakEven, ap]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Pricing", href: "/pricing" }, { label: "Craft Fair" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><Store size={14} strokeWidth={1.5} /> Pricing</span><h1>Craft Fair Pricing Tool</h1><p>Calculate your break-even point and profit projections before committing to a show.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Show Costs</h2>
                    <div className="calculator-form">
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Booth Fee ($)</label><input type="number" className="input-field input-mono" placeholder="e.g., 150" value={boothCost} onChange={e => setBoothCost(e.target.value)} min="0" step="1" /></div>
                            <div className="input-group"><label className="input-label">Travel + Meals ($)</label><input type="number" className="input-field input-mono" value={travel} onChange={e => setTravel(e.target.value)} min="0" /></div>
                            <div className="input-group"><label className="input-label">Display Costs ($)</label><input type="number" className="input-field input-mono" value={display} onChange={e => setDisplay(e.target.value)} min="0" /></div>
                        </div>
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Avg Item Price ($)</label><input type="number" className="input-field input-mono" placeholder="e.g., 45" value={avgPrice} onChange={e => setAvgPrice(e.target.value)} min="0" step="0.01" /></div>
                            <div className="input-group"><label className="input-label">Avg Item Cost ($)</label><input type="number" className="input-field input-mono" placeholder="e.g., 18" value={avgCost} onChange={e => setAvgCost(e.target.value)} min="0" step="0.01" /></div>
                            <div className="input-group"><label className="input-label">Hours at Fair</label><input type="number" className="input-field input-mono" value={hoursAtFair} onChange={e => setHoursAtFair(e.target.value)} min="1" /></div>
                        </div>
                    </div>
                    {hasResult && (<div><div className="calculator-divider" />
                        <div className="result-card"><div className="result-prefix">Break-Even Point</div><div className="result-value">{breakEven} items</div><div className="result-label">Fixed costs: ${fixedCosts} + ${timeCost} labor = ${totalCosts} total outlay</div></div>
                        <div className="calculator-card" style={{ marginTop: 16 }}><h3 style={{ fontSize: "var(--text-sm)", fontWeight: 600, marginBottom: 8 }}>Sales Scenarios</h3>
                            <div className={styles.tableWrap}><table className={styles.convTable}><thead><tr><th>Units Sold</th><th>Revenue</th><th>Total Costs</th><th>Net Profit</th></tr></thead>
                                <tbody>{salesScenarios.map(s => (<tr key={s.units} style={{ color: s.profit < 0 ? "var(--color-error)" : undefined }}><td style={{ fontWeight: 600 }}>{s.units}</td><td>${s.revenue.toFixed(0)}</td><td>${s.costs.toFixed(0)}</td><td>{s.profit >= 0 ? "$" : "-$"}{Math.abs(s.profit).toFixed(0)}</td></tr>))}</tbody>
                            </table></div>
                        </div>
                        <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
                    </div>)}
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}