"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Scaling, Copy, Printer, ChevronDown, Droplets, Ruler } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const fiberDefaults: Record<string, { label: string; len: number; cross: number }> = {
    cotton: { label: "100% Cotton", len: 4, cross: 2.5 },
    linen: { label: "100% Linen", len: 7, cross: 5 },
    rayon: { label: "100% Rayon", len: 8, cross: 5 },
    wool: { label: "100% Wool", len: 5, cross: 3 },
    silk: { label: "100% Silk", len: 2, cross: 1 },
    cottonPoly: { label: "Cotton/Poly Blend", len: 2, cross: 1.5 },
    cottonSpandex: { label: "Cotton/Spandex", len: 3.5, cross: 3 },
};

const relatedTools = [
    { name: "Pre-Wash Estimator", href: "/shrinkage/pre-wash-estimator", icon: Droplets },
    { name: "Shrinkage % Calc", href: "/shrinkage/percentage-calculator", icon: Ruler },
    { name: "Post-Wash Yardage", href: "/shrinkage/post-wash-yardage", icon: Ruler },
];
const faqItems = [
    { q: "How do I adjust a pattern for shrinkage?", a: "Increase each measurement by the expected shrinkage percentage. For 4% shrinkage, multiply each dimension by 1/0.96 (about 1.042)." },
    { q: "Is it better to pre-wash or adjust the pattern?", a: "Pre-washing is safer and simpler. Pattern adjustment works but is complex for fitted garments with curves and darts." },
    { q: "Can I make a garment slightly large knowing it will shrink?", a: "Yes, but only for simple shapes. Complex fitted garments with darts and panels will not shrink evenly and may lose their shape." },
];

export default function GarmentAdjusterPage() {
    const [fiber, setFiber] = useState("cotton");
    const [bust, setBust] = useState(""); const [waist, setWaist] = useState(""); const [hip, setHip] = useState(""); const [length, setLength] = useState(""); const [sleeve, setSleeve] = useState("");
    const [useCustom, setUseCustom] = useState(false); const [customLen, setCustomLen] = useState("4"); const [customCross, setCustomCross] = useState("2.5");
    const [activeFaq, setActiveFaq] = useState<number | null>(null); const [copied, setCopied] = useState(false);

    const fb = fiberDefaults[fiber];
    const lenPct = useCustom ? (parseFloat(customLen) || 0) : fb.len;
    const crossPct = useCustom ? (parseFloat(customCross) || 0) : fb.cross;
    const adj = (val: string, pct: number) => { const v = parseFloat(val) || 0; return v > 0 ? (v / (1 - pct / 100)).toFixed(1) : ""; };

    const measurements = [
        { label: "Bust/Chest", val: bust, dir: "cross" },
        { label: "Waist", val: waist, dir: "cross" },
        { label: "Hip", val: hip, dir: "cross" },
        { label: "Length", val: length, dir: "len" },
        { label: "Sleeve", val: sleeve, dir: "len" },
    ];
    const hasResult = measurements.some(m => parseFloat(m.val) > 0);

    const handleCopy = useCallback(() => {
        const lines = measurements.filter(m => parseFloat(m.val) > 0).map(m => `${m.label}: ${m.val}" -> cut ${adj(m.val, m.dir === "len" ? lenPct : crossPct)}"`);
        navigator.clipboard.writeText(lines.join("\n")); setCopied(true); setTimeout(() => setCopied(false), 2000);
    }, [measurements, lenPct, crossPct]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Shrinkage", href: "/shrinkage" }, { label: "Garment Adjuster" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><Scaling size={14} strokeWidth={1.5} /> Shrinkage</span><h1>Garment Shrinkage Adjuster</h1><p>Calculate pattern adjustments to compensate for post-construction shrinkage.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Desired Finished Measurements</h2>
                    <div className="calculator-form">
                        <div className="input-group"><label className="input-label">Fiber Content</label><select className="input-field" value={fiber} onChange={e => setFiber(e.target.value)}>{Object.entries(fiberDefaults).map(([k, v]) => <option key={k} value={k}>{v.label} (~{v.len}%/{v.cross}%)</option>)}</select></div>
                        <div className="calculator-form-row" style={{ alignItems: "center" }}>
                            <label style={{ fontSize: "var(--text-sm)", display: "flex", alignItems: "center", gap: 8 }}><input type="checkbox" checked={useCustom} onChange={e => setUseCustom(e.target.checked)} /> Use custom shrinkage %</label>
                            {useCustom && (<><div className="input-group"><label className="input-label">Length %</label><input type="number" className="input-field input-mono" value={customLen} onChange={e => setCustomLen(e.target.value)} min="0" max="50" step="0.5" style={{ maxWidth: 80 }} /></div><div className="input-group"><label className="input-label">Cross %</label><input type="number" className="input-field input-mono" value={customCross} onChange={e => setCustomCross(e.target.value)} min="0" max="50" step="0.5" style={{ maxWidth: 80 }} /></div></>)}
                        </div>
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Bust/Chest (in)</label><input type="number" className="input-field input-mono" placeholder="e.g., 40" value={bust} onChange={e => setBust(e.target.value)} min="0" /></div>
                            <div className="input-group"><label className="input-label">Waist (in)</label><input type="number" className="input-field input-mono" placeholder="e.g., 30" value={waist} onChange={e => setWaist(e.target.value)} min="0" /></div>
                            <div className="input-group"><label className="input-label">Hip (in)</label><input type="number" className="input-field input-mono" placeholder="e.g., 42" value={hip} onChange={e => setHip(e.target.value)} min="0" /></div>
                        </div>
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Length (in)</label><input type="number" className="input-field input-mono" placeholder="e.g., 28" value={length} onChange={e => setLength(e.target.value)} min="0" /></div>
                            <div className="input-group"><label className="input-label">Sleeve (in)</label><input type="number" className="input-field input-mono" placeholder="e.g., 23" value={sleeve} onChange={e => setSleeve(e.target.value)} min="0" /></div>
                        </div>
                    </div>
                    {hasResult && (<div><div className="calculator-divider" />
                        <div className={styles.tableWrap}><table className={styles.convTable}><thead><tr><th>Measurement</th><th>Desired Finish</th><th>Cut To</th></tr></thead>
                            <tbody>{measurements.filter(m => parseFloat(m.val) > 0).map(m => (<tr key={m.label}><td style={{ fontWeight: 600 }}>{m.label}</td><td>{m.val}&quot;</td><td style={{ fontWeight: 600 }}>{adj(m.val, m.dir === "len" ? lenPct : crossPct)}&quot;</td></tr>))}</tbody>
                        </table></div>
                        <p style={{ margin: "12px 0 0", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", fontStyle: "italic" }}>Lengthwise adjustment: +{lenPct}% | Crosswise adjustment: +{crossPct}%</p>
                        <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
                    </div>)}
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}