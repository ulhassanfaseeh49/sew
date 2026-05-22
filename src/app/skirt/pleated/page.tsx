"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Columns3, Copy, Printer, ChevronDown, Ruler, Circle } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const pleatTypes: Record<string, { label: string; fabricPerPleat: (depth: number, boxW: number) => number }> = {
    knife: { label: "Knife pleats", fabricPerPleat: (depth) => depth * 2 },
    box: { label: "Box pleats", fabricPerPleat: (depth, boxW) => boxW + depth * 4 },
    inverted: { label: "Inverted box pleats", fabricPerPleat: (depth, boxW) => boxW + depth * 4 },
};
const relatedTools = [
    { name: "A-Line", href: "/skirt/a-line", icon: Ruler },
    { name: "Tiered", href: "/skirt/tiered", icon: Ruler },
    { name: "Yardage by Style", href: "/skirt/yardage-by-style", icon: Circle },
];
const faqItems = [
    { q: "How much fabric do pleated skirts use?", a: "Typically 2-3x the finished waist width. Box pleats use even more. A 28\" waist skirt may need 56-84\" of flat fabric before pleating." },
    { q: "What is the difference between knife and box pleats?", a: "Knife pleats all fold in one direction. Box pleats have two folds meeting at center with fabric behind. Box pleats use more fabric but create a structured look." },
    { q: "Should I press pleats before or after hemming?", a: "Hem first, then press pleats. Pressed pleats maintain their fold better. For permanent pleats, press with vinegar-water solution or use starch." },
];

export default function PleatedPage() {
    const [waist, setWaist] = useState("28"); const [length, setLength] = useState("24"); const [pleatType, setPleatType] = useState("knife");
    const [pleatDepth, setPleatDepth] = useState("1"); const [boxWidth, setBoxWidth] = useState("1.5"); const [fabWidth, setFabWidth] = useState("60");
    const [activeFaq, setActiveFaq] = useState<number | null>(null); const [copied, setCopied] = useState(false);

    const w = parseFloat(waist) || 28; const l = parseFloat(length) || 24; const pd = parseFloat(pleatDepth) || 1;
    const bw = parseFloat(boxWidth) || 1.5; const fw = parseFloat(fabWidth) || 60;
    const pt = pleatTypes[pleatType] || pleatTypes.knife;
    const fabricPerPleat = pt.fabricPerPleat(pd, bw);
    const pleatVisible = pleatType === "knife" ? pd : bw;
    const numPleats = Math.round(w / pleatVisible);
    const totalFabricWidth = w + numPleats * fabricPerPleat;
    const multiplier = totalFabricWidth / w;
    const stripLen = l + 2.625; // hem + waist SA
    const strips = Math.ceil(totalFabricWidth / fw);
    const yardage = (strips * stripLen) / 36;
    const hasResult = w > 0 && l > 0;

    const handleCopy = useCallback(() => { navigator.clipboard.writeText(`${pt.label}: ${numPleats} pleats, ${totalFabricWidth.toFixed(0)}" wide (${multiplier.toFixed(1)}x). ~${yardage.toFixed(1)} yd.`); setCopied(true); setTimeout(() => setCopied(false), 2000); }, [pt.label, numPleats, totalFabricWidth, multiplier, yardage]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Skirt Calculators", href: "/skirt" }, { label: "Pleated" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><Columns3 size={14} strokeWidth={1.5} /> Skirt</span><h1>Pleated Skirt Calculator</h1><p>Calculate fabric width, pleat count, and yardage for knife, box, and inverted pleats.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Pleat Details</h2>
                    <div className="calculator-form">
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Waist (in)</label><input type="number" className="input-field input-mono" value={waist} onChange={e => setWaist(e.target.value)} min="1" step="0.5" /></div>
                            <div className="input-group"><label className="input-label">Length (in)</label><input type="number" className="input-field input-mono" value={length} onChange={e => setLength(e.target.value)} min="1" step="0.5" /></div>
                            <div className="input-group"><label className="input-label">Pleat Type</label><select className="input-field" value={pleatType} onChange={e => setPleatType(e.target.value)}>{Object.entries(pleatTypes).map(([k, v]) => (<option key={k} value={k}>{v.label}</option>))}</select></div>
                        </div>
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Pleat Depth (in)</label><input type="number" className="input-field input-mono" value={pleatDepth} onChange={e => setPleatDepth(e.target.value)} min="0.5" step="0.25" /></div>
                            {pleatType !== "knife" && <div className="input-group"><label className="input-label">Box Width (in)</label><input type="number" className="input-field input-mono" value={boxWidth} onChange={e => setBoxWidth(e.target.value)} min="0.5" step="0.25" /></div>}
                            <div className="input-group"><label className="input-label">Fabric Width (in)</label><select className="input-field" value={fabWidth} onChange={e => setFabWidth(e.target.value)}><option value="44">44&quot;</option><option value="54">54&quot;</option><option value="60">60&quot;</option></select></div>
                        </div>
                    </div>
                    {hasResult && (<div><div className="calculator-divider" />
                        <div className="result-card"><div className="result-prefix">{pt.label}</div><div className="result-value">{numPleats} pleats</div><div className="result-label">{totalFabricWidth.toFixed(0)}&quot; flat width ({multiplier.toFixed(1)}x waist)</div></div>
                        <div className={styles.resultDetails} style={{ marginTop: 12 }}>
                            <div className="result-row"><span className="result-row-label">Fabric per pleat (hidden)</span><span className="result-row-value">{fabricPerPleat.toFixed(1)}&quot;</span></div>
                            <div className="result-row"><span className="result-row-label">Strips needed on {fw}&quot;</span><span className="result-row-value">{strips}</span></div>
                            <div className="result-row"><span className="result-row-label">Yardage</span><span className="result-row-value">~{yardage.toFixed(1)} yards</span></div>
                        </div>
                        <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
                    </div>)}
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}