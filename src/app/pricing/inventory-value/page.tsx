"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Archive, Copy, Printer, ChevronDown, DollarSign, Calculator } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const relatedTools = [
    { name: "Material Tracker", href: "/pricing/material-tracker", icon: Calculator },
    { name: "Handmade Pricing", href: "/pricing/handmade-pricing", icon: DollarSign },
    { name: "Tax Calculator", href: "/pricing/tax-calculator", icon: DollarSign },
];
const faqItems = [
    { q: "Why should I track inventory value?", a: "For taxes, insurance, and business health. Your unsold inventory represents tied-up capital that is not generating revenue." },
    { q: "Should I value at cost or selling price?", a: "For accounting, use cost basis (materials + labor). For insurance, use selling price. Track both." },
    { q: "When should I mark down old inventory?", a: "Items unsold after 6-12 months should be discounted 20-40%. After 18 months, consider clearing at cost to free up capital." },
];

export default function InventoryValuePage() {
    const [items, setItems] = useState([{ name: "", qty: "", cost: "", price: "" }]);
    const [activeFaq, setActiveFaq] = useState<number | null>(null); const [copied, setCopied] = useState(false);

    const updateItem = (i: number, field: string, val: string) => { const it = [...items]; (it[i] as Record<string, string>)[field] = val; setItems(it); };

    const totalCost = items.reduce((s, it) => s + (parseInt(it.qty) || 0) * (parseFloat(it.cost) || 0), 0);
    const totalRetail = items.reduce((s, it) => s + (parseInt(it.qty) || 0) * (parseFloat(it.price) || 0), 0);
    const totalUnits = items.reduce((s, it) => s + (parseInt(it.qty) || 0), 0);
    const potentialProfit = totalRetail - totalCost;
    const hasResult = totalUnits > 0;

    const handleCopy = useCallback(() => { navigator.clipboard.writeText(`Inventory: ${totalUnits} units. Cost basis: $${totalCost.toFixed(2)}. Retail value: $${totalRetail.toFixed(2)}. Potential profit: $${potentialProfit.toFixed(2)}.`); setCopied(true); setTimeout(() => setCopied(false), 2000); }, [totalUnits, totalCost, totalRetail, potentialProfit]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Pricing", href: "/pricing" }, { label: "Inventory Value" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><Archive size={14} strokeWidth={1.5} /> Pricing</span><h1>Inventory Value Calculator</h1><p>Track the cost basis and retail value of your unsold inventory for accounting and insurance.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Inventory Items</h2>
                    {items.map((it, i) => (<div key={i} className="calculator-form" style={{ marginBottom: 12, paddingBottom: 12, borderBottom: i < items.length - 1 ? "1px solid var(--color-border)" : "none" }}>
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Item</label><input type="text" className="input-field" placeholder="e.g., Tote bag" value={it.name} onChange={e => updateItem(i, "name", e.target.value)} /></div>
                            <div className="input-group"><label className="input-label">Qty</label><input type="number" className="input-field input-mono" value={it.qty} onChange={e => updateItem(i, "qty", e.target.value)} min="0" style={{ maxWidth: 70 }} /></div>
                            <div className="input-group"><label className="input-label">Cost Each ($)</label><input type="number" className="input-field input-mono" value={it.cost} onChange={e => updateItem(i, "cost", e.target.value)} min="0" step="0.01" style={{ maxWidth: 100 }} /></div>
                            <div className="input-group"><label className="input-label">Retail ($)</label><input type="number" className="input-field input-mono" value={it.price} onChange={e => updateItem(i, "price", e.target.value)} min="0" step="0.01" style={{ maxWidth: 100 }} /></div>
                        </div>
                    </div>))}
                    <button className="btn btn-secondary btn-sm" onClick={() => setItems([...items, { name: "", qty: "", cost: "", price: "" }])}>+ Add Item</button>
                    {hasResult && (<div><div className="calculator-divider" />
                        <div className="result-card"><div className="result-prefix">Total Inventory</div><div className="result-value">{totalUnits} units</div><div className="result-label">Cost: ${totalCost.toFixed(2)} | Retail: ${totalRetail.toFixed(2)}</div></div>
                        <div className={styles.resultDetails} style={{ marginTop: 12 }}>
                            <div className="result-row"><span className="result-row-label">Cost basis (accounting)</span><span className="result-row-value">${totalCost.toFixed(2)}</span></div>
                            <div className="result-row"><span className="result-row-label">Retail value (insurance)</span><span className="result-row-value">${totalRetail.toFixed(2)}</span></div>
                            <div className="result-row"><span className="result-row-label">Potential profit</span><span className="result-row-value">${potentialProfit.toFixed(2)}</span></div>
                        </div>
                        <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
                    </div>)}
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}