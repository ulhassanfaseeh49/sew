"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Leaf, Copy, Printer, ChevronDown, Scale, BookOpen } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const co2PerYard: Record<string, number> = { cotton: 2.1, organic: 1.2, linen: 0.9, hemp: 0.6, polyester: 3.5, silk: 2.8, wool: 4.2, tencel: 0.8, blend: 2.5 };
const fiberOpts = [
    { val: "cotton", label: "Conventional Cotton" }, { val: "organic", label: "Organic Cotton" },
    { val: "linen", label: "Linen" }, { val: "hemp", label: "Hemp" }, { val: "polyester", label: "Polyester" },
    { val: "silk", label: "Silk" }, { val: "wool", label: "Wool" }, { val: "tencel", label: "Tencel/Lyocell" }, { val: "blend", label: "Blend/Other" },
];

const relatedTools = [
    { name: "Eco-Fabric Comparator", href: "/sustainable/eco-fabric", icon: Scale },
    { name: "Make vs Buy", href: "/sustainable/make-vs-buy", icon: Leaf },
    { name: "Fiber Guide", href: "/sustainable/fiber-guide", icon: BookOpen },
];
const faqItems = [
    { q: "Is home sewing more sustainable than buying?", a: "Usually yes — especially if you choose quality fabric, make durable garments, and wear them for years. A handmade garment worn 200 times beats fast fashion worn 10 times." },
    { q: "Does the sewing machine use a lot of electricity?", a: "A typical home machine uses 75-100W. Sewing for 5 hours uses about 0.4 kWh — equivalent to running a lightbulb. Machine energy is a tiny fraction of total garment impact." },
    { q: "What matters most for sustainability?", a: "Longevity. A garment worn 300 times has 30x lower per-wear impact than one worn 10 times. Make quality, repair often, and wear everything you make." },
];

export default function CarbonFootprintPage() {
    const [fiber, setFiber] = useState("cotton"); const [yards, setYards] = useState("");
    const [lifespan, setLifespan] = useState("5"); const [wearsYear, setWears] = useState("40");
    const [activeFaq, setActiveFaq] = useState<number | null>(null); const [copied, setCopied] = useState(false);

    const y = parseFloat(yards) || 0; const life = parseInt(lifespan) || 5; const wpy = parseInt(wearsYear) || 40;
    const fabricCO2 = y * (co2PerYard[fiber] || 2.5);
    const machCO2 = 0.08; const totalHandmade = fabricCO2 + machCO2;
    const fastFashionCO2 = 8.0; const ffWears = 10;
    const perWearHandmade = totalHandmade / (life * wpy);
    const perWearFF = fastFashionCO2 / ffWears;
    const hasResult = y > 0;

    const handleCopy = useCallback(() => { navigator.clipboard.writeText(`Handmade: ${totalHandmade.toFixed(1)} kg CO2e total, ${(perWearHandmade * 1000).toFixed(0)}g/wear. Fast fashion: ${fastFashionCO2} kg CO2e, ${(perWearFF * 1000).toFixed(0)}g/wear.`); setCopied(true); setTimeout(() => setCopied(false), 2000); }, [totalHandmade, perWearHandmade, perWearFF]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Sustainable", href: "/sustainable" }, { label: "Carbon Footprint" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><Leaf size={14} strokeWidth={1.5} /> Sustainable</span><h1>Carbon Footprint: Handmade vs Store-Bought</h1><p>Compare the estimated carbon footprint of sewing your own garment versus buying.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Your Handmade Garment</h2>
                    <div className="calculator-form">
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Fabric Fiber</label><select className="input-field" value={fiber} onChange={e => setFiber(e.target.value)}>{fiberOpts.map(f => <option key={f.val} value={f.val}>{f.label}</option>)}</select></div>
                            <div className="input-group"><label className="input-label">Yardage</label><input type="number" className="input-field input-mono" placeholder="e.g., 3" value={yards} onChange={e => setYards(e.target.value)} min="0" step="0.25" /></div>
                        </div>
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Expected Lifespan (years)</label><input type="number" className="input-field input-mono" value={lifespan} onChange={e => setLifespan(e.target.value)} min="1" /></div>
                            <div className="input-group"><label className="input-label">Wears per Year</label><input type="number" className="input-field input-mono" value={wearsYear} onChange={e => setWears(e.target.value)} min="1" /></div>
                        </div>
                    </div>
                    {hasResult && (<div><div className="calculator-divider" />
                        <div className="result-card"><div className="result-prefix">Your Handmade Garment</div><div className="result-value">{totalHandmade.toFixed(1)} kg CO2e</div><div className="result-label">{(perWearHandmade * 1000).toFixed(0)}g per wear ({life * wpy} total wears)</div></div>
                        <div className={styles.resultDetails} style={{ marginTop: 16 }}>
                            <div className="result-row"><span className="result-row-label">Fabric production</span><span className="result-row-value">{fabricCO2.toFixed(1)} kg CO2e</span></div>
                            <div className="result-row"><span className="result-row-label">Machine energy</span><span className="result-row-value">{machCO2.toFixed(2)} kg CO2e</span></div>
                            <div className="result-row" style={{ borderTop: "2px solid var(--color-border)", paddingTop: 8, marginTop: 8 }}>
                                <span className="result-row-label">vs Fast fashion (~10 wears)</span><span className="result-row-value">{fastFashionCO2} kg / {(perWearFF * 1000).toFixed(0)}g per wear</span>
                            </div>
                            <div className="result-row"><span className="result-row-label">Your advantage</span><span className="result-row-value" style={{ color: "var(--color-accent)", fontWeight: 600 }}>{perWearHandmade < perWearFF ? `${((1 - perWearHandmade / perWearFF) * 100).toFixed(0)}% lower per-wear` : "Similar"}</span></div>
                        </div>
                        <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
                    </div>)}
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}