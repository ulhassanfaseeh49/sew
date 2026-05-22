"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { ShoppingBag, Copy, Printer, ChevronDown, Droplets, Ruler } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const fiberShrinkage: Record<string, { label: string; pct: number }> = {
    cotton: { label: "100% Cotton", pct: 4 },
    linen: { label: "100% Linen", pct: 7 },
    rayon: { label: "100% Rayon", pct: 8 },
    wool: { label: "100% Wool", pct: 5 },
    silk: { label: "100% Silk", pct: 2 },
    polyester: { label: "100% Polyester", pct: 0.5 },
    cottonPoly: { label: "Cotton/Poly Blend", pct: 2 },
    cottonSpandex: { label: "Cotton/Spandex", pct: 3.5 },
    bamboo: { label: "100% Bamboo", pct: 4.5 },
    tencel: { label: "100% Tencel", pct: 3 },
};

const relatedTools = [
    { name: "Pre-Wash Estimator", href: "/shrinkage/pre-wash-estimator", icon: Droplets },
    { name: "Post-Wash Yardage", href: "/shrinkage/post-wash-yardage", icon: Ruler },
    { name: "Shrinkage % Calc", href: "/shrinkage/percentage-calculator", icon: Ruler },
];
const faqItems = [
    { q: "How much extra fabric should I buy for shrinkage?", a: "For cotton, add 5-8%. For linen or rayon, add 8-12%. For polyester blends, 1-3%. Always round up to the nearest 1/8 yard." },
    { q: "What if I already bought fabric without extra?", a: "Pre-wash and measure. If short, check if pattern pieces can be rearranged for efficiency or if smaller pieces can be pieced." },
    { q: "Should I always buy extra?", a: "For natural fibers (cotton, linen, wool, rayon): yes. For synthetics (polyester, nylon): the extra is minimal and optional." },
];

export default function BuyExtraPage() {
    const [fabrics, setFabrics] = useState([{ name: "Main fabric", yardage: "", fiber: "cotton" }]);
    const [bufferPct, setBufferPct] = useState("5");
    const [activeFaq, setActiveFaq] = useState<number | null>(null); const [copied, setCopied] = useState(false);

    const updateFab = (i: number, field: string, val: string) => { const f = [...fabrics]; (f[i] as Record<string, string>)[field] = val; setFabrics(f); };

    const results = fabrics.map(f => {
        const yd = parseFloat(f.yardage) || 0; const fb = fiberShrinkage[f.fiber]; const bf = parseFloat(bufferPct) || 0;
        const shrinkYd = yd * (fb.pct / 100); const bufferYd = yd * (bf / 100);
        const total = yd + shrinkYd + bufferYd; const buy = Math.ceil(total * 8) / 8;
        return { ...f, yd, shrinkYd, bufferYd, total, buy, pct: fb.pct };
    });
    const hasResult = results.some(r => r.yd > 0);

    const handleCopy = useCallback(() => {
        const lines = results.filter(r => r.yd > 0).map(r => `${r.name}: need ${r.yd} yd, buy ${r.buy} yd (+${r.pct}% shrinkage)`);
        navigator.clipboard.writeText(lines.join("\n")); setCopied(true); setTimeout(() => setCopied(false), 2000);
    }, [results]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Shrinkage", href: "/shrinkage" }, { label: "Buy Extra" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><ShoppingBag size={14} strokeWidth={1.5} /> Shrinkage</span><h1>Buy Extra for Shrinkage Calculator</h1><p>Calculate exactly how much extra fabric to purchase for shrinkage.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Fabric Requirements</h2>
                    {fabrics.map((f, i) => (<div key={i} className="calculator-form" style={{ marginBottom: 12, paddingBottom: 12, borderBottom: i < fabrics.length - 1 ? "1px solid var(--color-border)" : "none" }}>
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Fabric</label><input type="text" className="input-field" value={f.name} onChange={ev => updateFab(i, "name", ev.target.value)} /></div>
                            <div className="input-group"><label className="input-label">Yardage Needed</label><input type="number" className="input-field input-mono" placeholder="e.g., 3" value={f.yardage} onChange={ev => updateFab(i, "yardage", ev.target.value)} min="0" step="0.125" /></div>
                            <div className="input-group"><label className="input-label">Fiber</label><select className="input-field" value={f.fiber} onChange={ev => updateFab(i, "fiber", ev.target.value)}>{Object.entries(fiberShrinkage).map(([k, v]) => <option key={k} value={k}>{v.label} (~{v.pct}%)</option>)}</select></div>
                        </div>
                    </div>))}
                    <button className="btn btn-secondary btn-sm" onClick={() => setFabrics([...fabrics, { name: "", yardage: "", fiber: "cotton" }])}>+ Add Fabric</button>
                    <div className="input-group" style={{ marginTop: 12 }}><label className="input-label">Safety Buffer %</label><select className="input-field" value={bufferPct} onChange={e => setBufferPct(e.target.value)}><option value="0">None</option><option value="5">5%</option><option value="10">10%</option></select></div>
                    {hasResult && (<div><div className="calculator-divider" />
                        <div className={styles.tableWrap}><table className={styles.convTable}><thead><tr><th>Fabric</th><th>Need</th><th>Shrinkage</th><th>Buffer</th><th>Buy</th></tr></thead>
                            <tbody>{results.filter(r => r.yd > 0).map((r, i) => (<tr key={i}><td style={{ fontWeight: 600 }}>{r.name}</td><td>{r.yd} yd</td><td>+{r.shrinkYd.toFixed(2)} yd ({r.pct}%)</td><td>+{r.bufferYd.toFixed(2)} yd</td><td style={{ fontWeight: 600 }}>{r.buy} yd</td></tr>))}</tbody>
                        </table></div>
                        <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
                    </div>)}
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}