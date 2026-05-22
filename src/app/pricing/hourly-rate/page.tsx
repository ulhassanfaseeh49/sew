"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Clock, Copy, Printer, ChevronDown, DollarSign, Calculator } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const specialtyRates = [
    { specialty: "General alterations", range: "$15 - $35/hr" },
    { specialty: "Custom garments", range: "$25 - $60/hr" },
    { specialty: "Bridal and formal", range: "$35 - $80/hr" },
    { specialty: "Quilting commissions", range: "$20 - $50/hr" },
    { specialty: "Embroidery (machine)", range: "$35 - $75/hr" },
    { specialty: "Upholstery", range: "$40 - $80/hr" },
];
const relatedTools = [
    { name: "Handmade Pricing", href: "/pricing/handmade-pricing", icon: DollarSign },
    { name: "Time Tracker", href: "/pricing/time-tracker", icon: Clock },
    { name: "Profit Margin", href: "/pricing/profit-margin", icon: Calculator },
];
const faqItems = [
    { q: "How much should I charge per hour for sewing?", a: "Skilled sewists typically charge $25-60/hr. Factor in your expenses, taxes, and non-billable time. Never go below minimum wage." },
    { q: "What are non-billable hours?", a: "Time spent on admin, shopping, photography, marketing, customer communication. Most sewists spend 30-50% of work time on non-billable tasks." },
    { q: "How do I raise my rates?", a: "Raise immediately for new clients. Grandfather existing clients for 3-6 months, then notify with 30 days advance notice." },
];

export default function HourlyRatePage() {
    const [income, setIncome] = useState("35000"); const [hoursWeek, setHoursWeek] = useState("30"); const [weeksYear, setWeeksYear] = useState("48");
    const [billablePct, setBillablePct] = useState("60"); const [expenses, setExpenses] = useState("5000"); const [taxRate, setTaxRate] = useState("25");
    const [activeFaq, setActiveFaq] = useState<number | null>(null); const [copied, setCopied] = useState(false);

    const inc = parseFloat(income) || 35000; const hw = parseFloat(hoursWeek) || 30; const wy = parseFloat(weeksYear) || 48;
    const bp = parseFloat(billablePct) || 60; const exp = parseFloat(expenses) || 5000; const tax = parseFloat(taxRate) || 25;
    const totalHours = hw * wy;
    const billableHours = totalHours * (bp / 100);
    const grossNeeded = (inc + exp) / (1 - tax / 100);
    const minRate = grossNeeded / billableHours;
    const recRate = minRate * 1.15; // 15% buffer
    const hasResult = inc > 0 && hw > 0;

    const projections = [10, 15, 20, 25].map(bh => ({ hours: bh, monthly: (recRate * bh * 4.33).toFixed(0), annual: (recRate * bh * wy).toFixed(0) }));

    const handleCopy = useCallback(() => { navigator.clipboard.writeText(`Minimum rate: $${minRate.toFixed(2)}/hr. Recommended: $${recRate.toFixed(2)}/hr. Based on $${inc} desired income, ${billableHours.toFixed(0)} billable hours/year.`); setCopied(true); setTimeout(() => setCopied(false), 2000); }, [minRate, recRate, inc, billableHours]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Pricing", href: "/pricing" }, { label: "Hourly Rate" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><Clock size={14} strokeWidth={1.5} /> Pricing</span><h1>Hourly Rate Calculator</h1><p>Calculate a sustainable hourly rate based on desired income, expenses, taxes, and billable hours.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Your Business</h2>
                    <div className="calculator-form">
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Desired Annual Income ($)</label><input type="number" className="input-field input-mono" value={income} onChange={e => setIncome(e.target.value)} min="0" step="1000" /></div>
                            <div className="input-group"><label className="input-label">Hours/Week</label><input type="number" className="input-field input-mono" value={hoursWeek} onChange={e => setHoursWeek(e.target.value)} min="1" max="60" /></div>
                            <div className="input-group"><label className="input-label">Weeks/Year</label><input type="number" className="input-field input-mono" value={weeksYear} onChange={e => setWeeksYear(e.target.value)} min="1" max="52" /></div>
                        </div>
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Billable Time %</label><input type="range" min="30" max="90" step="5" value={billablePct} onChange={e => setBillablePct(e.target.value)} style={{ width: "100%" }} /><div style={{ textAlign: "center", fontWeight: 600, fontSize: "var(--text-sm)" }}>{billablePct}%</div></div>
                            <div className="input-group"><label className="input-label">Annual Expenses ($)</label><input type="number" className="input-field input-mono" value={expenses} onChange={e => setExpenses(e.target.value)} min="0" step="500" /></div>
                            <div className="input-group"><label className="input-label">Tax Rate %</label><input type="number" className="input-field input-mono" value={taxRate} onChange={e => setTaxRate(e.target.value)} min="0" max="50" /></div>
                        </div>
                    </div>
                    {hasResult && (<div><div className="calculator-divider" />
                        <div className="result-card"><div className="result-prefix">Recommended Hourly Rate</div><div className="result-value">${recRate.toFixed(2)}/hr</div><div className="result-label">Minimum viable: ${minRate.toFixed(2)}/hr ({billableHours.toFixed(0)} billable hrs/year)</div></div>
                        <div className="calculator-card" style={{ marginTop: 16 }}><h3 style={{ fontSize: "var(--text-sm)", fontWeight: 600, marginBottom: 8 }}>Income Projections at ${recRate.toFixed(0)}/hr</h3>
                            <div className={styles.tableWrap}><table className={styles.convTable}><thead><tr><th>Billable Hrs/Week</th><th>Monthly</th><th>Annual</th></tr></thead>
                                <tbody>{projections.map(p => (<tr key={p.hours}><td style={{ fontWeight: 600 }}>{p.hours} hrs</td><td>${p.monthly}</td><td>${p.annual}</td></tr>))}</tbody>
                            </table></div>
                        </div>
                        <div className="calculator-card" style={{ marginTop: 16 }}><h3 style={{ fontSize: "var(--text-sm)", fontWeight: 600, marginBottom: 8 }}>Market Reference</h3>
                            <div className={styles.tableWrap}><table className={styles.convTable}><thead><tr><th>Specialty</th><th>Typical Range</th></tr></thead>
                                <tbody>{specialtyRates.map(s => (<tr key={s.specialty}><td style={{ fontWeight: 600 }}>{s.specialty}</td><td>{s.range}</td></tr>))}</tbody>
                            </table></div>
                        </div>
                        <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
                    </div>)}
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}