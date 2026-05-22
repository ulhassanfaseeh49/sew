"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { DollarSign, Copy, Printer, ChevronDown, Clock, Calculator } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const relatedTools = [
    { name: "Cost-Plus Pricing", href: "/pricing/cost-plus", icon: Calculator },
    { name: "Hourly Rate", href: "/pricing/hourly-rate", icon: Clock },
    { name: "Etsy Fee Calculator", href: "/pricing/etsy-fees", icon: DollarSign },
];
const faqItems = [
    { q: "What is the formula for pricing handmade items?", a: "Materials + Labor + Overhead + Profit = Selling Price. Each element is non-negotiable for a sustainable business." },
    { q: "Should I charge for my time when pricing handmade items?", a: "Absolutely. Your time, skill, and expertise have real value. Not charging for labor means you are working for free." },
    { q: "What is a fair profit margin for handmade goods?", a: "20-40% profit margin is standard for handmade. Below 20% leaves no buffer for mistakes, returns, or slow periods." },
];

export default function HandmadePricingPage() {
    const [materials, setMaterials] = useState(""); const [hours, setHours] = useState(""); const [hourlyRate, setHourlyRate] = useState("25");
    const [overheadPct, setOverheadPct] = useState("15"); const [profitPct, setProfitPct] = useState("30");
    const [platform, setPlatform] = useState("none");
    const [activeFaq, setActiveFaq] = useState<number | null>(null); const [copied, setCopied] = useState(false);

    const mat = parseFloat(materials) || 0; const hrs = parseFloat(hours) || 0; const hr = parseFloat(hourlyRate) || 25;
    const ovPct = parseFloat(overheadPct) || 15; const prPct = parseFloat(profitPct) || 30;
    const labor = hrs * hr;
    const subtotal = mat + labor;
    const overhead = subtotal * (ovPct / 100);
    const costTotal = subtotal + overhead;
    const profit = costTotal * (prPct / 100);
    const priceBeforeFees = costTotal + profit;
    const platformFees: Record<string, number> = { none: 0, etsy: 0.13, shopify: 0.029, amazon: 0.15, fair: 0 };
    const feeRate = platformFees[platform] || 0;
    const sellingPrice = feeRate > 0 ? priceBeforeFees / (1 - feeRate) : priceBeforeFees;
    const fees = sellingPrice - priceBeforeFees;
    const takeHome = sellingPrice - fees - mat - labor - overhead;
    const hasResult = mat > 0 || hrs > 0;

    const handleCopy = useCallback(() => { navigator.clipboard.writeText(`Selling price: $${sellingPrice.toFixed(2)}. Materials: $${mat.toFixed(2)}, Labor: $${labor.toFixed(2)}, Overhead: $${overhead.toFixed(2)}, Profit: $${profit.toFixed(2)}.`); setCopied(true); setTimeout(() => setCopied(false), 2000); }, [sellingPrice, mat, labor, overhead, profit]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Pricing", href: "/pricing" }, { label: "Handmade Pricing" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><DollarSign size={14} strokeWidth={1.5} /> Pricing</span><h1>Handmade Item Pricing Calculator</h1><p>Calculate the correct selling price using the proven formula: Materials + Labor + Overhead + Profit.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Costs</h2>
                    <div className="calculator-form">
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Total Materials ($)</label><input type="number" className="input-field input-mono" placeholder="e.g., 35" value={materials} onChange={e => setMaterials(e.target.value)} min="0" step="0.01" /></div>
                            <div className="input-group"><label className="input-label">Hours of Work</label><input type="number" className="input-field input-mono" placeholder="e.g., 6" value={hours} onChange={e => setHours(e.target.value)} min="0" step="0.25" /></div>
                            <div className="input-group"><label className="input-label">Hourly Rate ($)</label><select className="input-field" value={hourlyRate} onChange={e => setHourlyRate(e.target.value)}><option value="15">$15 (minimum)</option><option value="20">$20 (fair craft)</option><option value="25">$25 (skilled)</option><option value="35">$35 (expert)</option><option value="50">$50 (master)</option></select></div>
                        </div>
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Overhead %</label><select className="input-field" value={overheadPct} onChange={e => setOverheadPct(e.target.value)}><option value="10">10%</option><option value="15">15%</option><option value="20">20%</option><option value="25">25%</option></select></div>
                            <div className="input-group"><label className="input-label">Profit Margin %</label><select className="input-field" value={profitPct} onChange={e => setProfitPct(e.target.value)}><option value="15">15%</option><option value="20">20%</option><option value="30">30%</option><option value="40">40%</option><option value="50">50%</option></select></div>
                            <div className="input-group"><label className="input-label">Selling Platform</label><select className="input-field" value={platform} onChange={e => setPlatform(e.target.value)}><option value="none">Direct / Local</option><option value="etsy">Etsy (~13%)</option><option value="shopify">Shopify (~3%)</option><option value="amazon">Amazon Handmade (~15%)</option></select></div>
                        </div>
                    </div>
                    {hasResult && (<div><div className="calculator-divider" />
                        <div className="result-card"><div className="result-prefix">Recommended Selling Price</div><div className="result-value">${sellingPrice.toFixed(2)}</div><div className="result-label">Net take-home: ${takeHome.toFixed(2)} per item</div></div>
                        <div className={styles.resultDetails} style={{ marginTop: 12 }}>
                            <div className="result-row"><span className="result-row-label">Materials</span><span className="result-row-value">${mat.toFixed(2)}</span></div>
                            <div className="result-row"><span className="result-row-label">Labor ({hrs} hr x ${hr}/hr)</span><span className="result-row-value">${labor.toFixed(2)}</span></div>
                            <div className="result-row"><span className="result-row-label">Overhead ({ovPct}%)</span><span className="result-row-value">${overhead.toFixed(2)}</span></div>
                            <div className="result-row"><span className="result-row-label">Total cost</span><span className="result-row-value">${costTotal.toFixed(2)}</span></div>
                            <div className="result-row"><span className="result-row-label">Profit ({prPct}%)</span><span className="result-row-value">${profit.toFixed(2)}</span></div>
                            {feeRate > 0 && <div className="result-row"><span className="result-row-label">Platform fees</span><span className="result-row-value">${fees.toFixed(2)}</span></div>}
                        </div>
                        <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
                    </div>)}
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}