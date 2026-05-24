"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { BookOpen, Printer } from "lucide-react";

const items = [{"term":"Crib/Baby","def":"36 x 52 inches"},{"term":"Throw","def":"50 x 65 inches"},{"term":"Twin","def":"68 x 90 inches"},{"term":"Full/Double","def":"86 x 90 inches"},{"term":"Queen","def":"90 x 108 inches"},{"term":"King","def":"108 x 108 inches"},{"term":"Cal King","def":"104 x 108 inches"},{"term":"Lap","def":"36 x 48 inches"},{"term":"Wall Hanging","def":"24x24 to 40x40 inches"}];

export default function Page() {
    const [search, setSearch] = useState("");
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const faqItems = [{"q":"Should quilts overhang?","a":"Yes: 10-12 inches on sides, 10 at foot, 6-10 pillow tuck at top."}];
    const filtered = items.filter((item: typeof items[0]) => !search || item.term.toLowerCase().includes(search.toLowerCase()) || item.def.toLowerCase().includes(search.toLowerCase()));
    return (<div className="container"><Breadcrumb items={[{ label: "Reference", href: "/reference" }, { label: "Quilt Size Chart" }]} />
        <div className="calculator-layout"><div className="calculator-main">
            <div className={styles.toolHeader}><span className="category-badge"><BookOpen size={14} /> Ref #469</span><h1>Quilt Size Chart</h1><p>Standard quilt sizes for all bed types.</p></div>
            <div className={`glass-card ${styles.calculatorCard}`}>
                <div className="input-group"><label className="input-label">Search</label>
                    <input type="text" className="input-field" placeholder="Type to search..." value={search} onChange={e => setSearch(e.target.value)} /></div>
            </div>
            <div className={`glass-card ${styles.calculatorCard}`}>
                <h2 className={styles.calcTitle}>{filtered.length} entries</h2>
                {filtered.map((item: typeof items[0], i: number) => (
                    <div key={i} style={{ padding: "6px 0", borderBottom: i < filtered.length - 1 ? "1px solid hsl(0,0%,92%)" : "none" }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "hsl(200,50%,35%)" }}>{item.term}</div>
                        <div style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>{item.def}</div>
                    </div>
                ))}
            </div>
            <div className="toolbar" style={{ marginBottom: 10 }}><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={13} /> Print</button></div>
            <section className="faq-section"><h2>FAQ</h2><div style={{ marginTop: "1.5rem" }}>{faqItems.map((f, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
        </div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/reference" className="related-tool-link">All Reference</a></div></aside></div></div>);
}
