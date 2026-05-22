"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, Scissors } from "lucide-react";
export default function Page() {
    const [designW, sW] = useState(""); const [designH, sH] = useState("");
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const w = parseFloat(designW) || 0; const h = parseFloat(designH) || 0; const hoops: { w: number, h: number, n: string }[] = [{ w: 4, h: 4, n: "4×4" }, { w: 5, h: 7, n: "5×7" }, { w: 6, h: 10, n: "6×10" }, { w: 8, h: 8, n: "8×8" }, { w: 8, h: 12, n: "8×12" }]; const fits = hoops.filter(hp => hp.w >= w + 0.5 && hp.h >= h + 0.5); const best = fits.length > 0 ? fits[0].n : "Design too large"; const hasResult = w > 0 && h > 0; const resultValue = best + "\" hoop"; const resultLabel = "for " + w + "\"×" + h + "\" design (need 1/2\" margin)";
    const faqItems = [{ q: "Can I use a hoop larger than needed?", a: "Yes, larger hoops work fine. Smaller hoops cannot — the design must fit with margin." }];
    return (<div className="container"><Breadcrumb items={[{ label: "Embroidery", href: "/embroidery" }, { label: "Hoop Size Selector" }]} />
        <div className="calculator-layout"><div className="calculator-main">
            <div className={styles.toolHeader}><span className="category-badge"><span>⭕</span> Embroidery #310</span><h1>Hoop Size Selector</h1><p>Best hoop for your design.</p></div>
            <div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
                <div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Design width (in)</label><input type="number" className="input-field" placeholder="4" value={designW} onChange={e => sW(e.target.value)} /></div><div className="input-group"><label className="input-label">Design height (in)</label><input type="number" className="input-field" placeholder="4" value={designH} onChange={e => sH(e.target.value)} /></div></div></div>
                {hasResult && (<div className={`calculator-results ${styles.results}`}>
                    <div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
                    <div className={styles.resultDetails}></div>
                    <div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={13} /> Print</button></div>
                </div>)}
            </div>
            <section className="faq-section"><h2>FAQ</h2><div style={{ marginTop: "1.5rem" }}>{faqItems.map((f, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
        </div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/embroidery" className="related-tool-link"><Scissors size={13} /> All Embroidery</a></div></aside></div></div>);
}