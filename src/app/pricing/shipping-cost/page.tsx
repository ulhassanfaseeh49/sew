"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Truck, Copy, Printer, ChevronDown, DollarSign, Calculator } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const relatedTools = [
    { name: "Etsy Fees", href: "/pricing/etsy-fees", icon: DollarSign },
    { name: "Handmade Pricing", href: "/pricing/handmade-pricing", icon: Calculator },
    { name: "Break-Even", href: "/pricing/break-even", icon: Calculator },
];
const faqItems = [
    { q: "Should I offer free shipping?", a: "Free shipping increases conversion rates, especially on Etsy. But you must factor shipping cost into your item price. Test both approaches." },
    { q: "How do I estimate package weight?", a: "Weigh finished item + packaging materials (box, tissue, poly mailer). Add 1-2 oz for the packaging itself. Round up to the next ounce." },
    { q: "Which carrier is cheapest for handmade items?", a: "Under 1 lb: USPS First Class. 1-3 lbs: USPS Priority or Pirate Ship. Over 3 lbs: compare USPS, UPS, and FedEx rates." },
];

export default function ShippingCostPage() {
    const [pkgWeight, setPkgWeight] = useState(""); const [pkgLen, setPkgLen] = useState("12"); const [pkgWid, setPkgWid] = useState("10"); const [pkgHt, setPkgHt] = useState("4");
    const [zone, setZone] = useState("4");
    const [activeFaq, setActiveFaq] = useState<number | null>(null); const [copied, setCopied] = useState(false);

    const wt = parseFloat(pkgWeight) || 0; const z = parseInt(zone) || 4;
    const hasResult = wt > 0;
    // Simplified USPS-like rate estimation
    const firstClass = wt <= 16 ? 3.50 + wt * 0.15 : null;
    const priority = 7.50 + (wt / 16) * 1.50 + (z - 1) * 0.80;
    const ground = 5.00 + (wt / 16) * 1.00 + (z - 1) * 0.50;
    const flatRateSmall = 9.45; const flatRateMedium = 16.10;
    const carriers = [
        ...(firstClass ? [{ name: "USPS First Class", rate: firstClass, note: "Under 1 lb only" }] : []),
        { name: "USPS Priority Mail", rate: priority, note: "1-3 day delivery" },
        { name: "USPS Ground Advantage", rate: ground, note: "2-5 day delivery" },
        { name: "Priority Flat Rate (Small)", rate: flatRateSmall, note: "If item fits small box" },
        { name: "Priority Flat Rate (Medium)", rate: flatRateMedium, note: "If item fits medium box" },
    ].sort((a, b) => a.rate - b.rate);

    const handleCopy = useCallback(() => { navigator.clipboard.writeText(`Package: ${wt} oz, Zone ${z}. Cheapest: ${carriers[0]?.name} $${carriers[0]?.rate.toFixed(2)}`); setCopied(true); setTimeout(() => setCopied(false), 2000); }, [wt, z, carriers]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Pricing", href: "/pricing" }, { label: "Shipping Cost" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><Truck size={14} strokeWidth={1.5} /> Pricing</span><h1>Shipping Cost Estimator</h1><p>Compare shipping rates across carriers to find the most cost-effective option for your handmade items.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Package Details</h2>
                    <div className="calculator-form">
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Weight (oz)</label><input type="number" className="input-field input-mono" placeholder="e.g., 12" value={pkgWeight} onChange={e => setPkgWeight(e.target.value)} min="0" step="0.5" /></div>
                            <div className="input-group"><label className="input-label">Shipping Zone</label><select className="input-field" value={zone} onChange={e => setZone(e.target.value)}><option value="1">Zone 1-2 (local)</option><option value="3">Zone 3</option><option value="4">Zone 4</option><option value="5">Zone 5</option><option value="6">Zone 6</option><option value="7">Zone 7</option><option value="8">Zone 8 (coast-to-coast)</option></select></div>
                        </div>
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Length (in)</label><input type="number" className="input-field input-mono" value={pkgLen} onChange={e => setPkgLen(e.target.value)} min="0" /></div>
                            <div className="input-group"><label className="input-label">Width (in)</label><input type="number" className="input-field input-mono" value={pkgWid} onChange={e => setPkgWid(e.target.value)} min="0" /></div>
                            <div className="input-group"><label className="input-label">Height (in)</label><input type="number" className="input-field input-mono" value={pkgHt} onChange={e => setPkgHt(e.target.value)} min="0" /></div>
                        </div>
                    </div>
                    {hasResult && (<div><div className="calculator-divider" />
                        <div className="result-card"><div className="result-prefix">Cheapest Option</div><div className="result-value">${carriers[0]?.rate.toFixed(2)}</div><div className="result-label">{carriers[0]?.name} -- {carriers[0]?.note}</div></div>
                        <div className={styles.tableWrap} style={{ marginTop: 12 }}><table className={styles.convTable}><thead><tr><th>Service</th><th>Est. Rate</th><th>Note</th></tr></thead>
                            <tbody>{carriers.map(c => (<tr key={c.name}><td style={{ fontWeight: 600 }}>{c.name}</td><td>${c.rate.toFixed(2)}</td><td>{c.note}</td></tr>))}</tbody>
                        </table></div>
                        <p style={{ margin: "12px 0 0", padding: 12, fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", background: "var(--color-surface-hover)", borderRadius: 8 }}>Rates are estimates. Check carrier websites or Pirate Ship for exact rates. Commercial rates are typically 10-20% lower.</p>
                        <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
                    </div>)}
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}