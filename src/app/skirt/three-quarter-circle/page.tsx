"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Circle, Copy, Printer, ChevronDown, Ruler, Scissors } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const relatedTools = [
    { name: "Full Circle", href: "/skirt/full-circle", icon: Circle },
    { name: "Custom Angle", href: "/skirt/custom-angle-circle", icon: Ruler },
    { name: "Hem Circumference", href: "/skirt/hem-circumference", icon: Scissors },
];
const faqItems = [
    { q: "How does a 3/4 circle compare to a full circle?", a: "It has about 75% of the fullness. Less fabric cost, slightly easier hemming, but still very dramatic sweep. A great compromise between half and full circle." },
    { q: "How do I cut a 3/4 circle?", a: "Most commonly, cut as two pieces: two 135-degree wedges joined at a seam. Cannot be cut as one piece from standard fabric widths." },
    { q: "What is the waist radius formula for 3/4 circle?", a: "r = waist / (1.5 x pi) = waist / 4.712. For a 28\" waist: r = 28 / 4.712 = 5.94 inches." },
];

export default function ThreeQuarterCirclePage() {
    const [waist, setWaist] = useState("28"); const [length, setLength] = useState("24"); const [fabWidth, setFabWidth] = useState("60");
    const [activeFaq, setActiveFaq] = useState<number | null>(null); const [copied, setCopied] = useState(false);

    const w = parseFloat(waist) || 28; const l = parseFloat(length) || 24; const fw = parseFloat(fabWidth) || 60;
    const radius = (w * 2) / (3 * Math.PI); // waist / (1.5 * pi)
    const outerRadius = radius + l;
    const hemCirc = 1.5 * Math.PI * outerRadius; // 270/360 * 2*pi*r
    const yardage = ((outerRadius + 1) * 2) / 36;
    const hasResult = w > 0 && l > 0;

    const handleCopy = useCallback(() => { navigator.clipboard.writeText(`3/4 circle: radius ${radius.toFixed(1)}", hem ${hemCirc.toFixed(0)}", ~${yardage.toFixed(1)} yd.`); setCopied(true); setTimeout(() => setCopied(false), 2000); }, [radius, hemCirc, yardage]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Skirt Calculators", href: "/skirt" }, { label: "Three-Quarter Circle" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><Circle size={14} strokeWidth={1.5} /> Skirt</span><h1>Three-Quarter Circle Skirt Calculator</h1><p>Calculate dimensions for a 270-degree skirt -- between half and full circle fullness.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Measurements</h2>
                    <div className="calculator-form">
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Waist (in)</label><input type="number" className="input-field input-mono" value={waist} onChange={e => setWaist(e.target.value)} min="1" step="0.5" /></div>
                            <div className="input-group"><label className="input-label">Skirt Length (in)</label><input type="number" className="input-field input-mono" value={length} onChange={e => setLength(e.target.value)} min="1" step="0.5" /></div>
                            <div className="input-group"><label className="input-label">Fabric Width (in)</label><select className="input-field" value={fabWidth} onChange={e => setFabWidth(e.target.value)}><option value="44">44/45&quot;</option><option value="54">54&quot;</option><option value="60">60&quot;</option></select></div>
                        </div>
                    </div>
                    {hasResult && (<div><div className="calculator-divider" />
                        <div className="result-card"><div className="result-prefix">Waist Radius</div><div className="result-value">{radius.toFixed(2)}&quot;</div><div className="result-label">r = waist / (1.5 x pi) = {w} / 4.712</div></div>
                        <div className={styles.resultDetails} style={{ marginTop: 12 }}>
                            <div className="result-row"><span className="result-row-label">Outer radius</span><span className="result-row-value">{outerRadius.toFixed(1)}&quot;</span></div>
                            <div className="result-row"><span className="result-row-label">Hem circumference</span><span className="result-row-value">{hemCirc.toFixed(0)}&quot; ({(hemCirc / 12).toFixed(1)} ft)</span></div>
                            <div className="result-row"><span className="result-row-label">Construction</span><span className="result-row-value">2-piece (two 135-degree wedges)</span></div>
                            <div className="result-row"><span className="result-row-label">Yardage estimate</span><span className="result-row-value">~{yardage.toFixed(1)} yards</span></div>
                        </div>
                        <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
                    </div>)}
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}