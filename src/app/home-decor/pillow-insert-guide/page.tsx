"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { Home, ClipboardCopy, Printer } from "lucide-react";

const sizes = [{k:"14",n:"14\" Cover",fill:16},{k:"16",n:"16\" Cover",fill:18},{k:"18",n:"18\" Cover",fill:20},{k:"20",n:"20\" Cover",fill:22},{k:"24",n:"24\" Cover",fill:26}];

export default function Page() {
    const [sizeKey, setSizeKey] = useState(sizes[0].k);
    
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const faqItems = [{"q":"Why use a larger insert?","a":"2 inches larger = plump, professional look. Same-size inserts look flat."}];
    const spec = sizes.find((s: typeof sizes[0]) => s.k === sizeKey) || sizes[0];
    const diff=spec.fill-parseInt(spec.k);
    const resultText = `Use ${spec.fill}" insert for ${spec.k}" cover (${diff}" larger)`;
    return (<div className="container"><Breadcrumb items={[{ label: "Home Decor", href: "/home-decor" }, { label: "Pillow Insert Size Guide" }]} />
        <div className="calculator-layout"><div className="calculator-main">
            <div className={styles.toolHeader}><span className="category-badge"><Home size={14} /> Home #436</span><h1>Pillow Insert Size Guide</h1><p>Choose the right insert size for your cover.</p></div>
            <div className={`glass-card ${styles.calculatorCard}`}>
                <h2 className={styles.calcTitle}>Select Size</h2>
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 8 }}>
                    {sizes.map((s: typeof sizes[0]) => (<button key={s.k} className={`btn btn-sm ${sizeKey === s.k ? "btn-primary" : "btn-ghost"}`} onClick={() => setSizeKey(s.k)} style={{ fontSize: 10 }}>{s.n}</button>))}
                </div>
                
            </div>
            <div className={`glass-card ${styles.calculatorCard}`} style={{ borderLeft: "4px solid hsl(200,50%,45%)" }}>
                <h2 className={styles.calcTitle}>Result</h2>
                <div style={{ padding: 14, background: "hsl(200,15%,95%)", borderRadius: 10, textAlign: "center" }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "hsl(200,50%,30%)" }}>{resultText}</div>
                </div>
            </div>
            <div className="toolbar" style={{ marginBottom: 10 }}>
                <button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard.writeText(resultText)}><ClipboardCopy size={13} /> Copy</button>
                <button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={13} /> Print</button>
            </div>
            <section className="faq-section"><h2>FAQ</h2><div style={{ marginTop: "1.5rem" }}>{faqItems.map((f, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
        </div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/home-decor" className="related-tool-link">All Home Decor</a></div></aside></div></div>);
}
