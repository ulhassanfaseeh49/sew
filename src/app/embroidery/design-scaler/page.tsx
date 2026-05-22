"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Scaling, Copy, Printer, ChevronDown, Layers, Maximize } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const relatedTools = [
    { name: "Thread Coverage", href: "/embroidery/thread-coverage", icon: Layers },
    { name: "Hoop Selector", href: "/embroidery/hoop-selector", icon: Maximize },
    { name: "Stabilizer", href: "/embroidery/stabilizer-selector", icon: Layers },
];
const faqItems = [
    { q: "How much can I safely resize an embroidery design?", a: "Stay within 80-120% for best results. Beyond 150% or below 60%, re-digitizing is recommended." },
    { q: "What happens to stitch count when I resize?", a: "Stitch count stays roughly the same, but density changes. Enlarged designs become sparse; reduced designs pile up." },
    { q: "Why does my scaled design look different?", a: "Scaling changes stitch density. Satin stitches become too long when enlarged, or pile up when reduced. Test stitch first." },
];

export default function DesignScalerPage() {
    const [origW, setOrigW] = useState(""); const [origH, setOrigH] = useState(""); const [origStitches, setOrigStitches] = useState("");
    const [scalePct, setScalePct] = useState("100");
    const [activeFaq, setActiveFaq] = useState<number | null>(null); const [copied, setCopied] = useState(false);

    const ow = parseFloat(origW) || 0; const oh = parseFloat(origH) || 0; const os = parseInt(origStitches) || 0;
    const sp = parseFloat(scalePct) || 100;
    const newW = ow * sp / 100; const newH = oh * sp / 100;
    const origArea = ow * oh; const newArea = newW * newH;
    const densityChange = origArea > 0 ? (origArea / newArea) : 1;
    const hasResult = ow > 0 && oh > 0;

    const quality = sp >= 80 && sp <= 120 ? "safe" : sp >= 60 && sp <= 150 ? "caution" : "danger";
    const qualityLabel = quality === "safe" ? "Safe to scale" : quality === "caution" ? "Proceed with caution -- test stitch first" : "Not recommended -- consider re-digitizing";

    const presets = [
        { label: "Left chest logo", w: 3.5, h: 3.5 }, { label: "Cap front", w: 2.25, h: 3.5 },
        { label: "Full chest", w: 10, h: 10 }, { label: "Sleeve", w: 3, h: 3 },
    ];

    const comparisons = [50, 75, 100, 125, 150, 200].map(p => ({ pct: p, w: (ow * p / 100).toFixed(1), h: (oh * p / 100).toFixed(1), quality: p >= 80 && p <= 120 ? "Safe" : p >= 60 && p <= 150 ? "Caution" : "Re-digitize" }));

    const handleCopy = useCallback(() => { navigator.clipboard.writeText(`Design: ${ow}" x ${oh}" scaled to ${sp}% = ${newW.toFixed(1)}" x ${newH.toFixed(1)}". Quality: ${qualityLabel}.`); setCopied(true); setTimeout(() => setCopied(false), 2000); }, [ow, oh, sp, newW, newH, qualityLabel]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Embroidery", href: "/embroidery" }, { label: "Design Scaler" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><Scaling size={14} strokeWidth={1.5} /> Embroidery</span><h1>Embroidery Design Size Scaler</h1><p>Calculate new dimensions and assess quality when resizing embroidery designs.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Original Design</h2>
                    <div className="calculator-form">
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Width (in)</label><input type="number" className="input-field input-mono" placeholder="e.g., 5" value={origW} onChange={e => setOrigW(e.target.value)} min="0" step="0.1" /></div>
                            <div className="input-group"><label className="input-label">Height (in)</label><input type="number" className="input-field input-mono" placeholder="e.g., 4" value={origH} onChange={e => setOrigH(e.target.value)} min="0" step="0.1" /></div>
                            <div className="input-group"><label className="input-label">Stitch Count (optional)</label><input type="number" className="input-field input-mono" value={origStitches} onChange={e => setOrigStitches(e.target.value)} min="0" /></div>
                        </div>
                        <div className="input-group" style={{ marginTop: 8 }}><label className="input-label">Scale to %</label><input type="range" min="25" max="250" step="5" value={scalePct} onChange={e => setScalePct(e.target.value)} style={{ width: "100%" }} /><div style={{ textAlign: "center", fontWeight: 600, fontSize: "var(--text-sm)" }}>{scalePct}%</div></div>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>{presets.map(p => { const pct = ow > 0 ? Math.round((p.w / ow) * 100) : 0; return (<button key={p.label} className="btn btn-secondary btn-sm" onClick={() => { if (ow > 0) setScalePct(String(pct)); }}>{p.label} ({pct}%)</button>); })}</div>
                    </div>
                    {hasResult && (<div><div className="calculator-divider" />
                        <div className="result-card"><div className="result-prefix">Scaled Size</div><div className="result-value">{newW.toFixed(1)}&quot; x {newH.toFixed(1)}&quot;</div><div className="result-label" style={{ color: quality === "safe" ? "var(--color-success, #22c55e)" : quality === "caution" ? "var(--color-warning, #eab308)" : "var(--color-error)" }}>{qualityLabel}</div></div>
                        <div className={styles.resultDetails} style={{ marginTop: 12 }}>
                            <div className="result-row"><span className="result-row-label">Density change</span><span className="result-row-value">{densityChange.toFixed(2)}x</span></div>
                            {os > 0 && <div className="result-row"><span className="result-row-label">Est. stitch count</span><span className="result-row-value">~{os} (unchanged)</span></div>}
                        </div>
                        <div className="calculator-card" style={{ marginTop: 16 }}><h3 style={{ fontSize: "var(--text-sm)", fontWeight: 600, marginBottom: 8 }}>Scale Comparison</h3>
                            <div className={styles.tableWrap}><table className={styles.convTable}><thead><tr><th>Scale %</th><th>Width</th><th>Height</th><th>Quality</th></tr></thead>
                                <tbody>{comparisons.map(c => (<tr key={c.pct} style={{ background: c.pct === sp ? "var(--color-surface-hover)" : undefined }}><td style={{ fontWeight: 600 }}>{c.pct}%</td><td>{c.w}&quot;</td><td>{c.h}&quot;</td><td>{c.quality}</td></tr>))}</tbody>
                            </table></div>
                        </div>
                        <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
                    </div>)}
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}