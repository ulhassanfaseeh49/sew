"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { ArrowUp, ClipboardCopy, Palette, Printer, Ruler } from "lucide-react";

export default function BorderPrintCalcPage() {
    const [finishedLength, setFinishedLength] = useState(""); const [numPanels, setNumPanels] = useState("4"); const [fabricWidth, setFabricWidth] = useState("44.5"); const [borderWidth, setBorderWidth] = useState("6"); const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const fl = parseFloat(finishedLength) || 0; const np = parseInt(numPanels) || 1; const fw = parseFloat(fabricWidth) || 44.5; const bw = parseFloat(borderWidth) || 6;
    const usableWidth = fw - bw;
    // Crosswise cutting: panels across the length, piece length comes from width
    const panelsAcrossLength = fl > 0 ? Math.floor(fw / fl) : 0;
    const crossYardage = panelsAcrossLength > 0 ? Math.ceil(np / panelsAcrossLength) * (fw / 36) : 0;
    // Standard cutting
    const standardYardage = (fl * np) / 36;
    const roundedCross = Math.ceil(crossYardage * 8) / 8; const roundedStd = Math.ceil(standardYardage * 8) / 8;

    const faqItems = [
        { q: "What is a border print fabric?", a: "A fabric with a decorative design running along one or both selvage edges. You position it so the border appears at the hem, edge, or other desired location." },
        { q: "Why does border print need special calculation?", a: "Because pieces are often cut crosswise to place the border at the hem, which completely changes the yardage calculation." },
    ];

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Yardage Calculators", href: "/yardage" }, { label: "Border Print" }]} />
            <div className="calculator-layout">
                <div className="calculator-main">
                    <div className={styles.toolHeader}><span className="category-badge"><Palette size={14} strokeWidth={1.5} /> Yardage Tool</span><h1>Border Print Fabric Yardage Calculator</h1><p>Calculate yardage for border print fabrics where the decorative border runs along the selvage.</p></div>
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>Border Print Details</h2>
                        <div className="calculator-form">
                            <div className="calculator-form-row">
                                <div className="input-group"><label className="input-label" htmlFor="fl">Finished piece length (in)</label><input id="fl" type="number" className="input-field" placeholder="e.g., 30" value={finishedLength} onChange={e => setFinishedLength(e.target.value)} min="0" /></div>
                                <div className="input-group"><label className="input-label" htmlFor="np">Number of panels</label><input id="np" type="number" className="input-field" value={numPanels} onChange={e => setNumPanels(e.target.value)} min="1" /></div>
                            </div>
                            <div className="calculator-form-row">
                                <div className="input-group"><label className="input-label" htmlFor="fw">Fabric width</label><select id="fw" className="input-field" value={fabricWidth} onChange={e => setFabricWidth(e.target.value)}><option value="44.5">44/45&quot;</option><option value="54">54&quot;</option><option value="60">60&quot;</option></select></div>
                                <div className="input-group"><label className="input-label" htmlFor="bw">Border width (in)</label><input id="bw" type="number" className="input-field" placeholder="e.g., 6" value={borderWidth} onChange={e => setBorderWidth(e.target.value)} min="0" /></div>
                            </div>
                        </div>
                        {fl > 0 && (<div className={`calculator-results ${styles.results}`}>
                            <div className="result-card"><div className="result-value">{roundedCross.toFixed(3)} yards</div><div className="result-label">Crosswise cutting (border at hem)</div></div>
                            <div className={styles.resultDetails}>
                                <div className={styles.resultRow}><span>Standard cutting</span><strong>{roundedStd.toFixed(3)} yd</strong></div>
                                <div className={styles.resultRow}><span>Crosswise cutting</span><strong>{roundedCross.toFixed(3)} yd</strong></div>
                                <div className={styles.resultRow}><span>Usable width (minus border)</span><strong>{usableWidth.toFixed(1)}&quot;</strong></div>
                            </div>
                            <div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard.writeText(`Border print: ${roundedCross.toFixed(3)} yd crosswise`)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={13} /> Print</button></div>
                        </div>)}
                    </div>
                    <section className="faq-section"><h2>FAQ</h2><div style={{ marginTop: "1.5rem" }}>{faqItems.map((f, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
                </div>
                <aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related Tools</h4><a href="/yardage/directional-fabric-calculator" className="related-tool-link"><ArrowUp size={13} /> Directional Fabric</a><a href="/yardage/basic-calculator" className="related-tool-link"><Ruler size={13} /> Basic Yardage</a></div></aside>
            </div>
        </div>
    );
}
