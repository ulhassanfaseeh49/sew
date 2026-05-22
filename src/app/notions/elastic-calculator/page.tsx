"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Minus, Copy, Printer, ChevronDown, Scissors, Ruler } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const apps: Record<string, { ratio: number; width: string }> = {
    "Waistband (direct)": { ratio: 0.80, width: "3/4\" - 1\"" },
    "Waistband (in casing)": { ratio: 0.85, width: "3/4\" - 1.5\"" },
    "Sleeve cuff": { ratio: 0.70, width: "1/4\" - 3/8\"" },
    "Pant cuff": { ratio: 0.75, width: "3/8\" - 1/2\"" },
    "Neckline": { ratio: 0.70, width: "1/4\" - 3/8\"" },
    "Leg opening (swimwear)": { ratio: 0.75, width: "3/8\" - 1/2\"" },
    "Gathered skirt waist": { ratio: 0.80, width: "3/4\" - 1.5\"" },
    "Hair tie / scrunchie": { ratio: 0.70, width: "1/4\"" },
};
const relatedTools = [
    { name: "Waist Elastic", href: "/elastic/waist-calculator", icon: Ruler },
    { name: "Casing Width", href: "/notions/casing-width", icon: Ruler },
    { name: "Elastic Types", href: "/elastic/types-guide", icon: Scissors },
];
const faqItems = [
    { q: "What percentage should I reduce for waist elastic?", a: "Typically 75-85% of body measurement. Firmer elastic (woven) uses 80-85%. Lighter elastic uses 75-80%. Always test stretch comfort before cutting." },
    { q: "Which elastic type should I use?", a: "Braided: only for casings (loses width when stretched). Knitted: can be exposed (maintains width). Woven: firmest, for waistbands and swimwear." },
    { q: "How do I test elastic length before cutting?", a: "Pin the elastic around the body at the desired position. Wear it for a few minutes. It should feel snug but comfortable. Adjust up or down based on comfort." },
];

export default function ElasticCalcPage() {
    const [app, setApp] = useState("Waistband (in casing)"); const [measurement, setMeasurement] = useState("30");
    const [activeFaq, setActiveFaq] = useState<number | null>(null); const [copied, setCopied] = useState(false);

    const m = parseFloat(measurement) || 0;
    const info = apps[app] || { ratio: 0.8, width: "3/4\"" };
    const elasticLen = m * info.ratio;
    const hasResult = m > 0;

    const handleCopy = useCallback(() => { navigator.clipboard.writeText(`Elastic for ${app}: ${elasticLen.toFixed(1)}" (${m}" x ${(info.ratio * 100).toFixed(0)}%). Width: ${info.width}`); setCopied(true); setTimeout(() => setCopied(false), 2000); }, [app, elasticLen, m, info]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Notions", href: "/notions" }, { label: "Elastic Calculator" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><Minus size={14} strokeWidth={1.5} /> Notions</span><h1>Elastic Width and Length Calculator</h1><p>Calculate elastic cutting length and recommended width for any application.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Application Details</h2>
                    <div className="calculator-form">
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Application</label><select className="input-field" value={app} onChange={e => setApp(e.target.value)}>{Object.keys(apps).map(a => (<option key={a} value={a}>{a}</option>))}</select></div>
                            <div className="input-group"><label className="input-label">Body Measurement (in)</label><input type="number" className="input-field input-mono" value={measurement} onChange={e => setMeasurement(e.target.value)} min="1" step="0.5" /></div>
                        </div>
                    </div>
                    {hasResult && (<div><div className="calculator-divider" />
                        <div className="result-card"><div className="result-prefix">Cut Elastic Length</div><div className="result-value">{elasticLen.toFixed(1)}&quot;</div><div className="result-label">{(info.ratio * 100).toFixed(0)}% of {m}&quot; measurement</div></div>
                        <div className={styles.resultDetails} style={{ marginTop: 12 }}>
                            <div className="result-row"><span className="result-row-label">Recommended width</span><span className="result-row-value">{info.width}</span></div>
                            <div className="result-row"><span className="result-row-label">Stretch ratio</span><span className="result-row-value">{(info.ratio * 100).toFixed(0)}%</span></div>
                            <div className="result-row"><span className="result-row-label">Add for overlap join</span><span className="result-row-value">+1&quot;</span></div>
                        </div>
                        <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
                    </div>)}
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}