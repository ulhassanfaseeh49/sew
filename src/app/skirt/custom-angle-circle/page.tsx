"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Settings, Copy, Printer, ChevronDown, Circle, Ruler } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const presets = [
    { label: "90deg (Quarter)", angle: 90 }, { label: "120deg (One-third)", angle: 120 },
    { label: "180deg (Half)", angle: 180 }, { label: "240deg (Two-thirds)", angle: 240 },
    { label: "270deg (Three-quarter)", angle: 270 }, { label: "300deg (Nearly full)", angle: 300 },
    { label: "360deg (Full)", angle: 360 },
];
const relatedTools = [
    { name: "Full Circle", href: "/skirt/full-circle", icon: Circle },
    { name: "Waist Radius", href: "/skirt/waist-radius", icon: Ruler },
    { name: "Hem Circumference", href: "/skirt/hem-circumference", icon: Circle },
];
const faqItems = [
    { q: "What is the general formula for any angle?", a: "r = waist x 360 / (2 x pi x angle). Simplified: r = waist x 57.296 / angle. This works for any degree from 45 to 360." },
    { q: "What angle gives the best balance of fullness and fabric?", a: "180-240 degrees is the sweet spot. Half circle (180) is practical and elegant. Two-thirds (240) adds drama without extreme fabric cost." },
    { q: "Can I use a non-standard angle like 150 degrees?", a: "Absolutely. Any angle works mathematically. Unusual angles create unique silhouettes. Enter your custom value in the calculator." },
];

export default function CustomAnglePage() {
    const [waist, setWaist] = useState("28"); const [length, setLength] = useState("24"); const [angle, setAngle] = useState("240");
    const [activeFaq, setActiveFaq] = useState<number | null>(null); const [copied, setCopied] = useState(false);

    const w = parseFloat(waist) || 28; const l = parseFloat(length) || 24; const a = parseFloat(angle) || 180;
    const radius = (w * 360) / (2 * Math.PI * a);
    const outerRadius = radius + l;
    const hemCirc = (a / 360) * 2 * Math.PI * outerRadius;
    const yardage = ((outerRadius + 1) * 2) / 36;
    const hasResult = w > 0 && l > 0 && a >= 45 && a <= 360;

    const handleCopy = useCallback(() => { navigator.clipboard.writeText(`${a}deg circle: radius ${radius.toFixed(1)}", hem ${hemCirc.toFixed(0)}", ~${yardage.toFixed(1)} yd.`); setCopied(true); setTimeout(() => setCopied(false), 2000); }, [a, radius, hemCirc, yardage]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Skirt Calculators", href: "/skirt" }, { label: "Custom Angle" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><Settings size={14} strokeWidth={1.5} /> Skirt</span><h1>Custom Angle Circle Skirt Calculator</h1><p>Calculate any circle skirt from 45 to 360 degrees -- choose the exact fullness you want.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Measurements</h2>
                    <div className="calculator-form">
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Waist (in)</label><input type="number" className="input-field input-mono" value={waist} onChange={e => setWaist(e.target.value)} min="1" step="0.5" /></div>
                            <div className="input-group"><label className="input-label">Skirt Length (in)</label><input type="number" className="input-field input-mono" value={length} onChange={e => setLength(e.target.value)} min="1" step="0.5" /></div>
                        </div>
                        <div className="input-group"><label className="input-label">Angle (degrees)</label><input type="range" min="45" max="360" step="5" value={angle} onChange={e => setAngle(e.target.value)} style={{ width: "100%", marginBottom: 4 }} /><div style={{ display: "flex", justifyContent: "space-between", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}><span>45deg</span><span style={{ fontWeight: 600 }}>{angle}deg</span><span>360deg</span></div></div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>{presets.map(p => (<button key={p.angle} className={`btn btn-secondary btn-sm`} style={{ fontSize: 12, opacity: parseInt(angle) === p.angle ? 1 : 0.6 }} onClick={() => setAngle(String(p.angle))}>{p.label}</button>))}</div>
                    </div>
                    {hasResult && (<div><div className="calculator-divider" />
                        <div className="result-card"><div className="result-prefix">Waist Radius at {a}deg</div><div className="result-value">{radius.toFixed(2)}&quot;</div><div className="result-label">r = {w} x 57.296 / {a}</div></div>
                        <div className={styles.resultDetails} style={{ marginTop: 12 }}>
                            <div className="result-row"><span className="result-row-label">Outer radius</span><span className="result-row-value">{outerRadius.toFixed(1)}&quot;</span></div>
                            <div className="result-row"><span className="result-row-label">Hem circumference</span><span className="result-row-value">{hemCirc.toFixed(0)}&quot; ({(hemCirc / 12).toFixed(1)} ft)</span></div>
                            <div className="result-row"><span className="result-row-label">Yardage estimate</span><span className="result-row-value">~{yardage.toFixed(1)} yards</span></div>
                        </div>
                        <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
                    </div>)}
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}