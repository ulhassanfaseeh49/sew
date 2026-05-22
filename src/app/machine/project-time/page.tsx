"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { CalendarDays, Copy, Printer, ChevronDown, Clock, DollarSign } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const phases = [
    { id: "planning", label: "Planning & Shopping", defaultMin: 30 },
    { id: "pattern", label: "Pattern Work", defaultMin: 60 },
    { id: "prep", label: "Fabric Preparation", defaultMin: 90 },
    { id: "cutting", label: "Cutting & Marking", defaultMin: 60 },
    { id: "sewing", label: "Sewing Construction", defaultMin: 180 },
    { id: "pressing", label: "Pressing", defaultMin: 45 },
    { id: "fitting", label: "Fitting & Adjustment", defaultMin: 30 },
    { id: "finishing", label: "Finishing & Hand Sewing", defaultMin: 30 },
];

const relatedTools = [
    { name: "Speed Estimator", href: "/machine/speed-estimator", icon: Clock },
    { name: "Stitch Length Calculator", href: "/machine/stitch-length", icon: Clock },
    { name: "Pricing Calculator", href: "/pricing", icon: DollarSign },
];

const faqItems = [
    { q: "Why do projects always take longer than expected?", a: "Most sewists only estimate machine sewing time. But cutting, pressing, fitting, and finishing can account for 50-65% of total project time. Include ALL phases when planning." },
    { q: "How do I estimate for commissions?", a: "Track actual time for similar past projects. Include every phase. Add 20% buffer for custom work (client changes, extra fittings). Price all phases, not just sewing." },
    { q: "What takes the most time?", a: "For a typical dress: sewing 35%, cutting 15%, pressing 15%, pattern work 20%, finishing 15%. Complex garments shift more time to fitting and construction." },
];

export default function ProjectTimePage() {
    const [times, setTimes] = useState<Record<string, string>>({});
    const [rate, setRate] = useState("");
    const [hrsPerWeek, setHrs] = useState("4");
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const [copied, setCopied] = useState(false);

    const getMin = (id: string) => parseInt(times[id] || "") || phases.find(p => p.id === id)!.defaultMin;
    const totalMins = phases.reduce((s, p) => s + getMin(p.id), 0);
    const hrRate = parseFloat(rate) || 0;
    const hpw = parseFloat(hrsPerWeek) || 4;
    const weeks = Math.ceil((totalMins / 60) / hpw);
    const fmtTime = (m: number) => { const h = Math.floor(m / 60); return h > 0 ? `${h}h ${m % 60}m` : `${m}m`; };

    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(`Total project time: ${fmtTime(totalMins)} (${(totalMins / 60).toFixed(1)} hours)`);
        setCopied(true); setTimeout(() => setCopied(false), 2000);
    }, [totalMins]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Machine Tools", href: "/machine" }, { label: "Project Time" }]} />
            <div className="calculator-layout">
                <div className="calculator-main">
                    <div className={styles.toolHeader}>
                        <span className="category-badge"><CalendarDays size={14} strokeWidth={1.5} /> Sewing Machine Tool</span>
                        <h1>Project Time Estimator</h1>
                        <p>Estimate total project time for ALL phases — shopping, pattern, cutting, sewing, pressing, finishing.</p>
                    </div>
                    <div className="calculator-card">
                        <h2 className={styles.calcTitle}>Phase-by-Phase Estimate (minutes)</h2>
                        <div className="calculator-form">
                            {phases.map(p => (
                                <div className="input-group" key={p.id}>
                                    <label className="input-label">{p.label}</label>
                                    <input type="number" className="input-field input-mono" placeholder={`Default: ${p.defaultMin}`} value={times[p.id] || ""} onChange={e => setTimes({ ...times, [p.id]: e.target.value })} min="0" step="15" />
                                </div>
                            ))}
                            <div className="calculator-form-row">
                                <div className="input-group"><label className="input-label">Hourly Rate (optional)</label><input type="number" className="input-field input-mono" placeholder="e.g., 25" value={rate} onChange={e => setRate(e.target.value)} min="0" /></div>
                                <div className="input-group"><label className="input-label">Hours/Week Available</label><input type="number" className="input-field input-mono" value={hrsPerWeek} onChange={e => setHrs(e.target.value)} min="1" /></div>
                            </div>
                        </div>
                        <div className="calculator-divider" />
                        <div className="result-card">
                            <div className="result-prefix">Total Project Time</div>
                            <div className="result-value">{fmtTime(totalMins)}</div>
                            <div className="result-label">{(totalMins / 60).toFixed(1)} hours total</div>
                        </div>
                        <div className={styles.resultDetails} style={{ marginTop: 16 }}>
                            {phases.map(p => (
                                <div className="result-row" key={p.id}><span className="result-row-label">{p.label}</span><span className="result-row-value">{fmtTime(getMin(p.id))} ({Math.round((getMin(p.id) / totalMins) * 100)}%)</span></div>
                            ))}
                            <div className="result-row" style={{ borderTop: "2px solid var(--color-border)", paddingTop: 8, marginTop: 8 }}>
                                <span className="result-row-label">Completion at {hpw}h/week</span>
                                <span className="result-row-value">{weeks} week{weeks > 1 ? "s" : ""}</span>
                            </div>
                            {hrRate > 0 && <div className="result-row"><span className="result-row-label">Labor cost</span><span className="result-row-value">${((totalMins / 60) * hrRate).toFixed(0)}</span></div>}
                        </div>
                        <div className="toolbar" style={{ marginTop: 16 }}>
                            <button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button>
                            <button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button>
                        </div>
                    </div>
                    <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
                </div>
                <aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside>
            </div>
        </div>
    );
}