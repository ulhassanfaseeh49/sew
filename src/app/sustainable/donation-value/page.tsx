"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { DollarSign, Copy, Printer, ChevronDown, Leaf, PackageOpen } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const condMult: Record<string, { label: string; mult: number }> = {
    new: { label: "New/unwashed", mult: 1.0 }, prewashed: { label: "Pre-washed excellent", mult: 0.95 },
    good: { label: "Good used", mult: 0.80 }, fair: { label: "Fair condition", mult: 0.60 }, poor: { label: "Poor (stained/worn)", mult: 0.35 },
};
const ageMult: Record<string, { label: string; mult: number }> = {
    current: { label: "Current season", mult: 1.0 }, "1-2": { label: "1-2 years old", mult: 0.90 },
    "2-5": { label: "2-5 years old", mult: 0.75 }, "5-10": { label: "5-10 years old", mult: 0.60 }, vintage: { label: "Vintage 10+", mult: 0.50 },
};

const relatedTools = [
    { name: "Stash Tracker", href: "/sustainable/stash-tracker", icon: PackageOpen },
    { name: "Remnant Usage", href: "/sustainable/remnant-usage", icon: Leaf },
    { name: "Scrap Sorting", href: "/sustainable/scrap-sorting", icon: Leaf },
];
const faqItems = [
    { q: "How do I price destash fabric?", a: "General rule: 50-75% of original price for new/unused. Adjust down for age and condition. Etsy can get higher prices; local groups expect lower." },
    { q: "Can I deduct fabric donations on taxes?", a: "In the US, donations to qualifying organizations are deductible. Document fair market value, keep photos/receipts. Consult a tax professional for donations over $500." },
    { q: "What if I don't know the original price?", a: "Estimate based on similar fabric at current retail. Quilting cotton: $10-15/yd, Linen: $15-30/yd, Silk: $25-60/yd. Adjust for condition and age." },
];

export default function DonationValuePage() {
    const [price, setPrice] = useState(""); const [yardage, setYardage] = useState("");
    const [condition, setCondition] = useState("prewashed"); const [age, setAge] = useState("1-2");
    const [activeFaq, setActiveFaq] = useState<number | null>(null); const [copied, setCopied] = useState(false);

    const p = parseFloat(price) || 0; const y = parseFloat(yardage) || 0;
    const cm = condMult[condition].mult; const am = ageMult[age].mult;
    const originalTotal = p * y; const fmv = originalTotal * cm * am;
    const etsyPrice = fmv * 1.1; const swapPrice = fmv * 0.85;
    const hasResult = p > 0 && y > 0;

    const handleCopy = useCallback(() => { navigator.clipboard.writeText(`Fair market value: $${fmv.toFixed(2)} (${y} yards at $${p}/yd, ${condMult[condition].label}, ${ageMult[age].label})`); setCopied(true); setTimeout(() => setCopied(false), 2000); }, [fmv, y, p, condition, age]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Sustainable", href: "/sustainable" }, { label: "Donation Value" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><DollarSign size={14} strokeWidth={1.5} /> Sustainable</span><h1>Fabric Donation / Swap Value Calculator</h1><p>Calculate fair value of fabric for donations, swaps, or destashing.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Fabric Details</h2>
                    <div className="calculator-form">
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Original Price/Yard ($)</label><input type="number" className="input-field input-mono" placeholder="e.g., 12" value={price} onChange={e => setPrice(e.target.value)} min="0" step="0.5" /></div>
                            <div className="input-group"><label className="input-label">Yardage</label><input type="number" className="input-field input-mono" placeholder="e.g., 3" value={yardage} onChange={e => setYardage(e.target.value)} min="0" step="0.25" /></div>
                        </div>
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Condition</label><select className="input-field" value={condition} onChange={e => setCondition(e.target.value)}>{Object.entries(condMult).map(([k, v]) => <option key={k} value={k}>{v.label} ({(v.mult * 100).toFixed(0)}%)</option>)}</select></div>
                            <div className="input-group"><label className="input-label">Age</label><select className="input-field" value={age} onChange={e => setAge(e.target.value)}>{Object.entries(ageMult).map(([k, v]) => <option key={k} value={k}>{v.label} ({(v.mult * 100).toFixed(0)}%)</option>)}</select></div>
                        </div>
                    </div>
                    {hasResult && (<div><div className="calculator-divider" />
                        <div className="result-card"><div className="result-prefix">Fair Market Value</div><div className="result-value">${fmv.toFixed(2)}</div><div className="result-label">Original retail: ${originalTotal.toFixed(2)}</div></div>
                        <div className={styles.resultDetails} style={{ marginTop: 16 }}>
                            <div className="result-row"><span className="result-row-label">Etsy destash price</span><span className="result-row-value">${etsyPrice.toFixed(2)}</span></div>
                            <div className="result-row"><span className="result-row-label">Swap value</span><span className="result-row-value">${swapPrice.toFixed(2)}</span></div>
                            <div className="result-row"><span className="result-row-label">Donation FMV</span><span className="result-row-value">${fmv.toFixed(2)}</span></div>
                        </div>
                        <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
                    </div>)}
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}