"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Flower, Copy, Printer, ChevronDown, Ruler, Circle } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const relatedTools = [
    { name: "A-Line", href: "/skirt/a-line", icon: Ruler },
    { name: "High-Low", href: "/skirt/high-low", icon: Ruler },
    { name: "Wrap Skirt", href: "/skirt/wrap-skirt", icon: Circle },
];
const faqItems = [
    { q: "What creates the tulip/petal effect?", a: "Two curved front panels overlap in the center. The curved edges create the petal shape. The overlap determines how much skin shows through." },
    { q: "How do I make both panels identical?", a: "Cut one panel, then fold technique: lay the first panel on fabric, flip it over and use it as a template for the second panel." },
    { q: "How do I hem the curved petal edge?", a: "Use a narrow double-fold hem (1/4\"). For very tight curves, a rolled hem or binding works better. Press as you go around the curve." },
];

export default function TulipSkirtPage() {
    const [waist, setWaist] = useState("28"); const [hip, setHip] = useState("38"); const [length, setLength] = useState("20");
    const [overlapAmt, setOverlapAmt] = useState("6"); const [fabWidth, setFabWidth] = useState("60");
    const [activeFaq, setActiveFaq] = useState<number | null>(null); const [copied, setCopied] = useState(false);

    const w = parseFloat(waist) || 28; const h = parseFloat(hip) || 38; const l = parseFloat(length) || 20;
    const ov = parseFloat(overlapAmt) || 6; const fw = parseFloat(fabWidth) || 60;
    const frontPanelW = h / 2 + ov + 1.25;
    const backPanelW = h / 2 + 1.25;
    const panelLen = l + 2.625;
    const totalPanels = 2 + 1; // 2 front + 1 back
    const piecesAcross = Math.floor(fw / Math.max(frontPanelW, backPanelW)) || 1;
    const rows = Math.ceil(totalPanels / piecesAcross);
    const yardage = (rows * panelLen) / 36;
    const hasResult = w > 0 && h > 0 && l > 0;

    const handleCopy = useCallback(() => { navigator.clipboard.writeText(`Tulip skirt: front panels ${frontPanelW.toFixed(1)}" x ${panelLen.toFixed(1)}", back ${backPanelW.toFixed(1)}". ~${yardage.toFixed(1)} yd.`); setCopied(true); setTimeout(() => setCopied(false), 2000); }, [frontPanelW, panelLen, backPanelW, yardage]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Skirt Calculators", href: "/skirt" }, { label: "Tulip/Petal Skirt" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><Flower size={14} strokeWidth={1.5} /> Skirt</span><h1>Tulip / Petal Skirt Calculator</h1><p>Calculate overlapping panel dimensions and curve guides for tulip skirts.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Measurements</h2>
                    <div className="calculator-form">
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Waist (in)</label><input type="number" className="input-field input-mono" value={waist} onChange={e => setWaist(e.target.value)} min="1" step="0.5" /></div>
                            <div className="input-group"><label className="input-label">Hip (in)</label><input type="number" className="input-field input-mono" value={hip} onChange={e => setHip(e.target.value)} min="1" step="0.5" /></div>
                            <div className="input-group"><label className="input-label">Length (in)</label><input type="number" className="input-field input-mono" value={length} onChange={e => setLength(e.target.value)} min="1" step="0.5" /></div>
                        </div>
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Overlap Amount</label><select className="input-field" value={overlapAmt} onChange={e => setOverlapAmt(e.target.value)}><option value="3">3&quot; (subtle)</option><option value="6">6&quot; (classic)</option><option value="10">10&quot; (dramatic)</option></select></div>
                            <div className="input-group"><label className="input-label">Fabric Width (in)</label><select className="input-field" value={fabWidth} onChange={e => setFabWidth(e.target.value)}><option value="44">44&quot;</option><option value="60">60&quot;</option></select></div>
                        </div>
                    </div>
                    {hasResult && (<div><div className="calculator-divider" />
                        <div className="result-card"><div className="result-prefix">Tulip Panels</div><div className="result-value">2 front + 1 back</div><div className="result-label">~{yardage.toFixed(1)} yards total</div></div>
                        <div className={styles.resultDetails} style={{ marginTop: 12 }}>
                            <div className="result-row"><span className="result-row-label">Front panel (each)</span><span className="result-row-value">{frontPanelW.toFixed(1)}&quot; x {panelLen.toFixed(1)}&quot;</span></div>
                            <div className="result-row"><span className="result-row-label">Back panel</span><span className="result-row-value">{backPanelW.toFixed(1)}&quot; x {panelLen.toFixed(1)}&quot;</span></div>
                            <div className="result-row"><span className="result-row-label">Overlap</span><span className="result-row-value">{ov}&quot;</span></div>
                        </div>
                        <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
                    </div>)}
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}