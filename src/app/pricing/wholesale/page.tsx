"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Package, Copy, Printer, ChevronDown, DollarSign, Calculator } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const relatedTools = [
    { name: "Cost-Plus", href: "/pricing/cost-plus", icon: Calculator },
    { name: "Handmade Pricing", href: "/pricing/handmade-pricing", icon: DollarSign },
    { name: "Profit Margin", href: "/pricing/profit-margin", icon: DollarSign },
];
const faqItems = [
    { q: "What is the standard wholesale discount?", a: "Wholesale is typically 50% of retail. So if retail is $60, wholesale to a shop is $30. The shop doubles it to retail." },
    { q: "Can I still sell at retail if I wholesale?", a: "Yes, but never undercut your retailers. Your direct price should be at or above the retail price shops charge." },
    { q: "What is the minimum order for wholesale?", a: "You set your own minimums. Common: 6+ units or $150+ order. Minimums ensure each wholesale transaction is worth your time." },
];

export default function WholesalePage() {
    const [retailPrice, setRetailPrice] = useState(""); const [totalCost, setTotalCost] = useState("");
    const [wholesalePct, setWholesalePct] = useState("50"); const [minOrder, setMinOrder] = useState("6");
    const [activeFaq, setActiveFaq] = useState<number | null>(null); const [copied, setCopied] = useState(false);

    const rp = parseFloat(retailPrice) || 0; const tc = parseFloat(totalCost) || 0;
    const wpct = parseFloat(wholesalePct) || 50; const mo = parseInt(minOrder) || 6;
    const wholesalePrice = rp * (wpct / 100);
    const wholesaleProfit = wholesalePrice - tc;
    const wholesaleMargin = wholesalePrice > 0 ? (wholesaleProfit / wholesalePrice) * 100 : 0;
    const retailProfit = rp - tc;
    const retailMargin = rp > 0 ? (retailProfit / rp) * 100 : 0;
    const minOrderValue = wholesalePrice * mo;
    const minOrderProfit = wholesaleProfit * mo;
    const hasResult = rp > 0 && tc > 0;

    const tiers = [40, 45, 50, 55, 60].map(p => { const wp = rp * p / 100; return { pct: p, price: wp, profit: wp - tc, margin: wp > 0 ? ((wp - tc) / wp * 100) : 0 }; });

    const handleCopy = useCallback(() => { navigator.clipboard.writeText(`Retail: $${rp}, Wholesale (${wpct}%): $${wholesalePrice.toFixed(2)}, Profit/unit: $${wholesaleProfit.toFixed(2)} (${wholesaleMargin.toFixed(0)}% margin)`); setCopied(true); setTimeout(() => setCopied(false), 2000); }, [rp, wpct, wholesalePrice, wholesaleProfit, wholesaleMargin]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Pricing", href: "/pricing" }, { label: "Wholesale" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><Package size={14} strokeWidth={1.5} /> Pricing</span><h1>Wholesale Pricing Calculator</h1><p>Calculate wholesale pricing, minimum orders, and confirm profitability at lower price points.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Pricing</h2>
                    <div className="calculator-form">
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Retail Price ($)</label><input type="number" className="input-field input-mono" placeholder="e.g., 65" value={retailPrice} onChange={e => setRetailPrice(e.target.value)} min="0" step="0.01" /></div>
                            <div className="input-group"><label className="input-label">Total Cost ($)</label><input type="number" className="input-field input-mono" placeholder="e.g., 25" value={totalCost} onChange={e => setTotalCost(e.target.value)} min="0" step="0.01" /></div>
                            <div className="input-group"><label className="input-label">Wholesale % of Retail</label><select className="input-field" value={wholesalePct} onChange={e => setWholesalePct(e.target.value)}><option value="40">40%</option><option value="45">45%</option><option value="50">50% (standard)</option><option value="55">55%</option><option value="60">60%</option></select></div>
                            <div className="input-group"><label className="input-label">Min Order (units)</label><input type="number" className="input-field input-mono" value={minOrder} onChange={e => setMinOrder(e.target.value)} min="1" /></div>
                        </div>
                    </div>
                    {hasResult && (<div><div className="calculator-divider" />
                        <div className="result-card"><div className="result-prefix">Wholesale Price</div><div className="result-value">${wholesalePrice.toFixed(2)}</div><div className="result-label">Profit: ${wholesaleProfit.toFixed(2)}/unit ({wholesaleMargin.toFixed(0)}% margin)</div></div>
                        {wholesaleProfit <= 0 && <p style={{ margin: "8px 0", padding: 12, fontSize: "var(--text-sm)", borderRadius: 8, background: "rgba(255,0,0,0.1)", color: "var(--color-error)" }}>Wholesale price is at or below cost. You will lose money on wholesale orders.</p>}
                        <div className={styles.resultDetails} style={{ marginTop: 12 }}>
                            <div className="result-row"><span className="result-row-label">Retail profit/unit</span><span className="result-row-value">${retailProfit.toFixed(2)} ({retailMargin.toFixed(0)}%)</span></div>
                            <div className="result-row"><span className="result-row-label">Min order value</span><span className="result-row-value">${minOrderValue.toFixed(2)} ({mo} units)</span></div>
                            <div className="result-row"><span className="result-row-label">Min order profit</span><span className="result-row-value">${minOrderProfit.toFixed(2)}</span></div>
                        </div>
                        <div className="calculator-card" style={{ marginTop: 16 }}><h3 style={{ fontSize: "var(--text-sm)", fontWeight: 600, marginBottom: 8 }}>Wholesale Tier Comparison</h3>
                            <div className={styles.tableWrap}><table className={styles.convTable}><thead><tr><th>% of Retail</th><th>Wholesale Price</th><th>Profit/Unit</th><th>Margin</th></tr></thead>
                                <tbody>{tiers.map(t => (<tr key={t.pct} style={{ background: t.pct === wpct ? "var(--color-surface-hover)" : undefined, color: t.profit <= 0 ? "var(--color-error)" : undefined }}><td style={{ fontWeight: 600 }}>{t.pct}%</td><td>${t.price.toFixed(2)}</td><td>${t.profit.toFixed(2)}</td><td>{t.margin.toFixed(0)}%</td></tr>))}</tbody>
                            </table></div>
                        </div>
                        <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
                    </div>)}
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}