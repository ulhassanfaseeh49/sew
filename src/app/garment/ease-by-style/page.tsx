"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { Scissors, ClipboardCopy, Printer } from "lucide-react";

export default function Page() {
    const [vals, setVals] = useState({"style":1});
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const faqItems = [{"q":"What is wearing ease?","a":"Extra room beyond body measurements for comfort. Even fitted garments have 2-3 inches of ease."}];
    const styles=[{name:'Very fitted',bust:0,waist:0,hip:0,desc:'Body skimming'},{name:'Fitted',bust:2.5,waist:1,hip:2,desc:'Close but comfortable'},{name:'Semi-fitted',bust:4,waist:2,hip:3,desc:'Defined shape'},{name:'Loose',bust:6,waist:4,hip:5,desc:'Relaxed'}];const s=styles[vals.style]||styles[1];
    return (<div className="container"><Breadcrumb items={[{ label: "Garment", href: "/garment" }, { label: "Ease by Garment Style Guide" }]} />
        <div className="calculator-layout"><div className="calculator-main">
            <div className={styles.toolHeader}><span className="category-badge"><Scissors size={14} /> Garment #228</span><h1>Ease by Garment Style Guide</h1><p>How much ease for different garment styles.</p></div>
            <div className={`glass-card ${styles.calculatorCard}`}>
                <h2 className={styles.calcTitle}>Measurements</h2>
                <div className="calculator-form-row">
                    <div className="input-group"><label className="input-label">Style (0-3)</label><input type="number" className="input-field" value={vals.style} onChange={e => setVals(p=>({...p, style: parseFloat(e.target.value)||1}))} style={{width:80}} /></div>
                </div>
            </div>
            <div className={`glass-card ${styles.calculatorCard}`} style={{ borderLeft: "4px solid hsl(280,50%,45%)" }}>
                <h2 className={styles.calcTitle}>Results</h2>
                <div className={styles.resultDetails}>
                    <div className="result-row"><span>Style</span><strong>{s.name+' - '+s.desc}</strong></div>
                        <div className="result-row"><span>Bust ease</span><strong>{s.bust+'"'}</strong></div>
                        <div className="result-row"><span>Waist ease</span><strong>{s.waist+'"'}</strong></div>
                        <div className="result-row"><span>Hip ease</span><strong>{s.hip+'"'}</strong></div>
                </div>
            </div>
            <div className="toolbar" style={{ marginBottom: 10 }}>
                <button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard.writeText("Ease by Garment Style Guide result")}><ClipboardCopy size={13} /> Copy</button>
                <button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={13} /> Print</button>
            </div>
            <section className="faq-section"><h2>FAQ</h2><div style={{ marginTop: "1.5rem" }}>{faqItems.map((f, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
        </div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/garment" className="related-tool-link">All Garment</a></div></aside></div></div>);
}
