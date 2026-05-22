"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Ruler, Copy, Printer, ChevronDown, BookOpen } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const easeOpts: Record<string, { label: string; add: number }> = {
    min: { label: "Minimum (snug)", add: 0.125 },
    standard: { label: "Standard (smooth)", add: 0.25 },
    generous: { label: "Generous (easy threading)", add: 0.375 },
};

const quickRef = [
    { ew: '1/4"', channel: '3/8"', foldOver: '7/8" - 1"' },
    { ew: '1/2"', channel: '3/4"', foldOver: '1-1/4" - 1-1/2"' },
    { ew: '3/4"', channel: '1"', foldOver: '1-1/2" - 1-3/4"' },
    { ew: '1"', channel: '1-1/4"', foldOver: '1-3/4" - 2"' },
    { ew: '1-1/2"', channel: '1-3/4"', foldOver: '2-1/4" - 2-1/2"' },
    { ew: '2"', channel: '2-1/4"', foldOver: '2-3/4" - 3"' },
];

const relatedTools = [
    { name: "Waist Elastic Calc", href: "/elastic/waist-calculator", icon: Ruler },
    { name: "Drawstring Calc", href: "/elastic/drawstring-calculator", icon: Ruler },
    { name: "Elastic Types Guide", href: "/elastic/types-guide", icon: BookOpen },
];
const faqItems = [
    { q: "How wide should a casing be for elastic?", a: "Elastic width plus 1/4\" ease (standard). Too narrow and elastic bunches; too wide and elastic twists and rolls inside the casing." },
    { q: "What is the difference between fold-over and sewn-on casing?", a: "Fold-over: the garment edge folds to the inside to form the channel. Sewn-on: a separate strip of fabric is sewn to the garment to create the channel." },
    { q: "Why does my elastic keep rolling in the casing?", a: "The casing is likely too wide. Reduce ease, or stitch through the casing and elastic at seam points to prevent rotation." },
];

export default function CasingWidthPage() {
    const [elasticWidth, setElasticWidth] = useState("1"); const [ease, setEase] = useState("standard");
    const [construction, setConstruction] = useState("foldOver");
    const [topSA, setTopSA] = useState("0.25"); const [bottomSA, setBottomSA] = useState("0.25");
    const [activeFaq, setActiveFaq] = useState<number | null>(null); const [copied, setCopied] = useState(false);

    const ew = parseFloat(elasticWidth) || 1; const ea = easeOpts[ease];
    const ts = parseFloat(topSA) || 0.25; const bs = parseFloat(bottomSA) || 0.25;
    const channel = ew + ea.add;
    const foldOverTotal = channel + ts + bs;
    const waistbandStrip = (channel * 2) + ts + bs;

    const handleCopy = useCallback(() => { navigator.clipboard.writeText(`Elastic: ${ew}". Channel: ${channel.toFixed(3)}". ${construction === "foldOver" ? `Fold-over: ${foldOverTotal.toFixed(3)}"` : `Waistband strip: ${waistbandStrip.toFixed(3)}" wide`}`); setCopied(true); setTimeout(() => setCopied(false), 2000); }, [ew, channel, construction, foldOverTotal, waistbandStrip]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Elastic", href: "/elastic" }, { label: "Casing Width" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><Ruler size={14} strokeWidth={1.5} /> Elastic</span><h1>Elastic Casing Width Calculator</h1><p>Calculate fabric casing width for elastic to slide smoothly without bunching.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Casing Details</h2>
                    <div className="calculator-form">
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Elastic Width (inches)</label><input type="number" className="input-field input-mono" value={elasticWidth} onChange={e => setElasticWidth(e.target.value)} min="0.25" step="0.125" /></div>
                            <div className="input-group"><label className="input-label">Ease</label><select className="input-field" value={ease} onChange={e => setEase(e.target.value)}>{Object.entries(easeOpts).map(([k, v]) => <option key={k} value={k}>{v.label} (+{v.add}&quot;)</option>)}</select></div>
                        </div>
                        <div className="input-group"><label className="input-label">Construction</label><select className="input-field" value={construction} onChange={e => setConstruction(e.target.value)}><option value="foldOver">Fold-over casing</option><option value="waistband">Separate waistband strip</option></select></div>
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Top Seam Allowance</label><select className="input-field" value={topSA} onChange={e => setTopSA(e.target.value)}><option value="0.25">1/4&quot;</option><option value="0.375">3/8&quot;</option><option value="0.5">1/2&quot;</option></select></div>
                            <div className="input-group"><label className="input-label">Bottom Seam Allowance</label><select className="input-field" value={bottomSA} onChange={e => setBottomSA(e.target.value)}><option value="0.25">1/4&quot;</option><option value="0.375">3/8&quot;</option><option value="0.5">1/2&quot;</option></select></div>
                        </div>
                    </div>
                    <div className="calculator-divider" />
                    <div className="result-card"><div className="result-prefix">{construction === "foldOver" ? "Total Fabric to Fold Up" : "Cut Waistband Strip"}</div><div className="result-value">{construction === "foldOver" ? foldOverTotal.toFixed(3) : waistbandStrip.toFixed(3)}&quot;</div><div className="result-label">Channel: {channel.toFixed(3)}&quot; ({ew}&quot; elastic + {ea.add}&quot; ease)</div></div>
                    <div className={styles.resultDetails} style={{ marginTop: 12 }}>
                        <div className="result-row"><span className="result-row-label">Elastic width</span><span className="result-row-value">{ew}&quot;</span></div>
                        <div className="result-row"><span className="result-row-label">Ease added</span><span className="result-row-value">+{ea.add}&quot;</span></div>
                        <div className="result-row"><span className="result-row-label">Channel needed</span><span className="result-row-value">{channel.toFixed(3)}&quot;</span></div>
                        <div className="result-row"><span className="result-row-label">Stitch casing at</span><span className="result-row-value">{channel.toFixed(3)}&quot; from fold</span></div>
                    </div>
                    <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
                </div>
                <div className="calculator-card"><h2 className={styles.sectionTitle}>Common Casing Width Reference</h2>
                    <div className={styles.tableWrap}><table className={styles.convTable}><thead><tr><th>Elastic Width</th><th>Channel</th><th>Fold-Over Total</th></tr></thead>
                        <tbody>{quickRef.map(r => (<tr key={r.ew}><td style={{ fontWeight: 600 }}>{r.ew}</td><td>{r.channel}</td><td>{r.foldOver}</td></tr>))}</tbody>
                    </table></div>
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}