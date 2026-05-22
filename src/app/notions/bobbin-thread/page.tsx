"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Circle, Copy, Printer, ChevronDown, Scissors, Ruler } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const bobbinTypes: Record<string, number> = { "Class 15 (standard A)": 70, "Class 66 (L style)": 60, "Class 15J (drop-in)": 80, "Bernina style": 75, "Viking/Husqvarna": 70, "Industrial bobbin": 120, "Custom": 0 };
const weightFactor: Record<string, number> = { "60wt (fine)": 1.25, "50wt (standard)": 1.0, "40wt": 0.85, "30wt (heavy)": 0.7, "12wt (very heavy)": 0.45 };
const relatedTools = [
    { name: "Thread Yardage", href: "/notions/thread-yardage", icon: Scissors },
    { name: "Spool Size", href: "/notions/spool-size-comparison", icon: Ruler },
    { name: "Thread Weight", href: "/notions/thread-weight-comparison", icon: Ruler },
];
const faqItems = [
    { q: "Why does my bobbin run out before the top thread?", a: "Bobbin thread travels a longer path around the bobbin hook. Also, slightly higher bobbin tension pulls more thread per stitch." },
    { q: "How many bobbins should I pre-wind?", a: "Wind all bobbins needed for a project plus one extra before starting. This prevents interruptions mid-seam." },
    { q: "Can I use lighter thread in the bobbin to save space?", a: "Yes. Using 60wt bobbin thread with 50wt top thread is common. The bobbin holds more thread and changes are less frequent." },
];

export default function BobbinThreadPage() {
    const [bobbinType, setBobbinType] = useState("Class 15 (standard A)");
    const [customCap, setCustomCap] = useState("70");
    const [threadWeight, setThreadWeight] = useState("50wt (standard)");
    const [totalNeeded, setTotalNeeded] = useState("45");
    const [activeFaq, setActiveFaq] = useState<number | null>(null); const [copied, setCopied] = useState(false);

    const baseCap = bobbinType === "Custom" ? (parseFloat(customCap) || 70) : bobbinTypes[bobbinType];
    const factor = weightFactor[threadWeight] || 1;
    const effectiveCap = baseCap * factor;
    const needed = parseFloat(totalNeeded) || 0;
    const bobbinsNeeded = effectiveCap > 0 ? Math.ceil(needed / effectiveCap) : 0;
    const hasResult = needed > 0 && effectiveCap > 0;

    const handleCopy = useCallback(() => { navigator.clipboard.writeText(`${bobbinsNeeded} bobbins needed (${needed} yd total, ~${effectiveCap.toFixed(0)} yd capacity each at ${threadWeight})`); setCopied(true); setTimeout(() => setCopied(false), 2000); }, [bobbinsNeeded, needed, effectiveCap, threadWeight]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Notions", href: "/notions" }, { label: "Bobbin Thread Calculator" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><Circle size={14} strokeWidth={1.5} /> Notions</span><h1>Bobbin Thread Calculator</h1><p>Calculate how many bobbins to pre-wind for your project.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Bobbin Details</h2>
                    <div className="calculator-form">
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Bobbin Type</label><select className="input-field" value={bobbinType} onChange={e => setBobbinType(e.target.value)}>{Object.keys(bobbinTypes).map(b => (<option key={b} value={b}>{b}</option>))}</select></div>
                            {bobbinType === "Custom" && <div className="input-group"><label className="input-label">Capacity (yd)</label><input type="number" className="input-field input-mono" value={customCap} onChange={e => setCustomCap(e.target.value)} min="10" /></div>}
                            <div className="input-group"><label className="input-label">Thread Weight</label><select className="input-field" value={threadWeight} onChange={e => setThreadWeight(e.target.value)}>{Object.keys(weightFactor).map(w => (<option key={w} value={w}>{w}</option>))}</select></div>
                        </div>
                        <div className="input-group"><label className="input-label">Total Bobbin Thread Needed (yd)</label><input type="number" className="input-field input-mono" value={totalNeeded} onChange={e => setTotalNeeded(e.target.value)} min="1" /></div>
                    </div>
                    {hasResult && (<div><div className="calculator-divider" />
                        <div className="result-card"><div className="result-prefix">Bobbins Needed</div><div className="result-value">{bobbinsNeeded} bobbins</div><div className="result-label">Pre-wind {bobbinsNeeded + 1} (plus one spare)</div></div>
                        <div className={styles.resultDetails} style={{ marginTop: 12 }}>
                            <div className="result-row"><span className="result-row-label">Bobbin capacity</span><span className="result-row-value">~{effectiveCap.toFixed(0)} yd</span></div>
                            <div className="result-row"><span className="result-row-label">Thread needed</span><span className="result-row-value">{needed} yd</span></div>
                            <div className="result-row"><span className="result-row-label">Bobbin changes</span><span className="result-row-value">{bobbinsNeeded - 1}</span></div>
                        </div>
                        <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
                    </div>)}
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}