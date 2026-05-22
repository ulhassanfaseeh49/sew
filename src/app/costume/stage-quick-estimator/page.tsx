"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Drama, Printer } from "lucide-react";
export default function Page() {
    const [type, sT] = useState("dress");
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const yds: Record<string, number> = { dress: 6, shirt: 3, pants: 4, cape: 5, gown: 10, jacket: 4, vest: 2 }; const yd = yds[type] || 6; const hasResult = true; const resultValue = yd + " yards (quick estimate)"; const resultLabel = "stage " + type + " — add 20% for fitting adjustments";
    const faqItems = [{ q: "How accurate is the stage estimator?", a: "These are rough estimates for budgeting. Always do a proper calculation before cutting." }];
    return (<div className="container"><Breadcrumb items={[{ label: "Costume", href: "/costume" }, { label: "Stage Quick Estimator" }]} />
        <div className="calculator-layout"><div className="calculator-main">
            <div className={styles.toolHeader}><span className="category-badge"><Drama size={14} strokeWidth={1.5} /> Costume #350</span><h1>Stage Costume Quick Estimator</h1><p>Quick yardage for theatrical costumes.</p></div>
            <div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
                <div className="calculator-form"><div className="input-group"><label className="input-label">Costume type</label><select className="input-field" value={type} onChange={e => sT(e.target.value)}><option value="dress">Dress</option><option value="shirt">Shirt/blouse</option><option value="pants">Pants</option><option value="cape">Cape</option><option value="gown">Full gown</option><option value="jacket">Jacket/coat</option><option value="vest">Vest</option></select></div></div>
                {hasResult && (<div className={`calculator-results ${styles.results}`}>
                    <div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
                    <div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={13} /> Print</button></div>
                </div>)}
            </div>
            <section className="faq-section"><h2>FAQ</h2><div style={{ marginTop: "1.5rem" }}>{faqItems.map((f, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
        </div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/costume" className="related-tool-link"><Drama size={13} /> All Costume</a></div></aside></div></div>);
}
