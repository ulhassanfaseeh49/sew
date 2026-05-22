"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, Recycle, Ruler, Shield } from "lucide-react";

export default function BufferCalcPage() {
    const [baseYardage, setBaseYardage] = useState(""); const [skill, setSkill] = useState("intermediate"); const [fabricRisk, setFabricRisk] = useState("easy"); const [complexity, setComplexity] = useState("medium"); const [shrinkage, setShrinkage] = useState("3"); const [canReorder, setCanReorder] = useState("yes"); const [activeFaq, setActiveFaq] = useState<number | null>(null);

    const base = parseFloat(baseYardage) || 0;
    const skillPct = { beginner: 17, intermediate: 10, advanced: 5, professional: 2 }[skill] || 10;
    const fabricPct = { easy: 3, medium: 7, difficult: 12, veryDifficult: 18 }[fabricRisk] || 3;
    const complexPct = { simple: 3, medium: 7, complex: 12, couture: 18 }[complexity] || 7;
    const shrinkPct = parseFloat(shrinkage) || 0;
    const reorderPct = canReorder === "no" ? 5 : canReorder === "maybe" ? 3 : 0;
    const totalPct = skillPct + fabricPct + complexPct + shrinkPct + reorderPct;
    const bufferYards = base * (totalPct / 100);
    const totalYards = base + bufferYards;
    const rounded = Math.ceil(totalYards * 8) / 8;

    const faqItems = [{ q: "How much extra fabric should I buy?", a: `Based on your selections, we recommend ${totalPct}% extra. Beginners should add more, experienced sewists can get away with less.` }, { q: "Why does skill level affect buffer?", a: "Less experienced sewists may need to re-cut pieces due to cutting errors, so extra fabric provides insurance." }];

    return (<div className="container"><Breadcrumb items={[{ label: "Yardage Calculators", href: "/yardage" }, { label: "Buffer Calculator" }]} />
        <div className="calculator-layout"><div className="calculator-main">
            <div className={styles.toolHeader}><span className="category-badge"><Shield size={14} strokeWidth={1.5} /> Yardage Tool</span><h1>Extra Yardage Buffer Calculator</h1><p>Calculate exactly how much extra fabric to buy based on your skill, fabric type, and project complexity.</p></div>
            <div className={`glass-card ${styles.calculatorCard}`}>
                <h2 className={styles.calcTitle}>Risk Factors</h2>
                <div className="calculator-form">
                    <div className="input-group"><label className="input-label" htmlFor="base">Base yardage needed</label><input id="base" type="number" className="input-field" placeholder="e.g., 3.5" value={baseYardage} onChange={e => setBaseYardage(e.target.value)} min="0" step="0.125" /></div>
                    <div className="calculator-form-row">
                        <div className="input-group"><label className="input-label">Skill level (+{skillPct}%)</label><select className="input-field" value={skill} onChange={e => setSkill(e.target.value)}><option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option><option value="professional">Professional</option></select></div>
                        <div className="input-group"><label className="input-label">Fabric difficulty (+{fabricPct}%)</label><select className="input-field" value={fabricRisk} onChange={e => setFabricRisk(e.target.value)}><option value="easy">Easy (cotton, stable)</option><option value="medium">Medium (linen, home dec)</option><option value="difficult">Difficult (silk, velvet)</option><option value="veryDifficult">Very difficult (sheer, sequin)</option></select></div>
                    </div>
                    <div className="calculator-form-row">
                        <div className="input-group"><label className="input-label">Complexity (+{complexPct}%)</label><select className="input-field" value={complexity} onChange={e => setComplexity(e.target.value)}><option value="simple">Simple</option><option value="medium">Medium</option><option value="complex">Complex</option><option value="couture">Couture/Historical</option></select></div>
                        <div className="input-group"><label className="input-label">Shrinkage (+{shrinkPct}%)</label><select className="input-field" value={shrinkage} onChange={e => setShrinkage(e.target.value)}><option value="0">No pre-wash</option><option value="3">Cotton 3%</option><option value="5">Linen 5%</option><option value="8">Rayon 8%</option></select></div>
                    </div>
                    <div className="input-group"><label className="input-label">Can you get more? (+{reorderPct}%)</label><select className="input-field" value={canReorder} onChange={e => setCanReorder(e.target.value)}><option value="yes">Yes, easily</option><option value="maybe">Maybe</option><option value="no">No, one-of-a-kind</option></select></div>
                </div>
                {base > 0 && (<div className={`calculator-results ${styles.results}`}>
                    <div className="result-card"><div className="result-value">{rounded.toFixed(3)} yards total</div><div className="result-label">Buy {rounded.toFixed(3)} yd (base {base} + {totalPct}% buffer)</div></div>
                    <div className={styles.resultDetails}>
                        <div className={styles.resultRow}><span>Base yardage</span><strong>{base.toFixed(3)} yd</strong></div>
                        <div className={styles.resultRow}><span>Total buffer</span><strong>+{bufferYards.toFixed(3)} yd ({totalPct}%)</strong></div>
                        <div className={styles.resultRow}><span>Skill buffer</span><strong>+{skillPct}%</strong></div>
                        <div className={styles.resultRow}><span>Fabric risk</span><strong>+{fabricPct}%</strong></div>
                        <div className={styles.resultRow}><span>Complexity</span><strong>+{complexPct}%</strong></div>
                        <div className={styles.resultRow}><span>Shrinkage</span><strong>+{shrinkPct}%</strong></div>
                    </div>
                    <div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard.writeText(`Buy ${rounded.toFixed(3)} yd (${base} base + ${totalPct}% buffer)`)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={13} /> Print</button></div>
                </div>)}
            </div>
            <section className="faq-section"><h2>FAQ</h2><div style={{ marginTop: "1.5rem" }}>{faqItems.map((f, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
        </div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related Tools</h4><a href="/yardage/waste-calculator" className="related-tool-link"><Recycle size={13} /> Waste Calculator</a><a href="/yardage/basic-calculator" className="related-tool-link"><Ruler size={13} /> Basic Yardage</a></div></aside></div>
    </div>);
}
