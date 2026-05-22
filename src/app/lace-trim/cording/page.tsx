"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Cable, Copy, Printer, ChevronDown, Scissors, Ruler } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const appTypes: Record<string, { label: string; multiplier: number }> = {
    linear: { label: "Linear / edge trim", multiplier: 1.1 },
    loops: { label: "Decorative loops", multiplier: 2.5 },
    frogging: { label: "Frogging closure sets", multiplier: 1 },
    soutache: { label: "Soutache embroidery", multiplier: 4 },
};

const cordRef = [
    { type: "Soutache braid", width: "3mm", flex: "Very flexible", best: "Curves, embroidery" },
    { type: "Rattail", width: "2-3mm", flex: "Flexible", best: "Closures, decorative" },
    { type: "Chinese knotting", width: "2-4mm", flex: "Medium", best: "Frogging, closures" },
    { type: "Military cording", width: "3-6mm", flex: "Medium", best: "Military trim" },
    { type: "Gimp braid", width: "3-5mm", flex: "Flexible", best: "Decorative edging" },
];

const relatedTools = [
    { name: "Fringe Calc", href: "/lace-trim/fringe", icon: Scissors },
    { name: "Ribbon Calc", href: "/lace-trim/ribbon", icon: Scissors },
    { name: "Placement Guide", href: "/lace-trim/placement-guide", icon: Ruler },
];
const faqItems = [
    { q: "How much cord for frogging closures?", a: "Small set: about 36\" (1 yard). Medium: about 48\". Large: about 60\". Always buy 30% extra as frogging is hard to estimate precisely." },
    { q: "What is soutache braid?", a: "A narrow (3mm) flat braid with a groove down the center, used for decorative embroidery, jewelry, and couture trim. Very flexible for curves." },
    { q: "How much extra cord should I buy for soutache?", a: "Buy 30-50% more than calculated. Soutache curves and loops use 3-5x the linear distance -- it is notoriously hard to estimate." },
];

export default function CordingPage() {
    const [appType, setAppType] = useState("linear");
    const [edgeLen, setEdgeLen] = useState(""); const [froggingSets, setFroggingSets] = useState("3"); const [frogSize, setFrogSize] = useState("48");
    const [activeFaq, setActiveFaq] = useState<number | null>(null); const [copied, setCopied] = useState(false);

    const at = appTypes[appType];
    let total = 0;
    if (appType === "frogging") { total = (parseInt(froggingSets) || 0) * (parseFloat(frogSize) || 48) * 1.3; }
    else { total = (parseFloat(edgeLen) || 0) * at.multiplier * 1.15; }
    const yards = total / 36; const hasResult = total > 0;

    const handleCopy = useCallback(() => { navigator.clipboard.writeText(`Cording: ${yards.toFixed(1)} yards (${total.toFixed(0)}")`); setCopied(true); setTimeout(() => setCopied(false), 2000); }, [yards, total]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Lace & Trim", href: "/lace-trim" }, { label: "Cording" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><Cable size={14} strokeWidth={1.5} /> Lace and Trim</span><h1>Cording and Soutache Calculator</h1><p>Calculate decorative cording and soutache yardage for any application.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Application Details</h2>
                    <div className="calculator-form">
                        <div className="input-group"><label className="input-label">Application Type</label><select className="input-field" value={appType} onChange={e => setAppType(e.target.value)}>{Object.entries(appTypes).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}</select></div>
                        {appType === "frogging" ? (<div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Number of Closure Sets</label><input type="number" className="input-field input-mono" value={froggingSets} onChange={e => setFroggingSets(e.target.value)} min="1" /></div>
                            <div className="input-group"><label className="input-label">Cord per Set (inches)</label><select className="input-field" value={frogSize} onChange={e => setFrogSize(e.target.value)}><option value="36">Small (36&quot;)</option><option value="48">Medium (48&quot;)</option><option value="60">Large (60&quot;)</option></select></div>
                        </div>) : (
                            <div className="input-group"><label className="input-label">{appType === "soutache" ? "Design Area Linear Estimate (inches)" : "Edge Length (inches)"}</label><input type="number" className="input-field input-mono" placeholder="e.g., 60" value={edgeLen} onChange={e => setEdgeLen(e.target.value)} min="0" step="1" /></div>
                        )}
                    </div>
                    {hasResult && (<div><div className="calculator-divider" />
                        <div className="result-card"><div className="result-prefix">Total Cording</div><div className="result-value">{yards.toFixed(1)} yards</div><div className="result-label">{total.toFixed(0)}&quot; (includes buffer + {appType === "frogging" ? "30%" : "15%"} safety)</div></div>
                        <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
                    </div>)}
                </div>
                <div className="calculator-card"><h2 className={styles.sectionTitle}>Cord Type Comparison</h2>
                    <div className={styles.tableWrap}><table className={styles.convTable}><thead><tr><th>Type</th><th>Width</th><th>Flexibility</th><th>Best For</th></tr></thead>
                        <tbody>{cordRef.map(c => (<tr key={c.type}><td style={{ fontWeight: 600 }}>{c.type}</td><td>{c.width}</td><td>{c.flex}</td><td>{c.best}</td></tr>))}</tbody>
                    </table></div>
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}