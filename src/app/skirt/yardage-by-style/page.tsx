"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { BarChart3, Copy, Printer, ChevronDown, Circle, Ruler } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const relatedTools = [
    { name: "Full Circle", href: "/skirt/full-circle", icon: Circle },
    { name: "A-Line", href: "/skirt/a-line", icon: Ruler },
    { name: "Pleated", href: "/skirt/pleated", icon: Ruler },
];
const faqItems = [
    { q: "Which skirt style uses the least fabric?", a: "A-line and straight/pencil skirts use the least -- typically 1-1.5 yards. Full circle skirts can need 3-4+ yards for the same length." },
    { q: "Which skirt is best for beginners?", a: "Tiered prairie skirt with elastic waist: no darts, no zipper, minimal fitting. Or a simple wrap skirt." },
    { q: "How does fabric width affect yardage?", a: "Wider fabric (60\") reduces yardage significantly, especially for circle skirts. On 44\" fabric a full circle may need 4+ yards; on 60\" it might be 3." },
];

export default function YardageByStylePage() {
    const [waist, setWaist] = useState("28"); const [hip, setHip] = useState("38"); const [length, setLength] = useState("24"); const [fabWidth, setFabWidth] = useState("60");
    const [activeFaq, setActiveFaq] = useState<number | null>(null); const [copied, setCopied] = useState(false);

    const w = parseFloat(waist) || 28; const h = parseFloat(hip) || 38; const l = parseFloat(length) || 24; const fw = parseFloat(fabWidth) || 60;
    const hasResult = w > 0 && l > 0;

    const calcStyles = () => {
        const rFull = w / (2 * Math.PI); const orFull = rFull + l;
        const rHalf = w / Math.PI; const orHalf = rHalf + l;
        const fullYd = ((orFull + 1) * 2) / 36;
        const halfYd = ((orHalf + 1) * 2) / 36;
        const qtrYd = ((rFull + l + 1) * 2) / 36;
        const alineYd = ((l + 2.625) * 2) / 36;
        const pleatYd = ((w * 3 / fw) * (l + 2.625)) / 36;
        const tieredYd = ((h * 1.5 + h * 3 + h * 6) / fw * (l / 3 + 2)) / 36;
        return [
            { style: "Full circle (360deg)", yd: fullYd, fullness: "Maximum", diff: "Hard (hem)" },
            { style: "3/4 circle (270deg)", yd: fullYd * 0.75, fullness: "Very full", diff: "Hard" },
            { style: "Half circle (180deg)", yd: halfYd, fullness: "Full", diff: "Moderate" },
            { style: "A-line", yd: alineYd, fullness: "Slight", diff: "Easy" },
            { style: "Pleated (knife)", yd: Math.max(pleatYd, 1.5), fullness: "Structured", diff: "Moderate" },
            { style: "Tiered (3-tier)", yd: Math.max(tieredYd, 2), fullness: "Moderate", diff: "Easy" },
        ];
    };
    const styleData = hasResult ? calcStyles() : [];

    const handleCopy = useCallback(() => { navigator.clipboard.writeText(styleData.map(s => `${s.style}: ~${s.yd.toFixed(1)} yd`).join(", ")); setCopied(true); setTimeout(() => setCopied(false), 2000); }, [styleData]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Skirt Calculators", href: "/skirt" }, { label: "Yardage by Style" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><BarChart3 size={14} strokeWidth={1.5} /> Skirt</span><h1>Skirt Yardage Calculator by Style</h1><p>Compare fabric yardage across all skirt styles for your measurements.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Your Measurements</h2>
                    <div className="calculator-form">
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Waist (in)</label><input type="number" className="input-field input-mono" value={waist} onChange={e => setWaist(e.target.value)} min="1" step="0.5" /></div>
                            <div className="input-group"><label className="input-label">Hip (in)</label><input type="number" className="input-field input-mono" value={hip} onChange={e => setHip(e.target.value)} min="1" step="0.5" /></div>
                            <div className="input-group"><label className="input-label">Length (in)</label><input type="number" className="input-field input-mono" value={length} onChange={e => setLength(e.target.value)} min="1" step="0.5" /></div>
                            <div className="input-group"><label className="input-label">Fabric (in)</label><select className="input-field" value={fabWidth} onChange={e => setFabWidth(e.target.value)}><option value="44">44&quot;</option><option value="54">54&quot;</option><option value="60">60&quot;</option></select></div>
                        </div>
                    </div>
                    {hasResult && (<div><div className="calculator-divider" />
                        <div className={styles.tableWrap}><table className={styles.convTable}><thead><tr><th>Style</th><th>Yardage</th><th>Fullness</th><th>Difficulty</th></tr></thead>
                            <tbody>{styleData.map(s => (<tr key={s.style}><td style={{ fontWeight: 600 }}>{s.style}</td><td>~{s.yd.toFixed(1)} yd</td><td>{s.fullness}</td><td>{s.diff}</td></tr>))}</tbody>
                        </table></div>
                        <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
                    </div>)}
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}