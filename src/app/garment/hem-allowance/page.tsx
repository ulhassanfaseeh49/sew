"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { Scissors, ClipboardCopy, Printer } from "lucide-react";

export default function Page() {
    const [vals, setVals] = useState({"type":0});
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const faqItems = [{"q":"Standard hem depths?","a":"Skirts/dresses: 2\". Pants: 1.5\". Blouses: 5/8\". Shirt tails: 1/4\" rolled."}];
    const types=[{name:'Dress/Skirt',hem:2,fold:'Double fold'},{name:'Pants/Trousers',hem:1.5,fold:'Double fold'},{name:'Blouse/Top',hem:0.625,fold:'Narrow double fold'},{name:'Shirt tail',hem:0.25,fold:'Rolled hem'},{name:'Jacket',hem:1.5,fold:'Blind hem'}];const t=types[vals.type]||types[0];
    return (<div className="container"><Breadcrumb items={[{ label: "Garment", href: "/garment" }, { label: "Hem Allowance Calculator" }]} />
        <div className="calculator-layout"><div className="calculator-main">
            <div className={styles.toolHeader}><span className="category-badge"><Scissors size={14} /> Garment #213</span><h1>Hem Allowance Calculator</h1><p>Calculate hem depth by garment type.</p></div>
            <div className={`glass-card ${styles.calculatorCard}`}>
                <h2 className={styles.calcTitle}>Measurements</h2>
                <div className="calculator-form-row">
                    <div className="input-group"><label className="input-label">Garment type (0-4)</label><input type="number" className="input-field" value={vals.type} onChange={e => setVals(p=>({...p, type: parseFloat(e.target.value)||0}))} style={{width:80}} /></div>
                </div>
            </div>
            <div className={`glass-card ${styles.calculatorCard}`} style={{ borderLeft: "4px solid hsl(280,50%,45%)" }}>
                <h2 className={styles.calcTitle}>Results</h2>
                <div className={styles.resultDetails}>
                    <div className="result-row"><span>Hem depth</span><strong>{t.hem+'"'}</strong></div>
                        <div className="result-row"><span>Method</span><strong>{t.fold}</strong></div>
                        <div className="result-row"><span>Cut hem allowance</span><strong>{(t.hem*2)+'"'}</strong></div>
                </div>
            </div>
            <div className="toolbar" style={{ marginBottom: 10 }}>
                <button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard.writeText("Hem Allowance Calculator result")}><ClipboardCopy size={13} /> Copy</button>
                <button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={13} /> Print</button>
            </div>
            <section className="faq-section"><h2>FAQ</h2><div style={{ marginTop: "1.5rem" }}>{faqItems.map((f, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
        </div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/garment" className="related-tool-link">All Garment</a></div></aside></div></div>);
}
