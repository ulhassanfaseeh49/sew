"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { ArrowLeftRight, ClipboardCopy, Printer, Repeat, Ruler, Shield } from "lucide-react";

export default function BasicYardageCalcPage() {
    const [length, setLength] = useState("");
    const [width, setWidth] = useState("");
    const [pieces, setPieces] = useState("1");
    const [fabricWidth, setFabricWidth] = useState("44.5");
    const [seamAllowance, setSeamAllowance] = useState("0.625");
    const [buffer, setBuffer] = useState("10");
    const [activeFaq, setActiveFaq] = useState<number | null>(null);

    const l = parseFloat(length) || 0;
    const w = parseFloat(width) || 0;
    const p = parseInt(pieces) || 1;
    const fw = parseFloat(fabricWidth) || 44.5;
    const sa = parseFloat(seamAllowance) || 0;
    const buf = parseFloat(buffer) || 0;

    const cutL = l + sa * 2;
    const cutW = w + sa * 2;
    const piecesAcross = cutW > 0 ? Math.floor(fw / cutW) : 0;
    const rows = piecesAcross > 0 ? Math.ceil(p / piecesAcross) : 0;
    const totalLength = rows * cutL;
    const withBuffer = totalLength * (1 + buf / 100);
    const yards = withBuffer / 36;
    const roundedYards = Math.ceil(yards * 8) / 8;
    const meters = roundedYards * 0.9144;

    const faqItems = [
        { q: "How much extra fabric should I buy?", a: "For beginners, add 10-15% buffer. For experienced sewists, 5-10%. Always add more for directional or patterned fabrics." },
        { q: "What does fabric width mean?", a: "Fabric width is how wide the fabric is on the bolt — typically 44/45\", 54\", or 60\". Wider fabric means you may need less yardage." },
        { q: "Why does my pattern list two different yardage amounts?", a: "Patterns list yardage for different fabric widths. Wider fabric needs less yardage because more pattern pieces fit across." },
    ];

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Yardage Calculators", href: "/yardage" }, { label: "Basic Yardage" }]} />
            <div className="calculator-layout">
                <div className="calculator-main">
                    <div className={styles.toolHeader}>
                        <span className="category-badge"><Ruler size={14} strokeWidth={1.5} /> Yardage Tool</span>
                        <h1>Basic Fabric Yardage Calculator</h1>
                        <p>Calculate how much fabric you need based on your project dimensions and fabric width.</p>
                    </div>
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>Project Dimensions</h2>
                        <div className="calculator-form">
                            <div className="calculator-form-row">
                                <div className="input-group"><label className="input-label" htmlFor="l">Piece length (inches)</label><input id="l" type="number" className="input-field" placeholder="e.g., 36" value={length} onChange={e => setLength(e.target.value)} min="0" /></div>
                                <div className="input-group"><label className="input-label" htmlFor="w">Piece width (inches)</label><input id="w" type="number" className="input-field" placeholder="e.g., 20" value={width} onChange={e => setWidth(e.target.value)} min="0" /></div>
                            </div>
                            <div className="calculator-form-row">
                                <div className="input-group"><label className="input-label" htmlFor="p">Number of pieces</label><input id="p" type="number" className="input-field" value={pieces} onChange={e => setPieces(e.target.value)} min="1" /></div>
                                <div className="input-group"><label className="input-label" htmlFor="fw">Fabric width</label>
                                    <select id="fw" className="input-field" value={fabricWidth} onChange={e => setFabricWidth(e.target.value)}>
                                        <option value="36">36&quot;</option><option value="44.5">44/45&quot;</option><option value="54">54&quot;</option><option value="60">60&quot;</option><option value="72">72&quot;</option><option value="108">108&quot;</option>
                                    </select>
                                </div>
                            </div>
                            <div className="calculator-form-row">
                                <div className="input-group"><label className="input-label" htmlFor="sa">Seam allowance</label>
                                    <select id="sa" className="input-field" value={seamAllowance} onChange={e => setSeamAllowance(e.target.value)}>
                                        <option value="0">None</option><option value="0.25">¼&quot;</option><option value="0.375">⅜&quot;</option><option value="0.5">½&quot;</option><option value="0.625">⅝&quot; (standard)</option><option value="1">1&quot;</option>
                                    </select>
                                </div>
                                <div className="input-group"><label className="input-label" htmlFor="buf">Buffer %</label>
                                    <select id="buf" className="input-field" value={buffer} onChange={e => setBuffer(e.target.value)}>
                                        <option value="0">0%</option><option value="5">5%</option><option value="10">10%</option><option value="15">15%</option><option value="20">20%</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        {l > 0 && w > 0 && (<div className={`calculator-results ${styles.results}`}>
                            <div className="result-card"><div className="result-value">{roundedYards.toFixed(3)} yards</div><div className="result-label">Buy {roundedYards.toFixed(3)} yards ({meters.toFixed(2)} m) of {fw}&quot;-wide fabric</div></div>
                            <div className={styles.resultDetails}>
                                <div className={styles.resultRow}><span>Cut size per piece</span><strong>{cutL.toFixed(1)}&quot; × {cutW.toFixed(1)}&quot;</strong></div>
                                <div className={styles.resultRow}><span>Pieces across width</span><strong>{piecesAcross}</strong></div>
                                <div className={styles.resultRow}><span>Rows needed</span><strong>{rows}</strong></div>
                                <div className={styles.resultRow}><span>Total length (no buffer)</span><strong>{totalLength.toFixed(1)}&quot; ({(totalLength / 36).toFixed(3)} yd)</strong></div>
                                <div className={styles.resultRow}><span>Buffer added</span><strong>{buf}% ({((withBuffer - totalLength) / 36).toFixed(3)} yd)</strong></div>
                            </div>
                            <div className="toolbar">
                                <button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard.writeText(`Need ${roundedYards.toFixed(3)} yards of ${fw}" fabric for ${p} pieces at ${l}"×${w}"`)}><ClipboardCopy size={13} /> Copy</button>
                                <button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={13} /> Print</button>
                            </div>
                        </div>)}
                    </div>
                    <section className="faq-section"><h2>FAQ</h2><div style={{ marginTop: "1.5rem" }}>{faqItems.map((f, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
                </div>
                <aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related Tools</h4><a href="/yardage/pattern-repeat-calculator" className="related-tool-link"><Repeat size={13} /> Pattern Repeat</a><a href="/yardage/buffer-calculator" className="related-tool-link"><Shield size={13} /> Buffer Calculator</a><a href="/convert/fabric-width-universal" className="related-tool-link"><ArrowLeftRight size={13} /> Width Converter</a></div></aside>
            </div>
        </div>
    );
}
