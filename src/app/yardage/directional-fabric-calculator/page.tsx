"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { ArrowUp, ClipboardCopy, Palette, Printer, Repeat } from "lucide-react";

export default function DirectionalFabricPage() {
    const [pieceL, setPieceL] = useState(""); const [pieceW, setPieceW] = useState(""); const [numPieces, setNumPieces] = useState("4"); const [fabricWidth, setFabricWidth] = useState("44.5"); const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const pl = parseFloat(pieceL) || 0; const pw = parseFloat(pieceW) || 0; const np = parseInt(numPieces) || 1; const fw = parseFloat(fabricWidth) || 44.5;
    // Non-directional: pieces can flip, so also try perpendicular
    const acrossNorm = pw > 0 ? Math.floor(fw / pw) : 0; const rowsNorm = acrossNorm > 0 ? Math.ceil(np / acrossNorm) : 0; const yardNorm = (rowsNorm * pl) / 36;
    // Directional: all pieces same direction only
    const acrossDir = pw > 0 ? Math.floor(fw / pw) : 0; const rowsDir = acrossDir > 0 ? Math.ceil(np / acrossDir) : 0; const yardDir = (rowsDir * pl) / 36;
    const extra = yardDir - yardNorm; const pctMore = yardNorm > 0 ? ((extra / yardNorm) * 100) : 0; const roundedDir = Math.ceil(yardDir * 8) / 8;

    const faqItems = [
        { q: "What does 'with nap' mean on a pattern?", a: "'With nap' means all pattern pieces must be cut in the same direction because the fabric has a one-way design, texture, or sheen direction." },
        { q: "How much more fabric do directional fabrics need?", a: "Typically 10-25% more, depending on piece shapes and sizes. This calculator shows you the exact difference." },
    ];

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Yardage Calculators", href: "/yardage" }, { label: "Directional Fabric" }]} />
            <div className="calculator-layout">
                <div className="calculator-main">
                    <div className={styles.toolHeader}><span className="category-badge"><ArrowUp size={14} strokeWidth={1.5} /> Yardage Tool</span><h1>One-Way / Directional Fabric Calculator</h1><p>Calculate extra yardage needed when fabric has a one-way design, nap, or sheen direction.</p></div>
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>Piece Dimensions</h2>
                        <div className="calculator-form">
                            <div className="calculator-form-row">
                                <div className="input-group"><label className="input-label" htmlFor="pl">Piece length (in)</label><input id="pl" type="number" className="input-field" placeholder="e.g., 30" value={pieceL} onChange={e => setPieceL(e.target.value)} min="0" /></div>
                                <div className="input-group"><label className="input-label" htmlFor="pw">Piece width (in)</label><input id="pw" type="number" className="input-field" placeholder="e.g., 20" value={pieceW} onChange={e => setPieceW(e.target.value)} min="0" /></div>
                            </div>
                            <div className="calculator-form-row">
                                <div className="input-group"><label className="input-label" htmlFor="np">Pieces</label><input id="np" type="number" className="input-field" value={numPieces} onChange={e => setNumPieces(e.target.value)} min="1" /></div>
                                <div className="input-group"><label className="input-label">Fabric width</label><select className="input-field" value={fabricWidth} onChange={e => setFabricWidth(e.target.value)}><option value="44.5">44/45&quot;</option><option value="54">54&quot;</option><option value="60">60&quot;</option></select></div>
                            </div>
                        </div>
                        {pl > 0 && pw > 0 && (<div className={`calculator-results ${styles.results}`}>
                            <div className="result-card"><div className="result-value">{roundedDir.toFixed(3)} yards</div><div className="result-label">Yardage with directional layout</div></div>
                            <div className={styles.resultDetails}>
                                <div className={styles.resultRow}><span>Non-directional yardage</span><strong>{Math.ceil(yardNorm * 8 / 8).toFixed(3)} yd</strong></div>
                                <div className={styles.resultRow}><span>Directional yardage</span><strong>{roundedDir.toFixed(3)} yd</strong></div>
                                <div className={styles.resultRow}><span>Extra needed</span><strong>{extra > 0 ? `+${extra.toFixed(3)} yd (${pctMore.toFixed(1)}% more)` : "Same"}</strong></div>
                            </div>
                            <div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard.writeText(`Directional: ${roundedDir.toFixed(3)} yd vs non-directional: ${Math.ceil(yardNorm * 8 / 8).toFixed(3)} yd`)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={13} /> Print</button></div>
                        </div>)}
                    </div>
                    <section className="faq-section"><h2>FAQ</h2><div style={{ marginTop: "1.5rem" }}>{faqItems.map((f, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
                </div>
                <aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related Tools</h4><a href="/yardage/pattern-repeat-calculator" className="related-tool-link"><Repeat size={13} /> Pattern Repeat</a><a href="/yardage/border-print-calculator" className="related-tool-link"><Palette size={13} /> Border Print</a></div></aside>
            </div>
        </div>
    );
}
