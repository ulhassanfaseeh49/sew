"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Ruler, Copy, Printer, ChevronDown, BookOpen } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const locations: Record<string, { label: string; passLabel: string }> = {
    wrist: { label: "Wrist Cuff (sleeve)", passLabel: "Hand circumference (knuckles)" },
    ankle: { label: "Ankle Cuff (pant leg)", passLabel: "Heel/ball of foot circumference" },
    knee: { label: "Knee Cuff (capri)", passLabel: "Calf circumference" },
    upperArm: { label: "Upper Arm (blouson)", passLabel: "Elbow circumference" },
};

const relatedTools = [
    { name: "Waist Elastic Calc", href: "/elastic/waist-calculator", icon: Ruler },
    { name: "Neckline Elastic", href: "/elastic/neckline-calculator", icon: Ruler },
    { name: "Elastic Types Guide", href: "/elastic/types-guide", icon: BookOpen },
];
const faqItems = [
    { q: "How do I calculate cuff elastic?", a: "Measure the body part (wrist/ankle), multiply by 85% for a snug fit. Then verify the elastic can stretch to pass over the hand/foot. This calculator does both checks." },
    { q: "Why does cuff elastic need a passage check?", a: "Unlike waist elastic, cuffs must stretch over a larger body part to put on the garment. A wrist cuff must pass over the hand, an ankle cuff over the foot." },
    { q: "What width elastic works best for cuffs?", a: "1/4\" to 1/2\" for most cuffs. Wider elastic (3/4\"-1\") for heavy outerwear or rain jackets where wind protection matters." },
];

export default function CuffElasticPage() {
    const [location, setLocation] = useState("wrist");
    const [bodyMeas, setBodyMeas] = useState(""); const [passMeas, setPassMeas] = useState("");
    const [numCuffs, setNumCuffs] = useState("2");
    const [activeFaq, setActiveFaq] = useState<number | null>(null); const [copied, setCopied] = useState(false);

    const loc = locations[location]; const b = parseFloat(bodyMeas) || 0; const p = parseFloat(passMeas) || 0;
    const n = parseInt(numCuffs) || 2;
    const cutPerCuff = b * 0.85 + 0.5; // 85% + 0.5" overlap
    const total = cutPerCuff * n;
    const maxStretch = cutPerCuff / 0.5; // elastic stretches ~2x
    const passCheck = p > 0 ? maxStretch >= p : null;
    const hasResult = b > 0;

    const handleCopy = useCallback(() => { navigator.clipboard.writeText(`${loc.label}: ${cutPerCuff.toFixed(1)}" per cuff x ${n} = ${total.toFixed(1)}" total. Buy ${Math.ceil(total / 36 * 10) / 10} yards.`); setCopied(true); setTimeout(() => setCopied(false), 2000); }, [loc, cutPerCuff, n, total]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Elastic", href: "/elastic" }, { label: "Cuff Calculator" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><Ruler size={14} strokeWidth={1.5} /> Elastic</span><h1>Cuff Elastic Calculator</h1><p>Calculate elastic length for sleeve and pant cuffs with hand/foot passage check.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Cuff Details</h2>
                    <div className="calculator-form">
                        <div className="input-group"><label className="input-label">Cuff Location</label><select className="input-field" value={location} onChange={e => setLocation(e.target.value)}>{Object.entries(locations).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}</select></div>
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">{loc.label} Circumference (inches)</label><input type="number" className="input-field input-mono" placeholder="e.g., 7" value={bodyMeas} onChange={e => setBodyMeas(e.target.value)} min="0" step="0.25" /></div>
                            <div className="input-group"><label className="input-label">{loc.passLabel} (inches)</label><input type="number" className="input-field input-mono" placeholder="For passage check" value={passMeas} onChange={e => setPassMeas(e.target.value)} min="0" step="0.25" /></div>
                        </div>
                        <div className="input-group"><label className="input-label">Number of Cuffs</label><select className="input-field" value={numCuffs} onChange={e => setNumCuffs(e.target.value)}><option value="2">2 cuffs (pair of sleeves)</option><option value="4">4 cuffs (sleeves + ankles)</option><option value="1">1 cuff</option></select></div>
                    </div>
                    {hasResult && (<div><div className="calculator-divider" />
                        <div className="result-card"><div className="result-prefix">Cut Per Cuff</div><div className="result-value">{cutPerCuff.toFixed(1)}&quot;</div><div className="result-label">Total for {n} cuffs: {total.toFixed(1)}&quot; (Buy {(Math.ceil(total / 36 * 10) / 10).toFixed(1)} yards)</div></div>
                        {passCheck !== null && (<p style={{ marginTop: 12, padding: "12px 16px", borderRadius: 8, fontSize: "var(--text-sm)", fontWeight: 600, background: passCheck ? "#dcfce7" : "#fecaca", color: passCheck ? "#166534" : "#991b1b" }}>{passCheck ? `Passage check passed -- elastic stretches to ${maxStretch.toFixed(1)}" (need ${p}")` : `Warning: elastic only stretches to ${maxStretch.toFixed(1)}" but ${loc.passLabel.toLowerCase()} is ${p}". Cannot put garment on!`}</p>)}
                        <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
                    </div>)}
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}