"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { ClipboardList, Copy, Printer, ChevronDown, DollarSign, Calculator } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const relatedTools = [
    { name: "Handmade Pricing", href: "/pricing/handmade-pricing", icon: DollarSign },
    { name: "Cost-Plus", href: "/pricing/cost-plus", icon: Calculator },
    { name: "Profit Margin", href: "/pricing/profit-margin", icon: DollarSign },
];
const faqItems = [
    { q: "Should I track stash fabric costs?", a: "Yes. Stash fabric still has a cost -- the price you originally paid. Assign its current market value or original cost to the project." },
    { q: "How do I allocate pattern cost?", a: "Divide the pattern price by the number of times you expect to use it. A $15 pattern used 5 times = $3 per project." },
    { q: "What if material costs exceed 60% of selling price?", a: "That leaves too little for labor and profit. Either source cheaper materials, price higher, or find efficiencies in cutting/layout." },
];

export default function MaterialTrackerPage() {
    const [items, setItems] = useState([{ name: "Main fabric", qty: "", unitPrice: "" }, { name: "Thread", qty: "", unitPrice: "" }]);
    const [targetPrice, setTargetPrice] = useState("");
    const [activeFaq, setActiveFaq] = useState<number | null>(null); const [copied, setCopied] = useState(false);

    const updateItem = (i: number, field: string, val: string) => { const it = [...items]; (it[i] as Record<string, string>)[field] = val; setItems(it); };

    const total = items.reduce((s, it) => s + (parseFloat(it.qty) || 0) * (parseFloat(it.unitPrice) || 0), 0);
    const tp = parseFloat(targetPrice) || 0;
    const matPct = tp > 0 ? (total / tp) * 100 : 0;
    const remaining = tp > 0 ? tp - total : 0;
    const hasResult = total > 0;

    const handleCopy = useCallback(() => { navigator.clipboard.writeText(`Material total: $${total.toFixed(2)}. ${tp > 0 ? `${matPct.toFixed(0)}% of $${tp} selling price.` : ""}`); setCopied(true); setTimeout(() => setCopied(false), 2000); }, [total, tp, matPct]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Pricing", href: "/pricing" }, { label: "Material Tracker" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><ClipboardList size={14} strokeWidth={1.5} /> Pricing</span><h1>Material Cost Tracker</h1><p>Track and total all material costs per project for accurate pricing and accounting.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Project Materials</h2>
                    {items.map((it, i) => (<div key={i} className="calculator-form" style={{ marginBottom: 12, paddingBottom: 12, borderBottom: i < items.length - 1 ? "1px solid var(--color-border)" : "none" }}>
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Item</label><input type="text" className="input-field" value={it.name} onChange={e => updateItem(i, "name", e.target.value)} /></div>
                            <div className="input-group"><label className="input-label">Qty</label><input type="number" className="input-field input-mono" value={it.qty} onChange={e => updateItem(i, "qty", e.target.value)} min="0" step="0.25" style={{ maxWidth: 80 }} /></div>
                            <div className="input-group"><label className="input-label">Unit Price ($)</label><input type="number" className="input-field input-mono" value={it.unitPrice} onChange={e => updateItem(i, "unitPrice", e.target.value)} min="0" step="0.01" style={{ maxWidth: 100 }} /></div>
                            <div className="input-group"><label className="input-label">Total</label><div className="input-field input-mono" style={{ background: "var(--color-surface-hover)" }}>${((parseFloat(it.qty) || 0) * (parseFloat(it.unitPrice) || 0)).toFixed(2)}</div></div>
                        </div>
                    </div>))}
                    <button className="btn btn-secondary btn-sm" onClick={() => setItems([...items, { name: "", qty: "", unitPrice: "" }])}>+ Add Item</button>
                    <div className="input-group" style={{ marginTop: 12 }}><label className="input-label">Target Selling Price ($, optional)</label><input type="number" className="input-field input-mono" placeholder="e.g., 85" value={targetPrice} onChange={e => setTargetPrice(e.target.value)} min="0" step="0.01" /></div>
                    {hasResult && (<div><div className="calculator-divider" />
                        <div className="result-card"><div className="result-prefix">Total Material Cost</div><div className="result-value">${total.toFixed(2)}</div>{tp > 0 && <div className="result-label">{matPct.toFixed(0)}% of ${tp} selling price. ${remaining.toFixed(2)} left for labor/overhead/profit.</div>}</div>
                        <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
                    </div>)}
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}