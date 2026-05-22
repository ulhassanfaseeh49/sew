"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Ruler, Copy, Printer, ChevronDown, Circle, Scissors } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const fractions = [
    { label: "Full circle (360deg)", divisor: 2 * Math.PI },
    { label: "3/4 circle (270deg)", divisor: 1.5 * Math.PI },
    { label: "Half circle (180deg)", divisor: Math.PI },
    { label: "Quarter circle (90deg)", divisor: Math.PI / 2 },
];
const relatedTools = [
    { name: "Full Circle", href: "/skirt/full-circle", icon: Circle },
    { name: "Custom Angle", href: "/skirt/custom-angle-circle", icon: Circle },
    { name: "Hem Circumference", href: "/skirt/hem-circumference", icon: Scissors },
];
const faqItems = [
    { q: "What is the waist radius formula?", a: "For a full circle: r = waist / (2 x pi). For a half circle: r = waist / pi. The general formula: r = waist x 360 / (2 x pi x angle)." },
    { q: "How do I draw the waist curve on fabric?", a: "Tie chalk or pencil to a string at the radius length. Hold the other end at the center point. Draw the arc keeping the string taut." },
    { q: "Should I round the radius?", a: "Yes. Round to the nearest 1/8 inch. The tiny difference is absorbed by the seam allowance." },
];

export default function WaistRadiusPage() {
    const [waist, setWaist] = useState("28"); const [unit, setUnit] = useState("in");
    const [activeFaq, setActiveFaq] = useState<number | null>(null); const [copied, setCopied] = useState(false);

    const w = parseFloat(waist) || 28;
    const hasResult = w > 0;

    const handleCopy = useCallback(() => {
        const lines = fractions.map(f => `${f.label}: ${(w / f.divisor).toFixed(2)}${unit === "in" ? '"' : "cm"}`).join(", ");
        navigator.clipboard.writeText(`Waist ${w}${unit === "in" ? '"' : "cm"}: ${lines}`);
        setCopied(true); setTimeout(() => setCopied(false), 2000);
    }, [w, unit]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Skirt Calculators", href: "/skirt" }, { label: "Waist Radius" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><Ruler size={14} strokeWidth={1.5} /> Skirt</span><h1>Waist Radius Calculator</h1><p>Calculate the waist radius for any circle skirt fraction -- the foundational circle skirt calculation.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Your Waist</h2>
                    <div className="calculator-form">
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Waist Measurement</label><input type="number" className="input-field input-mono" value={waist} onChange={e => setWaist(e.target.value)} min="1" step="0.5" /></div>
                            <div className="input-group"><label className="input-label">Unit</label><select className="input-field" value={unit} onChange={e => setUnit(e.target.value)}><option value="in">Inches</option><option value="cm">Centimeters</option></select></div>
                        </div>
                    </div>
                    {hasResult && (<div><div className="calculator-divider" />
                        <div className={styles.tableWrap}><table className={styles.convTable}><thead><tr><th>Circle Type</th><th>Radius</th><th>String Length (rounded)</th></tr></thead>
                            <tbody>{fractions.map(f => { const r = w / f.divisor; return (<tr key={f.label}><td style={{ fontWeight: 600 }}>{f.label}</td><td>{r.toFixed(2)}{unit === "in" ? '"' : "cm"}</td><td>{(Math.round(r * 8) / 8).toFixed(3)}{unit === "in" ? '"' : "cm"}</td></tr>); })}</tbody>
                        </table></div>
                        <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
                    </div>)}
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}