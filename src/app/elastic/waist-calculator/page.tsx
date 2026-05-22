"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Ruler, Copy, Printer, ChevronDown, BookOpen, Scissors } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const elasticTypes: Record<string, { label: string; ratio: number; note: string }> = {
    braided: { label: "Braided Elastic", ratio: 0.85, note: "Narrows when stretched. Best for casings." },
    knitted: { label: "Knitted Elastic", ratio: 0.85, note: "Maintains width. Softest, most versatile." },
    woven: { label: "Woven Elastic", ratio: 0.80, note: "Firmest, most durable. Best for structured waistbands." },
    clear: { label: "Clear/Poly Elastic", ratio: 0.80, note: "Very stretchy, transparent. Lingerie, lightweight." },
    swimwear: { label: "Swimwear Elastic", ratio: 0.75, note: "Chlorine/salt resistant. Swimwear only." },
};

const fitAdj: Record<string, { label: string; mod: number }> = {
    verySnug: { label: "Very Snug (activewear)", mod: -1 },
    snug: { label: "Snug (standard)", mod: 0 },
    comfortable: { label: "Comfortable (casual)", mod: 0.5 },
    veryComfortable: { label: "Very Comfortable (lounge/sleep)", mod: 1 },
};

const quickRef = [
    { waist: 24, comf: 20.5, snug: 19.5 }, { waist: 28, comf: 24, snug: 23 },
    { waist: 32, comf: 27.5, snug: 26 }, { waist: 36, comf: 31, snug: 29.5 },
    { waist: 40, comf: 34.5, snug: 33 }, { waist: 44, comf: 38, snug: 36 },
    { waist: 48, comf: 41.5, snug: 39.5 },
];

const relatedTools = [
    { name: "Cuff Elastic Calc", href: "/elastic/cuff-calculator", icon: Ruler },
    { name: "Casing Width Calc", href: "/elastic/casing-width", icon: Ruler },
    { name: "Elastic Types Guide", href: "/elastic/types-guide", icon: BookOpen },
];
const faqItems = [
    { q: "How long should I cut elastic for a waistband?", a: "Generally 80-85% of your waist measurement, depending on elastic type. This calculator accounts for elastic type, fit preference, and overlap for joining." },
    { q: "Should elastic be shorter than my waist measurement?", a: "Yes! Elastic works by tension against your body. If elastic equals your waist measurement, there is zero tension and it will fall down." },
    { q: "What type of elastic is best for a waistband?", a: "Knitted elastic is most versatile. Woven is most durable for structured waistbands. Braided works in casings. Use swimwear elastic only for swimwear." },
];

export default function WaistElasticPage() {
    const [waist, setWaist] = useState(""); const [hip, setHip] = useState("");
    const [elasticType, setElasticType] = useState("knitted"); const [fit, setFit] = useState("snug");
    const [overlap, setOverlap] = useState("1");
    const [activeFaq, setActiveFaq] = useState<number | null>(null); const [copied, setCopied] = useState(false);

    const w = parseFloat(waist) || 0; const h = parseFloat(hip) || 0;
    const et = elasticTypes[elasticType]; const fa = fitAdj[fit];
    const baseElastic = w * et.ratio + fa.mod;
    const ov = parseFloat(overlap) || 1;
    const cutLength = baseElastic + ov;
    const loopCirc = baseElastic;
    const maxStretch = cutLength / et.ratio;
    const hipCheck = h > 0 ? maxStretch >= h : null;
    const hasResult = w > 0;

    const handleCopy = useCallback(() => { navigator.clipboard.writeText(`Waist: ${w}", ${et.label}, ${fa.label} fit. Cut elastic: ${cutLength.toFixed(1)}" (includes ${ov}" overlap)`); setCopied(true); setTimeout(() => setCopied(false), 2000); }, [w, et, fa, cutLength, ov]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Elastic", href: "/elastic" }, { label: "Waist Calculator" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><Ruler size={14} strokeWidth={1.5} /> Elastic</span><h1>Waist Elastic Length Calculator</h1><p>Calculate the correct elastic length for waistbands based on body measurements and elastic type.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Measurements</h2>
                    <div className="calculator-form">
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Waist Measurement (inches)</label><input type="number" className="input-field input-mono" placeholder="e.g., 30" value={waist} onChange={e => setWaist(e.target.value)} min="0" step="0.5" /></div>
                            <div className="input-group"><label className="input-label">Hip Measurement (optional)</label><input type="number" className="input-field input-mono" placeholder="For pull-on check" value={hip} onChange={e => setHip(e.target.value)} min="0" step="0.5" /><span className="input-helper">For garments that pull on over hips</span></div>
                        </div>
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Elastic Type</label><select className="input-field" value={elasticType} onChange={e => setElasticType(e.target.value)}>{Object.entries(elasticTypes).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}</select></div>
                            <div className="input-group"><label className="input-label">Fit Preference</label><select className="input-field" value={fit} onChange={e => setFit(e.target.value)}>{Object.entries(fitAdj).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}</select></div>
                        </div>
                        <div className="input-group"><label className="input-label">Overlap for Joining (inches)</label><select className="input-field" value={overlap} onChange={e => setOverlap(e.target.value)}><option value="0.5">1/2&quot;</option><option value="1">1&quot; (standard)</option><option value="1.5">1.5&quot; (wide elastic)</option></select></div>
                    </div>
                    {hasResult && (<div><div className="calculator-divider" />
                        <div className="result-card"><div className="result-prefix">Cut Elastic Length</div><div className="result-value">{cutLength.toFixed(1)}&quot;</div><div className="result-label">Loop circumference: {loopCirc.toFixed(1)}&quot; (includes {ov}&quot; overlap for joining)</div></div>
                        {hipCheck !== null && (<p style={{ marginTop: 12, padding: "12px 16px", borderRadius: 8, fontSize: "var(--text-sm)", fontWeight: 600, background: hipCheck ? "#dcfce7" : "#fecaca", color: hipCheck ? "#166534" : "#991b1b" }}>{hipCheck ? `Hip check passed -- elastic stretches to ${maxStretch.toFixed(1)}" (hip: ${h}")` : `Warning: elastic only stretches to ${maxStretch.toFixed(1)}" but hips are ${h}". Garment may not pull on!`}</p>)}
                        <p style={{ margin: "8px 0", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>{et.note}</p>
                        <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
                    </div>)}
                </div>
                <div className="calculator-card"><h2 className={styles.sectionTitle}>Quick Reference: Common Waist Sizes</h2>
                    <div className={styles.tableWrap}><table className={styles.convTable}><thead><tr><th>Waist</th><th>Comfortable</th><th>Snug</th></tr></thead>
                        <tbody>{quickRef.map(r => (<tr key={r.waist}><td style={{ fontWeight: 600 }}>{r.waist}&quot;</td><td>{r.comf}&quot;</td><td>{r.snug}&quot;</td></tr>))}</tbody>
                    </table></div>
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}