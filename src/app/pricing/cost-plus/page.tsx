"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Percent, Copy, Printer, ChevronDown, DollarSign, Calculator } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const relatedTools = [
    { name: "Handmade Pricing", href: "/pricing/handmade-pricing", icon: DollarSign },
    { name: "Profit Margin", href: "/pricing/profit-margin", icon: Percent },
    { name: "Wholesale", href: "/pricing/wholesale", icon: Calculator },
];
const faqItems = [
    { q: "What is the difference between margin and markup?", a: "Margin is profit as % of selling price ($10 cost, $20 price = 50% margin). Markup is profit as % of cost ($10 cost, $20 price = 100% markup)." },
    { q: "What margin should I target?", a: "30% is standard retail. 20% for wholesale. 40-50% for premium handmade items. Below 20% leaves little room for error." },
    { q: "How do multi-channel prices differ?", a: "Same item, different prices: online retail = full price, craft fair = 80-90%, wholesale to shops = 50%, commissions = 100-120%." },
];

export default function CostPlusPage() {
    const [totalCost, setTotalCost] = useState(""); const [margin, setMargin] = useState("30");
    const [activeFaq, setActiveFaq] = useState<number | null>(null); const [copied, setCopied] = useState(false);

    const cost = parseFloat(totalCost) || 0; const m = parseFloat(margin) || 30;
    const sellingPrice = cost / (1 - m / 100);
    const profitAmt = sellingPrice - cost;
    const markup = cost > 0 ? ((profitAmt / cost) * 100) : 0;
    const hasResult = cost > 0;

    const channels = [
        { name: "Online retail", pct: 1, label: "100%" },
        { name: "Craft fair", pct: 0.9, label: "90%" },
        { name: "Wholesale", pct: 0.5, label: "50%" },
        { name: "Commission", pct: 1.15, label: "115%" },
    ];
    const margins = [10, 20, 30, 40, 50];

    const handleCopy = useCallback(() => { navigator.clipboard.writeText(`Cost: $${cost.toFixed(2)}, Margin: ${m}%, Selling Price: $${sellingPrice.toFixed(2)}, Profit: $${profitAmt.toFixed(2)}`); setCopied(true); setTimeout(() => setCopied(false), 2000); }, [cost, m, sellingPrice, profitAmt]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Pricing", href: "/pricing" }, { label: "Cost-Plus Pricing" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><Percent size={14} strokeWidth={1.5} /> Pricing</span><h1>Cost-Plus Pricing Tool</h1><p>Set consistent, profitable prices by applying a target margin to your total item cost.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Your Costs</h2>
                    <div className="calculator-form">
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Total Item Cost ($)</label><input type="number" className="input-field input-mono" placeholder="e.g., 45" value={totalCost} onChange={e => setTotalCost(e.target.value)} min="0" step="0.01" /></div>
                            <div className="input-group"><label className="input-label">Target Profit Margin %</label><input type="range" min="5" max="70" step="5" value={margin} onChange={e => setMargin(e.target.value)} style={{ width: "100%" }} /><div style={{ textAlign: "center", fontWeight: 600, fontSize: "var(--text-sm)" }}>{margin}%</div></div>
                        </div>
                    </div>
                    {hasResult && (<div><div className="calculator-divider" />
                        <div className="result-card"><div className="result-prefix">Selling Price at {m}% Margin</div><div className="result-value">${sellingPrice.toFixed(2)}</div><div className="result-label">Profit: ${profitAmt.toFixed(2)} ({markup.toFixed(0)}% markup on cost)</div></div>
                        <div className="calculator-card" style={{ marginTop: 16 }}><h3 style={{ fontSize: "var(--text-sm)", fontWeight: 600, marginBottom: 8 }}>Multi-Channel Pricing</h3>
                            <div className={styles.tableWrap}><table className={styles.convTable}><thead><tr><th>Channel</th><th>Price</th><th>Your Profit</th></tr></thead>
                                <tbody>{channels.map(ch => { const p = sellingPrice * ch.pct; return (<tr key={ch.name}><td style={{ fontWeight: 600 }}>{ch.name} ({ch.label})</td><td>${p.toFixed(2)}</td><td>${(p - cost).toFixed(2)}</td></tr>); })}</tbody>
                            </table></div>
                        </div>
                        <div className="calculator-card" style={{ marginTop: 16 }}><h3 style={{ fontSize: "var(--text-sm)", fontWeight: 600, marginBottom: 8 }}>Margin Comparison</h3>
                            <div className={styles.tableWrap}><table className={styles.convTable}><thead><tr><th>Margin</th><th>Selling Price</th><th>Profit</th></tr></thead>
                                <tbody>{margins.map(mg => { const sp = cost / (1 - mg / 100); return (<tr key={mg} style={{ background: mg === m ? "var(--color-surface-hover)" : undefined }}><td style={{ fontWeight: 600 }}>{mg}%</td><td>${sp.toFixed(2)}</td><td>${(sp - cost).toFixed(2)}</td></tr>); })}</tbody>
                            </table></div>
                        </div>
                        <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
                    </div>)}
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}