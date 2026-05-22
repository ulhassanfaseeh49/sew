"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { DollarSign, Copy, Printer, RotateCcw, ChevronDown, Tag, TrendingUp, ArrowRightLeft } from "lucide-react";
import styles from "../../convert/yards-to-meters/page.module.css";

const ratePresets = [
  { label: "Minimum ($15/hr)", rate: 15 },
  { label: "Fair ($25/hr)", rate: 25 },
  { label: "Professional ($50/hr)", rate: 50 },
];

const contextPresets = [
  { label: "Etsy", markup: 3.5, fees: 11 },
  { label: "Craft Fair", markup: 2.5, fees: 5 },
  { label: "Local Market", markup: 2, fees: 0 },
  { label: "Wholesale", markup: 2, fees: 0 },
  { label: "Commission", markup: 1.5, fees: 0 },
];

export default function Page() {
  const [materialCost, setMaterialCost] = useState("");
  const [laborHours, setLaborHours] = useState("");
  const [laborRate, setLaborRate] = useState("");
  const [overheadPct, setOverheadPct] = useState("15");
  const [profitPct, setProfitPct] = useState("25");
  const [context, setContext] = useState("Etsy");
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const mat = parseFloat(materialCost) || 0;
  const lh = parseFloat(laborHours) || 0;
  const lr = parseFloat(laborRate) || 0;
  const labor = lh * lr;
  const oh = parseFloat(overheadPct) || 0;
  const overhead = (mat + labor) * (oh / 100);
  const subtotalCost = mat + labor + overhead;
  const prof = parseFloat(profitPct) || 0;
  const profit = subtotalCost * (prof / 100);
  const priceBeforeFees = subtotalCost + profit;
  const ctx = contextPresets.find(c => c.label === context) || contextPresets[0];
  const fees = priceBeforeFees * (ctx.fees / 100);
  const finalPrice = priceBeforeFees + fees;
  const hasResult = mat > 0;

  const suggestedPrices = [
    { end: "99", price: Math.floor(finalPrice) - 0.01 },
    { end: "round $5", price: Math.ceil(finalPrice / 5) * 5 },
    { end: "round $10", price: Math.ceil(finalPrice / 10) * 10 },
  ];

  const clearAll = () => { setMaterialCost(""); setLaborHours(""); setLaborRate(""); setOverheadPct("15"); setProfitPct("25"); };

  const faqItems = [
    { q: "How do I price handmade items to make a profit?", a: "Use the formula: Materials + Labor + Overhead + Profit Margin. Never skip labor — your time has real value. A 20-30% profit margin is standard for handmade goods." },
    { q: "Should I charge for my time when pricing?", a: "Absolutely. If you are selling, your time is a business cost. Even skilled volunteers deserve fair compensation. Minimum $15/hr, $25-50/hr for experienced sewists." },
    { q: "How much markup should I add to material costs?", a: "For Etsy: 3-4× material cost. For craft fairs: 2-2.5×. For wholesale: 2×. These multipliers account for labor, overhead, and profit." },
    { q: "What is the difference between markup and profit margin?", a: "Markup is based on cost (100% markup = 2× cost). Profit margin is based on selling price (50% margin means half the price is profit). A 100% markup equals a 50% margin." },
    { q: "Why can't I price handmade the same as store-bought?", a: "Mass production uses economies of scale, cheaper materials, and overseas labor. Handmade items use premium materials, skilled local labor, and one-at-a-time production." },
  ];

  return (
    <div className="container">
      <Breadcrumb items={[{ label: "Cost Calculators", href: "/cost" }, { label: "Pricing Calculator" }]} />
      <div className="calculator-layout">
        <div className="calculator-main">
          <div className={styles.toolHeader}>
            <span className="category-badge"><Tag size={14} strokeWidth={1.5} /> Cost Tool</span>
            <h1>Handmade Item Pricing Calculator</h1>
            <p>Calculate the right selling price for handmade items using materials + labor + overhead + profit margin. Stop underpricing your work.</p>
          </div>

          <div className={`glass-card ${styles.calculatorCard}`}>
            <h2 className={styles.calcTitle}>Materials &amp; Labor</h2>
            <div className="calculator-form">
              <div className="calculator-form-row">
                <div className="input-group"><label className="input-label">Total material cost ($)</label><input type="number" className="input-field" placeholder="e.g. 35.00" value={materialCost} onChange={e => setMaterialCost(e.target.value)} min="0" step="0.01" /></div>
              </div>
              <div className="calculator-form-row">
                <div className="input-group"><label className="input-label">Hours to make</label><input type="number" className="input-field" placeholder="e.g. 5" value={laborHours} onChange={e => setLaborHours(e.target.value)} min="0" step="0.25" /></div>
                <div className="input-group">
                  <label className="input-label">Hourly rate ($)</label>
                  <input type="number" className="input-field" placeholder="e.g. 25" value={laborRate} onChange={e => setLaborRate(e.target.value)} min="0" step="1" />
                  <div style={{ display: "flex", gap: "0.25rem", marginTop: "0.5rem" }}>
                    {ratePresets.map(r => (
                      <button key={r.rate} className="preset-btn" style={{ fontSize: "11px", padding: "4px 8px" }} onClick={() => setLaborRate(String(r.rate))}>{r.label}</button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="calculator-form-row">
                <div className="input-group"><label className="input-label">Overhead (%)</label><input type="number" className="input-field" value={overheadPct} onChange={e => setOverheadPct(e.target.value)} min="0" step="1" /></div>
                <div className="input-group"><label className="input-label">Profit margin (%)</label><input type="number" className="input-field" value={profitPct} onChange={e => setProfitPct(e.target.value)} min="0" step="1" /></div>
              </div>
            </div>
          </div>

          <div className={`glass-card ${styles.calculatorCard}`}>
            <h2 className={styles.calcTitle}>Selling Context</h2>
            <div className="preset-grid">
              {contextPresets.map(c => (
                <button key={c.label} className={`preset-btn ${context === c.label ? "active" : ""}`} onClick={() => setContext(c.label)}>
                  {c.label} {c.fees > 0 ? `(~${c.fees}% fees)` : "(no fees)"}
                </button>
              ))}
            </div>
          </div>

          {hasResult && (
            <div className={`glass-card ${styles.calculatorCard}`}>
              <h2 className={styles.calcTitle}><TrendingUp size={16} style={{ marginRight: 6 }} />Pricing Breakdown</h2>
              <div className={`calculator-results ${styles.results}`}>
                <div className="result-card">
                  <div className="result-value">${finalPrice.toFixed(2)}</div>
                  <div className="result-label">Recommended selling price ({context})</div>
                </div>
                <div className={styles.resultDetails}>
                  <div className={styles.resultRow}><span>Materials</span><strong>${mat.toFixed(2)}</strong></div>
                  {labor > 0 && <div className={styles.resultRow}><span>Labor ({lh}h × ${lr}/hr)</span><strong>${labor.toFixed(2)}</strong></div>}
                  {overhead > 0 && <div className={styles.resultRow}><span>Overhead ({oh}%)</span><strong>${overhead.toFixed(2)}</strong></div>}
                  <div className={styles.resultRow} style={{ borderTop: "1px solid var(--color-border)", paddingTop: "0.5rem" }}>
                    <span><strong>Total cost</strong></span><strong>${subtotalCost.toFixed(2)}</strong>
                  </div>
                  <div className={styles.resultRow}><span>Profit ({prof}%)</span><strong>+${profit.toFixed(2)}</strong></div>
                  <div className={styles.resultRow}><span>Price before fees</span><strong>${priceBeforeFees.toFixed(2)}</strong></div>
                  {fees > 0 && <div className={styles.resultRow}><span>{context} fees (~{ctx.fees}%)</span><strong>+${fees.toFixed(2)}</strong></div>}
                  <div className={styles.resultRow} style={{ borderTop: "1px solid var(--color-border)", paddingTop: "0.5rem" }}>
                    <span><strong>Final selling price</strong></span><strong style={{ color: "var(--color-accent-primary)", fontSize: "1.1em" }}>${finalPrice.toFixed(2)}</strong>
                  </div>
                  <div className={styles.resultRow}><span>Your take-home</span><strong>${(finalPrice - fees).toFixed(2)}</strong></div>
                  <div className={styles.resultRow}><span>Markup on materials</span><strong>{mat > 0 ? ((finalPrice / mat) * 100 - 100).toFixed(0) : 0}%</strong></div>
                </div>

                <div style={{ marginTop: "1.25rem" }}>
                  <h3 style={{ fontSize: "14px", fontWeight: 600, marginBottom: "0.75rem" }}>Psychological Pricing</h3>
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                    {suggestedPrices.map(s => (
                      <span key={s.end} style={{ padding: "6px 12px", background: "var(--color-bg-secondary)", borderRadius: "var(--radius-md)", fontSize: "14px", fontWeight: 600 }}>${s.price.toFixed(2)}</span>
                    ))}
                  </div>
                </div>

                <div className="smart-tip" style={{ marginTop: "1rem" }}>
                  <strong>Break-even price:</strong> ${subtotalCost.toFixed(2)} (materials + labor + overhead only, zero profit)
                </div>

                <div className="toolbar" style={{ marginTop: "1rem" }}>
                  <button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard.writeText(`Selling price: $${finalPrice.toFixed(2)}`)}><Copy size={13} /> Copy</button>
                  <button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={13} /> Print</button>
                  <button className="btn btn-secondary btn-sm" onClick={clearAll}><RotateCcw size={13} /> Clear</button>
                </div>
              </div>
            </div>
          )}

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
            <a href="/cost/per-garment" className="related-tool-link"><DollarSign size={14} /> Per Garment Cost</a>
            <a href="/cost/breakdown" className="related-tool-link"><DollarSign size={14} /> Cost Breakdown</a>
            <a href="/cost/batch-production" className="related-tool-link"><DollarSign size={14} /> Batch Production</a>
            <a href="/pricing/etsy-fee-calculator" className="related-tool-link"><Tag size={14} /> Etsy Fee Calculator</a>
          </div>
          <div className="glass-card" style={{ padding: "1.25rem" }}>
            <h4 style={{ marginBottom: "0.75rem" }}>Markup Guide</h4>
            <div style={{ fontSize: "13px", color: "var(--color-text-secondary)", lineHeight: 1.8 }}>
              <div><strong>Craft fair:</strong> 2-2.5× cost</div>
              <div><strong>Etsy:</strong> 3-4× cost</div>
              <div><strong>Wholesale:</strong> 2× cost</div>
              <div><strong>Retail:</strong> 4-6× cost</div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}