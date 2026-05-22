"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Triangle, Copy, Printer, ChevronDown, Ruler, Circle } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const relatedTools = [
    { name: "Flared Skirt", href: "/skirt/flared", icon: Triangle },
    { name: "Quarter Circle", href: "/skirt/quarter-circle", icon: Circle },
    { name: "Yardage by Style", href: "/skirt/yardage-by-style", icon: Ruler },
];
const faqItems = [
    { q: "How do I calculate dart intake for an A-line?", a: "Total dart intake = hip circumference - waist circumference. Divide by 4 for standard 4-dart configuration (2 front, 2 back). Each dart gets 1/4 of the total intake." },
    { q: "How much should the hem flare beyond the hip?", a: "Classic A-line: hip + 4-6\". Moderate flare: hip + 8-12\". Wide A-line: hip + 14-20\". Adjust to taste." },
    { q: "Do I need a lining for an A-line skirt?", a: "Depends on fabric. Lightweight or sheer fabrics need lining. Medium-weight cotton or linen may not. Lining adds comfort and prevents clinging." },
];

export default function ALinePage() {
    const [waistC, setWaistC] = useState("28"); const [hipC, setHipC] = useState("38"); const [length, setLength] = useState("24");
    const [flareExtra, setFlareExtra] = useState("8"); const [fabWidth, setFabWidth] = useState("60");
    const [activeFaq, setActiveFaq] = useState<number | null>(null); const [copied, setCopied] = useState(false);

    const w = parseFloat(waistC) || 28; const h = parseFloat(hipC) || 38; const l = parseFloat(length) || 24; const fe = parseFloat(flareExtra) || 8; const fw = parseFloat(fabWidth) || 60;
    const hemCirc = h + fe;
    const dartIntake = h - w;
    const dartEach = dartIntake / 4;
    const panelWaist = w / 4 + dartEach;
    const panelHip = h / 4;
    const panelHem = hemCirc / 4;
    const panelLen = l + 2 + 0.625; // hem + waist SA
    const panelsAcross = Math.floor(fw / (panelHem + 1.25)) || 1;
    const rows = Math.ceil(4 / panelsAcross);
    const yardage = (rows * panelLen) / 36;
    const hasResult = w > 0 && h > 0 && l > 0;

    const handleCopy = useCallback(() => { navigator.clipboard.writeText(`A-line: waist ${w}", hip ${h}", hem ${hemCirc}", 4 darts at ${dartEach.toFixed(1)}" each. ~${yardage.toFixed(1)} yd.`); setCopied(true); setTimeout(() => setCopied(false), 2000); }, [w, h, hemCirc, dartEach, yardage]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Skirt Calculators", href: "/skirt" }, { label: "A-Line" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><Triangle size={14} strokeWidth={1.5} /> Skirt</span><h1>A-Line Skirt Calculator</h1><p>Calculate dart intake, panel dimensions, and yardage for a classic A-line skirt.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Body Measurements</h2>
                    <div className="calculator-form">
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Waist (in)</label><input type="number" className="input-field input-mono" value={waistC} onChange={e => setWaistC(e.target.value)} min="1" step="0.5" /></div>
                            <div className="input-group"><label className="input-label">Hip (in)</label><input type="number" className="input-field input-mono" value={hipC} onChange={e => setHipC(e.target.value)} min="1" step="0.5" /></div>
                            <div className="input-group"><label className="input-label">Length (in)</label><input type="number" className="input-field input-mono" value={length} onChange={e => setLength(e.target.value)} min="1" step="0.5" /></div>
                        </div>
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Hem Flare Beyond Hip (in)</label><select className="input-field" value={flareExtra} onChange={e => setFlareExtra(e.target.value)}><option value="4">Classic (+4&quot;)</option><option value="8">Moderate (+8&quot;)</option><option value="12">Wide (+12&quot;)</option><option value="16">Very Wide (+16&quot;)</option></select></div>
                            <div className="input-group"><label className="input-label">Fabric Width (in)</label><select className="input-field" value={fabWidth} onChange={e => setFabWidth(e.target.value)}><option value="44">44/45&quot;</option><option value="54">54&quot;</option><option value="60">60&quot;</option></select></div>
                        </div>
                    </div>
                    {hasResult && (<div><div className="calculator-divider" />
                        <div className="result-card"><div className="result-prefix">A-Line Dimensions</div><div className="result-value">{hemCirc}&quot; hem</div><div className="result-label">{dartIntake.toFixed(1)}&quot; total dart intake (4 darts at {dartEach.toFixed(1)}&quot;)</div></div>
                        <div className={styles.resultDetails} style={{ marginTop: 12 }}>
                            <div className="result-row"><span className="result-row-label">Panel at waist</span><span className="result-row-value">{panelWaist.toFixed(1)}&quot;</span></div>
                            <div className="result-row"><span className="result-row-label">Panel at hip</span><span className="result-row-value">{panelHip.toFixed(1)}&quot;</span></div>
                            <div className="result-row"><span className="result-row-label">Panel at hem</span><span className="result-row-value">{panelHem.toFixed(1)}&quot;</span></div>
                            <div className="result-row"><span className="result-row-label">Yardage on {fw}&quot;</span><span className="result-row-value">~{yardage.toFixed(1)} yards</span></div>
                        </div>
                        <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
                    </div>)}
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}