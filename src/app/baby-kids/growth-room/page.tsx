"use client";
import { useState, useMemo } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { Baby, ClipboardCopy, Printer, ChevronDown } from "lucide-react";

// Growth rates: inches per year by age range
const growthRates: { min: number; max: number; hPerYr: number; cPerYr: number }[] = [
    { min: 0, max: 1, hPerYr: 10, cPerYr: 5 },
    { min: 1, max: 2, hPerYr: 5, cPerYr: 2.5 },
    { min: 2, max: 5, hPerYr: 3, cPerYr: 1.5 },
    { min: 5, max: 10, hPerYr: 2.5, cPerYr: 1 },
    { min: 10, max: 16, hPerYr: 3, cPerYr: 2 }, // puberty - variable
];

const faqItems = [
    { q: "How fast do children grow?", a: "0-1 year: ~10\" per year. 1-2 years: ~5\". 2-5 years: ~3\". 5-10 years: ~2.5\". 10-14: highly variable (puberty growth spurts). Width growth is slower — about half the rate of height growth." },
    { q: "How much growth room should I add?", a: "For items worn immediately: standard ease only. For 3 months ahead: add 1-2\" in length. For 6 months: consider making the next size up. Beyond 6 months: make 1-2 full sizes larger." },
    { q: "Should I add growth room to baby garments?", a: "Newborn to 3 months: minimal — they grow SO fast that growth room won't help much. Better to make the NEXT size. 6m+: add 1\" to hems (can be let down). Elastic waistbands adjust naturally." },
    { q: "What is the difference between ease and growth room?", a: "Ease is the comfort room between body and garment (needed for movement). Growth room is EXTRA fabric beyond ease to accommodate future growth. Ease never changes; growth room is temporary — it becomes ease, then disappears as the child grows." },
    { q: "Best garment design for growing children?", a: "Use: elastic waistbands (adjustable), deep hems (let-down later), raglan sleeves (no shoulder restriction), A-line shapes, adjustable straps on dresses. Avoid: too-fitted styles, set-in sleeves for fast-growing kids." },
];

export default function Page() {
    const [ageYears, setAgeYears] = useState(3);
    const [ageMonths, setAgeMonths] = useState(0);
    const [currHeight, setCurrHeight] = useState(38);
    const [currChest, setCurrChest] = useState(22);
    const [currWaist, setCurrWaist] = useState(21);
    const [monthsAhead, setMonthsAhead] = useState(6);
    const [garment, setGarment] = useState("dress");
    const [showEdu, setShowEdu] = useState(false);
    const [activeFaq, setActiveFaq] = useState<number | null>(null);

    const calc = useMemo(() => {
        const age = ageYears + ageMonths / 12;
        const rate = growthRates.find(r => age >= r.min && age < r.max) || growthRates[growthRates.length - 1];
        const hGrow = (rate.hPerYr / 12) * monthsAhead;
        const cGrow = (rate.cPerYr / 12) * monthsAhead;
        const wGrow = cGrow * 0.8; // waist grows slightly slower

        const futHeight = currHeight + hGrow;
        const futChest = currChest + cGrow;
        const futWaist = currWaist + wGrow;

        // Specific adjustments by garment
        let hemExtra = 0, sleeveExtra = 0, torsoExtra = 0;
        if (garment === "dress" || garment === "top") {
            hemExtra = Math.min(hGrow * 0.4, 3); // up to 3" in hem
            sleeveExtra = hGrow * 0.25;
            torsoExtra = hGrow * 0.15;
        } else if (garment === "pants") {
            hemExtra = Math.min(hGrow * 0.5, 3);
            sleeveExtra = 0;
            torsoExtra = hGrow * 0.2;
        } else if (garment === "jacket") {
            hemExtra = Math.min(hGrow * 0.3, 2);
            sleeveExtra = hGrow * 0.3;
            torsoExtra = hGrow * 0.2;
        } else {
            hemExtra = Math.min(hGrow * 0.4, 3);
            sleeveExtra = hGrow * 0.25;
            torsoExtra = hGrow * 0.2;
        }

        // Useful life estimate
        const usefulMonths = Math.min(monthsAhead + Math.round(3 + monthsAhead / 3), 24);

        return { hGrow, cGrow, wGrow, futHeight, futChest, futWaist, hemExtra, sleeveExtra, torsoExtra, usefulMonths, rate };
    }, [ageYears, ageMonths, currHeight, currChest, currWaist, monthsAhead, garment]);

    const copyText = `Growth room for ${ageYears}y${ageMonths}m child, ${monthsAhead} months ahead: Height +${calc.hGrow.toFixed(1)}", Chest +${calc.cGrow.toFixed(1)}", Waist +${calc.wGrow.toFixed(1)}". Hem: +${calc.hemExtra.toFixed(1)}", Sleeves: +${calc.sleeveExtra.toFixed(1)}".`;

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Baby & Kids", href: "/baby-kids" }, { label: "Growth Room" }]} />
            <div className="calculator-layout">
                <div className="calculator-main">
                    <div className={styles.toolHeader}>
                        <span className="category-badge"><Baby size={14} strokeWidth={1.5} /> Baby #390</span>
                        <h1>Growth Room Calculator</h1>
                        <p>Calculate how much extra to add to children&apos;s garments for growth. Age-specific growth rates with garment-specific adjustment recommendations.</p>
                    </div>

                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>① Child&apos;s Current Info</h2>
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Age (years)</label>
                                <input type="number" className="input-field" value={ageYears} onChange={e => setAgeYears(Math.max(0, parseInt(e.target.value) || 0))} min={0} max={16} /></div>
                            <div className="input-group"><label className="input-label">+ months</label>
                                <input type="number" className="input-field" value={ageMonths} onChange={e => setAgeMonths(Math.max(0, Math.min(11, parseInt(e.target.value) || 0)))} min={0} max={11} /></div>
                        </div>
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Height (in)</label>
                                <input type="number" className="input-field" value={currHeight} onChange={e => setCurrHeight(parseFloat(e.target.value) || 0)} step={0.5} /></div>
                            <div className="input-group"><label className="input-label">Chest (in)</label>
                                <input type="number" className="input-field" value={currChest} onChange={e => setCurrChest(parseFloat(e.target.value) || 0)} step={0.5} /></div>
                            <div className="input-group"><label className="input-label">Waist (in)</label>
                                <input type="number" className="input-field" value={currWaist} onChange={e => setCurrWaist(parseFloat(e.target.value) || 0)} step={0.5} /></div>
                        </div>
                    </div>

                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>② When Will They Wear It?</h2>
                        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                            {[0, 1, 3, 6, 9, 12].map(m => (
                                <button key={m} className={`btn btn-sm ${monthsAhead === m ? "btn-primary" : "btn-ghost"}`} onClick={() => setMonthsAhead(m)} style={{ fontSize: 10 }}>
                                    {m === 0 ? "Now" : `${m} month${m > 1 ? "s" : ""}`}
                                </button>
                            ))}
                        </div>
                        <div className="input-group" style={{ marginTop: 6 }}><label className="input-label">Garment type</label>
                            <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                                {[["dress", "Dress"], ["top", "Top"], ["pants", "Pants"], ["jacket", "Jacket"], ["romper", "Romper"]].map(([k, l]) => (
                                    <button key={k} className={`btn btn-sm ${garment === k ? "btn-primary" : "btn-ghost"}`} onClick={() => setGarment(k)} style={{ fontSize: 10 }}>{l}</button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className={`glass-card ${styles.calculatorCard}`} style={{ borderLeft: "4px solid hsl(80,50%,40%)" }}>
                        <h2 className={styles.calcTitle}>Projected Growth &amp; Adjustments</h2>
                        <div className={styles.resultDetails}>
                            <div className="result-row" style={{ fontWeight: 600, borderBottom: "2px solid hsl(0,0%,85%)" }}><span>Measurement</span><span>Now → In {monthsAhead}m</span></div>
                            <div className="result-row"><span>Height</span><strong>{currHeight}&quot; → {calc.futHeight.toFixed(1)}&quot; (+{calc.hGrow.toFixed(1)}&quot;)</strong></div>
                            <div className="result-row"><span>Chest</span><strong>{currChest}&quot; → {calc.futChest.toFixed(1)}&quot; (+{calc.cGrow.toFixed(1)}&quot;)</strong></div>
                            <div className="result-row"><span>Waist</span><strong>{currWaist}&quot; → {calc.futWaist.toFixed(1)}&quot; (+{calc.wGrow.toFixed(1)}&quot;)</strong></div>
                        </div>
                        <div style={{ marginTop: 12, padding: 10, background: "hsl(80,15%,95%)", borderRadius: 8 }}>
                            <div style={{ fontSize: 11, fontWeight: 700, marginBottom: 4, color: "hsl(80,40%,30%)" }}>Pattern Adjustments for {garment}:</div>
                            <div className={styles.resultDetails}>
                                <div className="result-row"><span>Add to hem allowance</span><strong>+{calc.hemExtra.toFixed(1)}&quot;</strong></div>
                                {calc.sleeveExtra > 0 && <div className="result-row"><span>Add to sleeve length</span><strong>+{calc.sleeveExtra.toFixed(1)}&quot;</strong></div>}
                                <div className="result-row"><span>Add to torso length</span><strong>+{calc.torsoExtra.toFixed(1)}&quot;</strong></div>
                            </div>
                        </div>
                        <div style={{ fontSize: 10, color: "var(--color-text-tertiary)", marginTop: 8 }}>
                            Growth rate: {calc.rate.hPerYr}&quot;/yr height at this age. Estimated useful life: ~{calc.usefulMonths} months.
                        </div>
                    </div>

                    <div className="toolbar" style={{ marginBottom: 10 }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard.writeText(copyText)}><ClipboardCopy size={13} /> Copy</button>
                        <button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={13} /> Print</button>
                    </div>

                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <button className="btn btn-sm btn-secondary" style={{ width: "100%", justifyContent: "space-between" }} onClick={() => setShowEdu(!showEdu)}>
                            📚 Smart Design for Growing Kids
                            <ChevronDown size={14} style={{ transform: showEdu ? "rotate(180deg)" : "none", transition: ".2s" }} />
                        </button>
                        {showEdu && (
                            <div style={{ marginTop: 10, fontSize: 12, lineHeight: 1.9, color: "var(--color-text-secondary)" }}>
                                <p><strong>Deep hems:</strong> The #1 strategy. Fold up a 3&quot; hem — you can let it down later as the child grows, gaining up to 2.5&quot; of visible length.</p>
                                <p><strong>Elastic waistbands:</strong> Accommodate 2-3&quot; of waist growth naturally. Best for pants and skirts.</p>
                                <p><strong>Raglan sleeves:</strong> No shoulder seam restriction — the garment grows better with the child compared to set-in sleeves.</p>
                                <p><strong>A-line shapes:</strong> Flared skirts and dresses grow with the child — the hem rises but the garment still fits well.</p>
                            </div>
                        )}
                    </div>

                    <section className="faq-section"><h2>Frequently Asked Questions</h2>
                        <div style={{ marginTop: "1.5rem" }}>{faqItems.map((f, i) => (
                            <div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}>
                                <button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></button>
                                <div className="faq-answer">{f.a}</div>
                            </div>
                        ))}</div>
                    </section>
                </div>
                <aside className="calculator-sidebar">
                    <div className="glass-card" style={{ padding: "var(--space-5)", marginBottom: "var(--space-4)" }}>
                        <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Growth Summary</h4>
                        <div style={{ fontSize: 11, lineHeight: 2, color: "var(--color-text-secondary)" }}>
                            <div>In {monthsAhead} months:</div>
                            <div>Height: <strong>+{calc.hGrow.toFixed(1)}&quot;</strong></div>
                            <div>Chest: <strong>+{calc.cGrow.toFixed(1)}&quot;</strong></div>
                            <div>Hem: <strong>+{calc.hemExtra.toFixed(1)}&quot;</strong></div>
                        </div>
                    </div>
                    <div className="glass-card related-tools">
                        <h4>Related Tools</h4>
                        <a href="/baby-kids/size-converter" className="related-tool-link">Size Converter</a>
                        <a href="/baby-kids/baby-clothing-yardage" className="related-tool-link">Baby Clothing Yardage</a>
                        <a href="/baby-kids" className="related-tool-link">All Baby & Kids</a>
                    </div>
                </aside>
            </div>
        </div>
    );
}