"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

export default function PatternRepeatCalcPage() {
    const [pieceLength, setPieceLength] = useState("");
    const [numPieces, setNumPieces] = useState("4");
    const [repeat, setRepeat] = useState("");
    const [repeatType, setRepeatType] = useState<"straight" | "halfdrop">("straight");
    const [fabricWidth, setFabricWidth] = useState("54");
    const [activeFaq, setActiveFaq] = useState<number | null>(null);

    const pl = parseFloat(pieceLength) || 0;
    const np = parseInt(numPieces) || 1;
    const rep = parseFloat(repeat) || 0;
    const fw = parseFloat(fabricWidth) || 54;

    const adjustedRepeat = repeatType === "halfdrop" ? rep * 2 : rep;
    const adjustedPieceLength = rep > 0 ? Math.ceil(pl / adjustedRepeat) * adjustedRepeat : pl;
    const baseYardage = (pl * np) / 36;
    const adjustedYardage = (adjustedPieceLength * np) / 36;
    const extraYardage = adjustedYardage - baseYardage;
    const roundedYards = Math.ceil(adjustedYardage * 8) / 8;
    const wastePercent = baseYardage > 0 ? ((extraYardage / baseYardage) * 100) : 0;

    const faqItems = [
        { q: "What is a pattern repeat?", a: "A pattern repeat is the distance before a printed motif repeats on the fabric. You need extra yardage so each piece can be cut at the right point in the repeat to match." },
        { q: "What is a half-drop repeat?", a: "In a half-drop repeat, every other column is offset by half the repeat height. This effectively doubles the repeat size for cutting purposes." },
        { q: "How do I find the repeat size?", a: "Check the bolt label at the store, or measure from one point on a motif to the same point on the next identical motif along the selvage." },
    ];

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Yardage Calculators", href: "/yardage" }, { label: "Pattern Repeat" }]} />
            <div className="calculator-layout">
                <div className="calculator-main">
                    <div className={styles.toolHeader}>
                        <span className="category-badge"><span>🔁</span> Yardage Tool #26</span>
                        <h1>Yardage with Pattern Repeat Calculator</h1>
                        <p>Calculate the extra fabric needed to match pattern repeats across seams — for curtains, upholstery, and garments.</p>
                    </div>
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>Pattern Repeat Details</h2>
                        <div className="calculator-form">
                            <div className="calculator-form-row">
                                <div className="input-group"><label className="input-label" htmlFor="pl">Piece length (inches)</label><input id="pl" type="number" className="input-field" placeholder="e.g., 84" value={pieceLength} onChange={e => setPieceLength(e.target.value)} min="0" /></div>
                                <div className="input-group"><label className="input-label" htmlFor="np">Number of pieces</label><input id="np" type="number" className="input-field" value={numPieces} onChange={e => setNumPieces(e.target.value)} min="1" /></div>
                            </div>
                            <div className="calculator-form-row">
                                <div className="input-group"><label className="input-label" htmlFor="rep">Repeat size (inches)</label><input id="rep" type="number" className="input-field" placeholder="e.g., 12" value={repeat} onChange={e => setRepeat(e.target.value)} min="0" /></div>
                                <div className="input-group"><label className="input-label">Repeat type</label>
                                    <select className="input-field" value={repeatType} onChange={e => setRepeatType(e.target.value as "straight" | "halfdrop")}>
                                        <option value="straight">Straight match</option><option value="halfdrop">Half-drop match</option>
                                    </select>
                                </div>
                            </div>
                            <div className="input-group"><label className="input-label" htmlFor="fw">Fabric width</label>
                                <select id="fw" className="input-field" value={fabricWidth} onChange={e => setFabricWidth(e.target.value)}>
                                    <option value="44.5">44/45&quot;</option><option value="54">54&quot;</option><option value="60">60&quot;</option><option value="108">108&quot;</option>
                                </select>
                            </div>
                        </div>
                        {pl > 0 && rep > 0 && (<div className={`calculator-results ${styles.results}`}>
                            <div className="result-card"><div className="result-value">{roundedYards.toFixed(3)} yards</div><div className="result-label">Total yardage needed with pattern matching</div></div>
                            <div className={styles.resultDetails}>
                                <div className={styles.resultRow}><span>Base yardage (no repeat)</span><strong>{baseYardage.toFixed(3)} yd</strong></div>
                                <div className={styles.resultRow}><span>Extra for repeat matching</span><strong>{extraYardage.toFixed(3)} yd ({wastePercent.toFixed(1)}% more)</strong></div>
                                <div className={styles.resultRow}><span>Adjusted cut length per piece</span><strong>{adjustedPieceLength}&quot;</strong></div>
                                <div className={styles.resultRow}><span>Effective repeat</span><strong>{adjustedRepeat}&quot; ({repeatType})</strong></div>
                            </div>
                            <div className="toolbar">
                                <button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard.writeText(`${roundedYards.toFixed(3)} yd needed (${rep}" ${repeatType} repeat, ${np} pieces at ${pl}")`)}>📋 Copy</button>
                                <button className="btn btn-secondary btn-sm" onClick={() => window.print()}>🖨️ Print</button>
                            </div>
                        </div>)}
                    </div>
                    <section className="faq-section"><h2>FAQ</h2><div style={{ marginTop: "1.5rem" }}>{faqItems.map((f, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
                </div>
                <aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related Tools</h4><a href="/yardage/basic-calculator" className="related-tool-link">📐 Basic Yardage</a><a href="/yardage/directional-fabric-calculator" className="related-tool-link">⬆️ Directional Fabric</a></div></aside>
            </div>
        </div>
    );
}
