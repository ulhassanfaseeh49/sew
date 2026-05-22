"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { DollarSign, Copy, Printer, RotateCcw, ChevronDown, Users, TrendingUp } from "lucide-react";
import styles from "../../convert/yards-to-meters/page.module.css";

export default function Page() {
  const [quantity, setQuantity] = useState("1");
  const [fabricYd, setFabricYd] = useState("");
  const [fabricPrice, setFabricPrice] = useState("");
  const [liningYd, setLiningYd] = useState("");
  const [liningPrice, setLiningPrice] = useState("");
  const [threadSpools, setThreadSpools] = useState("2");
  const [threadPrice, setThreadPrice] = useState("3.50");
  const [notionsEach, setNotionsEach] = useState("");
  const [patternCost, setPatternCost] = useState("");
  const [patternTotalUses, setPatternTotalUses] = useState("1");
  const [laborHours, setLaborHours] = useState("");
  const [laborRate, setLaborRate] = useState("");
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const qty = Math.max(parseInt(quantity) || 1, 1);
  const fabricCost = (parseFloat(fabricYd) || 0) * (parseFloat(fabricPrice) || 0);
  const liningCost = (parseFloat(liningYd) || 0) * (parseFloat(liningPrice) || 0);
  const threadCost = (parseInt(threadSpools) || 0) * (parseFloat(threadPrice) || 0);
  const notionsCostTotal = (parseFloat(notionsEach) || 0) * qty;
  const patCost = parseFloat(patternCost) || 0;
  const patUses = Math.max(parseInt(patternTotalUses) || 1, 1);
  const patShare = patCost / patUses;
  const materialTotal = fabricCost + liningCost + threadCost + notionsCostTotal + patShare;
  const materialPerItem = materialTotal / qty;
  const lh = parseFloat(laborHours) || 0;
  const lr = parseFloat(laborRate) || 0;
  const laborPerItem = lh * lr;
  const totalPerItem = materialPerItem + laborPerItem;
  const grandTotal = totalPerItem * qty;
  const hasResult = materialTotal > 0;

  const scaleData = [1, 5, 10, 25].map(q => {
    const mat = (fabricCost + liningCost + threadCost) / q + (parseFloat(notionsEach) || 0) + patCost / Math.max(patUses, q);
    return { qty: q, matPerItem: mat, withLabor: mat + laborPerItem };
  });

  const clearAll = () => { setQuantity("1"); setFabricYd(""); setFabricPrice(""); setLiningYd(""); setLiningPrice(""); setThreadSpools("2"); setThreadPrice("3.50"); setNotionsEach(""); setPatternCost(""); setPatternTotalUses("1"); setLaborHours(""); setLaborRate(""); };

  const faqItems = [
    { q: "How do I calculate the cost to make one garment?", a: "Add up all material costs (fabric, lining, thread, notions), divide pattern cost by number of uses, then add labor if selling. This tool does it all automatically." },
    { q: "How does making multiples save money?", a: "Fixed costs like pattern and thread spread across more items. Buying fabric in bulk often gets quantity discounts. The more you make, the lower the per-item cost." },
    { q: "Should I include pattern cost for each garment?", a: "Divide pattern cost by total times you will use it. A $15 pattern used 10 times costs only $1.50 per garment. Enter your expected total uses." },
    { q: "What hourly rate should I use for labor?", a: "Minimum $15/hr for basic sewing, $25-35/hr for skilled work, $50+/hr for couture/specialized techniques. Never price below minimum wage if selling." },
  ];

  return (
    <div className="container">
      <Breadcrumb items={[{ label: "Cost Calculators", href: "/cost" }, { label: "Cost Per Garment" }]} />
      <div className="calculator-layout">
        <div className="calculator-main">
          <div className={styles.toolHeader}>
            <span className="category-badge"><DollarSign size={14} strokeWidth={1.5} /> Cost Tool</span>
            <h1>Cost Per Garment Calculator</h1>
            <p>Calculate the true cost per finished garment including materials, pattern amortization, and labor — essential for pricing handmade items.</p>
          </div>

          <div className={`glass-card ${styles.calculatorCard}`}>
            <h2 className={styles.calcTitle}><Users size={16} style={{ marginRight: 6 }} />Production Quantity</h2>
            <div className="calculator-form">
              <div className="input-group" style={{ maxWidth: 200 }}>
                <label className="input-label">How many items?</label>
                <input type="number" className="input-field" value={quantity} onChange={e => setQuantity(e.target.value)} min="1" step="1" />
              </div>
            </div>
          </div>

          <div className={`glass-card ${styles.calculatorCard}`}>
            <h2 className={styles.calcTitle}>Material Costs (for entire run)</h2>
            <div className="calculator-form">
              <div className="calculator-form-row">
                <div className="input-group"><label className="input-label">Main fabric (yards total)</label><input type="number" className="input-field" placeholder="e.g. 15" value={fabricYd} onChange={e => setFabricYd(e.target.value)} min="0" step="0.125" /></div>
                <div className="input-group"><label className="input-label">Price per yard ($)</label><input type="number" className="input-field" placeholder="e.g. 12.00" value={fabricPrice} onChange={e => setFabricPrice(e.target.value)} min="0" step="0.01" /></div>
              </div>
              <div className="calculator-form-row">
                <div className="input-group"><label className="input-label">Lining (yards total)</label><input type="number" className="input-field" placeholder="0" value={liningYd} onChange={e => setLiningYd(e.target.value)} min="0" step="0.125" /></div>
                <div className="input-group"><label className="input-label">Lining $/yard</label><input type="number" className="input-field" placeholder="0.00" value={liningPrice} onChange={e => setLiningPrice(e.target.value)} min="0" step="0.01" /></div>
              </div>
              <div className="calculator-form-row">
                <div className="input-group"><label className="input-label">Thread spools</label><input type="number" className="input-field" value={threadSpools} onChange={e => setThreadSpools(e.target.value)} min="0" step="1" /></div>
                <div className="input-group"><label className="input-label">$/spool</label><input type="number" className="input-field" value={threadPrice} onChange={e => setThreadPrice(e.target.value)} min="0" step="0.01" /></div>
              </div>
              <div className="calculator-form-row">
                <div className="input-group"><label className="input-label">Notions per item ($)</label><input type="number" className="input-field" placeholder="e.g. 8.50" value={notionsEach} onChange={e => setNotionsEach(e.target.value)} min="0" step="0.01" /></div>
                <div className="input-group"><label className="input-label">Pattern cost ($)</label><input type="number" className="input-field" placeholder="e.g. 15.00" value={patternCost} onChange={e => setPatternCost(e.target.value)} min="0" step="0.01" /></div>
                <div className="input-group"><label className="input-label">Total pattern uses</label><input type="number" className="input-field" placeholder="1" value={patternTotalUses} onChange={e => setPatternTotalUses(e.target.value)} min="1" step="1" /></div>
              </div>
            </div>
          </div>

          <div className={`glass-card ${styles.calculatorCard}`}>
            <h2 className={styles.calcTitle}>Labor (Optional)</h2>
            <div className="calculator-form">
              <div className="calculator-form-row">
                <div className="input-group"><label className="input-label">Hours per item</label><input type="number" className="input-field" placeholder="e.g. 4" value={laborHours} onChange={e => setLaborHours(e.target.value)} min="0" step="0.25" /></div>
                <div className="input-group"><label className="input-label">Hourly rate ($)</label><input type="number" className="input-field" placeholder="e.g. 25" value={laborRate} onChange={e => setLaborRate(e.target.value)} min="0" step="1" /></div>
              </div>
            </div>
          </div>

          {hasResult && (
            <div className={`glass-card ${styles.calculatorCard}`}>
              <h2 className={styles.calcTitle}>Per-Garment Cost Breakdown</h2>
              <div className={`calculator-results ${styles.results}`}>
                <div className="result-card">
                  <div className="result-value">${totalPerItem.toFixed(2)} <span style={{ fontSize: "0.5em", fontWeight: 400 }}>per item</span></div>
                  <div className="result-label">Total for {qty} items: ${grandTotal.toFixed(2)}</div>
                </div>
                <div className={styles.resultDetails}>
                  <div className={styles.resultRow}><span>Main fabric per item</span><strong>${(fabricCost / qty).toFixed(2)}</strong></div>
                  {liningCost > 0 && <div className={styles.resultRow}><span>Lining per item</span><strong>${(liningCost / qty).toFixed(2)}</strong></div>}
                  <div className={styles.resultRow}><span>Thread per item</span><strong>${(threadCost / qty).toFixed(2)}</strong></div>
                  {(parseFloat(notionsEach) || 0) > 0 && <div className={styles.resultRow}><span>Notions per item</span><strong>${(parseFloat(notionsEach) || 0).toFixed(2)}</strong></div>}
                  {patShare > 0 && <div className={styles.resultRow}><span>Pattern (1/{patUses} uses)</span><strong>${patShare.toFixed(2)}</strong></div>}
                  <div className={styles.resultRow} style={{ borderTop: "1px solid var(--color-border)", paddingTop: "0.5rem" }}>
                    <span><strong>Materials per item</strong></span><strong>${materialPerItem.toFixed(2)}</strong>
                  </div>
                  {laborPerItem > 0 && (
                    <>
                      <div className={styles.resultRow}><span>Labor ({lh}h × ${lr}/hr)</span><strong>${laborPerItem.toFixed(2)}</strong></div>
                      <div className={styles.resultRow}><span><strong>Total per item</strong></span><strong style={{ color: "var(--color-accent-primary)" }}>${totalPerItem.toFixed(2)}</strong></div>
                    </>
                  )}
                </div>

                {/* Scale Chart */}
                <div style={{ marginTop: "1.25rem" }}>
                  <h3 style={{ fontSize: "14px", fontWeight: 600, marginBottom: "0.75rem" }}><TrendingUp size={14} style={{ marginRight: 6 }} />Quantity Scale Effect</h3>
                  <div className="reference-table-wrapper">
                    <table className="reference-table">
                      <thead><tr><th>Qty</th><th>Material/Item</th>{laborPerItem > 0 && <th>With Labor</th>}</tr></thead>
                      <tbody>
                        {scaleData.map(d => (
                          <tr key={d.qty}><td>{d.qty}</td><td style={{ fontFamily: "var(--font-mono)" }}>${d.matPerItem.toFixed(2)}</td>{laborPerItem > 0 && <td style={{ fontFamily: "var(--font-mono)" }}>${d.withLabor.toFixed(2)}</td>}</tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="toolbar" style={{ marginTop: "1rem" }}>
                  <button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard.writeText(`Per item: $${totalPerItem.toFixed(2)}`)}><Copy size={13} /> Copy</button>
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
            <a href="/cost/pricing-calculator" className="related-tool-link"><DollarSign size={14} /> Pricing Calculator</a>
            <a href="/cost/batch-production" className="related-tool-link"><DollarSign size={14} /> Batch Production</a>
            <a href="/cost/breakdown" className="related-tool-link"><DollarSign size={14} /> Cost Breakdown</a>
            <a href="/cost/project-estimator" className="related-tool-link"><DollarSign size={14} /> Project Estimator</a>
          </div>
        </aside>
      </div>
    </div>
  );
}