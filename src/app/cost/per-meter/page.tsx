"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { DollarSign, Copy, Printer, RotateCcw, ChevronDown, ArrowRightLeft } from "lucide-react";
import styles from "../../convert/yards-to-meters/page.module.css";

const presets = [
  { label: "Budget Cotton", price: 5.50, meters: 2.7 },
  { label: "Quilting Cotton", price: 9.80, meters: 2.7 },
  { label: "Medium Linen", price: 16.40, meters: 2.3 },
  { label: "Silk Charmeuse", price: 32.80, meters: 2.7 },
  { label: "Liberty Print", price: 41.60, meters: 1.8 },
  { label: "Italian Wool", price: 49.20, meters: 3.2 },
];

export default function Page() {
  const [mode, setMode] = useState<"perMeter" | "total">("total");
  const [pricePerMeter, setPricePerMeter] = useState("");
  const [meters, setMeters] = useState("");
  const [totalPaid, setTotalPaid] = useState("");
  const [totalMeters, setTotalMeters] = useState("");
  const [shipping, setShipping] = useState("");
  const [vatPct, setVatPct] = useState("");
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const ppm = parseFloat(pricePerMeter) || 0;
  const m = parseFloat(meters) || 0;
  const tp = parseFloat(totalPaid) || 0;
  const tm = parseFloat(totalMeters) || 0;
  const sh = parseFloat(shipping) || 0;
  const vat = parseFloat(vatPct) || 0;

  let resultPerMeter = 0, resultTotal = 0, hasResult = false;
  if (mode === "total" && ppm > 0 && m > 0) {
    resultTotal = ppm * m;
    resultPerMeter = ppm;
    hasResult = true;
  } else if (mode === "perMeter" && tp > 0 && tm > 0) {
    resultPerMeter = tp / tm;
    resultTotal = tp;
    hasResult = true;
  }
  const qty = mode === "total" ? m : tm;
  const shippingPerMeter = hasResult && qty > 0 ? sh / qty : 0;
  const vatAmount = hasResult ? resultTotal * (vat / 100) : 0;
  const trueTotal = resultTotal + sh + vatAmount;
  const truePerMeter = hasResult && qty > 0 ? resultPerMeter + shippingPerMeter + (vatAmount / qty) : 0;
  const perYard = resultPerMeter * 0.9144;

  const applyPreset = (p: typeof presets[0]) => { setMode("total"); setPricePerMeter(String(p.price)); setMeters(String(p.meters)); };
  const clearAll = () => { setPricePerMeter(""); setMeters(""); setTotalPaid(""); setTotalMeters(""); setShipping(""); setVatPct(""); };

  const refTable = [
    { perM: 5, perYd: 4.57 }, { perM: 8, perYd: 7.32 }, { perM: 10, perYd: 9.14 },
    { perM: 15, perYd: 13.72 }, { perM: 20, perYd: 18.29 }, { perM: 25, perYd: 22.86 },
    { perM: 30, perYd: 27.43 }, { perM: 40, perYd: 36.58 }, { perM: 50, perYd: 45.72 },
  ];

  const faqItems = [
    { q: "How do I calculate cost per meter?", a: "Divide the total price paid by the total meters purchased. For example, €30 for 3 meters = €10 per meter." },
    { q: "How do I convert cost per meter to cost per yard?", a: "Multiply cost per meter by 0.9144. For example, €10/m × 0.9144 = $9.14/yd." },
    { q: "What is VAT and how does it affect fabric prices?", a: "VAT (Value Added Tax) is common in Europe, typically 19-25%. It is usually included in the listed price. If buying from outside the EU, you may need to add it." },
    { q: "How do I compare European and US fabric prices fairly?", a: "Convert both to the same unit (per meter or per yard), add shipping and taxes, then compare the true all-in cost." },
    { q: "Is fabric generally cheaper in Europe or the US?", a: "It varies. European linens and wool are often cheaper locally in Europe, while US quilting cotton tends to be cheaper in the US. Always compare true costs including shipping." },
  ];

  return (
    <div className="container">
      <Breadcrumb items={[{ label: "Cost Calculators", href: "/cost" }, { label: "Cost Per Meter Calculator" }]} />
      <div className="calculator-layout">
        <div className="calculator-main">
          <div className={styles.toolHeader}>
            <span className="category-badge"><DollarSign size={14} strokeWidth={1.5} /> Cost Tool</span>
            <h1>Cost Per Meter Calculator</h1>
            <p>Calculate fabric cost per meter, total cost, and true cost with VAT and shipping. The metric companion to Cost Per Yard.</p>
          </div>

          <div className={`glass-card ${styles.calculatorCard}`}>
            <h2 className={styles.calcTitle}>Quick Presets</h2>
            <div className="preset-grid">
              {presets.map(p => (
                <button key={p.label} className="preset-btn" onClick={() => applyPreset(p)}>
                  {p.label} — ${p.price}/m × {p.meters} m
                </button>
              ))}
            </div>
          </div>

          <div className={`glass-card ${styles.calculatorCard}`}>
            <h2 className={styles.calcTitle}>Calculation Mode</h2>
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
              <button className={`preset-btn ${mode === "total" ? "active" : ""}`} onClick={() => setMode("total")}>Calculate Total Cost</button>
              <button className={`preset-btn ${mode === "perMeter" ? "active" : ""}`} onClick={() => setMode("perMeter")}>Calculate Per Meter</button>
            </div>

            <div className="calculator-form">
              {mode === "total" ? (
                <div className="calculator-form-row">
                  <div className="input-group"><label className="input-label" htmlFor="ppm">Price per meter ($)</label><input id="ppm" type="number" className="input-field" placeholder="e.g. 14.50" value={pricePerMeter} onChange={e => setPricePerMeter(e.target.value)} min="0" step="0.01" /></div>
                  <div className="input-group"><label className="input-label" htmlFor="m">Meters needed</label><input id="m" type="number" className="input-field" placeholder="e.g. 2.5" value={meters} onChange={e => setMeters(e.target.value)} min="0" step="0.1" /></div>
                </div>
              ) : (
                <div className="calculator-form-row">
                  <div className="input-group"><label className="input-label" htmlFor="tp">Total price paid ($)</label><input id="tp" type="number" className="input-field" placeholder="e.g. 45.00" value={totalPaid} onChange={e => setTotalPaid(e.target.value)} min="0" step="0.01" /></div>
                  <div className="input-group"><label className="input-label" htmlFor="tm">Total meters</label><input id="tm" type="number" className="input-field" placeholder="e.g. 4" value={totalMeters} onChange={e => setTotalMeters(e.target.value)} min="0" step="0.1" /></div>
                </div>
              )}
              <div className="calculator-form-row">
                <div className="input-group"><label className="input-label" htmlFor="ship">Shipping ($)</label><input id="ship" type="number" className="input-field" placeholder="0.00" value={shipping} onChange={e => setShipping(e.target.value)} min="0" step="0.01" /></div>
                <div className="input-group"><label className="input-label" htmlFor="vatp">VAT / Tax (%)</label><input id="vatp" type="number" className="input-field" placeholder="0" value={vatPct} onChange={e => setVatPct(e.target.value)} min="0" step="0.1" /></div>
              </div>
            </div>

            {hasResult && (
              <div className={`calculator-results ${styles.results}`}>
                <div className="result-card">
                  <div className="result-value">${mode === "total" ? resultTotal.toFixed(2) : resultPerMeter.toFixed(2)}</div>
                  <div className="result-label">{mode === "total" ? `Total for ${m} meters at $${ppm.toFixed(2)}/m` : `Per meter (from $${tp.toFixed(2)} for ${tm} m)`}</div>
                </div>
                <div className={styles.resultDetails}>
                  <div className={styles.resultRow}><span>Cost per meter</span><strong>${resultPerMeter.toFixed(2)}/m</strong></div>
                  <div className={styles.resultRow}><span>Cost per yard</span><strong>${perYard.toFixed(2)}/yd</strong></div>
                  {sh > 0 && <div className={styles.resultRow}><span>Shipping per meter</span><strong>+${shippingPerMeter.toFixed(2)}/m</strong></div>}
                  {vat > 0 && <div className={styles.resultRow}><span>VAT ({vat}%)</span><strong>+${vatAmount.toFixed(2)}</strong></div>}
                  {(sh > 0 || vat > 0) && (
                    <>
                      <div className={styles.resultRow} style={{ borderTop: "1px solid var(--color-border)", paddingTop: "0.5rem", marginTop: "0.25rem" }}>
                        <span><strong>True cost per meter</strong></span><strong style={{ color: "var(--color-accent-primary)" }}>${truePerMeter.toFixed(2)}/m</strong>
                      </div>
                      <div className={styles.resultRow}><span><strong>True total</strong></span><strong style={{ color: "var(--color-accent-primary)" }}>${trueTotal.toFixed(2)}</strong></div>
                    </>
                  )}
                </div>
                <div className="toolbar">
                  <button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard.writeText(`$${truePerMeter.toFixed(2)}/m`)}><Copy size={13} /> Copy</button>
                  <button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={13} /> Print</button>
                  <button className="btn btn-secondary btn-sm" onClick={clearAll}><RotateCcw size={13} /> Clear</button>
                </div>
              </div>
            )}
          </div>

          <div className={`glass-card ${styles.calculatorCard}`}>
            <h2 className={styles.calcTitle}><ArrowRightLeft size={16} style={{ marginRight: 6 }} />Per Meter → Per Yard Reference</h2>
            <div className="reference-table-wrapper">
              <table className="reference-table">
                <thead><tr><th>Per Meter</th><th>Per Yard</th></tr></thead>
                <tbody>
                  {refTable.map(r => (
                    <tr key={r.perM}>
                      <td style={{ fontFamily: "var(--font-mono)" }}>${r.perM.toFixed(2)}</td>
                      <td style={{ fontFamily: "var(--font-mono)" }}>${r.perYd.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <section className="faq-section">
            <h2>Frequently Asked Questions</h2>
            <div style={{ marginTop: "1.5rem" }}>
              {faqItems.map((f, i) => (
                <div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}>
                  <button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{f.q}<ChevronDown size={16} className="faq-chevron" /></button>
                  <div className="faq-answer">{f.a}</div>
                </div>
              ))}
            </div>
          </section>
        </div>
        <aside className="calculator-sidebar">
          <div className="glass-card related-tools">
            <h4>Related Tools</h4>
            <a href="/cost/per-yard" className="related-tool-link"><DollarSign size={14} /> Cost Per Yard</a>
            <a href="/cost/project-estimator" className="related-tool-link"><DollarSign size={14} /> Project Estimator</a>
            <a href="/cost/currency-converter" className="related-tool-link"><ArrowRightLeft size={14} /> Currency Converter</a>
            <a href="/convert/yards-to-meters" className="related-tool-link"><ArrowRightLeft size={14} /> Yards to Meters</a>
          </div>
        </aside>
      </div>
    </div>
  );
}