"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../yards-to-meters/page.module.css";

export default function FabricPanelCalculatorPage() {
    const [panelW, setPanelW] = useState("");
    const [panelH, setPanelH] = useState("");
    const [borderW, setBorderW] = useState("0.5");
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const pw = parseFloat(panelW) || 0; const ph = parseFloat(panelH) || 0; const bw = parseFloat(borderW) || 0;
    const usableW = Math.max(0, pw - bw * 2); const usableH = Math.max(0, ph - bw * 2);
    const totalArea = pw * ph; const usableArea = usableW * usableH;

    const faqItems = [
        { q: "What is a fabric panel?", a: "A fabric panel is a piece of fabric with a printed design, usually 24\"×44\" or 36\"×44\", used as a focal point in quilts, pillows, or wall hangings." },
    ];

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Conversion Tools", href: "/convert" }, { label: "Fabric Panel Calculator" }]} />
            <div className="calculator-layout">
                <div className="calculator-main">
                    <div className={styles.toolHeader}>
                        <span className="category-badge"><span>🖼️</span> Conversion Tool #21</span>
                        <h1>Fabric Panel Size Calculator</h1>
                        <p>Calculate the usable/printable area of a fabric panel after accounting for borders.</p>
                    </div>
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>Panel Dimensions</h2>
                        <div className="calculator-form">
                            <div className="calculator-form-row">
                                <div className="input-group"><label className="input-label" htmlFor="pw">Panel width (inches)</label><input id="pw" type="number" className="input-field" placeholder="e.g., 44" value={panelW} onChange={e => setPanelW(e.target.value)} min="0" /></div>
                                <div className="input-group"><label className="input-label" htmlFor="ph">Panel height (inches)</label><input id="ph" type="number" className="input-field" placeholder="e.g., 24" value={panelH} onChange={e => setPanelH(e.target.value)} min="0" /></div>
                            </div>
                            <div className="input-group"><label className="input-label" htmlFor="bw">Border/selvage width each side (inches)</label><input id="bw" type="number" className="input-field" placeholder="0.5" value={borderW} onChange={e => setBorderW(e.target.value)} min="0" step="0.25" /></div>
                        </div>
                        {pw > 0 && ph > 0 && (<div className={`calculator-results ${styles.results}`}>
                            <div className="result-card"><div className="result-value">{usableW.toFixed(1)}&quot; × {usableH.toFixed(1)}&quot;</div><div className="result-label">Usable panel area ({usableArea.toFixed(1)} sq in)</div></div>
                            <div className={styles.resultDetails}>
                                <div className={styles.resultRow}><span>Total panel</span><strong>{pw}&quot;×{ph}&quot; ({totalArea} sq in)</strong></div>
                                <div className={styles.resultRow}><span>Usable area</span><strong>{usableArea.toFixed(1)} sq in ({(usableArea / totalArea * 100).toFixed(1)}%)</strong></div>
                            </div>
                            <div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard.writeText(`Usable: ${usableW}"×${usableH}" (${usableArea.toFixed(1)} sq in)`)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}>🖨️ Print</button></div>
                        </div>)}
                    </div>
                    <section className="faq-section"><h2>FAQ</h2><div style={{ marginTop: "1.5rem" }}>{faqItems.map((f, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
                </div>
                <aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related Tools</h4><a href="/convert/fabric-area-calculator" className="related-tool-link">📐 Area Calculator</a><a href="/quilt/charm-pack-calculator" className="related-tool-link">🟩 Charm Pack</a></div></aside>
            </div>
        </div>
    );
}
