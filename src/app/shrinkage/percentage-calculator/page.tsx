"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Percent, Copy, Printer, ChevronDown, Droplets, Ruler } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const classRef = [
    { range: "Under 1%", level: "Minimal", action: "Pre-washing optional" },
    { range: "1-3%", level: "Low", action: "Pre-wash for fitted garments" },
    { range: "3-5%", level: "Moderate", action: "Pre-washing essential" },
    { range: "5-8%", level: "High", action: "Pre-wash absolutely essential" },
    { range: "8-12%", level: "Very High", action: "Pre-wash multiple times" },
    { range: "Over 12%", level: "Extreme", action: "May not suit precision projects" },
];

const relatedTools = [
    { name: "Pre-Wash Estimator", href: "/shrinkage/pre-wash-estimator", icon: Droplets },
    { name: "Post-Wash Yardage", href: "/shrinkage/post-wash-yardage", icon: Ruler },
    { name: "Buy Extra Calc", href: "/shrinkage/buy-extra", icon: Ruler },
];
const faqItems = [
    { q: "How do I calculate fabric shrinkage percentage?", a: "Formula: ((before - after) / before) x 100. For example, if 10\" becomes 9.5\": (10 - 9.5) / 10 x 100 = 5% shrinkage." },
    { q: "What size swatch should I use?", a: "At least 6\" x 6\", marking a precise 5\" x 5\" square in the center. Larger swatches give more accurate results." },
    { q: "Do I need to wash the swatch the same way as the finished item?", a: "Yes. Use the same water temperature, cycle, and drying method you plan for the finished garment. Different conditions give different shrinkage." },
];

export default function PercentageCalcPage() {
    const [beforeLen, setBeforeLen] = useState("10"); const [afterLen, setAfterLen] = useState("");
    const [beforeWid, setBeforeWid] = useState("10"); const [afterWid, setAfterWid] = useState("");
    const [activeFaq, setActiveFaq] = useState<number | null>(null); const [copied, setCopied] = useState(false);

    const bl = parseFloat(beforeLen) || 10; const al = parseFloat(afterLen) || 0;
    const bw = parseFloat(beforeWid) || 10; const aw = parseFloat(afterWid) || 0;
    const lenPct = al > 0 ? ((bl - al) / bl) * 100 : 0;
    const widPct = aw > 0 ? ((bw - aw) / bw) * 100 : 0;
    const areaPct = al > 0 && aw > 0 ? ((bl * bw - al * aw) / (bl * bw)) * 100 : 0;
    const avgPct = (lenPct + widPct) / 2;
    const hasResult = al > 0 && aw > 0;

    const level = avgPct < 1 ? "Minimal" : avgPct < 3 ? "Low" : avgPct < 5 ? "Moderate" : avgPct < 8 ? "High" : avgPct < 12 ? "Very High" : "Extreme";

    const handleCopy = useCallback(() => { navigator.clipboard.writeText(`Shrinkage: ${lenPct.toFixed(1)}% lengthwise, ${widPct.toFixed(1)}% crosswise, ${areaPct.toFixed(1)}% area. Classification: ${level}`); setCopied(true); setTimeout(() => setCopied(false), 2000); }, [lenPct, widPct, areaPct, level]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Shrinkage", href: "/shrinkage" }, { label: "Percentage Calculator" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><Percent size={14} strokeWidth={1.5} /> Shrinkage</span><h1>Shrinkage Percentage Calculator</h1><p>Calculate actual shrinkage percentage from before and after measurements.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Measurements</h2>
                    <div className="calculator-form">
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Before Wash - Length (in)</label><input type="number" className="input-field input-mono" value={beforeLen} onChange={e => setBeforeLen(e.target.value)} min="0" step="0.25" /></div>
                            <div className="input-group"><label className="input-label">After Wash - Length (in)</label><input type="number" className="input-field input-mono" placeholder="e.g., 9.6" value={afterLen} onChange={e => setAfterLen(e.target.value)} min="0" step="0.0625" /></div>
                        </div>
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Before Wash - Width (in)</label><input type="number" className="input-field input-mono" value={beforeWid} onChange={e => setBeforeWid(e.target.value)} min="0" step="0.25" /></div>
                            <div className="input-group"><label className="input-label">After Wash - Width (in)</label><input type="number" className="input-field input-mono" placeholder="e.g., 9.8" value={afterWid} onChange={e => setAfterWid(e.target.value)} min="0" step="0.0625" /></div>
                        </div>
                    </div>
                    {hasResult && (<div><div className="calculator-divider" />
                        <div className="result-card"><div className="result-prefix">Shrinkage Classification</div><div className="result-value">{level}</div><div className="result-label">{avgPct.toFixed(1)}% average shrinkage</div></div>
                        <div className={styles.resultDetails} style={{ marginTop: 12 }}>
                            <div className="result-row"><span className="result-row-label">Lengthwise (warp)</span><span className="result-row-value">{lenPct.toFixed(1)}%</span></div>
                            <div className="result-row"><span className="result-row-label">Crosswise (weft)</span><span className="result-row-value">{widPct.toFixed(1)}%</span></div>
                            <div className="result-row"><span className="result-row-label">Area shrinkage</span><span className="result-row-value">{areaPct.toFixed(1)}%</span></div>
                        </div>
                        <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
                    </div>)}
                </div>
                <div className="calculator-card"><h2 className={styles.sectionTitle}>Shrinkage Classification</h2>
                    <div className={styles.tableWrap}><table className={styles.convTable}><thead><tr><th>Range</th><th>Level</th><th>Action</th></tr></thead>
                        <tbody>{classRef.map(r => (<tr key={r.range}><td style={{ fontWeight: 600 }}>{r.range}</td><td>{r.level}</td><td>{r.action}</td></tr>))}</tbody>
                    </table></div>
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}