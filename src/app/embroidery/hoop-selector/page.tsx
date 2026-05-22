"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Maximize, Copy, Printer, ChevronDown, Layers, Target } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const hoopSizes = [
    { label: '4" x 4"', w: 4, h: 4 }, { label: '5" x 7"', w: 5, h: 7 }, { label: '6" x 10"', w: 6, h: 10 },
    { label: '8" x 8"', w: 8, h: 8 }, { label: '8" x 12"', w: 8, h: 12 }, { label: '9.5" x 14"', w: 9.5, h: 14 },
];
const relatedTools = [
    { name: "Thread Coverage", href: "/embroidery/thread-coverage", icon: Layers },
    { name: "Stabilizer", href: "/embroidery/stabilizer-selector", icon: Target },
    { name: "Design Scaler", href: "/embroidery/design-scaler", icon: Maximize },
];
const faqItems = [
    { q: "What size hoop do I need for my design?", a: "Choose the smallest hoop that fits your design with at least 0.5 inches of clearance on all sides. Smaller hoops provide better stability." },
    { q: "Can I use any hoop with my machine?", a: "No. Each machine brand has specific hoop mounting systems. Check your manual for compatible hoop sizes." },
    { q: "How much clearance should I leave?", a: "Minimum 0.25 inches from the design edge to hoop edge. Ideally 0.5 inches for best stability and stitch quality." },
];

export default function HoopSelectorPage() {
    const [designW, setDesignW] = useState(""); const [designH, setDesignH] = useState(""); const [margin, setMargin] = useState("0.5");
    const [activeFaq, setActiveFaq] = useState<number | null>(null); const [copied, setCopied] = useState(false);

    const dw = parseFloat(designW) || 0; const dh = parseFloat(designH) || 0; const mg = parseFloat(margin) || 0.5;
    const needed = { w: dw + mg * 2, h: dh + mg * 2 };
    const hasResult = dw > 0 && dh > 0;

    const analysis = hoopSizes.map(h => {
        const fitsNormal = h.w >= needed.w && h.h >= needed.h;
        const fitsRotated = h.h >= needed.w && h.w >= needed.h;
        const fits = fitsNormal || fitsRotated;
        const clearW = fitsNormal ? ((h.w - dw) / 2) : fitsRotated ? ((h.h - dw) / 2) : 0;
        const clearH = fitsNormal ? ((h.h - dh) / 2) : fitsRotated ? ((h.w - dh) / 2) : 0;
        return { ...h, fits, clearW, clearH, tight: fits && (clearW < 0.5 || clearH < 0.5) };
    });
    const best = analysis.find(a => a.fits && !a.tight) || analysis.find(a => a.fits);

    const handleCopy = useCallback(() => { navigator.clipboard.writeText(`Design: ${dw}" x ${dh}". Best hoop: ${best?.label || "N/A"} (${best?.clearW.toFixed(1)}" clearance).`); setCopied(true); setTimeout(() => setCopied(false), 2000); }, [dw, dh, best]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Embroidery", href: "/embroidery" }, { label: "Hoop Selector" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><Maximize size={14} strokeWidth={1.5} /> Embroidery</span><h1>Embroidery Hoop Size Selector</h1><p>Find the best hoop size for your design dimensions with clearance analysis.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Design Dimensions</h2>
                    <div className="calculator-form"><div className="calculator-form-row">
                        <div className="input-group"><label className="input-label">Design Width (in)</label><input type="number" className="input-field input-mono" placeholder="e.g., 4.5" value={designW} onChange={e => setDesignW(e.target.value)} min="0" step="0.1" /></div>
                        <div className="input-group"><label className="input-label">Design Height (in)</label><input type="number" className="input-field input-mono" placeholder="e.g., 6" value={designH} onChange={e => setDesignH(e.target.value)} min="0" step="0.1" /></div>
                        <div className="input-group"><label className="input-label">Margin (in)</label><select className="input-field" value={margin} onChange={e => setMargin(e.target.value)}><option value="0.25">0.25"</option><option value="0.5">0.5" (recommended)</option><option value="1">1"</option></select></div>
                    </div></div>
                    {hasResult && (<div><div className="calculator-divider" />
                        {best && <div className="result-card"><div className="result-prefix">Recommended Hoop</div><div className="result-value">{best.label}</div><div className="result-label">Clearance: {best.clearW.toFixed(1)}" x {best.clearH.toFixed(1)}" on each side</div></div>}
                        <div className={styles.tableWrap} style={{ marginTop: 12 }}><table className={styles.convTable}><thead><tr><th>Hoop</th><th>Fits?</th><th>Clearance</th><th>Note</th></tr></thead>
                            <tbody>{analysis.map(a => (<tr key={a.label} style={{ background: a === best ? "var(--color-surface-hover)" : undefined, color: !a.fits ? "var(--color-text-secondary)" : undefined }}><td style={{ fontWeight: 600 }}>{a.label}</td><td>{a.fits ? "Yes" : "No"}</td><td>{a.fits ? `${a.clearW.toFixed(1)}" x ${a.clearH.toFixed(1)}"` : "--"}</td><td>{!a.fits ? "Too small" : a.tight ? "Tight fit" : a === best ? "Best choice" : "Usable"}</td></tr>))}</tbody>
                        </table></div>
                        <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
                    </div>)}
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}