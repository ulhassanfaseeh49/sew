"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeftRight, ChevronDown, DollarSign, Calculator } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const relatedTools = [
    { name: "Etsy Fees", href: "/pricing/etsy-fees", icon: DollarSign },
    { name: "Handmade Pricing", href: "/pricing/handmade-pricing", icon: Calculator },
    { name: "Wholesale", href: "/pricing/wholesale", icon: DollarSign },
];
const faqItems = [
    { q: "Which platform has the lowest fees?", a: "Direct website (Shopify at ~3%). Etsy is ~10-13%. Amazon Handmade is ~15%. Craft fairs depend on booth cost vs sales volume." },
    { q: "Can I sell on multiple platforms?", a: "Yes. Many sellers use Etsy for discovery, their own website for repeat customers, and craft fairs for local sales. Keep pricing consistent." },
    { q: "Should I include shipping in the comparison?", a: "Yes. Some platforms charge fees on shipping too (Etsy does). Free shipping increases your listing price, changing fee calculations." },
];

export default function ComparisonPage() {
    const [sellingPrice, setSellingPrice] = useState(""); const [itemCost, setItemCost] = useState(""); const [shippingCost, setShippingCost] = useState("0");
    const [activeFaq, setActiveFaq] = useState<number | null>(null);

    const sp = parseFloat(sellingPrice) || 0; const ic = parseFloat(itemCost) || 0; const sc = parseFloat(shippingCost) || 0;
    const hasResult = sp > 0;

    const platforms = [
        { name: "Direct sale", calc: () => ({ fees: 0, net: sp - ic }) },
        { name: "Own website (Shopify)", calc: () => { const f = sp * 0.029 + 0.30; return { fees: f, net: sp - f - ic }; } },
        { name: "Etsy", calc: () => { const f = 0.20 + (sp + sc) * 0.065 + (sp + sc) * 0.03 + 0.25; return { fees: f, net: sp - f - ic }; } },
        { name: "Amazon Handmade", calc: () => { const f = sp * 0.15; return { fees: f, net: sp - f - ic }; } },
        { name: "Facebook/Instagram", calc: () => { const f = sp * 0.029 + 0.30; return { fees: f, net: sp - f - ic }; } },
    ].map(p => ({ name: p.name, ...p.calc() })).sort((a, b) => b.net - a.net);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Pricing", href: "/pricing" }, { label: "Platform Comparison" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><ArrowLeftRight size={14} strokeWidth={1.5} /> Pricing</span><h1>Selling Platform Comparison</h1><p>Compare take-home profit across all major selling platforms at a glance.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Your Item</h2>
                    <div className="calculator-form"><div className="calculator-form-row">
                        <div className="input-group"><label className="input-label">Selling Price ($)</label><input type="number" className="input-field input-mono" placeholder="e.g., 45" value={sellingPrice} onChange={e => setSellingPrice(e.target.value)} min="0" step="0.01" /></div>
                        <div className="input-group"><label className="input-label">Item Cost ($)</label><input type="number" className="input-field input-mono" placeholder="e.g., 20" value={itemCost} onChange={e => setItemCost(e.target.value)} min="0" step="0.01" /></div>
                        <div className="input-group"><label className="input-label">Shipping Cost ($)</label><input type="number" className="input-field input-mono" value={shippingCost} onChange={e => setShippingCost(e.target.value)} min="0" step="0.01" /></div>
                    </div></div>
                    {hasResult && (<div><div className="calculator-divider" />
                        <div className={styles.tableWrap}><table className={styles.convTable}><thead><tr><th>Platform</th><th>Fees</th><th>Your Profit</th><th>% Kept</th></tr></thead>
                            <tbody>{platforms.map(p => (<tr key={p.name} style={{ color: p.net < 0 ? "var(--color-error)" : undefined }}><td style={{ fontWeight: 600 }}>{p.name}</td><td>${p.fees.toFixed(2)}</td><td>${p.net.toFixed(2)}</td><td>{sp > 0 ? (p.net / sp * 100).toFixed(0) : 0}%</td></tr>))}</tbody>
                        </table></div>
                        <p style={{ margin: "12px 0 0", padding: 12, fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", background: "var(--color-surface-hover)", borderRadius: 8 }}>Best option: {platforms[0]?.name} with ${platforms[0]?.net.toFixed(2)} profit per sale. Fees and rates are approximate -- verify current rates with each platform.</p>
                    </div>)}
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}