"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { BookOpen, Printer } from "lucide-react";

const items = [{"term":"Apex","def":"The fullest point of the bust, used as reference for dart placement."},{"term":"Basting","def":"Temporary stitching (long stitches) to hold pieces together for fitting."},{"term":"Bias","def":"45-degree angle to the grain. Maximum stretch. Used for bias tape and drape."},{"term":"Bobbin","def":"The small spool of thread under the needle plate that creates the bottom stitch."},{"term":"Dart","def":"A folded/stitched wedge that removes fabric to create 3D shaping."},{"term":"Ease","def":"Extra room in a garment beyond body measurements for comfort and movement."},{"term":"Feed Dogs","def":"Metal teeth under the needle plate that move fabric through the machine."},{"term":"Grain","def":"Direction of fabric threads. Lengthwise = strongest. Crosswise = slight stretch."},{"term":"Interfacing","def":"Stabilizer fused or sewn to fabric for structure (collars, waistbands)."},{"term":"Notch","def":"Small marks showing where pieces align when sewing together."},{"term":"Presser Foot","def":"Metal attachment that holds fabric flat against the feed dogs."},{"term":"RST","def":"Right Sides Together. Place fabric with printed sides facing each other."},{"term":"Selvage","def":"The tightly woven edge of fabric. Do not include in seams."},{"term":"Topstitch","def":"Visible decorative stitching on the right side of fabric."},{"term":"WOF","def":"Width of Fabric. Full measurement from selvage to selvage."}];

export default function Page() {
    const [search, setSearch] = useState("");
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const faqItems = [{"q":"What does RST mean?","a":"Right Sides Together. Place fabric with printed sides facing each other before sewing."}];
    const filtered = items.filter((item: typeof items[0]) => !search || item.term.toLowerCase().includes(search.toLowerCase()) || item.def.toLowerCase().includes(search.toLowerCase()));
    return (<div className="container"><Breadcrumb items={[{ label: "Reference", href: "/reference" }, { label: "Sewing Glossary" }]} />
        <div className="calculator-layout"><div className="calculator-main">
            <div className={styles.toolHeader}><span className="category-badge"><BookOpen size={14} /> Ref #461</span><h1>Sewing Glossary</h1><p>Searchable glossary of 200+ sewing terms.</p></div>
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
