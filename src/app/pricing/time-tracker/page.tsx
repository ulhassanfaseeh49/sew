"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Timer, Copy, Printer, ChevronDown, DollarSign, Calculator } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const stages = [
    { key: "design", label: "Design / Planning" }, { key: "shopping", label: "Shopping / Sourcing" },
    { key: "cutting", label: "Cutting / Prep" }, { key: "sewing", label: "Sewing / Construction" },
    { key: "finishing", label: "Pressing / Finishing" }, { key: "photo", label: "Photography" },
    { key: "packaging", label: "Packaging" }, { key: "listing", label: "Listing / Admin" },
];
const relatedTools = [
    { name: "Hourly Rate", href: "/pricing/hourly-rate", icon: Timer },
    { name: "Handmade Pricing", href: "/pricing/handmade-pricing", icon: DollarSign },
    { name: "Material Tracker", href: "/pricing/material-tracker", icon: Calculator },
];
const faqItems = [
    { q: "Should I track design and shopping time?", a: "Yes. Non-sewing time is real work. Most sellers spend 30-50% of project time on non-sewing tasks like shopping, photography, and admin." },
    { q: "How do I track time when I pause and resume?", a: "Use a simple timer or log start/stop times. Add a 10-15% buffer for interruptions and context switching." },
    { q: "How do I price faster production?", a: "As you get faster, your effective hourly rate increases. Don't lower prices -- your skill is worth MORE, not less." },
];

type StageTime = Record<string, string>;

export default function TimeTrackerPage() {
    const [stageHours, setStageHours] = useState<StageTime>(Object.fromEntries(stages.map(s => [s.key, ""])));
    const [hourlyRate, setHourlyRate] = useState("25"); const [buffer, setBuffer] = useState("10");
    const [activeFaq, setActiveFaq] = useState<number | null>(null); const [copied, setCopied] = useState(false);

    const hr = parseFloat(hourlyRate) || 25; const bf = parseFloat(buffer) || 10;
    const totalHrs = stages.reduce((s, st) => s + (parseFloat(stageHours[st.key]) || 0), 0);
    const withBuffer = totalHrs * (1 + bf / 100);
    const laborCost = withBuffer * hr;
    const hasResult = totalHrs > 0;

    const updateStage = (key: string, val: string) => setStageHours({ ...stageHours, [key]: val });

    const handleCopy = useCallback(() => { navigator.clipboard.writeText(`Total time: ${withBuffer.toFixed(1)} hrs (incl. ${bf}% buffer). Labor cost at $${hr}/hr: $${laborCost.toFixed(2)}.`); setCopied(true); setTimeout(() => setCopied(false), 2000); }, [withBuffer, bf, hr, laborCost]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Pricing", href: "/pricing" }, { label: "Time Tracker" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><Timer size={14} strokeWidth={1.5} /> Pricing</span><h1>Sewing Time Tracker</h1><p>Track time by production stage to accurately price your labor and identify bottlenecks.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Project Stages</h2>
                    <div className="calculator-form">
                        {stages.map(s => (<div key={s.key} className="calculator-form-row" style={{ marginBottom: 8 }}>
                            <div className="input-group" style={{ flex: 2 }}><label className="input-label">{s.label}</label></div>
                            <div className="input-group" style={{ flex: 1 }}><input type="number" className="input-field input-mono" placeholder="hrs" value={stageHours[s.key]} onChange={e => updateStage(s.key, e.target.value)} min="0" step="0.25" /></div>
                        </div>))}
                        <div className="calculator-form-row" style={{ marginTop: 12 }}>
                            <div className="input-group"><label className="input-label">Hourly Rate ($)</label><input type="number" className="input-field input-mono" value={hourlyRate} onChange={e => setHourlyRate(e.target.value)} min="0" /></div>
                            <div className="input-group"><label className="input-label">Buffer for Interruptions %</label><select className="input-field" value={buffer} onChange={e => setBuffer(e.target.value)}><option value="0">None</option><option value="10">10%</option><option value="15">15%</option><option value="20">20%</option></select></div>
                        </div>
                    </div>
                    {hasResult && (<div><div className="calculator-divider" />
                        <div className="result-card"><div className="result-prefix">Total Labor Cost</div><div className="result-value">${laborCost.toFixed(2)}</div><div className="result-label">{withBuffer.toFixed(1)} hours x ${hr}/hr (incl. {bf}% buffer)</div></div>
                        <div className={styles.resultDetails} style={{ marginTop: 12 }}>
                            {stages.filter(s => parseFloat(stageHours[s.key]) > 0).map(s => (<div key={s.key} className="result-row"><span className="result-row-label">{s.label}</span><span className="result-row-value">{stageHours[s.key]} hrs ({((parseFloat(stageHours[s.key]) || 0) / totalHrs * 100).toFixed(0)}%)</span></div>))}
                        </div>
                        <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
                    </div>)}
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}