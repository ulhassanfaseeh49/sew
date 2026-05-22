"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Sparkles, Copy, Printer, ChevronDown, Scissors, Ruler } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const fullness: Record<string, { label: string; strands: number }> = {
    slim: { label: "Slim (elegant)", strands: 25 },
    standard: { label: "Standard", strands: 50 },
    full: { label: "Full (luxurious)", strands: 90 },
    vfull: { label: "Very full (maximalist)", strands: 130 },
};

const sizeRef = [
    { size: '1" mini', standard: "~3 yards", full: "~5 yards" },
    { size: '2" small', standard: "~6 yards", full: "~10 yards" },
    { size: '3" medium', standard: "~10 yards", full: "~17 yards" },
    { size: '4" large', standard: "~14 yards", full: "~24 yards" },
    { size: '6" extra-large', standard: "~22 yards", full: "~38 yards" },
];

const relatedTools = [
    { name: "Fringe Calc", href: "/lace-trim/fringe", icon: Scissors },
    { name: "Pom-Pom Trim", href: "/lace-trim/pom-pom", icon: Scissors },
    { name: "Ribbon Calc", href: "/lace-trim/ribbon", icon: Ruler },
];
const faqItems = [
    { q: "How much thread do I need for one tassel?", a: "A 3\" standard-fullness tassel needs about 50 strands at 7\" each (body x 2 + knot) = ~350\" total, about 10 yards. Head wrapping adds 1-2 yards." },
    { q: "What thread is best for tassels?", a: "Embroidery floss for small tassels (under 3\"). Pearl cotton for medium. Yarn for large tassels. Silk for luxury. Thread weight affects both look and yardage." },
    { q: "How do I make all tassels the same size?", a: "Wrap thread around a cardboard strip cut to your tassel body length. Count wraps carefully for consistent fullness across all tassels." },
];

export default function TasselMakerPage() {
    const [bodyLen, setBodyLen] = useState("3"); const [full, setFull] = useState("standard");
    const [numTassels, setNumTassels] = useState("4"); const [headWrap, setHeadWrap] = useState("yes");
    const [activeFaq, setActiveFaq] = useState<number | null>(null); const [copied, setCopied] = useState(false);

    const bl = parseFloat(bodyLen) || 3; const f = fullness[full]; const n = parseInt(numTassels) || 1;
    const strandLen = bl * 2 + 0.5; // body x 2 + knot
    const bodyThread = strandLen * f.strands; // per tassel
    const headThread = headWrap === "yes" ? bl * 15 : 0; // rough head wrap
    const perTassel = bodyThread + headThread;
    const total = perTassel * n; const totalYards = total / 36;

    const handleCopy = useCallback(() => { navigator.clipboard.writeText(`${n} tassels at ${bl}" body (${f.label}): ${totalYards.toFixed(1)} yards thread total`); setCopied(true); setTimeout(() => setCopied(false), 2000); }, [n, bl, f, totalYards]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Lace & Trim", href: "/lace-trim" }, { label: "Tassel Maker" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><Sparkles size={14} strokeWidth={1.5} /> Lace and Trim</span><h1>Tassel Maker Calculator</h1><p>Calculate thread or yarn needed to make tassels of any size and quantity.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Tassel Details</h2>
                    <div className="calculator-form">
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Body Length (inches)</label><input type="number" className="input-field input-mono" value={bodyLen} onChange={e => setBodyLen(e.target.value)} min="0.5" step="0.5" /></div>
                            <div className="input-group"><label className="input-label">Fullness</label><select className="input-field" value={full} onChange={e => setFull(e.target.value)}>{Object.entries(fullness).map(([k, v]) => <option key={k} value={k}>{v.label} (~{v.strands} strands)</option>)}</select></div>
                        </div>
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Number of Tassels</label><input type="number" className="input-field input-mono" value={numTassels} onChange={e => setNumTassels(e.target.value)} min="1" /></div>
                            <div className="input-group"><label className="input-label">Wrapped Head?</label><select className="input-field" value={headWrap} onChange={e => setHeadWrap(e.target.value)}><option value="yes">Yes (thread-wrapped)</option><option value="no">No (bead or bare)</option></select></div>
                        </div>
                    </div>
                    <div className="calculator-divider" />
                    <div className="result-card"><div className="result-prefix">Total Thread / Yarn</div><div className="result-value">{totalYards.toFixed(1)} yards</div><div className="result-label">{perTassel.toFixed(0)}&quot; per tassel x {n} = {total.toFixed(0)}&quot;</div></div>
                    <div className={styles.resultDetails} style={{ marginTop: 12 }}>
                        <div className="result-row"><span className="result-row-label">Per tassel body</span><span className="result-row-value">{(bodyThread / 36).toFixed(1)} yards</span></div>
                        {headWrap === "yes" && <div className="result-row"><span className="result-row-label">Per tassel head wrap</span><span className="result-row-value">{(headThread / 36).toFixed(1)} yards</span></div>}
                        <div className="result-row"><span className="result-row-label">Embroidery floss skeins (8.7 yd each)</span><span className="result-row-value">{Math.ceil(totalYards / 8.7)} skeins</span></div>
                    </div>
                    <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
                </div>
                <div className="calculator-card"><h2 className={styles.sectionTitle}>Thread by Tassel Size (per tassel)</h2>
                    <div className={styles.tableWrap}><table className={styles.convTable}><thead><tr><th>Size</th><th>Standard</th><th>Full</th></tr></thead>
                        <tbody>{sizeRef.map(r => (<tr key={r.size}><td style={{ fontWeight: 600 }}>{r.size}</td><td>{r.standard}</td><td>{r.full}</td></tr>))}</tbody>
                    </table></div>
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}