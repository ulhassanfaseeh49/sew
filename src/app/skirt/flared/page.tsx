"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Expand, Copy, Printer, ChevronDown, Triangle, Ruler } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const relatedTools = [
    { name: "A-Line", href: "/skirt/a-line", icon: Triangle },
    { name: "Full Circle", href: "/skirt/full-circle", icon: Ruler },
    { name: "Yardage by Style", href: "/skirt/yardage-by-style", icon: Ruler },
];
const faqItems = [
    { q: "How many panels should a flared skirt have?", a: "4 panels (simplest, moderate shaping), 6 panels (more shaping), 8 panels (close to circle skirt effect). More panels = better hang and fit." },
    { q: "What is a gored skirt?", a: "A gored skirt uses multiple trapezoidal panels (gores) joined at seams. Each gore is narrow at the waist and wider at the hem, creating controlled flare." },
    { q: "How do I control the amount of flare?", a: "Enter your desired hem circumference. For reference: hip + 10\" is subtle, hip + 20\" is moderate, hip + 40\" is very full." },
];

export default function FlaredPage() {
    const [waistC, setWaistC] = useState("28"); const [hipC, setHipC] = useState("38"); const [length, setLength] = useState("24");
    const [numPanels, setNumPanels] = useState("6"); const [hemCirc, setHemCirc] = useState("58"); const [fabWidth, setFabWidth] = useState("60");
    const [activeFaq, setActiveFaq] = useState<number | null>(null); const [copied, setCopied] = useState(false);

    const w = parseFloat(waistC) || 28; const h = parseFloat(hipC) || 38; const l = parseFloat(length) || 24;
    const np = parseInt(numPanels) || 6; const hm = parseFloat(hemCirc) || 58; const fw = parseFloat(fabWidth) || 60;
    const panelWaist = w / np + 1.25; // + SA
    const panelHip = h / np + 1.25;
    const panelHem = hm / np + 1.25;
    const panelLen = l + 2.625; // hem + waist SA
    const piecesAcross = Math.floor(fw / (panelHem)) || 1;
    const rows = Math.ceil(np / piecesAcross);
    const yardage = (rows * panelLen) / 36;
    const hasResult = w > 0 && h > 0 && l > 0;

    const handleCopy = useCallback(() => { navigator.clipboard.writeText(`Flared skirt: ${np} panels, waist ${w}", hem ${hm}". ~${yardage.toFixed(1)} yd on ${fw}".`); setCopied(true); setTimeout(() => setCopied(false), 2000); }, [np, w, hm, yardage, fw]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Skirt Calculators", href: "/skirt" }, { label: "Flared" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><Expand size={14} strokeWidth={1.5} /> Skirt</span><h1>Flared / Gored Skirt Calculator</h1><p>Calculate trapezoid panel dimensions for multi-panel flared skirts with variable flare amounts.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Measurements</h2>
                    <div className="calculator-form">
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Waist (in)</label><input type="number" className="input-field input-mono" value={waistC} onChange={e => setWaistC(e.target.value)} min="1" step="0.5" /></div>
                            <div className="input-group"><label className="input-label">Hip (in)</label><input type="number" className="input-field input-mono" value={hipC} onChange={e => setHipC(e.target.value)} min="1" step="0.5" /></div>
                            <div className="input-group"><label className="input-label">Length (in)</label><input type="number" className="input-field input-mono" value={length} onChange={e => setLength(e.target.value)} min="1" step="0.5" /></div>
                        </div>
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Number of Panels</label><select className="input-field" value={numPanels} onChange={e => setNumPanels(e.target.value)}><option value="4">4 (simple)</option><option value="6">6 (standard)</option><option value="8">8 (very shaped)</option></select></div>
                            <div className="input-group"><label className="input-label">Desired Hem Circumference (in)</label><input type="number" className="input-field input-mono" value={hemCirc} onChange={e => setHemCirc(e.target.value)} min="1" /></div>
                            <div className="input-group"><label className="input-label">Fabric Width (in)</label><select className="input-field" value={fabWidth} onChange={e => setFabWidth(e.target.value)}><option value="44">44/45&quot;</option><option value="54">54&quot;</option><option value="60">60&quot;</option></select></div>
                        </div>
                    </div>
                    {hasResult && (<div><div className="calculator-divider" />
                        <div className="result-card"><div className="result-prefix">{np}-Panel Flared Skirt</div><div className="result-value">~{yardage.toFixed(1)} yards</div><div className="result-label">Hem: {hm}&quot; total ({np} panels at {panelHem.toFixed(1)}&quot;)</div></div>
                        <div className={styles.resultDetails} style={{ marginTop: 12 }}>
                            <div className="result-row"><span className="result-row-label">Panel at waist (w/SA)</span><span className="result-row-value">{panelWaist.toFixed(1)}&quot;</span></div>
                            <div className="result-row"><span className="result-row-label">Panel at hip (w/SA)</span><span className="result-row-value">{panelHip.toFixed(1)}&quot;</span></div>
                            <div className="result-row"><span className="result-row-label">Panel at hem (w/SA)</span><span className="result-row-value">{panelHem.toFixed(1)}&quot;</span></div>
                            <div className="result-row"><span className="result-row-label">Panel length</span><span className="result-row-value">{panelLen.toFixed(1)}&quot;</span></div>
                            <div className="result-row"><span className="result-row-label">Panels per fabric width</span><span className="result-row-value">{piecesAcross}</span></div>
                        </div>
                        <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
                    </div>)}
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}