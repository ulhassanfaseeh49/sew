"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { Baby, ClipboardCopy, Printer } from "lucide-react";

const chartData = [
 { age: "Newborn", ht: 20, chest: 14, waist: 14, hip: "—", us: "NB", eu: 56 },
 { age: "3 months", ht: 24, chest: 16, waist: 16, hip: "—", us: "3m", eu: 62 },
 { age: "6 months", ht: 26, chest: 17, waist: 17, hip: "—", us: "6m", eu: 68 },
 { age: "9 months", ht: 28, chest: 18, waist: 18, hip: "—", us: "9m", eu: 74 },
 { age: "12 months", ht: 30, chest: 19, waist: 19, hip: "—", us: "12m", eu: 80 },
 { age: "18 months", ht: 33, chest: 20, waist: 20, hip: "—", us: "18m", eu: 86 },
 { age: "2 years", ht: 36, chest: 21, waist: 20.5, hip: "—", us: "2T", eu: 92 },
 { age: "3 years", ht: 38, chest: 22, waist: 21, hip: "—", us: "3T", eu: 98 },
 { age: "4 years", ht: 40, chest: 23, waist: 21.5, hip: "24", us: "4", eu: 104 },
 { age: "5 years", ht: 43, chest: 24, waist: 22, hip: "25", us: "5", eu: 110 },
 { age: "6 years", ht: 45, chest: 25, waist: 22.5, hip: "26", us: "6", eu: 116 },
 { age: "7 years", ht: 48, chest: 26, waist: 23, hip: "27", us: "7", eu: 122 },
 { age: "8 years", ht: 50, chest: 27, waist: 23.5, hip: "28", us: "8", eu: 128 },
 { age: "10 years", ht: 55, chest: 29, waist: 24.5, hip: "30", us: "10", eu: 140 },
 { age: "12 years", ht: 59, chest: 31, waist: 25.5, hip: "32", us: "12", eu: 152 },
 { age: "14 years", ht: 63, chest: 33, waist: 26.5, hip: "34", us: "14", eu: 164 },
];

const faqItems = [
 { q: "How accurate are these charts?", a: "These represent 50th percentile averages. Individual children vary significantly — always measure the actual child. Charts are a starting point for estimating when you don't have measurements." },
 { q: "Should I measure or use age for pattern sizing?", a: "ALWAYS measure. Age-based sizing is the least reliable. A small 5-year-old may wear size 3-4 patterns, while a large 3-year-old might need size 5. Chest measurement is most important for tops." },
 { q: "When do children's sizes shift to teen/adult?", a: "Around age 12-14, children transition to junior or adult sizing. Girls often shift earlier (age 10-12) due to earlier puberty. Pattern companies have separate ranges for tweens." },
];

export default function Page() {
 const [activeFaq, setActiveFaq] = useState<number | null>(null);

 const tH = { padding: "6px 10px", borderBottom: "2px solid hsl(0,0%,85%)", textAlign: "left" as const, fontSize: 11, fontWeight: 600 as const };
 const tD = { padding: "5px 10px", borderBottom: "1px solid hsl(0,0%,92%)", fontSize: 11 };

 return (
 <div className="container">
 <Breadcrumb items={[{ label: "Baby & Kids", href: "/baby-kids" }, { label: "Growth Chart" }]} />
 <div className="calculator-layout">
 <div className="calculator-main">
 <div className={styles.toolHeader}>
 <span className="category-badge"><Baby size={14} strokeWidth={1.5} />Baby #399</span>
 <h1>Children&apos;s Growth Chart by Age</h1>
 <p>Reference heights, chest, waist, and hip measurements by age from newborn to 16 years. Use for sewing pattern sizing when you can&apos;t measure the child directly.</p>
 </div>

 <div style={{ padding: 10, background: "hsl(40,35%,95%)", borderRadius: 8, fontSize: 12, marginBottom: 10, color: "hsl(40,60%,30%)", fontWeight: 600, borderLeft: "4px solid hsl(40,60%,50%)" }}>These are average (50th percentile) measurements. Always measure the actual child when possible — children vary significantly.
 </div>

 <div className={`glass-card ${styles.calculatorCard}`}>
 <h2 className={styles.calcTitle}>Growth Chart — Newborn to 16 Years</h2>
 <div style={{ overflowX: "auto" }}>
 <table style={{ fontSize: 11, borderCollapse: "collapse", width: "100%" }}>
 <thead>
 <tr>
 <th style={tH}>Age</th>
 <th style={tH}>Height</th>
 <th style={tH}>Chest</th>
 <th style={tH}>Waist</th>
 <th style={tH}>Hip</th>
 <th style={tH}>US Size</th>
 <th style={tH}>EU</th>
 </tr>
 </thead>
 <tbody>{chartData.map((r, i) =>(
 <tr key={i} style={{ background: i % 2 ? "hsl(0,0%,98%)" : undefined }}>
 <td style={{ ...tD, fontWeight: 600 }}>{r.age}</td>
 <td style={tD}>{r.ht}&quot;</td>
 <td style={tD}>{r.chest}&quot;</td>
 <td style={tD}>{r.waist}&quot;</td>
 <td style={tD}>{r.hip === "—" ? "—" : r.hip + "\""}</td>
 <td style={tD}>{r.us}</td>
 <td style={tD}>{r.eu}</td>
 </tr>
 ))}</tbody>
 </table>
 </div>
 </div>

 <div className="toolbar" style={{ marginBottom: 10 }}>
 <button className="btn btn-secondary btn-sm" onClick={() =>{
 const text = chartData.map(r =>`${r.age}: ${r.ht}" ht, ${r.chest}" chest, US ${r.us}, EU ${r.eu}`).join("\n");
 navigator.clipboard.writeText(text);
 }}><ClipboardCopy size={13} />Copy</button>
 <button className="btn btn-secondary btn-sm" onClick={() =>window.print()}><Printer size={13} />Print</button>
 </div>

 <div className={`glass-card ${styles.calculatorCard}`}>
 <h2 className={styles.calcTitle}>Growth Rate by Age</h2>
 <div style={{ overflowX: "auto" }}>
 <table style={{ fontSize: 11, borderCollapse: "collapse", width: "100%" }}>
 <thead><tr><th style={tH}>Age Range</th><th style={tH}>Height/Year</th><th style={tH}>Chest/Year</th><th style={tH}>Notes</th></tr></thead>
 <tbody>
 <tr><td style={tD}>0-12 months</td><td style={tD}>~10&quot;</td><td style={tD}>~5&quot;</td><td style={tD}>Fastest growth period</td></tr>
 <tr style={{ background: "hsl(0,0%,98%)" }}><td style={tD}>1-2 years</td><td style={tD}>~5&quot;</td><td style={tD}>~2.5&quot;</td><td style={tD}>Rapid but slowing</td></tr>
 <tr><td style={tD}>2-5 years</td><td style={tD}>~3&quot;</td><td style={tD}>~1.5&quot;</td><td style={tD}>Steady growth</td></tr>
 <tr style={{ background: "hsl(0,0%,98%)" }}><td style={tD}>5-10 years</td><td style={tD}>~2.5&quot;</td><td style={tD}>~1&quot;</td><td style={tD}>Slower, predictable</td></tr>
 <tr><td style={tD}>10-16 years</td><td style={tD}>~3&quot;</td><td style={tD}>~2&quot;</td><td style={tD}>Puberty — very variable</td></tr>
 </tbody>
 </table>
 </div>
 </div>

 <section className="faq-section"><h2>FAQ</h2>
 <div style={{ marginTop: "1.5rem" }}>{faqItems.map((f, i) =>(
 <div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}>
 <button className="faq-question" onClick={() =>setActiveFaq(activeFaq === i ? null : i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></button>
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
 <a href="/baby-kids/baby-clothing-yardage" className="related-tool-link">Baby Clothing</a>
 <a href="/baby-kids" className="related-tool-link">All Baby & Kids</a>
 </div>
 </aside>
 </div>
 </div>
 );
}