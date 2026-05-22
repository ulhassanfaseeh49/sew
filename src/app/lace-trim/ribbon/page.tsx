"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Gift, Copy, Printer, ChevronDown, Scissors, Ruler } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const bowSizes = [
    { size: "Small (2\")", loop: '4"', perBow: '12-14"', width: '3/8"-1/2"' },
    { size: "Medium (4\")", loop: '6"', perBow: '18-22"', width: '3/4"-1"' },
    { size: "Large (6\")", loop: '8"', perBow: '24-28"', width: '1"-1-1/2"' },
    { size: "XL (8\")", loop: '10"', perBow: '30-36"', width: '1-1/2"-2"' },
];

const appTypes: Record<string, { label: string }> = {
    sash: { label: "Garment sash / waistband" },
    edge: { label: "Edge trim (hem, neckline)" },
    bow: { label: "Hair bow / decorative bow" },
    gift: { label: "Gift wrapping" },
};

const relatedTools = [
    { name: "Rickrack Calc", href: "/lace-trim/rickrack", icon: Scissors },
    { name: "Fringe Calc", href: "/lace-trim/fringe", icon: Scissors },
    { name: "Lace Straight", href: "/lace-trim/lace-straight", icon: Ruler },
];
const faqItems = [
    { q: "How much ribbon do I need for a sash?", a: "Waist measurement plus enough for bow loops (12-24\" depending on bow size) plus tail length (8-12\" per side). Typical adult sash: about 2-3 yards." },
    { q: "How much ribbon for a hair bow?", a: "Small (2\"): 12-14\" per bow. Medium (4\"): 18-22\" per bow. Large (6\"): 24-28\" per bow. Double for layered bows." },
    { q: "What type of ribbon holds bows best?", a: "Grosgrain ribbon holds bows well due to its texture. Wire-edge ribbon holds shapes best. Satin is smooth and slippery -- harder to tie." },
];

export default function RibbonPage() {
    const [appType, setAppType] = useState("sash");
    const [waist, setWaist] = useState(""); const [bowSize, setBowSize] = useState("18"); const [tailLen, setTailLen] = useState("8"); const [numSash, setNumSash] = useState("1");
    const [edgeLen, setEdgeLen] = useState(""); const [numBows, setNumBows] = useState("1");
    const [activeFaq, setActiveFaq] = useState<number | null>(null); const [copied, setCopied] = useState(false);

    let total = 0;
    if (appType === "sash") { const w = parseFloat(waist) || 0; const b = parseFloat(bowSize) || 0; const t = parseFloat(tailLen) || 0; const n = parseInt(numSash) || 1; total = (w + b + t * 2) * n; }
    else if (appType === "edge") { total = (parseFloat(edgeLen) || 0) * 1.1; }
    else if (appType === "bow") { total = (parseFloat(bowSize) || 18) * (parseInt(numBows) || 1); }
    else if (appType === "gift") { total = (parseFloat(edgeLen) || 0) * (parseInt(numBows) || 1); }
    const yards = total / 36; const hasResult = total > 0;

    const handleCopy = useCallback(() => { navigator.clipboard.writeText(`Ribbon: ${total.toFixed(0)}" (${yards.toFixed(1)} yards)`); setCopied(true); setTimeout(() => setCopied(false), 2000); }, [total, yards]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Lace & Trim", href: "/lace-trim" }, { label: "Ribbon" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><Gift size={14} strokeWidth={1.5} /> Lace and Trim</span><h1>Ribbon Calculator</h1><p>Calculate ribbon yardage for bows, sashes, edge trim, and gift wrapping.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Ribbon Application</h2>
                    <div className="calculator-form">
                        <div className="input-group"><label className="input-label">Application Type</label><select className="input-field" value={appType} onChange={e => setAppType(e.target.value)}>{Object.entries(appTypes).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}</select></div>
                        {appType === "sash" && (<div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Waist (inches)</label><input type="number" className="input-field input-mono" placeholder="e.g., 30" value={waist} onChange={e => setWaist(e.target.value)} min="0" /></div>
                            <div className="input-group"><label className="input-label">Bow Loop Length</label><input type="number" className="input-field input-mono" value={bowSize} onChange={e => setBowSize(e.target.value)} min="0" /></div>
                            <div className="input-group"><label className="input-label">Tail Length (per side)</label><input type="number" className="input-field input-mono" value={tailLen} onChange={e => setTailLen(e.target.value)} min="0" /></div>
                            <div className="input-group"><label className="input-label">Qty</label><input type="number" className="input-field input-mono" value={numSash} onChange={e => setNumSash(e.target.value)} min="1" style={{ maxWidth: 60 }} /></div>
                        </div>)}
                        {appType === "edge" && (<div className="input-group"><label className="input-label">Total Edge Length (inches)</label><input type="number" className="input-field input-mono" placeholder="e.g., 60" value={edgeLen} onChange={e => setEdgeLen(e.target.value)} min="0" /></div>)}
                        {appType === "bow" && (<div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Ribbon per Bow (inches)</label><input type="number" className="input-field input-mono" value={bowSize} onChange={e => setBowSize(e.target.value)} min="0" /></div>
                            <div className="input-group"><label className="input-label">Number of Bows</label><input type="number" className="input-field input-mono" value={numBows} onChange={e => setNumBows(e.target.value)} min="1" /></div>
                        </div>)}
                        {appType === "gift" && (<div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Ribbon per Package (inches)</label><input type="number" className="input-field input-mono" placeholder="e.g., 48" value={edgeLen} onChange={e => setEdgeLen(e.target.value)} min="0" /></div>
                            <div className="input-group"><label className="input-label">Number of Packages</label><input type="number" className="input-field input-mono" value={numBows} onChange={e => setNumBows(e.target.value)} min="1" /></div>
                        </div>)}
                    </div>
                    {hasResult && (<div><div className="calculator-divider" />
                        <div className="result-card"><div className="result-prefix">Total Ribbon</div><div className="result-value">{yards.toFixed(1)} yards</div><div className="result-label">{total.toFixed(0)}&quot; total</div></div>
                        <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
                    </div>)}
                </div>
                <div className="calculator-card"><h2 className={styles.sectionTitle}>Bow Size Reference</h2>
                    <div className={styles.tableWrap}><table className={styles.convTable}><thead><tr><th>Bow Size</th><th>Loop</th><th>Per Bow</th><th>Ribbon Width</th></tr></thead>
                        <tbody>{bowSizes.map(b => (<tr key={b.size}><td style={{ fontWeight: 600 }}>{b.size}</td><td>{b.loop}</td><td>{b.perBow}</td><td>{b.width}</td></tr>))}</tbody>
                    </table></div>
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}