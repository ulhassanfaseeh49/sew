"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { BookOpen, Printer } from "lucide-react";

const items = [{"term":"Beginner","def":"Can thread machine, straight stitch, simple hems. Try pillowcases, tote bags."},{"term":"Confident Beginner","def":"Comfortable with curves, does zippers. Try simple dresses, zipper pouches."},{"term":"Intermediate","def":"Sets sleeves, buttonholes, complex patterns. Try fitted garments, quilts."},{"term":"Advanced","def":"Alterations, princess seams, invisible zippers. Try tailored jackets, corsets."}];

export default function Page() {
    const [search, setSearch] = useState("");
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const faqItems = [{"q":"How long to become intermediate?","a":"With regular practice (2-3 projects/month): 6-12 months."}];
    const filtered = items.filter((item: typeof items[0]) => !search || item.term.toLowerCase().includes(search.toLowerCase()) || item.def.toLowerCase().includes(search.toLowerCase()));
    return (<div className="container"><Breadcrumb items={[{ label: "Reference", href: "/reference" }, { label: "Sewing Skill Assessment" }]} />
        <div className="calculator-layout"><div className="calculator-main">
            <div className={styles.toolHeader}><span className="category-badge"><BookOpen size={14} /> Ref #475</span><h1>Sewing Skill Assessment</h1><p>Assess your skill level for project selection.</p></div>
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
