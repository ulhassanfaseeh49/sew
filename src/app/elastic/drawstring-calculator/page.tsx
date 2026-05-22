"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Cable, Copy, Printer, ChevronDown, Ruler, BookOpen } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const tieStyles: Record<string, { label: string; perEnd: number }> = {
    knot: { label: "Simple knot", perEnd: 5 },
    smallBow: { label: "Small bow", perEnd: 8 },
    medBow: { label: "Medium bow", perEnd: 12 },
    largeBow: { label: "Large bow", perEnd: 16 },
    cordLock: { label: "Cord lock / toggle", perEnd: 3 },
    none: { label: "No tie (cord lock only)", perEnd: 2 },
};

const bowRef = [
    { style: "Tiny knot", perEnd: '3"', total: '6"' },
    { style: "Simple knot", perEnd: '5"', total: '10"' },
    { style: "Small bow", perEnd: '8"', total: '16"' },
    { style: "Medium bow", perEnd: '12"', total: '24"' },
    { style: "Large bow", perEnd: '16"', total: '32"' },
    { style: "Cord lock only", perEnd: '3"', total: '6"' },
];

const relatedTools = [
    { name: "Waist Elastic Calc", href: "/elastic/waist-calculator", icon: Ruler },
    { name: "Casing Width Calc", href: "/elastic/casing-width", icon: Ruler },
    { name: "Elastic Types Guide", href: "/elastic/types-guide", icon: BookOpen },
];
const faqItems = [
    { q: "How long should a drawstring be for pants?", a: "Casing circumference (waist) plus 10\" to 24\" extra per end for tying. A medium bow typically needs 12\" per end. Total: waist + 24\" for medium bows." },
    { q: "What is the difference between single and double drawstring?", a: "Single: one cord all the way around, both ends exit at one opening. Double: two cords going in opposite directions, pulled from both sides for even closure." },
    { q: "How much extra should I add for tying a bow?", a: "Small bow: 8\" per end. Medium: 12\" per end. Large: 16\" per end. For cord locks, only 2-3\" per end is needed." },
];

export default function DrawstringCalcPage() {
    const [casingCirc, setCasingCirc] = useState(""); const [tieStyle, setTieStyle] = useState("medBow");
    const [config, setConfig] = useState("single"); const [isChild, setIsChild] = useState("no");
    const [activeFaq, setActiveFaq] = useState<number | null>(null); const [copied, setCopied] = useState(false);

    const cc = parseFloat(casingCirc) || 0; const ts = tieStyles[tieStyle];
    const tieTotal = ts.perEnd * 2;
    const singleLen = cc + tieTotal;
    const doubleEach = cc + tieTotal;
    const total = config === "single" ? singleLen : doubleEach * 2;
    const hasResult = cc > 0;

    const handleCopy = useCallback(() => { navigator.clipboard.writeText(`${config === "single" ? "Single" : "Double"} drawstring: ${config === "single" ? `${singleLen.toFixed(1)}" total` : `2 x ${doubleEach.toFixed(1)}" = ${total.toFixed(1)}" total`}. Buy ${(Math.ceil(total / 36 * 10) / 10).toFixed(1)} yards.`); setCopied(true); setTimeout(() => setCopied(false), 2000); }, [config, singleLen, doubleEach, total]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Elastic", href: "/elastic" }, { label: "Drawstring Calculator" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><Cable size={14} strokeWidth={1.5} /> Elastic</span><h1>Drawstring Length Calculator</h1><p>Calculate drawstring length for garments and bags based on casing and tie style.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Drawstring Details</h2>
                    <div className="calculator-form">
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Casing Circumference (inches)</label><input type="number" className="input-field input-mono" placeholder="e.g., 32" value={casingCirc} onChange={e => setCasingCirc(e.target.value)} min="0" step="0.5" /></div>
                            <div className="input-group"><label className="input-label">Tie Style</label><select className="input-field" value={tieStyle} onChange={e => setTieStyle(e.target.value)}>{Object.entries(tieStyles).map(([k, v]) => <option key={k} value={k}>{v.label} (+{v.perEnd}&quot;/end)</option>)}</select></div>
                        </div>
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Configuration</label><select className="input-field" value={config} onChange={e => setConfig(e.target.value)}><option value="single">Single drawstring</option><option value="double">Double drawstring (2 cords)</option></select></div>
                            <div className="input-group"><label className="input-label">For Children?</label><select className="input-field" value={isChild} onChange={e => setIsChild(e.target.value)}><option value="no">Adult</option><option value="yes">Child (safety guidelines)</option></select></div>
                        </div>
                    </div>
                    {hasResult && (<div><div className="calculator-divider" />
                        <div className="result-card"><div className="result-prefix">{config === "single" ? "Single Drawstring" : "Double Drawstring (per cord)"}</div><div className="result-value">{config === "single" ? singleLen.toFixed(1) : doubleEach.toFixed(1)}&quot;</div><div className="result-label">{config === "double" ? `Cut 2 pieces. Total cord: ${total.toFixed(1)}". ` : ""}Buy {(Math.ceil(total / 36 * 10) / 10).toFixed(1)} yards</div></div>
                        <div className={styles.resultDetails} style={{ marginTop: 12 }}>
                            <div className="result-row"><span className="result-row-label">Casing circumference</span><span className="result-row-value">{cc}&quot;</span></div>
                            <div className="result-row"><span className="result-row-label">Tie allowance</span><span className="result-row-value">+{ts.perEnd}&quot; per end ({tieTotal}&quot; total)</span></div>
                            {config === "double" && <div className="result-row"><span className="result-row-label">Cords needed</span><span className="result-row-value">2</span></div>}
                        </div>
                        {isChild === "yes" && <p style={{ marginTop: 12, padding: "12px 16px", borderRadius: 8, fontSize: "var(--text-sm)", background: "#fef9c3", color: "#854d0e" }}>Safety: Children&apos;s drawstrings should have maximum 3&quot; (7.5cm) exposed cord per side when garment is on body. Hood drawstrings are not recommended for children. Consider cord locks instead of free-hanging ends.</p>}
                        <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
                    </div>)}
                </div>
                <div className="calculator-card"><h2 className={styles.sectionTitle}>Bow / Tie Length Reference</h2>
                    <div className={styles.tableWrap}><table className={styles.convTable}><thead><tr><th>Tie Style</th><th>Per End</th><th>Total Extra</th></tr></thead>
                        <tbody>{bowRef.map(b => (<tr key={b.style}><td style={{ fontWeight: 600 }}>{b.style}</td><td>{b.perEnd}</td><td>{b.total}</td></tr>))}</tbody>
                    </table></div>
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}