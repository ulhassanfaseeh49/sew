"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, FileText, Printer, Shirt, Tag } from "lucide-react";

export default function LiningCalcPage() {
    const [outerYardage, setOuterYardage] = useState(""); const [garmentType, setGarmentType] = useState("dress"); const [liningMethod, setLiningMethod] = useState("full"); const [outerWidth, setOuterWidth] = useState("44.5"); const [liningWidth, setLiningWidth] = useState("44.5"); const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const oy = parseFloat(outerYardage) || 0; const ow = parseFloat(outerWidth) || 44.5; const lw = parseFloat(liningWidth) || 44.5;
    const methodFactor = { full: 1, partial: 0.6, underlining: 1 }[liningMethod] || 1;
    const typeFactor = { dress: 0.95, skirt: 0.9, jacket: 1.1, coat: 1.15, pants: 0.85, vest: 0.7, top: 0.85 }[garmentType] || 1;
    const baseLining = oy * methodFactor * typeFactor;
    const adjLining = baseLining * (ow / lw);
    const rounded = Math.ceil(adjLining * 8) / 8;

    const faqItems = [{ q: "Is lining yardage the same as outer fabric?", a: "Usually slightly less for dresses/skirts (shorter hem) and slightly more for jackets (ease in lining). This calculator adjusts automatically." }, { q: "What's the difference between lining and underlining?", a: "Lining is a separate interior layer. Underlining is cut exactly like the fashion fabric and basted to each piece before construction." }];

    return (<div className="container"><Breadcrumb items={[{ label: "Yardage Calculators", href: "/yardage" }, { label: "Lining Calculator" }]} />
        <div className="calculator-layout"><div className="calculator-main">
            <div className={styles.toolHeader}><span className="category-badge"><Shirt size={14} strokeWidth={1.5} /> Yardage Tool</span><h1>Lining Yardage Calculator</h1><p>Calculate lining fabric yardage for any garment type with adjustments for construction method.</p></div>
            <div className={`glass-card ${styles.calculatorCard}`}>
                <h2 className={styles.calcTitle}>Lining Details</h2>
                <div className="calculator-form">
                    <div className="input-group"><label className="input-label" htmlFor="oy">Outer fabric yardage</label><input id="oy" type="number" className="input-field" placeholder="e.g., 3.5" value={outerYardage} onChange={e => setOuterYardage(e.target.value)} min="0" step="0.125" /></div>
                    <div className="calculator-form-row">
                        <div className="input-group"><label className="input-label">Garment type</label><select className="input-field" value={garmentType} onChange={e => setGarmentType(e.target.value)}><option value="dress">Dress</option><option value="skirt">Skirt</option><option value="jacket">Jacket/Blazer</option><option value="coat">Coat</option><option value="pants">Pants</option><option value="vest">Vest</option><option value="top">Bodice/Top</option></select></div>
                        <div className="input-group"><label className="input-label">Lining method</label><select className="input-field" value={liningMethod} onChange={e => setLiningMethod(e.target.value)}><option value="full">Full lining</option><option value="partial">Partial (back only)</option><option value="underlining">Underlining (cut-for-cut)</option></select></div>
                    </div>
                    <div className="calculator-form-row">
                        <div className="input-group"><label className="input-label">Outer fabric width</label><select className="input-field" value={outerWidth} onChange={e => setOuterWidth(e.target.value)}><option value="44.5">44/45&quot;</option><option value="54">54&quot;</option><option value="60">60&quot;</option></select></div>
                        <div className="input-group"><label className="input-label">Lining fabric width</label><select className="input-field" value={liningWidth} onChange={e => setLiningWidth(e.target.value)}><option value="44.5">44/45&quot;</option><option value="54">54&quot;</option><option value="60">60&quot;</option></select></div>
                    </div>
                </div>
                {oy > 0 && (<div className={`calculator-results ${styles.results}`}>
                    <div className="result-card"><div className="result-value">{rounded.toFixed(3)} yards lining</div><div className="result-label">{liningMethod} lining for {garmentType}</div></div>
                    <div className={styles.resultDetails}>
                        <div className={styles.resultRow}><span>Outer fabric</span><strong>{oy.toFixed(3)} yd ({ow}&quot;)</strong></div>
                        <div className={styles.resultRow}><span>Lining needed</span><strong>{rounded.toFixed(3)} yd ({lw}&quot;)</strong></div>
                        <div className={styles.resultRow}><span>Ratio</span><strong>{(adjLining / oy * 100).toFixed(0)}% of outer</strong></div>
                    </div>
                    <div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard.writeText(`Lining: ${rounded.toFixed(3)} yd of ${lw}" fabric`)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={13} /> Print</button></div>
                </div>)}
            </div>
            <section className="faq-section"><h2>FAQ</h2><div style={{ marginTop: "1.5rem" }}>{faqItems.map((f, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
        </div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related Tools</h4><a href="/yardage/interfacing-calculator" className="related-tool-link"><Tag size={13} /> Interfacing</a><a href="/yardage/underlining-calculator" className="related-tool-link"><FileText size={13} /> Underlining</a></div></aside></div>
    </div>);
}
