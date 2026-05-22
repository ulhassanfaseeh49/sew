"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { ShoppingBag, Copy, Printer, ChevronDown, DollarSign, Calculator } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const relatedTools = [
    { name: "Handmade Pricing", href: "/pricing/handmade-pricing", icon: DollarSign },
    { name: "Craft Fair", href: "/pricing/craft-fair", icon: ShoppingBag },
    { name: "Profit Margin", href: "/pricing/profit-margin", icon: Calculator },
];
const faqItems = [
    { q: "What percentage does Etsy take from sales?", a: "Listing fee ($0.20) + 6.5% transaction fee + 3% + $0.25 payment processing. Total is roughly 10-13% of the sale price." },
    { q: "Does Etsy charge fees on shipping?", a: "Yes. The 6.5% transaction fee applies to both item price AND shipping charges. This catches many sellers by surprise." },
    { q: "Should I offer free shipping on Etsy?", a: "Free shipping may improve search ranking. But you must increase your item price to cover shipping cost, and fees apply to the higher price." },
];

export default function EtsyFeesPage() {
    const [listPrice, setListPrice] = useState(""); const [shipping, setShipping] = useState("0");
    const [materialCost, setMaterialCost] = useState(""); const [laborCost, setLaborCost] = useState("");
    const [offsiteAds, setOffsiteAds] = useState("no");
    const [activeFaq, setActiveFaq] = useState<number | null>(null); const [copied, setCopied] = useState(false);

    const lp = parseFloat(listPrice) || 0; const sh = parseFloat(shipping) || 0; const mc = parseFloat(materialCost) || 0; const lc = parseFloat(laborCost) || 0;
    const gross = lp + sh;
    const listingFee = 0.20;
    const transactionFee = gross * 0.065;
    const paymentFee = gross * 0.03 + 0.25;
    const offAdsFee = offsiteAds === "yes" ? gross * 0.12 : 0;
    const totalFees = listingFee + transactionFee + paymentFee + offAdsFee;
    const feePct = gross > 0 ? (totalFees / gross) * 100 : 0;
    const takeHome = gross - totalFees - mc - lc - sh;
    const hasResult = lp > 0;

    const pricePoints = [25, 35, 45, 55, 65, 85].map(p => {
        const g = p + sh; const tf = 0.20 + g * 0.065 + g * 0.03 + 0.25;
        return { price: p, fees: tf, kept: g - tf, pct: ((g - tf) / g * 100) };
    });

    const handleCopy = useCallback(() => { navigator.clipboard.writeText(`Etsy: $${lp} listing, $${totalFees.toFixed(2)} fees (${feePct.toFixed(1)}%), take-home: $${takeHome.toFixed(2)}`); setCopied(true); setTimeout(() => setCopied(false), 2000); }, [lp, totalFees, feePct, takeHome]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Pricing", href: "/pricing" }, { label: "Etsy Fees" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><ShoppingBag size={14} strokeWidth={1.5} /> Pricing</span><h1>Etsy Fee Calculator</h1><p>Calculate all Etsy fees -- listing, transaction, payment processing, offsite ads -- to find your true profit per sale.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Listing Details</h2>
                    <div className="calculator-form">
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Listing Price ($)</label><input type="number" className="input-field input-mono" placeholder="e.g., 45" value={listPrice} onChange={e => setListPrice(e.target.value)} min="0" step="0.01" /></div>
                            <div className="input-group"><label className="input-label">Shipping to Buyer ($)</label><input type="number" className="input-field input-mono" value={shipping} onChange={e => setShipping(e.target.value)} min="0" step="0.01" /></div>
                            <div className="input-group"><label className="input-label">Offsite Ads</label><select className="input-field" value={offsiteAds} onChange={e => setOffsiteAds(e.target.value)}><option value="no">No</option><option value="yes">Yes (12%)</option></select></div>
                        </div>
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Your Material Cost ($)</label><input type="number" className="input-field input-mono" value={materialCost} onChange={e => setMaterialCost(e.target.value)} min="0" step="0.01" /></div>
                            <div className="input-group"><label className="input-label">Your Labor Cost ($)</label><input type="number" className="input-field input-mono" value={laborCost} onChange={e => setLaborCost(e.target.value)} min="0" step="0.01" /></div>
                        </div>
                    </div>
                    {hasResult && (<div><div className="calculator-divider" />
                        <div className="result-card"><div className="result-prefix">Your Take-Home</div><div className="result-value">${takeHome.toFixed(2)}</div><div className="result-label">Total Etsy fees: ${totalFees.toFixed(2)} ({feePct.toFixed(1)}% of gross)</div></div>
                        <div className={styles.resultDetails} style={{ marginTop: 12 }}>
                            <div className="result-row"><span className="result-row-label">Listing fee</span><span className="result-row-value">${listingFee.toFixed(2)}</span></div>
                            <div className="result-row"><span className="result-row-label">Transaction fee (6.5%)</span><span className="result-row-value">${transactionFee.toFixed(2)}</span></div>
                            <div className="result-row"><span className="result-row-label">Payment processing</span><span className="result-row-value">${paymentFee.toFixed(2)}</span></div>
                            {offAdsFee > 0 && <div className="result-row"><span className="result-row-label">Offsite Ads (12%)</span><span className="result-row-value">${offAdsFee.toFixed(2)}</span></div>}
                        </div>
                        <div className="calculator-card" style={{ marginTop: 16 }}><h3 style={{ fontSize: "var(--text-sm)", fontWeight: 600, marginBottom: 8 }}>Price Point Comparison</h3>
                            <div className={styles.tableWrap}><table className={styles.convTable}><thead><tr><th>List Price</th><th>Etsy Fees</th><th>You Keep</th><th>% Kept</th></tr></thead>
                                <tbody>{pricePoints.map(p => (<tr key={p.price} style={{ background: p.price === lp ? "var(--color-surface-hover)" : undefined }}><td style={{ fontWeight: 600 }}>${p.price}</td><td>${p.fees.toFixed(2)}</td><td>${p.kept.toFixed(2)}</td><td>{p.pct.toFixed(0)}%</td></tr>))}</tbody>
                            </table></div>
                        </div>
                        <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
                    </div>)}
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}