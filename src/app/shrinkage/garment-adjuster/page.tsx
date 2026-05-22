"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Shirt, Copy, Printer, ChevronDown, Droplets, BookOpen } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const measurements = [
    { key: "bust", label: "Bust/Chest", dir: "cross" },
    { key: "waist", label: "Waist", dir: "cross" },
    { key: "hip", label: "Hip", dir: "cross" },
    { key: "length", label: "Length", dir: "len" },
    { key: "sleeve", label: "Sleeve Length", dir: "len" },
];

const relatedTools = [
    { name: "Pre-Wash Estimator", href: "/shrinkage/pre-wash-estimator", icon: Droplets },
    { name: "Shrinkage % Calc", href: "/shrinkage/percentage-calculator", icon: Droplets },
    { name: "Pre-Washing Guide", href: "/shrinkage/pre-washing-guide", icon: BookOpen },
];
const faqItems = [
    { q: "How do I adjust a pattern to account for shrinkage?", a: "Add the shrinkage percentage to each measurement in the appropriate direction. Lengthwise shrinkage affects vertical measurements, crosswise affects horizontal. This calculator does the math for you." },
    { q: "Is it better to pre-wash or adjust the pattern for shrinkage?", a: "Pre-washing is almost always safer and more accurate. Pattern adjustment is for fabrics that cannot be pre-washed (coated, structured, or when intentional post-construction shrinkage is desired)." },
    { q: "Can I make a garment slightly large knowing it will shrink?", a: "Yes, but it is risky for fitted garments. Shrinkage is not perfectly uniform — curves and style lines can distort. For simple shapes (T-shirts, pajamas) this works better than for tailored garments." },
];

export default function GarmentAdjusterPage() {
    const [lenShrink, setLenShrink] = useState("4"); const [crossShrink, setCrossShrink] = useState("3");
    const [values, setValues] = useState<Record<string, string>>({});
    const [activeFaq, setActiveFaq] = useState<number | null>(null); const [copied, setCopied] = useState(false);

    const ls = parseFloat(lenShrink) || 0; const cs = parseFloat(crossShrink) || 0;

    const getAdjusted = (key: string, dir: string) => {
        const v = parseFloat(values[key] || "") || 0;
        const pct = dir === "len" ? ls : cs;
        return v > 0 ? v / (1 - pct / 100) : 0;
    };
    const hasResult = Object.values(values).some(v => parseFloat(v) > 0);

    const handleCopy = useCallback(() => {
        const lines = measurements.filter(m => parseFloat(values[m.key] || "") > 0).map(m => `${m.label}: ${values[m.key]}" desired → ${getAdjusted(m.key, m.dir).toFixed(2)}" cut`);
        navigator.clipboard.writeText(lines.join("\n")); setCopied(true); setTimeout(() => setCopied(false), 2000);
    }, [values, ls, cs]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Shrinkage", href: "/shrinkage" }, { label: "Garment Adjuster" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><Shirt size={14} strokeWidth={1.5} /> Shrinkage</span><h1>Garment Shrinkage Adjuster</h1><p>Calculate pattern adjustments to compensate for post-construction shrinkage.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Shrinkage Rates</h2>
                    <div className="calculator-form"><div className="calculator-form-row">
                        <div className="input-group"><label className="input-label">Lengthwise Shrinkage (%)</label><input type="number" className="input-field input-mono" value={lenShrink} onChange={e => setLenShrink(e.target.value)} min="0" max="20" step="0.5" /></div>
                        <div className="input-group"><label className="input-label">Crosswise Shrinkage (%)</label><input type="number" className="input-field input-mono" value={crossShrink} onChange={e => setCrossShrink(e.target.value)} min="0" max="20" step="0.5" /></div>
                    </div></div>
                </div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Desired Finished Measurements (after washing)</h2>
                    <div className="calculator-form">
                        {measurements.map(m => (
                            <div className="input-group" key={m.key}><label className="input-label">{m.label} (inches) — {m.dir === "len" ? "lengthwise" : "crosswise"}</label><input type="number" className="input-field input-mono" placeholder={`Desired finished ${m.label.toLowerCase()}`} value={values[m.key] || ""} onChange={e => setValues(prev => ({ ...prev, [m.key]: e.target.value }))} min="0" step="0.25" /></div>
                        ))}
                    </div>
                    {hasResult && (<div><div className="calculator-divider" />
                        <h3 style={{ fontSize: "var(--text-base)", fontWeight: 600, marginBottom: 12 }}>Cut to These Measurements</h3>
                        <div className={styles.tableWrap}><table className={styles.convTable}><thead><tr><th>Measurement</th><th>Desired Finish</th><th>Cut To</th><th>Direction</th></tr></thead>
                            <tbody>{measurements.filter(m => parseFloat(values[m.key] || "") > 0).map(m => {
                                const v = parseFloat(values[m.key] || "") || 0;
                                const adj = getAdjusted(m.key, m.dir);
                                return (<tr key={m.key}><td style={{ fontWeight: 600 }}>{m.label}</td><td>{v}&quot;</td><td style={{ fontWeight: 700, color: "var(--color-accent)" }}>{adj.toFixed(2)}&quot;</td><td>{m.dir === "len" ? `+${ls}% lengthwise` : `+${cs}% crosswise`}</td></tr>);
                            })}</tbody>
                        </table></div>
                        {(ls > 7 || cs > 7) && <p style={{ marginTop: 12, padding: "12px 16px", borderRadius: 8, fontSize: "var(--text-sm)", background: "#fed7aa", color: "#9a3412" }}>At over 7% shrinkage, pre-washing is strongly recommended over pattern adjustment. Adjusting patterns at high shrinkage rates risks distortion of style lines and fit.</p>}
                        <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
                    </div>)}
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}