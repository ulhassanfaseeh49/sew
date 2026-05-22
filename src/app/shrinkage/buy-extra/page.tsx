"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { ShoppingCart, Copy, Printer, ChevronDown, Droplets, BookOpen } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const fibers: Record<string, { label: string; pct: number }> = {
    cotton: { label: "100% Cotton", pct: 4 }, linen: { label: "100% Linen", pct: 7 },
    wool: { label: "100% Wool", pct: 5 }, silk: { label: "100% Silk", pct: 2 },
    rayon: { label: "100% Rayon/Viscose", pct: 8 }, polyester: { label: "100% Polyester", pct: 0.5 },
    nylon: { label: "100% Nylon", pct: 0.5 }, cottonPoly: { label: "Cotton/Poly Blend", pct: 2 },
    cottonLinen: { label: "Cotton/Linen Blend", pct: 5 }, tencel: { label: "Tencel/Lyocell", pct: 3 },
    bamboo: { label: "100% Bamboo", pct: 4.5 },
};

const relatedTools = [
    { name: "Pre-Wash Estimator", href: "/shrinkage/pre-wash-estimator", icon: Droplets },
    { name: "Post-Wash Yardage", href: "/shrinkage/post-wash-yardage", icon: Droplets },
    { name: "Shrinkage Database", href: "/shrinkage/fabric-database", icon: BookOpen },
];
const faqItems = [
    { q: "How much extra fabric should I buy for shrinkage?", a: "Add 5-10% for cotton, 10-15% for linen/rayon, 2-3% for synthetics. Always round up to the nearest 1/8 yard when purchasing." },
    { q: "What if I've already bought fabric without extra?", a: "Pre-wash and measure what you have. If it's not enough, try to match the dye lot at the same store, or adjust your pattern to fit available fabric." },
    { q: "Should I always buy extra or only for certain fabrics?", a: "Always buy at least 5% extra for natural fibers. For polyester and synthetics, the standard 1/8 yard rounding is usually sufficient." },
];

export default function BuyExtraPage() {
    const [yardage, setYardage] = useState(""); const [fiber, setFiber] = useState("cotton");
    const [buffer, setBuffer] = useState("5"); const [pricePerYard, setPricePerYard] = useState("");
    const [activeFaq, setActiveFaq] = useState<number | null>(null); const [copied, setCopied] = useState(false);

    const y = parseFloat(yardage) || 0; const f = fibers[fiber]; const b = parseFloat(buffer) || 0;
    const ppy = parseFloat(pricePerYard) || 0;
    const shrinkYd = y * (f.pct / 100); const bufferYd = y * (b / 100);
    const totalRaw = y + shrinkYd + bufferYd;
    const totalRounded = Math.ceil(totalRaw * 8) / 8; // nearest 1/8 yard
    const extraCost = ppy > 0 ? (totalRounded - y) * ppy : 0;
    const hasResult = y > 0;

    const handleCopy = useCallback(() => { navigator.clipboard.writeText(`Need: ${y} yd + ${shrinkYd.toFixed(2)} yd shrinkage + ${bufferYd.toFixed(2)} yd buffer = Buy ${totalRounded} yards (${f.label})`); setCopied(true); setTimeout(() => setCopied(false), 2000); }, [y, shrinkYd, bufferYd, totalRounded, f]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Shrinkage", href: "/shrinkage" }, { label: "Buy Extra" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><ShoppingCart size={14} strokeWidth={1.5} /> Shrinkage</span><h1>Buy Extra for Shrinkage Calculator</h1><p>Calculate exactly how much extra fabric to buy to account for shrinkage.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Fabric Purchase</h2>
                    <div className="calculator-form">
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Yardage Needed</label><input type="number" className="input-field input-mono" placeholder="e.g., 3" value={yardage} onChange={e => setYardage(e.target.value)} min="0" step="0.25" /></div>
                            <div className="input-group"><label className="input-label">Fiber Content</label><select className="input-field" value={fiber} onChange={e => setFiber(e.target.value)}>{Object.entries(fibers).map(([k, v]) => <option key={k} value={k}>{v.label} (~{v.pct}%)</option>)}</select></div>
                        </div>
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Safety Buffer (%)</label><select className="input-field" value={buffer} onChange={e => setBuffer(e.target.value)}><option value="0">None</option><option value="5">5%</option><option value="10">10%</option><option value="15">15%</option></select></div>
                            <div className="input-group"><label className="input-label">Price Per Yard (optional)</label><input type="number" className="input-field input-mono" placeholder="$" value={pricePerYard} onChange={e => setPricePerYard(e.target.value)} min="0" step="0.01" /></div>
                        </div>
                    </div>
                    {hasResult && (<div><div className="calculator-divider" />
                        <div className="result-card"><div className="result-prefix">Total to Purchase</div><div className="result-value">{totalRounded} yards</div><div className="result-label">{y} yd needed + {shrinkYd.toFixed(2)} yd shrinkage + {bufferYd.toFixed(2)} yd buffer</div></div>
                        <div className={styles.resultDetails} style={{ marginTop: 12 }}>
                            <div className="result-row"><span className="result-row-label">Pattern requires</span><span className="result-row-value">{y} yd</span></div>
                            <div className="result-row"><span className="result-row-label">Shrinkage (~{f.pct}%)</span><span className="result-row-value">+{shrinkYd.toFixed(2)} yd</span></div>
                            <div className="result-row"><span className="result-row-label">Safety buffer ({b}%)</span><span className="result-row-value">+{bufferYd.toFixed(2)} yd</span></div>
                            {ppy > 0 && <div className="result-row"><span className="result-row-label">Cost of extra fabric</span><span className="result-row-value">${extraCost.toFixed(2)}</span></div>}
                        </div>
                        <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
                    </div>)}
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}