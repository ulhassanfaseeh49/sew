"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { ShoppingBag, Printer } from "lucide-react";

const chart = [
    { age: "Baby (0-6m)", circ: 16.5, depth: 5.5 }, { age: "Toddler (1-3)", circ: 19, depth: 6.5 },
    { age: "Child (4-8)", circ: 20.5, depth: 7 }, { age: "Tween (9-12)", circ: 21, depth: 7.5 },
    { age: "Women S", circ: 21.5, depth: 8 }, { age: "Women M", circ: 22, depth: 8.5 },
    { age: "Women L", circ: 22.5, depth: 9 }, { age: "Men S", circ: 22, depth: 8.5 },
    { age: "Men M", circ: 22.5, depth: 9 }, { age: "Men L", circ: 23, depth: 9.5 },
];
const tH = { padding: "5px 8px", borderBottom: "2px solid hsl(0,0%,85%)", textAlign: "left" as const, fontSize: 11, fontWeight: 600 as const };
const tD = { padding: "4px 8px", borderBottom: "1px solid hsl(0,0%,92%)", fontSize: 11 };

export default function Page() {
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const faqItems = [{ q: "How to measure head for a hat?", a: "Wrap tape around head just above ears and across mid-forehead. That's circumference. For depth, measure from crown to just above the ear." }];
    return (<div className="container"><Breadcrumb items={[{ label: "Bags", href: "/bag" }, { label: "Hat Size" }]} />
        <div className="calculator-layout"><div className="calculator-main">
            <div className={styles.toolHeader}><span className="category-badge"><ShoppingBag size={14} /> Bag #381</span><h1>Hat Size Calculator</h1><p>Hat sizing chart by age and head circumference.</p></div>
            <div className={`glass-card ${styles.calculatorCard}`}>
                <h2 className={styles.calcTitle}>Hat Size Chart</h2>
                <table style={{ fontSize: 11, borderCollapse: "collapse", width: "100%" }}>
                    <thead><tr><th style={tH}>Size</th><th style={tH}>Circumference</th><th style={tH}>Depth</th><th style={tH}>Fabric</th></tr></thead>
                    <tbody>{chart.map((r, i) => (<tr key={i} style={{ background: i % 2 ? "hsl(0,0%,98%)" : undefined }}>
                        <td style={{ ...tD, fontWeight: 600 }}>{r.age}</td><td style={tD}>{r.circ}&quot;</td><td style={tD}>{r.depth}&quot;</td><td style={tD}>{r.circ < 20 ? "¼" : "⅜"} yd</td>
                    </tr>))}</tbody>
                </table>
            </div>
            <div className="toolbar" style={{ marginBottom: 10 }}><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={13} /> Print</button></div>
            <section className="faq-section"><h2>FAQ</h2><div style={{ marginTop: "1.5rem" }}>{faqItems.map((f, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
        </div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/bag/headband" className="related-tool-link">Headband</a><a href="/bag" className="related-tool-link">All Bags</a></div></aside></div></div>);
}
