"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Maximize2, Copy, Printer, ChevronDown, Circle, Ruler } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const hemMethods = [
    { maxLen: 80, diff: "Easy", method: "Standard double fold hem" },
    { maxLen: 120, diff: "Moderate", method: "Narrow double fold (1/4\")" },
    { maxLen: 160, diff: "Hard", method: "Rolled hem required" },
    { maxLen: 99999, diff: "Very hard", method: "Rolled hem or horsehair braid only" },
];
const relatedTools = [
    { name: "Waist Radius", href: "/skirt/waist-radius", icon: Ruler },
    { name: "Full Circle", href: "/skirt/full-circle", icon: Circle },
    { name: "Custom Angle", href: "/skirt/custom-angle-circle", icon: Circle },
];
const faqItems = [
    { q: "Why can't I use a wide hem on a circle skirt?", a: "A wide hem on a tight curve creates excess fabric that pleats and bunches. At 179\" of hem, even 1/2\" of folding is impossible to keep flat." },
    { q: "How long does it take to hem a circle skirt?", a: "A rolled hem on a full circle (180\") takes roughly 2-3 hours for an experienced sewer. Budget accordingly." },
    { q: "What is horsehair braid for hems?", a: "A stiffened mesh strip sewn into the hem that gives structure and bounce. Available in 1/2\", 1\", and 2\" widths. Creates the classic 1950s circle skirt shape." },
];

export default function HemCircumferencePage() {
    const [waist, setWaist] = useState("28"); const [length, setLength] = useState("24"); const [angle, setAngle] = useState("360");
    const [activeFaq, setActiveFaq] = useState<number | null>(null); const [copied, setCopied] = useState(false);

    const w = parseFloat(waist) || 28; const l = parseFloat(length) || 24; const a = parseFloat(angle) || 360;
    const radius = (w * 360) / (2 * Math.PI * a);
    const outerRadius = radius + l;
    const hemCirc = (a / 360) * 2 * Math.PI * outerRadius;
    const rec = hemMethods.find(m => hemCirc <= m.maxLen) || hemMethods[hemMethods.length - 1];
    const hasResult = w > 0 && l > 0;

    const lengths = [16, 22, 30, 42, 54].map(len => {
        const or = radius + len; const hc = (a / 360) * 2 * Math.PI * or;
        const m = hemMethods.find(h => hc <= h.maxLen) || hemMethods[hemMethods.length - 1];
        return { len, hc, method: m.method };
    });

    const handleCopy = useCallback(() => { navigator.clipboard.writeText(`Hem circumference: ${hemCirc.toFixed(0)}" (${(hemCirc / 12).toFixed(1)} ft). Method: ${rec.method}.`); setCopied(true); setTimeout(() => setCopied(false), 2000); }, [hemCirc, rec.method]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Skirt Calculators", href: "/skirt" }, { label: "Hem Circumference" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><Maximize2 size={14} strokeWidth={1.5} /> Skirt</span><h1>Hem Circumference Calculator</h1><p>See exactly how long your hem edge is and which hemming method you need.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Skirt Details</h2>
                    <div className="calculator-form">
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Waist (in)</label><input type="number" className="input-field input-mono" value={waist} onChange={e => setWaist(e.target.value)} min="1" step="0.5" /></div>
                            <div className="input-group"><label className="input-label">Skirt Length (in)</label><input type="number" className="input-field input-mono" value={length} onChange={e => setLength(e.target.value)} min="1" step="0.5" /></div>
                            <div className="input-group"><label className="input-label">Circle Angle</label><select className="input-field" value={angle} onChange={e => setAngle(e.target.value)}><option value="90">90deg (quarter)</option><option value="180">180deg (half)</option><option value="270">270deg (3/4)</option><option value="360">360deg (full)</option></select></div>
                        </div>
                    </div>
                    {hasResult && (<div><div className="calculator-divider" />
                        <div className="result-card"><div className="result-prefix">Hem Circumference</div><div className="result-value">{hemCirc.toFixed(0)}&quot; ({(hemCirc / 12).toFixed(1)} ft)</div><div className="result-label">{rec.method}</div></div>
                        <div className={styles.tableWrap} style={{ marginTop: 12 }}><table className={styles.convTable}><thead><tr><th>Length</th><th>Hem</th><th>Method</th></tr></thead>
                            <tbody>{lengths.map(r => (<tr key={r.len} style={{ background: r.len === l ? "var(--color-surface-hover)" : undefined }}><td style={{ fontWeight: 600 }}>{r.len}&quot;</td><td>{r.hc.toFixed(0)}&quot;</td><td>{r.method}</td></tr>))}</tbody>
                        </table></div>
                        <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
                    </div>)}
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}