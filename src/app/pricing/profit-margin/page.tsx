"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { TrendingUp, Copy, Printer, ChevronDown, DollarSign, Calculator } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const relatedTools = [
    { name: "Cost-Plus", href: "/pricing/cost-plus", icon: Calculator },
    { name: "Handmade Pricing", href: "/pricing/handmade-pricing", icon: DollarSign },
    { name: "Break-Even", href: "/pricing/break-even", icon: TrendingUp },
];
const faqItems = [
    { q: "What is the difference between margin and markup?", a: "Margin = profit / selling price. Markup = profit / cost. A 50% margin = 100% markup. They describe the same profit differently." },
    { q: "What is a healthy profit margin for handmade?", a: "25-40% is healthy. Below 20% is risky -- one return or mistake wipes out profit. Above 50% is premium territory." },
    { q: "Why does my margin seem low even with high prices?", a: "Materials cost, labor, and platform fees eat into margins. Track all costs carefully -- hidden costs are the usual culprit." },
];

export default function ProfitMarginPage() {
    const [sellingPrice, setSellingPrice] = useState(""); const [totalCost, setTotalCost] = useState("");
    const [activeFaq, setActiveFaq] = useState<number | null>(null); const [copied, setCopied] = useState(false);

    const sp = parseFloat(sellingPrice) || 0; const tc = parseFloat(totalCost) || 0;
    const profit = sp - tc;
    const margin = sp > 0 ? (profit / sp) * 100 : 0;
    const markupPct = tc > 0 ? (profit / tc) * 100 : 0;
    const hasResult = sp > 0 && tc > 0;

    const targets = [15, 20, 25, 30, 40, 50].map(m => ({ margin: m, price: tc / (1 - m / 100), profit: tc / (1 - m / 100) - tc }));

    const handleCopy = useCallback(() => { navigator.clipboard.writeText(`Price: $${sp}, Cost: $${tc}, Profit: $${profit.toFixed(2)} (${margin.toFixed(1)}% margin, ${markupPct.toFixed(0)}% markup)`); setCopied(true); setTimeout(() => setCopied(false), 2000); }, [sp, tc, profit, margin, markupPct]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Pricing", href: "/pricing" }, { label: "Profit Margin" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><TrendingUp size={14} strokeWidth={1.5} /> Pricing</span><h1>Profit Margin Calculator</h1><p>See your actual profit margin, markup %, and what price you need for a target margin.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Your Numbers</h2>
                    <div className="calculator-form"><div className="calculator-form-row">
                        <div className="input-group"><label className="input-label">Selling Price ($)</label><input type="number" className="input-field input-mono" placeholder="e.g., 65" value={sellingPrice} onChange={e => setSellingPrice(e.target.value)} min="0" step="0.01" /></div>
                        <div className="input-group"><label className="input-label">Total Cost ($)</label><input type="number" className="input-field input-mono" placeholder="e.g., 38" value={totalCost} onChange={e => setTotalCost(e.target.value)} min="0" step="0.01" /></div>
                    </div></div>
                    {hasResult && (<div><div className="calculator-divider" />
                        <div className="result-card"><div className="result-prefix">Profit Margin</div><div className="result-value">{margin.toFixed(1)}%</div><div className="result-label">Profit: ${profit.toFixed(2)} | Markup: {markupPct.toFixed(0)}%</div></div>
                        <p style={{ margin: "12px 0 0", padding: 12, fontSize: "var(--text-sm)", borderRadius: 8, background: margin < 20 ? "var(--color-error-bg, rgba(255,0,0,0.1))" : "var(--color-surface-hover)", color: margin < 20 ? "var(--color-error)" : "var(--color-text-secondary)" }}>{margin < 20 ? "Low margin -- one return or mistake eliminates profit." : margin < 35 ? "Moderate margin -- sustainable but build a buffer." : "Healthy margin -- sustainable business pricing."}</p>
                        <div className="calculator-card" style={{ marginTop: 16 }}><h3 style={{ fontSize: "var(--text-sm)", fontWeight: 600, marginBottom: 8 }}>Price Needed for Target Margin</h3>
                            <div className={styles.tableWrap}><table className={styles.convTable}><thead><tr><th>Target Margin</th><th>Selling Price</th><th>Profit</th></tr></thead>
                                <tbody>{targets.map(t => (<tr key={t.margin} style={{ background: Math.abs(t.margin - margin) < 3 ? "var(--color-surface-hover)" : undefined }}><td style={{ fontWeight: 600 }}>{t.margin}%</td><td>${t.price.toFixed(2)}</td><td>${t.profit.toFixed(2)}</td></tr>))}</tbody>
                            </table></div>
                        </div>
                        <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
                    </div>)}
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}