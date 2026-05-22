"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { DollarSign, Copy, Printer, RotateCcw, ChevronDown, ArrowRightLeft } from "lucide-react";
import styles from "../../convert/yards-to-meters/page.module.css";

const presets = [
  { label: "Budget Cotton", price: 4.99, yards: 3 },
  { label: "Quilting Cotton", price: 8.99, yards: 3 },
  { label: "Medium Linen", price: 14.99, yards: 2.5 },
  { label: "Silk Charmeuse", price: 29.99, yards: 3 },
  { label: "Liberty Print", price: 38.00, yards: 2 },
  { label: "Italian Wool", price: 45.00, yards: 3.5 },
];

export default function Page() {
  const [mode, setMode] = useState<"perYard" | "total">("total");
  const [pricePerYard, setPricePerYard] = useState("");
  const [yards, setYards] = useState("");
  const [totalPaid, setTotalPaid] = useState("");
  const [totalYards, setTotalYards] = useState("");
  const [shipping, setShipping] = useState("");
  const [taxPct, setTaxPct] = useState("");
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const ppy = parseFloat(pricePerYard) || 0;
  const yd = parseFloat(yards) || 0;
  const tp = parseFloat(totalPaid) || 0;
  const ty = parseFloat(totalYards) || 0;
  const sh = parseFloat(shipping) || 0;
  const tax = parseFloat(taxPct) || 0;

  let resultPerYard = 0, resultTotal = 0, hasResult = false;
  if (mode === "total" && ppy > 0 && yd > 0) {
    resultTotal = ppy * yd;
    resultPerYard = ppy;
    hasResult = true;
  } else if (mode === "perYard" && tp > 0 && ty > 0) {
    resultPerYard = tp / ty;
    resultTotal = tp;
    hasResult = true;
  }
  const shippingPerYard = hasResult && (mode === "total" ? yd : ty) > 0 ? sh / (mode === "total" ? yd : ty) : 0;
  const taxAmount = hasResult ? resultTotal * (tax / 100) : 0;
  const trueTotal = resultTotal + sh + taxAmount;
  const truePerYard = hasResult ? resultPerYard + shippingPerYard + (taxAmount / (mode === "total" ? yd || 1 : ty || 1)) : 0;
  const perMeter = resultPerYard / 0.9144;

  const applyPreset = (p: typeof presets[0]) => { setMode("total"); setPricePerYard(String(p.price)); setYards(String(p.yards)); };
  const clearAll = () => { setPricePerYard(""); setYards(""); setTotalPaid(""); setTotalYards(""); setShipping(""); setTaxPct(""); };

  const refTable = [
    { perYd: 5, perM: 5.47 }, { perYd: 8, perM: 8.75 }, { perYd: 10, perM: 10.94 },
    { perYd: 13, perM: 14.22 }, { perYd: 15, perM: 16.40 }, { perYd: 20, perM: 21.87 },
    { perYd: 25, perM: 27.34 }, { perYd: 30, perM: 32.81 }, { perYd: 40, perM: 43.74 },
    { perYd: 50, perM: 54.68 },
  ];

  const faqItems = [
    { q: "How do I calculate cost per yard?", a: "Divide the total price paid by the number of yards purchased. For example, $30 for 3 yards = $10 per yard." },
    { q: "Does shipping affect my per-yard cost?", a: "Yes. Shipping can significantly increase the true cost per yard, especially for small orders. Always add shipping to total before dividing by yards." },
    { q: "How do I compare two fabrics at different prices?", a: "Calculate the true per-yard cost for each (including shipping and tax), then also factor in fabric width — a wider fabric may need fewer yards, making it cheaper overall." },
    { q: "What is a good price per yard for quilting cotton?", a: "Quality quilting cotton typically ranges from $8-$15 per yard. Designer prints often run $12-$18. Anything under $6 may sacrifice quality." },
    { q: "How do I convert cost per yard to cost per meter?", a: "Divide cost per yard by 0.9144 (since 1 yard = 0.9144 meters). Alternatively, multiply cost per yard by 1.0936." },
  ];

  return (
    <div className="container">
      <Breadcrumb items={[{ label: "Cost Calculators", href: "/cost" }, { label: "Cost Per Yard Calculator" }]} />
      <div className="calculator-layout">
        <div className="calculator-main">
          <div className={styles.toolHeader}>
            <span className="category-badge"><DollarSign size={14} strokeWidth={1.5} /> Cost Tool</span>
            <h1>Cost Per Yard Calculator</h1>
            <p>Calculate fabric cost per yard, total cost, and true cost including shipping and tax. Compare up to 6 fabric presets instantly.</p>
          </div>

          {/* Presets */}
          <div className={`glass-card ${styles.calculatorCard}`}>
            <h2 className={styles.calcTitle}>Quick Presets</h2>
            <div className="preset-grid">
              {presets.map((p) => (
                <button key={p.label} className="preset-btn" onClick={() => applyPreset(p)}>
                  {p.label} — ${p.price}/yd × {p.yards} yd
                </button>
              ))}
            </div>
          </div>

          {/* Mode Toggle */}
          <div className={`glass-card ${styles.calculatorCard}`}>
            <h2 className={styles.calcTitle}>Calculation Mode</h2>
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
              <button className={`preset-btn ${mode === "total" ? "active" : ""}`} onClick={() => setMode("total")}>Calculate Total Cost</button>
              <button className={`preset-btn ${mode === "perYard" ? "active" : ""}`} onClick={() => setMode("perYard")}>Calculate Per Yard</button>
            </div>

            <div className="calculator-form">
              {mode === "total" ? (
                <div className="calculator-form-row">
                  <div className="input-group">
                    <label className="input-label" htmlFor="ppy">Price per yard ($)</label>
                    <input id="ppy" type="number" className="input-field" placeholder="e.g. 12.99" value={pricePerYard} onChange={e => setPricePerYard(e.target.value)} min="0" step="0.01" />
                  </div>
                  <div className="input-group">
                    <label className="input-label" htmlFor="yd">Yards needed</label>
                    <input id="yd" type="number" className="input-field" placeholder="e.g. 3.5" value={yards} onChange={e => setYards(e.target.value)} min="0" step="0.125" />
                  </div>
                </div>
              ) : (
                <div className="calculator-form-row">
                  <div className="input-group">
                    <label className="input-label" htmlFor="tp">Total price paid ($)</label>
                    <input id="tp" type="number" className="input-field" placeholder="e.g. 45.00" value={totalPaid} onChange={e => setTotalPaid(e.target.value)} min="0" step="0.01" />
                  </div>
                  <div className="input-group">
                    <label className="input-label" htmlFor="ty">Total yardage</label>
                    <input id="ty" type="number" className="input-field" placeholder="e.g. 5" value={totalYards} onChange={e => setTotalYards(e.target.value)} min="0" step="0.125" />
                  </div>
                </div>
              )}
              <div className="calculator-form-row">
                <div className="input-group">
                  <label className="input-label" htmlFor="ship">Shipping cost ($)</label>
                  <input id="ship" type="number" className="input-field" placeholder="0.00" value={shipping} onChange={e => setShipping(e.target.value)} min="0" step="0.01" />
                </div>
                <div className="input-group">
                  <label className="input-label" htmlFor="taxp">Tax (%)</label>
                  <input id="taxp" type="number" className="input-field" placeholder="0" value={taxPct} onChange={e => setTaxPct(e.target.value)} min="0" step="0.1" />
                </div>
              </div>
            </div>

            {hasResult && (
              <div className={`calculator-results ${styles.results}`}>
                <div className="result-card">
                  <div className="result-value">${mode === "total" ? resultTotal.toFixed(2) : resultPerYard.toFixed(2)}</div>
                  <div className="result-label">{mode === "total" ? `Total for ${yd} yards at $${ppy.toFixed(2)}/yd` : `Per yard (from $${tp.toFixed(2)} for ${ty} yds)`}</div>
                </div>
                <div className={styles.resultDetails}>
                  <div className={styles.resultRow}><span>Cost per yard</span><strong>${resultPerYard.toFixed(2)}/yd</strong></div>
                  <div className={styles.resultRow}><span>Cost per meter</span><strong>${perMeter.toFixed(2)}/m</strong></div>
                  {sh > 0 && <div className={styles.resultRow}><span>Shipping per yard</span><strong>+${shippingPerYard.toFixed(2)}/yd</strong></div>}
                  {tax > 0 && <div className={styles.resultRow}><span>Tax ({tax}%)</span><strong>+${taxAmount.toFixed(2)}</strong></div>}
                  {(sh > 0 || tax > 0) && (
                    <>
                      <div className={styles.resultRow} style={{ borderTop: "1px solid var(--color-border)", paddingTop: "0.5rem", marginTop: "0.25rem" }}>
                        <span><strong>True cost per yard</strong></span><strong style={{ color: "var(--color-accent-primary)" }}>${truePerYard.toFixed(2)}/yd</strong>
                      </div>
                      <div className={styles.resultRow}><span><strong>True total cost</strong></span><strong style={{ color: "var(--color-accent-primary)" }}>${trueTotal.toFixed(2)}</strong></div>
                    </>
                  )}
                </div>
                {sh > 0 && shippingPerYard > resultPerYard * 0.25 && (
                  <div className="smart-tip" style={{ marginTop: "1rem" }}>
                    <strong>Shipping adds {((shippingPerYard / resultPerYard) * 100).toFixed(0)}%</strong> to your per-yard cost. Consider buying locally or increasing your order to spread shipping.
                  </div>
                )}
                <div className="toolbar">
                  <button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard.writeText(`$${truePerYard.toFixed(2)}/yd`)}><Copy size={13} /> Copy</button>
                  <button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={13} /> Print</button>
                  <button className="btn btn-secondary btn-sm" onClick={clearAll}><RotateCcw size={13} /> Clear</button>
                </div>
              </div>
            )}
          </div>

          {/* Reference Table */}
          <div className={`glass-card ${styles.calculatorCard}`}>
            <h2 className={styles.calcTitle}><ArrowRightLeft size={16} style={{ marginRight: 6 }} />Per Yard → Per Meter Reference</h2>
            <div className="reference-table-wrapper">
              <table className="reference-table">
                <thead><tr><th>Per Yard</th><th>Per Meter</th><th>Fabric Type</th></tr></thead>
                <tbody>
                  {refTable.map(r => (
                    <tr key={r.perYd}>
                      <td style={{ fontFamily: "var(--font-mono)" }}>${r.perYd.toFixed(2)}</td>
                      <td style={{ fontFamily: "var(--font-mono)" }}>${r.perM.toFixed(2)}</td>
                      <td>{r.perYd <= 8 ? "Budget / Muslin" : r.perYd <= 15 ? "Quality Cotton / Linen" : r.perYd <= 30 ? "Premium / Silk Blend" : "Designer / Luxury"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Educational Content */}
          <div className={`glass-card ${styles.calculatorCard}`}>
            <h2 className={styles.calcTitle}>Understanding Fabric Pricing</h2>
            <div className="educational-content">
              <p><strong>Why true cost per yard matters:</strong> Shipping from online stores can add $2-5 per yard. A $10/yd fabric with $8 shipping on 2 yards becomes $14/yd — more expensive than the $12/yd local option.</p>
              <p><strong>Width matters too:</strong> A 60&quot; wide fabric at $15/yd often needs less yardage than a 44&quot; fabric at $10/yd. Calculate total yardage needed at each width before comparing prices.</p>
              <p><strong>Remnant deals:</strong> Stores sell remnants at discounts. Divide the remnant price by its length to find the true per-yard cost — it could be a bargain or barely a deal.</p>
            </div>
          </div>

          {/* FAQ */}
          <section className="faq-section">
            <h2>Frequently Asked Questions</h2>
            <div style={{ marginTop: "1.5rem" }}>
              {faqItems.map((f, i) => (
                <div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}>
                  <button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>
                    {f.q}
                    <ChevronDown size={16} className="faq-chevron" />
                  </button>
                  <div className="faq-answer">{f.a}</div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="calculator-sidebar">
          <div className="glass-card related-tools">
            <h4>Related Tools</h4>
            <a href="/cost/per-meter" className="related-tool-link"><DollarSign size={14} /> Cost Per Meter</a>
            <a href="/cost/project-estimator" className="related-tool-link"><DollarSign size={14} /> Project Estimator</a>
            <a href="/cost/fabric-comparison" className="related-tool-link"><ArrowRightLeft size={14} /> Fabric Comparison</a>
            <a href="/yardage/basic-calculator" className="related-tool-link"><DollarSign size={14} /> Yardage Calculator</a>
          </div>
          <div className="glass-card" style={{ padding: "1.25rem" }}>
            <h4 style={{ marginBottom: "0.75rem" }}>Quick Reference</h4>
            <div style={{ fontSize: "13px", color: "var(--color-text-secondary)", lineHeight: 1.8 }}>
              <div><strong>1 yard</strong> = 0.9144 meters</div>
              <div><strong>$/yd → $/m</strong> = divide by 0.9144</div>
              <div><strong>Budget cotton</strong> = $4-8/yd</div>
              <div><strong>Quality cotton</strong> = $8-15/yd</div>
              <div><strong>Linen</strong> = $12-25/yd</div>
              <div><strong>Silk</strong> = $20-60/yd</div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}