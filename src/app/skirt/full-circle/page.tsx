"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Circle, Copy, Printer, ChevronDown, Scissors, Ruler } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const hemTypes: Record<string, number> = { "Rolled hem (1/4\")": 0.25, "Narrow double fold (1/2\")": 0.5, "Standard double fold (1\")": 1, "Horsehair braid (1.25\")": 1.25 };
const relatedTools = [
    { name: "Half Circle", href: "/skirt/half-circle", icon: Circle },
    { name: "Waist Radius", href: "/skirt/waist-radius", icon: Ruler },
    { name: "Hem Circumference", href: "/skirt/hem-circumference", icon: Scissors },
];
const faqItems = [
    { q: "How much fabric does a full circle skirt need?", a: "A full circle skirt requires a SQUARE of fabric. For a 28\" waist and 24\" length, you need about 3.5 yards of 60\" fabric." },
    { q: "Why must I hang the skirt before hemming?", a: "Fabric cut on bias (45 degrees) stretches and drops. A full circle has significant bias sections. Hang for 24-48 hours, then trim the hem level." },
    { q: "Can I cut a full circle from 44\" fabric?", a: "Only for very short skirts. Most full circle skirts on 44\" fabric require a two-piece layout with a center seam." },
];

export default function FullCirclePage() {
    const [waist, setWaist] = useState("28"); const [length, setLength] = useState("24"); const [fabWidth, setFabWidth] = useState("60"); const [hemType, setHemType] = useState("Rolled hem (1/4\")");
    const [activeFaq, setActiveFaq] = useState<number | null>(null); const [copied, setCopied] = useState(false);

    const w = parseFloat(waist) || 28; const l = parseFloat(length) || 24; const fw = parseFloat(fabWidth) || 60;
    const hemAllow = hemTypes[hemType] || 0.25; const seamAllow = 0.625;
    const radius = w / (2 * Math.PI);
    const outerRadius = radius + l;
    const hemCirc = 2 * Math.PI * outerRadius;
    const squareNeeded = (outerRadius + hemAllow + seamAllow) * 2;
    const fitsOnePiece = squareNeeded <= fw;
    const yardageOnePiece = squareNeeded / 36;
    const yardageTwoPiece = ((outerRadius + hemAllow + seamAllow) * 2) / 36;
    const hasResult = w > 0 && l > 0;

    const handleCopy = useCallback(() => { navigator.clipboard.writeText(`Full circle skirt: waist radius ${radius.toFixed(1)}", outer radius ${outerRadius.toFixed(1)}", hem ${hemCirc.toFixed(0)}". Yardage: ~${(fitsOnePiece ? yardageOnePiece : yardageTwoPiece).toFixed(1)} yd.`); setCopied(true); setTimeout(() => setCopied(false), 2000); }, [radius, outerRadius, hemCirc, fitsOnePiece, yardageOnePiece, yardageTwoPiece]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Skirt Calculators", href: "/skirt" }, { label: "Full Circle" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><Circle size={14} strokeWidth={1.5} /> Skirt</span><h1>Full Circle Skirt Calculator</h1><p>Calculate waist radius, fabric yardage, and hem circumference for a 360-degree circle skirt.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Measurements</h2>
                    <div className="calculator-form">
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Waist (in)</label><input type="number" className="input-field input-mono" value={waist} onChange={e => setWaist(e.target.value)} min="1" step="0.5" /></div>
                            <div className="input-group"><label className="input-label">Skirt Length (in)</label><input type="number" className="input-field input-mono" value={length} onChange={e => setLength(e.target.value)} min="1" step="0.5" /></div>
                        </div>
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Fabric Width (in)</label><select className="input-field" value={fabWidth} onChange={e => setFabWidth(e.target.value)}><option value="44">44/45&quot;</option><option value="54">54&quot;</option><option value="60">60&quot;</option><option value="118">118&quot;</option></select></div>
                            <div className="input-group"><label className="input-label">Hem Type</label><select className="input-field" value={hemType} onChange={e => setHemType(e.target.value)}>{Object.keys(hemTypes).map(h => (<option key={h} value={h}>{h}</option>))}</select></div>
                        </div>
                    </div>
                    {hasResult && (<div><div className="calculator-divider" />
                        <div className="result-card"><div className="result-prefix">Waist Radius</div><div className="result-value">{radius.toFixed(2)}&quot;</div><div className="result-label">Draw a circle with this radius for the waist opening</div></div>
                        <div className={styles.resultDetails} style={{ marginTop: 12 }}>
                            <div className="result-row"><span className="result-row-label">Outer radius (waist + length)</span><span className="result-row-value">{outerRadius.toFixed(1)}&quot;</span></div>
                            <div className="result-row"><span className="result-row-label">Hem circumference</span><span className="result-row-value">{hemCirc.toFixed(0)}&quot; ({(hemCirc / 12).toFixed(1)} ft)</span></div>
                            <div className="result-row"><span className="result-row-label">Fabric square needed</span><span className="result-row-value">{squareNeeded.toFixed(1)}&quot; x {squareNeeded.toFixed(1)}&quot;</span></div>
                            <div className="result-row"><span className="result-row-label">Fits one-piece on {fw}&quot;?</span><span className="result-row-value">{fitsOnePiece ? "Yes" : "No -- use 2-piece layout"}</span></div>
                            <div className="result-row"><span className="result-row-label">Yardage estimate</span><span className="result-row-value">~{(fitsOnePiece ? yardageOnePiece : yardageTwoPiece).toFixed(1)} yards</span></div>
                        </div>
                        <p style={{ margin: "12px 0 0", padding: 12, fontSize: "var(--text-sm)", color: "var(--color-warning)", background: "var(--color-surface-hover)", borderRadius: 8, lineHeight: 1.6 }}>Hang for 24-48 hours before hemming. Bias sections will drop 1/2&quot; to 2&quot;.</p>
                        <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
                    </div>)}
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}