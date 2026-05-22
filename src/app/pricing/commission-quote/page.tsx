"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { FileText, Copy, Printer, ChevronDown, DollarSign, Calculator } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const relatedTools = [
    { name: "Handmade Pricing", href: "/pricing/handmade-pricing", icon: DollarSign },
    { name: "Time Tracker", href: "/pricing/time-tracker", icon: Calculator },
    { name: "Material Tracker", href: "/pricing/material-tracker", icon: Calculator },
];
const faqItems = [
    { q: "How much should a deposit be?", a: "50% deposit is standard for custom work. Some charge 100% for items under $100. The deposit covers materials and starts your commitment." },
    { q: "What if I underestimate a commission?", a: "Communicate early. A change order for extra complexity is normal. Never absorb costs silently -- it erodes your business." },
    { q: "Should I charge more for rush orders?", a: "Yes. 25-50% rush fee is standard. Rush work disrupts your schedule and other commitments. Communicate the surcharge upfront." },
];

export default function CommissionQuotePage() {
    const [description, setDescription] = useState(""); const [materials, setMaterials] = useState(""); const [hours, setHours] = useState("");
    const [hourlyRate, setHourlyRate] = useState("30"); const [complexity, setComplexity] = useState("standard"); const [rush, setRush] = useState("no");
    const [activeFaq, setActiveFaq] = useState<number | null>(null); const [copied, setCopied] = useState(false);

    const mat = parseFloat(materials) || 0; const hrs = parseFloat(hours) || 0; const hr = parseFloat(hourlyRate) || 30;
    const complexityMult: Record<string, number> = { simple: 1, standard: 1, complex: 1.2, couture: 1.5 };
    const cm = complexityMult[complexity] || 1;
    const rushMult = rush === "yes" ? 1.35 : 1;
    const labor = hrs * hr * cm;
    const overhead = (mat + labor) * 0.15;
    const subtotal = (mat + labor + overhead) * rushMult;
    const deposit = subtotal * 0.5;
    const hasResult = mat > 0 || hrs > 0;

    const handleCopy = useCallback(() => { navigator.clipboard.writeText(`Commission Quote: ${description || "Custom item"}. Materials: $${mat.toFixed(2)}, Labor: $${labor.toFixed(2)}, Total: $${subtotal.toFixed(2)}. Deposit: $${deposit.toFixed(2)}.`); setCopied(true); setTimeout(() => setCopied(false), 2000); }, [description, mat, labor, subtotal, deposit]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Pricing", href: "/pricing" }, { label: "Commission Quote" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><FileText size={14} strokeWidth={1.5} /> Pricing</span><h1>Commission Quote Generator</h1><p>Build a professional quote for custom work with materials, labor, complexity, and deposit calculation.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Project Details</h2>
                    <div className="calculator-form">
                        <div className="input-group"><label className="input-label">Project Description</label><input type="text" className="input-field" placeholder="e.g., Custom lined tote bag" value={description} onChange={e => setDescription(e.target.value)} /></div>
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Materials ($)</label><input type="number" className="input-field input-mono" placeholder="e.g., 35" value={materials} onChange={e => setMaterials(e.target.value)} min="0" step="0.01" /></div>
                            <div className="input-group"><label className="input-label">Est. Hours</label><input type="number" className="input-field input-mono" placeholder="e.g., 8" value={hours} onChange={e => setHours(e.target.value)} min="0" step="0.5" /></div>
                            <div className="input-group"><label className="input-label">Hourly Rate ($)</label><input type="number" className="input-field input-mono" value={hourlyRate} onChange={e => setHourlyRate(e.target.value)} min="0" /></div>
                        </div>
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Complexity</label><select className="input-field" value={complexity} onChange={e => setComplexity(e.target.value)}><option value="simple">Simple</option><option value="standard">Standard</option><option value="complex">Complex (+20%)</option><option value="couture">Couture (+50%)</option></select></div>
                            <div className="input-group"><label className="input-label">Rush Order?</label><select className="input-field" value={rush} onChange={e => setRush(e.target.value)}><option value="no">No</option><option value="yes">Yes (+35%)</option></select></div>
                        </div>
                    </div>
                    {hasResult && (<div><div className="calculator-divider" />
                        <div className="result-card"><div className="result-prefix">Quote Total</div><div className="result-value">${subtotal.toFixed(2)}</div><div className="result-label">50% deposit: ${deposit.toFixed(2)}</div></div>
                        <div className={styles.resultDetails} style={{ marginTop: 12 }}>
                            <div className="result-row"><span className="result-row-label">Materials</span><span className="result-row-value">${mat.toFixed(2)}</span></div>
                            <div className="result-row"><span className="result-row-label">Labor ({hrs}h x ${hr}/hr{cm > 1 ? ` x ${cm}x` : ""})</span><span className="result-row-value">${labor.toFixed(2)}</span></div>
                            <div className="result-row"><span className="result-row-label">Overhead (15%)</span><span className="result-row-value">${overhead.toFixed(2)}</span></div>
                            {rush === "yes" && <div className="result-row"><span className="result-row-label">Rush surcharge (+35%)</span><span className="result-row-value">Included</span></div>}
                        </div>
                        <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
                    </div>)}
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}