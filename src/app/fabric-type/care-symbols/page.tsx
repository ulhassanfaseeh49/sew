"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { Scale, ClipboardCopy, Printer } from "lucide-react";

const symbols = [
 {
 cat: "Washing", icon: "", items: [
 { sym: "⎕ 30°", name: "Machine wash cold", desc: "Wash at 30°C/86°F. Gentle cycle recommended." },
 { sym: "⎕ 40°", name: "Machine wash warm", desc: "Wash at 40°C/104°F. Normal cycle OK." },
 { sym: "⎕ 60°", name: "Machine wash hot", desc: "Wash at 60°C/140°F. For whites and sturdy cottons." },
 { sym: " ⎕", name: "Hand wash only", desc: "30°C max, gentle agitation. Do not wring." },
 { sym: "⎕ ✕", name: "Do not wash", desc: "Dry clean only. Water will damage this fabric." },
 ]
 },
 {
 cat: "Drying", icon: "", items: [
 { sym: "○ •", name: "Tumble dry low", desc: "Low heat tumble. Remove promptly." },
 { sym: "○ ••", name: "Tumble dry medium", desc: "Medium heat. Most cottons and blends." },
 { sym: "○ ✕", name: "Do not tumble dry", desc: "Air dry only. Heat will damage or shrink." },
 { sym: "▭", name: "Dry flat", desc: "Lay flat to dry. For knits and stretchy fabrics." },
 { sym: "⌢", name: "Line dry", desc: "Hang to dry. Out of direct sun if possible." },
 ]
 },
 {
 cat: "Ironing", icon: "", items: [
 { sym: "△ •", name: "Iron low (110°C)", desc: "Synthetics: nylon, acetate, acrylic. Use press cloth." },
 { sym: "△ ••", name: "Iron medium (150°C)", desc: "Silk, wool, polyester. Steam optional." },
 { sym: "△ •••", name: "Iron high (200°C)", desc: "Cotton, linen. Steam recommended." },
 { sym: "△ ✕", name: "Do not iron", desc: "Heat will damage. Steam also prohibited." },
 ]
 },
 {
 cat: "Bleaching", icon: "△", items: [
 { sym: "△", name: "Any bleach OK", desc: "Chlorine and oxygen bleach both safe." },
 { sym: "△ //", name: "Non-chlorine only", desc: "Use oxygen bleach (OxiClean). No chlorine (Clorox)." },
 { sym: "△ ✕", name: "Do not bleach", desc: "Neither chlorine nor oxygen bleach. Use detergent only." },
 ]
 },
 {
 cat: "Dry Cleaning", icon: "○", items: [
 { sym: "○ P", name: "Dry clean — any solvent", desc: "Professional dry clean with normal solvents." },
 { sym: "○ F", name: "Dry clean — petroleum only", desc: "Limited solvents. Tell your cleaner." },
 { sym: "○ ✕", name: "Do not dry clean", desc: "Solvents will damage fabric." },
 ]
 },
];

const faqItems = [
 { q: "What do the dots on iron symbols mean?", a: "One dot: low heat (110°C) for synthetics. Two dots: medium (150°C) for silk/wool. Three dots: high (200°C) for cotton/linen. More dots = more heat allowed." },
 { q: "What's the difference between bleach symbols?", a: "Empty triangle = any bleach OK. Triangle with two lines = non-chlorine (oxygen) only. Crossed-out triangle = no bleach at all." },
];

export default function Page() {
 const [search, setSearch] = useState("");
 const [activeCat, setActiveCat] = useState<string | null>(null);
 const [activeFaq, setActiveFaq] = useState<number | null>(null);
 const filtered = symbols.map(c =>({ ...c, items: c.items.filter(i =>!search || i.name.toLowerCase().includes(search.toLowerCase()) || i.desc.toLowerCase().includes(search.toLowerCase())) })).filter(c =>c.items.length >0);

 return (
 <div className="container">
 <Breadcrumb items={[{ label: "Fabric Type", href: "/fabric-type" }, { label: "Care Symbols" }]} />
 <div className="calculator-layout">
 <div className="calculator-main">
 <div className={styles.toolHeader}>
 <span className="category-badge"><Scale size={14} strokeWidth={1.5} />Fabric #419</span>
 <h1>Fabric Care Symbol Database</h1>
 <p>Searchable guide to all international fabric care symbols. Never ruin another garment.</p>
 </div>
 <div className={`glass-card ${styles.calculatorCard}`}>
 <div className="input-group"><label className="input-label">Search symbols</label>
 <input type="text" className="input-field" placeholder="e.g. iron, bleach, tumble..." value={search} onChange={e =>setSearch(e.target.value)} />
 </div>
 <div style={{ display: "flex", gap: 4, marginTop: 6, flexWrap: "wrap" }}>
 {symbols.map(c =>(<button key={c.cat} className={`btn btn-sm ${activeCat === c.cat ? "btn-primary" : "btn-ghost"}`} onClick={() =>setActiveCat(activeCat === c.cat ? null : c.cat)} style={{ fontSize: 10 }}>{c.icon} {c.cat}</button>))}
 </div>
 </div>
 {filtered.filter(c =>!activeCat || c.cat === activeCat).map(c =>(
 <div key={c.cat} className={`glass-card ${styles.calculatorCard}`}>
 <h2 className={styles.calcTitle}>{c.icon} {c.cat}</h2>
 {c.items.map((item, i) =>(
 <div key={i} style={{ display: "flex", gap: 10, padding: "6px 0", borderBottom: i < c.items.length - 1 ? "1px solid hsl(0,0%,92%)" : "none", alignItems: "center" }}>
 <div style={{ minWidth: 50, fontSize: 16, textAlign: "center", fontFamily: "monospace" }}>{item.sym}</div>
 <div><div style={{ fontSize: 12, fontWeight: 600 }}>{item.name}</div><div style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>{item.desc}</div></div>
 </div>
 ))}
 </div>
 ))}
 <div className="toolbar" style={{ marginBottom: 10 }}>
 <button className="btn btn-secondary btn-sm" onClick={() =>window.print()}><Printer size={13} />Print</button>
 </div>
 <section className="faq-section"><h2>FAQ</h2><div style={{ marginTop: "1.5rem" }}>{faqItems.map((f, i) =>(<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() =>setActiveFaq(activeFaq === i ? null : i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
 </div>
 <aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/fabric-type/selection-guide" className="related-tool-link">Selection Guide</a><a href="/fabric-type" className="related-tool-link">All Fabric Type</a></div></aside>
 </div>
 </div>
 );
}