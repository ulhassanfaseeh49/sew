"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { Baby, ClipboardCopy, Printer } from "lucide-react";

const shoeChart = [
    { age: "Preemie", len: 2.5, w: 1.5, sole: "2½\" × 1½\"" },
    { age: "0-3 months", len: 3.5, w: 2, sole: "3½\" × 2\"" },
    { age: "3-6 months", len: 3.75, w: 2.25, sole: "3¾\" × 2¼\"" },
    { age: "6-9 months", len: 4, w: 2.25, sole: "4\" × 2¼\"" },
    { age: "9-12 months", len: 4.25, w: 2.5, sole: "4¼\" × 2½\"" },
    { age: "12-18 months", len: 4.75, w: 2.5, sole: "4¾\" × 2½\"" },
    { age: "18-24 months", len: 5, w: 2.75, sole: "5\" × 2¾\"" },
];

const faqItems = [
    { q: "How do I measure a baby's foot?", a: "Stand baby on paper, trace around foot with pen held straight. Measure longest point (heel to toe) and widest point (across ball of foot). Add ¼\" to length for wiggle room." },
    { q: "What fabric for baby shoes?", a: "Upper: cotton, felt, or leather. Sole: leather (best grip) or suede. Lining: cotton jersey for comfort. Non-slip: use puffy paint dots on bottom of fabric soles for grip on smooth floors." },
    { q: "How much fabric for baby shoes?", a: "One pair: scrap-level amounts — about a fat quarter (18\" × 22\") is more than enough for multiple pairs. Sole leather: 6\" × 6\" piece per pair." },
];

export default function Page() {
    const [footLen, setFootLen] = useState("");
    const [activeFaq, setActiveFaq] = useState<number | null>(null);

    const fl = parseFloat(footLen) || 0;
    const match = fl > 0 ? shoeChart.reduce((best, r) => Math.abs(r.len - fl) < Math.abs(best.len - fl) ? r : best, shoeChart[0]) : null;

    const tH = { padding: "5px 8px", borderBottom: "2px solid hsl(0,0%,85%)", textAlign: "left" as const, fontSize: 11, fontWeight: 600 as const };
    const tD = { padding: "4px 8px", borderBottom: "1px solid hsl(0,0%,92%)", fontSize: 11 };

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Baby & Kids", href: "/baby-kids" }, { label: "Baby Shoes" }]} />
            <div className="calculator-layout">
                <div className="calculator-main">
                    <div className={styles.toolHeader}>
                        <span className="category-badge"><Baby size={14} strokeWidth={1.5} /> Baby #396</span>
                        <h1>Baby Shoe &amp; Bootie Size Calculator</h1>
                        <p>Get sole measurements and fabric needs for baby shoes and booties by age or foot measurement.</p>
                    </div>

                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>Foot Length</h2>
                        <div className="input-group" style={{ maxWidth: 200 }}>
                            <label className="input-label">Baby&apos;s foot length (in)</label>
                            <input type="number" className="input-field" placeholder="e.g. 4" value={footLen} onChange={e => setFootLen(e.target.value)} min={0} step={0.25} />
                        </div>
                        {match && fl > 0 && (
                            <div style={{ marginTop: 10, padding: 12, background: "hsl(340,15%,95%)", borderRadius: 8, borderLeft: "4px solid hsl(340,50%,45%)" }}>
                                <div style={{ fontSize: 12, fontWeight: 700, color: "hsl(340,40%,35%)" }}>Best match: {match.age}</div>
                                <div style={{ fontSize: 14, fontWeight: 800, marginTop: 4 }}>Sole: {match.sole}</div>
                                <div style={{ fontSize: 11, marginTop: 4, color: "var(--color-text-secondary)" }}>Cut sole {match.len + 0.5}&quot; × {match.w + 0.5}&quot; (includes ¼&quot; SA)</div>
                            </div>
                        )}
                    </div>

                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>Full Size Chart</h2>
                        <div style={{ overflowX: "auto" }}>
                            <table style={{ fontSize: 11, borderCollapse: "collapse", width: "100%" }}>
                                <thead><tr><th style={tH}>Age</th><th style={tH}>Foot Length</th><th style={tH}>Foot Width</th><th style={tH}>Sole Size</th></tr></thead>
                                <tbody>{shoeChart.map((r, i) => (
                                    <tr key={i} style={{ background: match === r ? "hsl(340,15%,93%)" : undefined }}>
                                        <td style={{ ...tD, fontWeight: 600 }}>{r.age}</td><td style={tD}>{r.len}&quot;</td><td style={tD}>{r.w}&quot;</td><td style={tD}>{r.sole}</td>
                                    </tr>
                                ))}</tbody>
                            </table>
                        </div>
                    </div>

                    <div className="toolbar" style={{ marginBottom: 10 }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard.writeText(match ? `Baby shoe size ${match.age}: sole ${match.sole}` : "")}><ClipboardCopy size={13} /> Copy</button>
                        <button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={13} /> Print</button>
                    </div>

                    <section className="faq-section"><h2>FAQ</h2>
                        <div style={{ marginTop: "1.5rem" }}>{faqItems.map((f, i) => (
                            <div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}>
                                <button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></button>
                                <div className="faq-answer">{f.a}</div>
                            </div>
                        ))}</div>
                    </section>
                </div>
                <aside className="calculator-sidebar">
                    <div className="glass-card related-tools">
                        <h4>Related Tools</h4>
                        <a href="/baby-kids/size-converter" className="related-tool-link">Size Converter</a>
                        <a href="/baby-kids/growth-room" className="related-tool-link">Growth Room</a>
                        <a href="/baby-kids" className="related-tool-link">All Baby & Kids</a>
                    </div>
                </aside>
            </div>
        </div>
    );
}