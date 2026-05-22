"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Receipt, Copy, Printer, ChevronDown, DollarSign, Calculator } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const relatedTools = [
    { name: "Hourly Rate", href: "/pricing/hourly-rate", icon: DollarSign },
    { name: "Profit Margin", href: "/pricing/profit-margin", icon: Calculator },
    { name: "Handmade Pricing", href: "/pricing/handmade-pricing", icon: DollarSign },
];
const faqItems = [
    { q: "Do I need to pay self-employment tax?", a: "In the US, if you earn $400+ from self-employment, you owe 15.3% SE tax (Social Security + Medicare) in addition to income tax." },
    { q: "What sewing expenses are tax deductible?", a: "Materials, equipment, workspace (home office), software, education, shipping supplies, booth fees, travel for craft fairs, and more." },
    { q: "Should I set aside money for taxes?", a: "Yes. Set aside 25-35% of net profit for taxes. Place it in a separate savings account so you are not caught off guard." },
];

export default function TaxCalculatorPage() {
    const [revenue, setRevenue] = useState(""); const [expenses, setExpenses] = useState(""); const [filingStatus, setFilingStatus] = useState("single");
    const [activeFaq, setActiveFaq] = useState<number | null>(null); const [copied, setCopied] = useState(false);

    const rev = parseFloat(revenue) || 0; const exp = parseFloat(expenses) || 0;
    const netProfit = rev - exp;
    const seRate = 0.153;
    const seTax = Math.max(0, netProfit * 0.9235 * seRate);
    const seDeduction = seTax / 2;
    const taxableIncome = Math.max(0, netProfit - seDeduction);
    const standardDed: Record<string, number> = { single: 14600, married: 29200, head: 21900 };
    const agi = Math.max(0, taxableIncome - (standardDed[filingStatus] || 14600));
    // Simplified federal brackets for estimation
    const fedTax = agi <= 11600 ? agi * 0.10 : agi <= 47150 ? 1160 + (agi - 11600) * 0.12 : agi <= 100525 ? 5426 + (agi - 47150) * 0.22 : 5426 + (100525 - 47150) * 0.22 + (agi - 100525) * 0.24;
    const totalTax = seTax + fedTax;
    const effectiveRate = netProfit > 0 ? (totalTax / netProfit) * 100 : 0;
    const quarterly = totalTax / 4;
    const hasResult = rev > 0;

    const handleCopy = useCallback(() => { navigator.clipboard.writeText(`Revenue: $${rev}, Expenses: $${exp}, Net: $${netProfit.toFixed(0)}. SE Tax: $${seTax.toFixed(0)}, Fed Tax: $${fedTax.toFixed(0)}. Total: $${totalTax.toFixed(0)} (${effectiveRate.toFixed(1)}%). Set aside $${quarterly.toFixed(0)}/quarter.`); setCopied(true); setTimeout(() => setCopied(false), 2000); }, [rev, exp, netProfit, seTax, fedTax, totalTax, effectiveRate, quarterly]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Pricing", href: "/pricing" }, { label: "Tax Calculator" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><Receipt size={14} strokeWidth={1.5} /> Pricing</span><h1>Sewing Business Tax Estimator</h1><p>Estimate self-employment and income tax so you can set aside the right amount.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Annual Income</h2>
                    <div className="calculator-form"><div className="calculator-form-row">
                        <div className="input-group"><label className="input-label">Total Revenue ($)</label><input type="number" className="input-field input-mono" placeholder="e.g., 25000" value={revenue} onChange={e => setRevenue(e.target.value)} min="0" step="100" /></div>
                        <div className="input-group"><label className="input-label">Total Expenses ($)</label><input type="number" className="input-field input-mono" placeholder="e.g., 8000" value={expenses} onChange={e => setExpenses(e.target.value)} min="0" step="100" /></div>
                        <div className="input-group"><label className="input-label">Filing Status</label><select className="input-field" value={filingStatus} onChange={e => setFilingStatus(e.target.value)}><option value="single">Single</option><option value="married">Married Filing Jointly</option><option value="head">Head of Household</option></select></div>
                    </div></div>
                    {hasResult && (<div><div className="calculator-divider" />
                        <div className="result-card"><div className="result-prefix">Estimated Annual Tax</div><div className="result-value">${totalTax.toFixed(0)}</div><div className="result-label">Effective rate: {effectiveRate.toFixed(1)}% on ${netProfit.toFixed(0)} net profit</div></div>
                        <div className={styles.resultDetails} style={{ marginTop: 12 }}>
                            <div className="result-row"><span className="result-row-label">Net profit</span><span className="result-row-value">${netProfit.toFixed(0)}</span></div>
                            <div className="result-row"><span className="result-row-label">Self-employment tax (15.3%)</span><span className="result-row-value">${seTax.toFixed(0)}</span></div>
                            <div className="result-row"><span className="result-row-label">Federal income tax (est.)</span><span className="result-row-value">${fedTax.toFixed(0)}</span></div>
                            <div className="result-row"><span className="result-row-label">Quarterly payment</span><span className="result-row-value">${quarterly.toFixed(0)}</span></div>
                            <div className="result-row"><span className="result-row-label">After-tax income</span><span className="result-row-value">${(netProfit - totalTax).toFixed(0)}</span></div>
                        </div>
                        <p style={{ margin: "12px 0 0", padding: 12, fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", background: "var(--color-surface-hover)", borderRadius: 8 }}>This is an estimate. Consult a tax professional for accurate filing. State taxes not included.</p>
                        <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
                    </div>)}
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}