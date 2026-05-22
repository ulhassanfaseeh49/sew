"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { DollarSign, Copy, Printer, RotateCcw, AlertTriangle, CheckCircle, ChevronDown, Target } from "lucide-react";
import styles from "../../convert/yards-to-meters/page.module.css";

export default function Page() {
  const [budget, setBudget] = useState("");
  const [fabricYd, setFabricYd] = useState("");
  const [fabricPrice, setFabricPrice] = useState("");
  const [liningYd, setLiningYd] = useState("");
  const [liningPrice, setLiningPrice] = useState("");
  const [interfYd, setInterfYd] = useState("");
  const [interfPrice, setInterfPrice] = useState("");
  const [notionsTotal, setNotionsTotal] = useState("");
  const [patternCost, setPatternCost] = useState("");
  const [shippingCost, setShippingCost] = useState("");
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const b = parseFloat(budget) || 0;
  const fabricCost = (parseFloat(fabricYd) || 0) * (parseFloat(fabricPrice) || 0);
  const liningCost = (parseFloat(liningYd) || 0) * (parseFloat(liningPrice) || 0);
  const interfCost = (parseFloat(interfYd) || 0) * (parseFloat(interfPrice) || 0);
  const notions = parseFloat(notionsTotal) || 0;
  const pattern = parseFloat(patternCost) || 0;
  const ship = parseFloat(shippingCost) || 0;
  const totalCost = fabricCost + liningCost + interfCost + notions + pattern + ship;
  const hasResult = b > 0 && totalCost > 0;
  const diff = b - totalCost;
  const pctDiff = b > 0 ? (diff / b) * 100 : 0;

  const isUnder = diff > b * 0.1;
  const isAt = Math.abs(diff) <= b * 0.1;
  const isOver = diff < -(b * 0.1);

  const targetFabricPrice = b > 0 && (parseFloat(fabricYd) || 0) > 0
    ? (b - liningCost - interfCost - notions - pattern - ship) / (parseFloat(fabricYd) || 1)
    : 0;

  const clearAll = () => { setBudget(""); setFabricYd(""); setFabricPrice(""); setLiningYd(""); setLiningPrice(""); setInterfYd(""); setInterfPrice(""); setNotionsTotal(""); setPatternCost(""); setShippingCost(""); };

  const suggestions = [
    { text: "Use a poly-blend instead of pure natural fiber", save: fabricCost * 0.35 },
    { text: "Choose fabric with no pattern repeat", save: fabricCost * 0.15 },
    { text: "Use polyester thread instead of cotton/silk", save: 4 },
    { text: "Find a free pattern alternative online", save: pattern },
    { text: "Buy locally to eliminate shipping", save: ship },
    { text: "Use fabric from your stash for lining", save: liningCost },
  ].filter(s => s.save > 0.5);

  const faqItems = [
    { q: "How do I stick to a fabric budget?", a: "Set your budget before shopping. Calculate the maximum per-yard price you can afford (budget divided by yards needed), then only look at fabrics at or below that price point." },
    { q: "What is the most expensive part of a typical sewing project?", a: "Main fabric usually accounts for 50-70% of the total cost. Notions are typically 10-20%, and pattern costs are 5-15% (less if you reuse patterns)." },
    { q: "Can I substitute cheaper fabric without ruining my project?", a: "Often yes. A quality cotton-poly blend can look similar to pure cotton at 30-40% less cost. The key is matching the weight and drape, not necessarily the fiber content." },
    { q: "How do I find cheaper alternatives to expensive fabric?", a: "Check fabric destash groups, wait for sales (typically 40-60% off), buy online from wholesalers, or look for similar fabrics in different fiber contents." },
    { q: "Is it worth buying expensive fabric?", a: "For heirloom garments, interview outfits, or items you will wear 100+ times: absolutely. For test garments, children's play clothes, or learning projects: save your money." },
  ];

  return (
    <div className="container">
      <Breadcrumb items={[{ label: "Cost Calculators", href: "/cost" }, { label: "Budget Comparator" }]} />
      <div className="calculator-layout">
        <div className="calculator-main">
          <div className={styles.toolHeader}>
            <span className="category-badge"><DollarSign size={14} strokeWidth={1.5} /> Cost Tool</span>
            <h1>Fabric Cost vs Budget Comparator</h1>
            <p>Compare your project cost against a set budget and get suggestions to bring costs within range.</p>
          </div>

          {/* Budget & Costs */}
          <div className={`glass-card ${styles.calculatorCard}`}>
            <h2 className={styles.calcTitle}><Target size={16} style={{ marginRight: 6 }} />Your Budget</h2>
            <div className="calculator-form">
              <div className="input-group" style={{ maxWidth: 250 }}>
                <label className="input-label">Total project budget ($)</label>
                <input type="number" className="input-field" placeholder="e.g. 75.00" value={budget} onChange={e => setBudget(e.target.value)} min="0" step="1" />
              </div>
            </div>
          </div>

          <div className={`glass-card ${styles.calculatorCard}`}>
            <h2 className={styles.calcTitle}>Project Costs</h2>
            <div className="calculator-form">
              <h3 style={{ fontSize: "13px", fontWeight: 600, color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>Main Fabric</h3>
              <div className="calculator-form-row">
                <div className="input-group"><label className="input-label">Yards</label><input type="number" className="input-field" placeholder="3" value={fabricYd} onChange={e => setFabricYd(e.target.value)} min="0" step="0.125" /></div>
                <div className="input-group"><label className="input-label">$/yard</label><input type="number" className="input-field" placeholder="12.99" value={fabricPrice} onChange={e => setFabricPrice(e.target.value)} min="0" step="0.01" /></div>
              </div>
              <h3 style={{ fontSize: "13px", fontWeight: 600, color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em", margin: "1rem 0 0.5rem" }}>Lining</h3>
              <div className="calculator-form-row">
                <div className="input-group"><label className="input-label">Yards</label><input type="number" className="input-field" placeholder="2" value={liningYd} onChange={e => setLiningYd(e.target.value)} min="0" step="0.125" /></div>
                <div className="input-group"><label className="input-label">$/yard</label><input type="number" className="input-field" placeholder="5.00" value={liningPrice} onChange={e => setLiningPrice(e.target.value)} min="0" step="0.01" /></div>
              </div>
              <h3 style={{ fontSize: "13px", fontWeight: 600, color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em", margin: "1rem 0 0.5rem" }}>Interfacing</h3>
              <div className="calculator-form-row">
                <div className="input-group"><label className="input-label">Yards</label><input type="number" className="input-field" placeholder="1" value={interfYd} onChange={e => setInterfYd(e.target.value)} min="0" step="0.125" /></div>
                <div className="input-group"><label className="input-label">$/yard</label><input type="number" className="input-field" placeholder="4.00" value={interfPrice} onChange={e => setInterfPrice(e.target.value)} min="0" step="0.01" /></div>
              </div>
              <h3 style={{ fontSize: "13px", fontWeight: 600, color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em", margin: "1rem 0 0.5rem" }}>Other Costs</h3>
              <div className="calculator-form-row">
                <div className="input-group"><label className="input-label">Notions total ($)</label><input type="number" className="input-field" placeholder="15.00" value={notionsTotal} onChange={e => setNotionsTotal(e.target.value)} min="0" step="0.01" /></div>
                <div className="input-group"><label className="input-label">Pattern ($)</label><input type="number" className="input-field" placeholder="12.00" value={patternCost} onChange={e => setPatternCost(e.target.value)} min="0" step="0.01" /></div>
                <div className="input-group"><label className="input-label">Shipping ($)</label><input type="number" className="input-field" placeholder="0.00" value={shippingCost} onChange={e => setShippingCost(e.target.value)} min="0" step="0.01" /></div>
              </div>
            </div>
          </div>

          {/* Results */}
          {hasResult && (
            <div className={`glass-card ${styles.calculatorCard}`}>
              <h2 className={styles.calcTitle}>Budget Analysis</h2>
              <div className={`calculator-results ${styles.results}`}>
                <div className="result-card" style={{ background: isUnder ? "rgba(0, 128, 96, 0.06)" : isAt ? "rgba(245, 158, 11, 0.06)" : "rgba(220, 38, 38, 0.06)" }}>
                  <div className="result-value" style={{ color: isUnder ? "var(--color-accent-primary)" : isAt ? "#d97706" : "#dc2626" }}>
                    {isOver ? <AlertTriangle size={24} style={{ marginRight: 8 }} /> : <CheckCircle size={24} style={{ marginRight: 8 }} />}
                    {diff >= 0 ? `$${diff.toFixed(2)} under budget` : `$${Math.abs(diff).toFixed(2)} over budget`}
                  </div>
                  <div className="result-label">{isUnder ? "Great — you have room!" : isAt ? "Cutting it close" : "Over budget — see suggestions below"} ({Math.abs(pctDiff).toFixed(0)}%)</div>
                </div>
                <div className={styles.resultDetails}>
                  <div className={styles.resultRow}><span>Budget</span><strong>${b.toFixed(2)}</strong></div>
                  {fabricCost > 0 && <div className={styles.resultRow}><span>Main fabric</span><strong>${fabricCost.toFixed(2)}</strong></div>}
                  {liningCost > 0 && <div className={styles.resultRow}><span>Lining</span><strong>${liningCost.toFixed(2)}</strong></div>}
                  {interfCost > 0 && <div className={styles.resultRow}><span>Interfacing</span><strong>${interfCost.toFixed(2)}</strong></div>}
                  {notions > 0 && <div className={styles.resultRow}><span>Notions</span><strong>${notions.toFixed(2)}</strong></div>}
                  {pattern > 0 && <div className={styles.resultRow}><span>Pattern</span><strong>${pattern.toFixed(2)}</strong></div>}
                  {ship > 0 && <div className={styles.resultRow}><span>Shipping</span><strong>${ship.toFixed(2)}</strong></div>}
                  <div className={styles.resultRow} style={{ borderTop: "1px solid var(--color-border)", paddingTop: "0.5rem" }}>
                    <span><strong>Total cost</strong></span><strong style={{ color: isOver ? "#dc2626" : "var(--color-accent-primary)" }}>${totalCost.toFixed(2)}</strong>
                  </div>
                </div>

                {targetFabricPrice > 0 && (
                  <div className="smart-tip" style={{ marginTop: "1rem" }}>
                    <strong>Target fabric price:</strong> To stay within budget, your main fabric must be under <strong>${targetFabricPrice.toFixed(2)}/yard</strong>.
                  </div>
                )}

                {isOver && suggestions.length > 0 && (
                  <div style={{ marginTop: "1.25rem" }}>
                    <h3 style={{ fontSize: "14px", fontWeight: 600, marginBottom: "0.75rem" }}>Cost Reduction Suggestions</h3>
                    {suggestions.map((s, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0", borderBottom: "1px solid var(--color-bg-tertiary)", fontSize: "13px" }}>
                        <span>{s.text}</span>
                        <strong style={{ color: "var(--color-accent-primary)" }}>−${s.save.toFixed(2)}</strong>
                      </div>
                    ))}
                  </div>
                )}

                <div className="toolbar" style={{ marginTop: "1rem" }}>
                  <button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard.writeText(`Budget: $${b.toFixed(2)} | Total: $${totalCost.toFixed(2)} | ${diff >= 0 ? "Under" : "Over"}: $${Math.abs(diff).toFixed(2)}`)}><Copy size={13} /> Copy</button>
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
            <a href="/cost/project-estimator" className="related-tool-link"><DollarSign size={14} /> Project Estimator</a>
            <a href="/cost/fabric-comparison" className="related-tool-link"><DollarSign size={14} /> Fabric Comparison</a>
            <a href="/cost/per-yard" className="related-tool-link"><DollarSign size={14} /> Cost Per Yard</a>
            <a href="/cost/stash-value" className="related-tool-link"><DollarSign size={14} /> Stash Value</a>
          </div>
        </aside>
      </div>
    </div>
  );
}