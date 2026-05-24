"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { Scale, ClipboardCopy, Printer } from "lucide-react";

const fabricProps = [
    { name: "Quilting Cotton", weight: 3, drape: 2, breathe: 4, stretch: 1, fray: 3, ease: 5, wrinkle: 2, pill: 4, wash: 5 },
    { name: "Linen", weight: 3, drape: 3, breathe: 5, stretch: 1, fray: 4, ease: 4, wrinkle: 1, pill: 5, wash: 4 },
    { name: "Silk Charmeuse", weight: 1, drape: 5, breathe: 4, stretch: 1, fray: 4, ease: 1, wrinkle: 3, pill: 3, wash: 2 },
    { name: "Denim", weight: 4, drape: 2, breathe: 3, stretch: 1, fray: 2, ease: 3, wrinkle: 3, pill: 5, wash: 5 },
    { name: "Jersey Knit", weight: 2, drape: 4, breathe: 4, stretch: 5, fray: 1, ease: 3, wrinkle: 4, pill: 2, wash: 5 },
    { name: "Fleece", weight: 3, drape: 2, breathe: 3, stretch: 2, fray: 1, ease: 5, wrinkle: 5, pill: 2, wash: 5 },
    { name: "Chiffon", weight: 1, drape: 5, breathe: 5, stretch: 1, fray: 5, ease: 1, wrinkle: 3, pill: 4, wash: 3 },
    { name: "Canvas", weight: 5, drape: 1, breathe: 3, stretch: 1, fray: 3, ease: 3, wrinkle: 3, pill: 5, wash: 4 },
    { name: "Velvet", weight: 4, drape: 3, breathe: 2, stretch: 1, fray: 4, ease: 2, wrinkle: 3, pill: 3, wash: 2 },
    { name: "Ponte", weight: 4, drape: 3, breathe: 3, stretch: 4, fray: 1, ease: 4, wrinkle: 5, pill: 3, wash: 5 },
];
const props = ["Weight", "Drape", "Breathe", "Stretch", "Fray", "Ease", "Wrinkle-R", "Pill-R", "Wash"];
const propKeys = ["weight", "drape", "breathe", "stretch", "fray", "ease", "wrinkle", "pill", "wash"] as const;

export default function Page() {
    const [sel, setSel] = useState<number[]>([0, 3, 4]);
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const toggle = (i: number) => { const s = [...sel]; const idx = s.indexOf(i); idx >= 0 ? s.splice(idx, 1) : s.length < 5 && s.push(i); setSel(s); };
    const selected = sel.map(i => fabricProps[i]).filter(Boolean);
    const colors = ["hsl(200,50%,50%)", "hsl(340,50%,50%)", "hsl(160,50%,40%)", "hsl(280,50%,50%)", "hsl(40,60%,50%)"];

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Fabric Type", href: "/fabric-type" }, { label: "Property Comparator" }]} />
            <div className="calculator-layout">
                <div className="calculator-main">
                    <div className={styles.toolHeader}>
                        <span className="category-badge"><Scale size={14} strokeWidth={1.5} /> Fabric #420</span>
                        <h1>Fabric Property Comparator</h1>
                        <p>Compare up to 5 fabrics across 9 properties: weight, drape, breathability, stretch, fraying, ease of sewing, and more.</p>
                    </div>
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>Select Fabrics (up to 5)</h2>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: 4 }}>
                            {fabricProps.map((f, i) => (<button key={i} className={`btn btn-sm ${sel.includes(i) ? "btn-primary" : "btn-ghost"}`} onClick={() => toggle(i)} style={{ fontSize: 10 }}>{f.name}</button>))}
                        </div>
                    </div>
                    {selected.length > 0 && (
                        <div className={`glass-card ${styles.calculatorCard}`}>
                            <h2 className={styles.calcTitle}>Property Comparison</h2>
                            <div style={{ overflowX: "auto" }}>
                                <table style={{ fontSize: 11, borderCollapse: "collapse", width: "100%" }}>
                                    <thead><tr><th style={{ padding: "5px 8px", borderBottom: "2px solid hsl(0,0%,85%)", textAlign: "left", fontSize: 11, fontWeight: 600 }}>Property</th>
                                        {selected.map((f, i) => (<th key={i} style={{ padding: "5px 8px", borderBottom: `2px solid ${colors[i]}`, textAlign: "center", fontSize: 11, fontWeight: 600, color: colors[i] }}>{f.name}</th>))}
                                    </tr></thead>
                                    <tbody>{propKeys.map((pk, pi) => (
                                        <tr key={pk}>
                                            <td style={{ padding: "4px 8px", borderBottom: "1px solid hsl(0,0%,92%)", fontSize: 11, fontWeight: 600 }}>{props[pi]}</td>
                                            {selected.map((f, i) => {
                                                const v = f[pk];
                                                return <td key={i} style={{ padding: "4px 8px", borderBottom: "1px solid hsl(0,0%,92%)", textAlign: "center" }}>
                                                    <div style={{ display: "inline-flex", gap: 1 }}>{Array.from({ length: 5 }, (_, j) => (<span key={j} style={{ width: 8, height: 8, borderRadius: 2, background: j < v ? colors[i] : "hsl(0,0%,90%)" }} />))}</div>
                                                </td>;
                                            })}
                                        </tr>
                                    ))}</tbody>
                                </table>
                            </div>
                        </div>
                    )}
                    <div className="toolbar" style={{ marginBottom: 10 }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={13} /> Print</button>
                    </div>
                    <section className="faq-section"><h2>FAQ</h2><div style={{ marginTop: "1.5rem" }}>{[{ q: "What do the ratings mean?", a: "Each property rated 1-5. For Weight: 1=ultra-light, 5=heavy. For Drape: 1=stiff, 5=fluid. For Fray: 1=minimal, 5=frays badly. Ease: 1=difficult, 5=very easy." }].map((f, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
                </div>
                <aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/fabric-type/weight-comparator" className="related-tool-link">Weight Comparator</a><a href="/fabric-type/substitution" className="related-tool-link">Substitution</a><a href="/fabric-type" className="related-tool-link">All Fabric Type</a></div></aside>
            </div>
        </div>
    );
}