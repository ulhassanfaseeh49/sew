"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { Scale, Printer } from "lucide-react";

const fibers = [
    { name: "Cotton", type: "natural", breathe: 4, moisture: 4, warmth: 2, stretch: 1, durability: 4, wrinkle: 1, wash: 5, eco: 3, cost: "$$" },
    { name: "Linen", type: "natural", breathe: 5, moisture: 5, warmth: 2, stretch: 1, durability: 5, wrinkle: 1, wash: 4, eco: 4, cost: "$$$" },
    { name: "Silk", type: "natural", breathe: 4, moisture: 3, warmth: 3, stretch: 1, durability: 3, wrinkle: 3, wash: 2, eco: 3, cost: "$$$$" },
    { name: "Wool", type: "natural", breathe: 3, moisture: 4, warmth: 5, stretch: 2, durability: 4, wrinkle: 4, wash: 2, eco: 3, cost: "$$$" },
    { name: "Hemp", type: "natural", breathe: 5, moisture: 4, warmth: 2, stretch: 1, durability: 5, wrinkle: 1, wash: 5, eco: 5, cost: "$$$" },
    { name: "Polyester", type: "synthetic", breathe: 2, moisture: 1, warmth: 2, stretch: 2, durability: 5, wrinkle: 5, wash: 5, eco: 1, cost: "$" },
    { name: "Nylon", type: "synthetic", breathe: 2, moisture: 1, warmth: 2, stretch: 3, durability: 5, wrinkle: 4, wash: 5, eco: 1, cost: "$$" },
    { name: "Rayon", type: "semi", breathe: 4, moisture: 4, warmth: 2, stretch: 1, durability: 2, wrinkle: 2, wash: 3, eco: 2, cost: "$$" },
    { name: "Tencel", type: "semi", breathe: 5, moisture: 5, warmth: 2, stretch: 1, durability: 4, wrinkle: 3, wash: 4, eco: 5, cost: "$$$" },
    { name: "Bamboo", type: "semi", breathe: 4, moisture: 4, warmth: 2, stretch: 2, durability: 3, wrinkle: 3, wash: 4, eco: 4, cost: "$$" },
];
const propNames = ["Breathable", "Moisture", "Warmth", "Stretch", "Durability", "Wrinkle-R", "Washable", "Eco-Score"];
const propKeys: (keyof typeof fibers[0])[] = ["breathe", "moisture", "warmth", "stretch", "durability", "wrinkle", "wash", "eco"];

export default function Page() {
    const [filter, setFilter] = useState<"all" | "natural" | "synthetic" | "semi">("all");
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const filtered = filter === "all" ? fibers : fibers.filter(f => f.type === filter);
    const colors: Record<string, string> = { natural: "hsl(160,50%,40%)", synthetic: "hsl(200,50%,50%)", semi: "hsl(40,60%,50%)" };

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Fabric Type", href: "/fabric-type" }, { label: "Fiber Comparator" }]} />
            <div className="calculator-layout">
                <div className="calculator-main">
                    <div className={styles.toolHeader}>
                        <span className="category-badge"><Scale size={14} strokeWidth={1.5} /> Fabric #422</span>
                        <h1>Natural vs Synthetic Fiber Comparator</h1>
                        <p>Compare natural, synthetic, and semi-synthetic fibers across 8 properties including eco-score.</p>
                    </div>
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <div style={{ display: "flex", gap: 4 }}>
                            {(["all", "natural", "synthetic", "semi"] as const).map(f => (<button key={f} className={`btn btn-sm ${filter === f ? "btn-primary" : "btn-ghost"}`} onClick={() => setFilter(f)} style={{ fontSize: 10, textTransform: "capitalize" }}>{f === "semi" ? "Semi-synthetic" : f}</button>))}
                        </div>
                    </div>
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <div style={{ overflowX: "auto" }}>
                            <table style={{ fontSize: 11, borderCollapse: "collapse", width: "100%" }}>
                                <thead><tr><th style={{ padding: "5px 8px", borderBottom: "2px solid hsl(0,0%,85%)", textAlign: "left", fontSize: 11, fontWeight: 600 }}>Fiber</th><th style={{ padding: "5px 8px", borderBottom: "2px solid hsl(0,0%,85%)", textAlign: "center", fontSize: 11, fontWeight: 600 }}>Type</th>
                                    {propNames.map(p => (<th key={p} style={{ padding: "5px 8px", borderBottom: "2px solid hsl(0,0%,85%)", textAlign: "center", fontSize: 10, fontWeight: 600 }}>{p}</th>))}
                                    <th style={{ padding: "5px 8px", borderBottom: "2px solid hsl(0,0%,85%)", textAlign: "center", fontSize: 11, fontWeight: 600 }}>Cost</th>
                                </tr></thead>
                                <tbody>{filtered.map((f, fi) => (
                                    <tr key={fi} style={{ background: fi % 2 ? "hsl(0,0%,98%)" : undefined }}>
                                        <td style={{ padding: "4px 8px", borderBottom: "1px solid hsl(0,0%,92%)", fontSize: 11, fontWeight: 600 }}>{f.name}</td>
                                        <td style={{ padding: "4px 8px", borderBottom: "1px solid hsl(0,0%,92%)", textAlign: "center" }}><span style={{ fontSize: 9, padding: "1px 5px", borderRadius: 4, color: "white", background: colors[f.type] }}>{f.type}</span></td>
                                        {propKeys.map(pk => { const v = f[pk] as number; return <td key={pk} style={{ padding: "4px 8px", borderBottom: "1px solid hsl(0,0%,92%)", textAlign: "center" }}><div style={{ display: "inline-flex", gap: 1 }}>{Array.from({ length: 5 }, (_, j) => (<span key={j} style={{ width: 6, height: 6, borderRadius: 1, background: j < v ? colors[f.type] : "hsl(0,0%,88%)" }}></span>))}</div></td>; })}
                                        <td style={{ padding: "4px 8px", borderBottom: "1px solid hsl(0,0%,92%)", textAlign: "center", fontSize: 11 }}>{f.cost}</td>
                                    </tr>
                                ))}</tbody>
                            </table>
                        </div>
                    </div>
                    <div className="toolbar" style={{ marginBottom: 10 }}><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={13} /> Print</button></div>
                    <section className="faq-section"><h2>FAQ</h2><div style={{ marginTop: "1.5rem" }}>{[{ q: "What is a semi-synthetic fiber?", a: "Made from natural materials (wood pulp, bamboo) using chemical processing. Rayon, Tencel, Modal, and Bamboo viscose. They combine natural softness with synthetic consistency." }].map((f, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
                </div>
                <aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/fabric-type/property-comparator" className="related-tool-link">Property Comparator</a><a href="/fabric-type" className="related-tool-link">All Fabric Type</a></div></aside>
            </div>
        </div>
    );
}