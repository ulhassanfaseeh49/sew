"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Circle, Copy, Printer, ChevronDown, Scissors, Ruler } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const relatedTools = [
    { name: "Full Circle", href: "/skirt/full-circle", icon: Circle },
    { name: "Waist Radius", href: "/skirt/waist-radius", icon: Ruler },
    { name: "Hem Circumference", href: "/skirt/hem-circumference", icon: Scissors },
];
const faqItems = [
    { q: "How is the radius different from a full circle?", a: "Half circle radius = waist / pi (~3.14). Full circle radius = waist / (2 x pi). The half circle requires a LARGER radius for the same waist." },
    { q: "Is a half circle easier to sew than a full circle?", a: "Yes. The hem is half as long, making hemming easier. The fabric lies flatter. And it uses significantly less fabric." },
    { q: "How much fabric does a half circle skirt save?", a: "Roughly 40-50% less fabric than a full circle for the same waist and length. A full circle might need 3.5 yards where a half circle needs ~2 yards." },
];

export default function HalfCirclePage() {
    const [waist, setWaist] = useState("28"); const [length, setLength] = useState("24"); const [fabWidth, setFabWidth] = useState("60");
    const [activeFaq, setActiveFaq] = useState<number | null>(null); const [copied, setCopied] = useState(false);

    const w = parseFloat(waist) || 28; const l = parseFloat(length) || 24; const fw = parseFloat(fabWidth) || 60;
    const radius = w / Math.PI;
    const outerRadius = radius + l;
    const hemCirc = Math.PI * outerRadius;
    const widthNeeded = outerRadius + 1; // +1 for allowances
    const lengthNeeded = (outerRadius + 1) * 2;
    const yardage = lengthNeeded / 36;
    const hasResult = w > 0 && l > 0;

    const handleCopy = useCallback(() => { navigator.clipboard.writeText(`Half circle skirt: radius ${radius.toFixed(1)}", outer ${outerRadius.toFixed(1)}", hem ${hemCirc.toFixed(0)}". ~${yardage.toFixed(1)} yd.`); setCopied(true); setTimeout(() => setCopied(false), 2000); }, [radius, outerRadius, hemCirc, yardage]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Skirt Calculators", href: "/skirt" }, { label: "Half Circle" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><Circle size={14} strokeWidth={1.5} /> Skirt</span><h1>Half Circle Skirt Calculator</h1><p>Calculate dimensions for a 180-degree half circle skirt -- moderate fullness, less fabric than full circle.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Measurements</h2>
                    <div className="calculator-form">
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Waist (in)</label><input type="number" className="input-field input-mono" value={waist} onChange={e => setWaist(e.target.value)} min="1" step="0.5" /></div>
                            <div className="input-group"><label className="input-label">Skirt Length (in)</label><input type="number" className="input-field input-mono" value={length} onChange={e => setLength(e.target.value)} min="1" step="0.5" /></div>
                            <div className="input-group"><label className="input-label">Fabric Width (in)</label><select className="input-field" value={fabWidth} onChange={e => setFabWidth(e.target.value)}><option value="44">44/45&quot;</option><option value="54">54&quot;</option><option value="60">60&quot;</option></select></div>
                        </div>
                    </div>
                    {hasResult && (<div><div className="calculator-divider" />
                        <div className="result-card"><div className="result-prefix">Waist Radius</div><div className="result-value">{radius.toFixed(2)}&quot;</div><div className="result-label">r = waist / pi = {w} / 3.14</div></div>
                        <div className={styles.resultDetails} style={{ marginTop: 12 }}>
                            <div className="result-row"><span className="result-row-label">Outer radius</span><span className="result-row-value">{outerRadius.toFixed(1)}&quot;</span></div>
                            <div className="result-row"><span className="result-row-label">Hem circumference</span><span className="result-row-value">{hemCirc.toFixed(0)}&quot; ({(hemCirc / 12).toFixed(1)} ft)</span></div>
                            <div className="result-row"><span className="result-row-label">Fabric needed</span><span className="result-row-value">~{yardage.toFixed(1)} yards</span></div>
                            <div className="result-row"><span className="result-row-label">Fits on {fw}&quot;?</span><span className="result-row-value">{widthNeeded <= fw ? "Yes" : "Need wider fabric or 2-piece"}</span></div>
                        </div>
                        <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
                    </div>)}
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}