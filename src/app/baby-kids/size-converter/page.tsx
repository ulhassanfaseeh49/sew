"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { Baby, ClipboardCopy, Printer } from "lucide-react";

const sizeChart = [
    { us: "NB", uk: "0-3m", eu: 56, ht: 22, chest: 14, waist: 14 },
    { us: "3m", uk: "0-3m", eu: 62, ht: 24, chest: 16, waist: 16 },
    { us: "6m", uk: "3-6m", eu: 68, ht: 26, chest: 17, waist: 17 },
    { us: "12m", uk: "9-12m", eu: 80, ht: 30, chest: 19, waist: 19 },
    { us: "18m", uk: "12-18m", eu: 86, ht: 33, chest: 20, waist: 20 },
    { us: "2T", uk: "18-24m", eu: 92, ht: 36, chest: 21, waist: 20.5 },
    { us: "3T", uk: "2-3y", eu: 98, ht: 38, chest: 22, waist: 21 },
    { us: "4", uk: "3-4y", eu: 104, ht: 40, chest: 23, waist: 21.5 },
    { us: "5", uk: "4-5y", eu: 110, ht: 43, chest: 24, waist: 22 },
    { us: "6", uk: "5-6y", eu: 116, ht: 45, chest: 25, waist: 22.5 },
    { us: "7", uk: "6-7y", eu: 122, ht: 48, chest: 26, waist: 23 },
    { us: "8", uk: "7-8y", eu: 128, ht: 50, chest: 27, waist: 23.5 },
    { us: "10", uk: "9-10y", eu: 140, ht: 55, chest: 29, waist: 24.5 },
    { us: "12", uk: "11-12y", eu: 152, ht: 59, chest: 31, waist: 25.5 },
    { us: "14", uk: "13-14y", eu: 164, ht: 63, chest: 33, waist: 26.5 },
];

const faqItems = [
    { q: "What is size 4T in UK children's sizes?", a: "US 4T is equivalent to UK 3-4 years. In EU sizing: 104. Height-based: approximately 40\" (102cm). Pattern sizing may differ from ready-to-wear — always check the pattern's own size chart." },
    { q: "How do EU children's sizes work?", a: "EU sizes are based on child's height in centimeters. Size 104 = 104cm tall child. This is more consistent than age-based sizing because it's measurement-based. Height 104cm ≈ US size 4 / UK age 3-4." },
    { q: "Should I use age or measurements for children's patterns?", a: "ALWAYS use measurements. Age-based sizing is unreliable — children vary enormously. Measure chest (for tops), waist (for pants), and height. Use the measurement that's most critical for the garment type." },
    { q: "My child is between sizes — which should I choose?", a: "For tops: use chest measurement. For pants: use height/inseam. When in doubt: size UP. It's easier to take in than let out. Children grow quickly — a slightly loose garment will be perfect in a month." },
    { q: "What is the difference between 4T and size 4?", a: "4T (toddler) is designed for a diaper-wearing child with a rounder belly. Size 4 (kids) assumes no diaper and a slimmer fit. 4T has more room in the seat and waist. Some children skip 4T and go straight to size 4." },
];

export default function Page() {
    const [chest, setChest] = useState("");
    const [height, setHeight] = useState("");
    const [activeFaq, setActiveFaq] = useState<number | null>(null);

    const c = parseFloat(chest) || 0;
    const h = parseFloat(height) || 0;
    const match = c > 0 || h > 0 ? sizeChart.reduce((best, row) => {
        const dc = c > 0 ? Math.abs(row.chest - c) : 0;
        const dh = h > 0 ? Math.abs(row.ht - h) : 0;
        const score = dc + dh;
        return score < best.score ? { row, score } : best;
    }, { row: sizeChart[0], score: 999 }).row : null;

    const tH = { padding: "5px 8px", borderBottom: "2px solid hsl(0,0%,85%)", textAlign: "left" as const, fontSize: 11, fontWeight: 600 as const };
    const tD = { padding: "4px 8px", borderBottom: "1px solid hsl(0,0%,92%)", fontSize: 11 };

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Baby & Kids", href: "/baby-kids" }, { label: "Size Converter" }]} />
            <div className="calculator-layout">
                <div className="calculator-main">
                    <div className={styles.toolHeader}>
                        <span className="category-badge"><Baby size={14} strokeWidth={1.5} /> Baby #389</span>
                        <h1>Children&apos;s Size Conversion Tool</h1>
                        <p>Convert between US, UK, EU, and pattern brand sizing for children ages 0-16. Enter measurements for the most accurate size recommendation.</p>
                    </div>

                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>Enter Measurements</h2>
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Chest (in)</label>
                                <input type="number" className="input-field" placeholder="e.g. 23" value={chest} onChange={e => setChest(e.target.value)} min={0} step={0.5} /></div>
                            <div className="input-group"><label className="input-label">Height (in)</label>
                                <input type="number" className="input-field" placeholder="e.g. 40" value={height} onChange={e => setHeight(e.target.value)} min={0} step={0.5} /></div>
                        </div>
                    </div>

                    {match && (c > 0 || h > 0) && (
                        <div className={`glass-card ${styles.calculatorCard}`} style={{ borderLeft: "4px solid hsl(200,50%,45%)" }}>
                            <h2 className={styles.calcTitle}>Best Match</h2>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 12 }}>
                                <div style={{ padding: 12, background: "hsl(200,15%,95%)", borderRadius: 10, textAlign: "center" }}>
                                    <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "hsl(200,40%,35%)" }}>US</div>
                                    <div style={{ fontSize: 28, fontWeight: 800, color: "hsl(200,50%,30%)" }}>{match.us}</div>
                                </div>
                                <div style={{ padding: 12, background: "hsl(160,15%,95%)", borderRadius: 10, textAlign: "center" }}>
                                    <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "hsl(160,40%,35%)" }}>UK</div>
                                    <div style={{ fontSize: 28, fontWeight: 800, color: "hsl(160,50%,30%)" }}>{match.uk}</div>
                                </div>
                                <div style={{ padding: 12, background: "hsl(280,15%,95%)", borderRadius: 10, textAlign: "center" }}>
                                    <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "hsl(280,40%,35%)" }}>EU</div>
                                    <div style={{ fontSize: 28, fontWeight: 800, color: "hsl(280,50%,30%)" }}>{match.eu}</div>
                                </div>
                            </div>
                            <div className={styles.resultDetails}>
                                <div className="result-row"><span>Height</span><strong>{match.ht}&quot;</strong></div>
                                <div className="result-row"><span>Chest</span><strong>{match.chest}&quot;</strong></div>
                                <div className="result-row"><span>Waist</span><strong>{match.waist}&quot;</strong></div>
                            </div>
                        </div>
                    )}

                    <div className="toolbar" style={{ marginBottom: 10 }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard.writeText(match ? `US ${match.us} / UK ${match.uk} / EU ${match.eu}` : "")}><ClipboardCopy size={13} /> Copy</button>
                        <button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={13} /> Print</button>
                    </div>

                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>Full Size Chart</h2>
                        <div style={{ overflowX: "auto" }}>
                            <table style={{ fontSize: 11, borderCollapse: "collapse", width: "100%" }}>
                                <thead><tr><th style={tH}>US</th><th style={tH}>UK</th><th style={tH}>EU</th><th style={tH}>Height</th><th style={tH}>Chest</th><th style={tH}>Waist</th></tr></thead>
                                <tbody>{sizeChart.map((r, i) => (
                                    <tr key={i} style={{ background: match === r ? "hsl(200,15%,93%)" : undefined }}>
                                        <td style={{ ...tD, fontWeight: 600 }}>{r.us}</td><td style={tD}>{r.uk}</td><td style={tD}>{r.eu}</td><td style={tD}>{r.ht}&quot;</td><td style={tD}>{r.chest}&quot;</td><td style={tD}>{r.waist}&quot;</td>
                                    </tr>
                                ))}</tbody>
                            </table>
                        </div>
                    </div>

                    <section className="faq-section"><h2>Frequently Asked Questions</h2>
                        <div style={{ marginTop: "1.5rem" }}>{faqItems.map((f, i) => (
                            <div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}>
                                <button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></button>
                                <div className="faq-answer">{f.a}</div>
                            </div>
                        ))}</div>
                    </section>
                </div>
                <aside className="calculator-sidebar">
                    <div className="glass-card" style={{ padding: "var(--space-5)", marginBottom: "var(--space-4)" }}>
                        <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Sizing Tips</h4>
                        <div style={{ fontSize: 11, lineHeight: 2, color: "var(--color-text-secondary)" }}>
                            <div>• Measure chest for tops</div>
                            <div>• Measure waist for pants</div>
                            <div>• Measure height for overall fit</div>
                            <div>• When in doubt, size UP</div>
                            <div>• EU sizing = height in cm</div>
                        </div>
                    </div>
                    <div className="glass-card related-tools">
                        <h4>Related Tools</h4>
                        <a href="/baby-kids/growth-room" className="related-tool-link">Growth Room</a>
                        <a href="/baby-kids/baby-clothing-yardage" className="related-tool-link">Baby Clothing Yardage</a>
                        <a href="/body/body-measurement" className="related-tool-link">Body Measurements</a>
                        <a href="/baby-kids" className="related-tool-link">All Baby & Kids</a>
                    </div>
                </aside>
            </div>
        </div>
    );
}