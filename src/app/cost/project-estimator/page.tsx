"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { DollarSign, Copy, Printer, RotateCcw, Plus, Trash2, ChevronDown, Package, Scissors as ScissorsIcon } from "lucide-react";
import styles from "../../convert/yards-to-meters/page.module.css";

interface LineItem { name: string; qty: string; unitPrice: string; }

const defaultFabrics: LineItem[] = [{ name: "Main fabric", qty: "", unitPrice: "" }];
const defaultNotions: LineItem[] = [{ name: "Thread", qty: "1", unitPrice: "3.50" }];

export default function Page() {
  const [fabrics, setFabrics] = useState<LineItem[]>(defaultFabrics);
  const [notions, setNotions] = useState<LineItem[]>(defaultNotions);
  const [patternCost, setPatternCost] = useState("");
  const [patternUses, setPatternUses] = useState("1");
  const [shipping, setShipping] = useState("");
  const [taxPct, setTaxPct] = useState("");
  const [laborHours, setLaborHours] = useState("");
  const [laborRate, setLaborRate] = useState("");
  const [buyPrice, setBuyPrice] = useState("");
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const calcLine = (item: LineItem) => (parseFloat(item.qty) || 0) * (parseFloat(item.unitPrice) || 0);
  const fabricTotal = fabrics.reduce((s, f) => s + calcLine(f), 0);
  const notionTotal = notions.reduce((s, n) => s + calcLine(n), 0);
  const patShare = (parseFloat(patternCost) || 0) / Math.max(parseFloat(patternUses) || 1, 1);
  const materialsSubtotal = fabricTotal + notionTotal + patShare;
  const sh = parseFloat(shipping) || 0;
  const tax = parseFloat(taxPct) || 0;
  const taxAmt = materialsSubtotal * (tax / 100);
  const totalMaterials = materialsSubtotal + sh + taxAmt;
  const lh = parseFloat(laborHours) || 0;
  const lr = parseFloat(laborRate) || 0;
  const laborCost = lh * lr;
  const grandTotal = totalMaterials + laborCost;
  const hasResult = materialsSubtotal > 0;
  const bp = parseFloat(buyPrice) || 0;

  const updateFabric = (i: number, field: keyof LineItem, val: string) => { const n = [...fabrics]; n[i] = { ...n[i], [field]: val }; setFabrics(n); };
  const updateNotion = (i: number, field: keyof LineItem, val: string) => { const n = [...notions]; n[i] = { ...n[i], [field]: val }; setNotions(n); };
  const addFabric = () => { if (fabrics.length < 6) setFabrics([...fabrics, { name: "", qty: "", unitPrice: "" }]); };
  const addNotion = () => { if (notions.length < 8) setNotions([...notions, { name: "", qty: "", unitPrice: "" }]); };
  const removeFabric = (i: number) => setFabrics(fabrics.filter((_, j) => j !== i));
  const removeNotion = (i: number) => setNotions(notions.filter((_, j) => j !== i));
  const clearAll = () => { setFabrics(defaultFabrics); setNotions(defaultNotions); setPatternCost(""); setPatternUses("1"); setShipping(""); setTaxPct(""); setLaborHours(""); setLaborRate(""); setBuyPrice(""); };

  const faqItems = [
    { q: "Why is my handmade item more expensive than store-bought?", a: "Mass production uses economies of scale, cheaper materials, and lower labor costs. Handmade items use higher quality materials and skilled labor. The true comparison includes customization, quality, and longevity." },
    { q: "Should I include my time in the project cost?", a: "If selling, absolutely yes. Even for personal projects, tracking time helps you understand the true investment. Use the labor section to see total cost with your time valued." },
    { q: "How do I calculate cost per item when making multiples?", a: "Enter total materials for your entire batch and your total time. The per-item cost is the grand total divided by the number of items produced." },
    { q: "What costs do beginners most often forget?", a: "Thread, interfacing, closures (zippers, buttons), shipping for online fabric purchases, pattern cost, and pre-washing shrinkage yardage." },
    { q: "How do I track costs across multiple projects?", a: "Use this estimator for each project and note the totals. Keep a simple spreadsheet with project name, date, and total cost for long-term tracking." },
  ];

  return (
    <div className="container">
      <Breadcrumb items={[{ label: "Cost Calculators", href: "/cost" }, { label: "Project Cost Estimator" }]} />
      <div className="calculator-layout">
        <div className="calculator-main">
          <div className={styles.toolHeader}>
            <span className="category-badge"><DollarSign size={14} strokeWidth={1.5} /> Cost Tool</span>
            <h1>Total Project Cost Estimator</h1>
            <p>Estimate the complete cost of any sewing project — fabric, notions, pattern, shipping, tax, and labor — all in one place.</p>
          </div>

          {/* Fabrics Section */}
          <div className={`glass-card ${styles.calculatorCard}`}>
            <h2 className={styles.calcTitle}><ScissorsIcon size={16} style={{ marginRight: 6 }} />Fabric Costs</h2>
            {fabrics.map((f, i) => (
              <div key={i} className="calculator-form" style={{ marginBottom: "0.75rem" }}>
                <div className="calculator-form-row">
                  <div className="input-group" style={{ flex: 2 }}>
                    <label className="input-label">Name</label>
                    <input type="text" className="input-field" placeholder="e.g. Navy linen" value={f.name} onChange={e => updateFabric(i, "name", e.target.value)} />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Yards</label>
                    <input type="number" className="input-field" placeholder="0" value={f.qty} onChange={e => updateFabric(i, "qty", e.target.value)} min="0" step="0.125" />
                  </div>
                  <div className="input-group">
                    <label className="input-label">$/yard</label>
                    <input type="number" className="input-field" placeholder="0.00" value={f.unitPrice} onChange={e => updateFabric(i, "unitPrice", e.target.value)} min="0" step="0.01" />
                  </div>
                  <div className="input-group" style={{ flex: "0 0 auto", alignSelf: "flex-end" }}>
                    {fabrics.length > 1 && <button className="btn btn-secondary btn-sm" onClick={() => removeFabric(i)} style={{ padding: "8px" }}><Trash2 size={14} /></button>}
                  </div>
                </div>
                {calcLine(f) > 0 && <div style={{ fontSize: "13px", color: "var(--color-text-tertiary)", marginTop: "0.25rem" }}>Subtotal: ${calcLine(f).toFixed(2)}</div>}
              </div>
            ))}
            {fabrics.length < 6 && <button className="btn btn-secondary btn-sm" onClick={addFabric}><Plus size={13} /> Add fabric</button>}
          </div>

          {/* Notions Section */}
          <div className={`glass-card ${styles.calculatorCard}`}>
            <h2 className={styles.calcTitle}><Package size={16} style={{ marginRight: 6 }} />Notions &amp; Supplies</h2>
            {notions.map((n, i) => (
              <div key={i} className="calculator-form" style={{ marginBottom: "0.75rem" }}>
                <div className="calculator-form-row">
                  <div className="input-group" style={{ flex: 2 }}>
                    <label className="input-label">Item</label>
                    <input type="text" className="input-field" placeholder="e.g. Zipper" value={n.name} onChange={e => updateNotion(i, "name", e.target.value)} />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Qty</label>
                    <input type="number" className="input-field" placeholder="0" value={n.qty} onChange={e => updateNotion(i, "qty", e.target.value)} min="0" step="1" />
                  </div>
                  <div className="input-group">
                    <label className="input-label">$ each</label>
                    <input type="number" className="input-field" placeholder="0.00" value={n.unitPrice} onChange={e => updateNotion(i, "unitPrice", e.target.value)} min="0" step="0.01" />
                  </div>
                  <div className="input-group" style={{ flex: "0 0 auto", alignSelf: "flex-end" }}>
                    {notions.length > 1 && <button className="btn btn-secondary btn-sm" onClick={() => removeNotion(i)} style={{ padding: "8px" }}><Trash2 size={14} /></button>}
                  </div>
                </div>
              </div>
            ))}
            {notions.length < 8 && <button className="btn btn-secondary btn-sm" onClick={addNotion}><Plus size={13} /> Add notion</button>}
          </div>

          {/* Pattern + Extras */}
          <div className={`glass-card ${styles.calculatorCard}`}>
            <h2 className={styles.calcTitle}>Pattern, Shipping &amp; Tax</h2>
            <div className="calculator-form">
              <div className="calculator-form-row">
                <div className="input-group"><label className="input-label">Pattern cost ($)</label><input type="number" className="input-field" placeholder="0.00" value={patternCost} onChange={e => setPatternCost(e.target.value)} min="0" step="0.01" /></div>
                <div className="input-group"><label className="input-label">Times used</label><input type="number" className="input-field" placeholder="1" value={patternUses} onChange={e => setPatternUses(e.target.value)} min="1" step="1" /></div>
              </div>
              <div className="calculator-form-row">
                <div className="input-group"><label className="input-label">Shipping ($)</label><input type="number" className="input-field" placeholder="0.00" value={shipping} onChange={e => setShipping(e.target.value)} min="0" step="0.01" /></div>
                <div className="input-group"><label className="input-label">Tax (%)</label><input type="number" className="input-field" placeholder="0" value={taxPct} onChange={e => setTaxPct(e.target.value)} min="0" step="0.1" /></div>
              </div>
            </div>
          </div>

          {/* Labor */}
          <div className={`glass-card ${styles.calculatorCard}`}>
            <h2 className={styles.calcTitle}>Labor (Optional)</h2>
            <div className="calculator-form">
              <div className="calculator-form-row">
                <div className="input-group"><label className="input-label">Hours</label><input type="number" className="input-field" placeholder="e.g. 6" value={laborHours} onChange={e => setLaborHours(e.target.value)} min="0" step="0.25" /></div>
                <div className="input-group"><label className="input-label">Hourly rate ($)</label><input type="number" className="input-field" placeholder="e.g. 25" value={laborRate} onChange={e => setLaborRate(e.target.value)} min="0" step="1" /></div>
              </div>
            </div>
          </div>

          {/* Results */}
          {hasResult && (
            <div className={`glass-card ${styles.calculatorCard}`}>
              <h2 className={styles.calcTitle}>Cost Summary</h2>
              <div className={`calculator-results ${styles.results}`}>
                <div className="result-card">
                  <div className="result-value">${grandTotal.toFixed(2)}</div>
                  <div className="result-label">Total project cost{laborCost > 0 ? " (with labor)" : ""}</div>
                </div>
                <div className={styles.resultDetails}>
                  <div className={styles.resultRow}><span>Fabric</span><strong>${fabricTotal.toFixed(2)}</strong></div>
                  <div className={styles.resultRow}><span>Notions</span><strong>${notionTotal.toFixed(2)}</strong></div>
                  {patShare > 0 && <div className={styles.resultRow}><span>Pattern (1/{patternUses} uses)</span><strong>${patShare.toFixed(2)}</strong></div>}
                  {sh > 0 && <div className={styles.resultRow}><span>Shipping</span><strong>${sh.toFixed(2)}</strong></div>}
                  {taxAmt > 0 && <div className={styles.resultRow}><span>Tax ({tax}%)</span><strong>${taxAmt.toFixed(2)}</strong></div>}
                  <div className={styles.resultRow} style={{ borderTop: "1px solid var(--color-border)", paddingTop: "0.5rem" }}>
                    <span><strong>Materials total</strong></span><strong>${totalMaterials.toFixed(2)}</strong>
                  </div>
                  {laborCost > 0 && (
                    <>
                      <div className={styles.resultRow}><span>Labor ({lh} hrs × ${lr}/hr)</span><strong>${laborCost.toFixed(2)}</strong></div>
                      <div className={styles.resultRow} style={{ borderTop: "1px solid var(--color-border)", paddingTop: "0.5rem" }}>
                        <span><strong>Grand total</strong></span><strong style={{ color: "var(--color-accent-primary)" }}>${grandTotal.toFixed(2)}</strong>
                      </div>
                    </>
                  )}
                </div>

                {/* Make vs Buy */}
                <div style={{ marginTop: "1.25rem", padding: "1rem", background: "var(--color-bg-secondary)", borderRadius: "var(--radius-md)" }}>
                  <label className="input-label" style={{ marginBottom: "0.5rem", display: "block" }}>Comparable store-bought price ($)</label>
                  <input type="number" className="input-field" placeholder="e.g. 89.99" value={buyPrice} onChange={e => setBuyPrice(e.target.value)} min="0" step="0.01" style={{ maxWidth: 200 }} />
                  {bp > 0 && (
                    <div style={{ marginTop: "0.75rem", fontSize: "14px" }}>
                      {grandTotal < bp ? (
                        <span style={{ color: "var(--color-accent-primary)" }}>You save <strong>${(bp - grandTotal).toFixed(2)}</strong> by making it yourself!</span>
                      ) : (
                        <span style={{ color: "#c05621" }}>Handmade costs <strong>${(grandTotal - bp).toFixed(2)}</strong> more — but you get custom fit, unique fabric, and quality.</span>
                      )}
                    </div>
                  )}
                </div>

                <div className="toolbar" style={{ marginTop: "1rem" }}>
                  <button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard.writeText(`Total: $${grandTotal.toFixed(2)}`)}><Copy size={13} /> Copy</button>
                  <button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={13} /> Print</button>
                  <button className="btn btn-secondary btn-sm" onClick={clearAll}><RotateCcw size={13} /> Clear All</button>
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
            <a href="/cost/per-yard" className="related-tool-link"><DollarSign size={14} /> Cost Per Yard</a>
            <a href="/cost/pricing-calculator" className="related-tool-link"><DollarSign size={14} /> Pricing Calculator</a>
            <a href="/cost/breakdown" className="related-tool-link"><DollarSign size={14} /> Cost Breakdown</a>
            <a href="/cost/budget-comparator" className="related-tool-link"><DollarSign size={14} /> Budget Comparator</a>
          </div>
          <div className="glass-card" style={{ padding: "1.25rem" }}>
            <h4 style={{ marginBottom: "0.75rem" }}>Common Costs to Remember</h4>
            <div style={{ fontSize: "13px", color: "var(--color-text-secondary)", lineHeight: 1.8 }}>
              <div>Thread: $3-5/spool</div>
              <div>Zipper: $2-6 each</div>
              <div>Buttons: $3-8/card</div>
              <div>Interfacing: $4-8/yd</div>
              <div>Elastic: $1-3/yd</div>
              <div>Bias tape: $3-5/pkg</div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}