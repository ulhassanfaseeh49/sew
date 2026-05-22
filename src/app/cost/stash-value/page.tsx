"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { DollarSign, Copy, Printer, RotateCcw, ChevronDown, Plus, Trash2, Archive } from "lucide-react";
import styles from "../../convert/yards-to-meters/page.module.css";

interface FabricItem { name: string; yards: string; pricePerYd: string; }

export default function Page() {
  const [items, setItems] = useState<FabricItem[]>([
    { name: "Cotton Broadcloth", yards: "", pricePerYd: "" },
    { name: "Quilting Cotton", yards: "", pricePerYd: "" },
  ]);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const updateItem = (i: number, field: keyof FabricItem, val: string) => { const n = [...items]; n[i] = { ...n[i], [field]: val }; setItems(n); };
  const addItem = () => { if (items.length < 20) setItems([...items, { name: "", yards: "", pricePerYd: "" }]); };
  const removeItem = (i: number) => { if (items.length > 1) setItems(items.filter((_, j) => j !== i)); };

  const calcValue = (item: FabricItem) => (parseFloat(item.yards) || 0) * (parseFloat(item.pricePerYd) || 0);
  const totalValue = items.reduce((s, item) => s + calcValue(item), 0);
  const totalYards = items.reduce((s, item) => s + (parseFloat(item.yards) || 0), 0);
  const itemsWithValue = items.filter(item => calcValue(item) > 0);
  const avgPerYard = totalYards > 0 ? totalValue / totalYards : 0;
  const hasResult = totalValue > 0;

  const faqItems = [
    { q: "Why should I calculate my stash value?", a: "It helps you appreciate what you already own, avoid buying duplicates, and make informed decisions about new purchases. Many sewists are shocked to find their stash is worth hundreds or thousands of dollars." },
    { q: "What price should I use for fabric I bought on sale?", a: "Use the current retail replacement cost, not what you paid. This gives you the true current value of your stash." },
    { q: "How do I estimate fabric I have lost track of?", a: "Measure each piece with a tape measure. Fold the fabric lengthwise to match its original width, then measure the length. Convert to yards if needed." },
    { q: "Should I include fabric scraps?", a: "Only include pieces large enough for a project — at least half a yard. Smaller scraps have minimal monetary value but can still be useful for small projects." },
  ];

  return (
    <div className="container">
      <Breadcrumb items={[{ label: "Cost Calculators", href: "/cost" }, { label: "Stash Value Estimator" }]} />
      <div className="calculator-layout">
        <div className="calculator-main">
          <div className={styles.toolHeader}>
            <span className="category-badge"><Archive size={14} strokeWidth={1.5} /> Cost Tool</span>
            <h1>Fabric Stash Value Estimator</h1>
            <p>Add up the total value of your fabric stash. Enter each fabric with its yardage and price to see your total collection value.</p>
          </div>
          <div className={`glass-card ${styles.calculatorCard}`}>
            <h2 className={styles.calcTitle}>Your Fabric Stash</h2>
            {items.map((item, i) => (
              <div key={i} className="calculator-form-row" style={{ marginBottom: "0.5rem" }}>
                <div className="input-group" style={{ flex: 2 }}><input type="text" className="input-field" placeholder="Fabric name" value={item.name} onChange={e => updateItem(i, "name", e.target.value)} /></div>
                <div className="input-group"><input type="number" className="input-field" placeholder="Yards" value={item.yards} onChange={e => updateItem(i, "yards", e.target.value)} min="0" step="0.25" /></div>
                <div className="input-group"><input type="number" className="input-field" placeholder="$/yard" value={item.pricePerYd} onChange={e => updateItem(i, "pricePerYd", e.target.value)} min="0" step="0.01" /></div>
                {items.length > 1 && <button className="btn btn-secondary btn-sm" onClick={() => removeItem(i)} style={{ padding: "8px", alignSelf: "center" }}><Trash2 size={14} /></button>}
              </div>
            ))}
            <button className="btn btn-secondary btn-sm" onClick={addItem} style={{ marginTop: "0.5rem" }}><Plus size={13} /> Add fabric</button>
          </div>
          {hasResult && (
            <div className={`glass-card ${styles.calculatorCard}`}>
              <h2 className={styles.calcTitle}>Stash Summary</h2>
              <div className={`calculator-results ${styles.results}`}>
                <div className="result-card">
                  <div className="result-value">${totalValue.toFixed(2)}</div>
                  <div className="result-label">{itemsWithValue.length} fabrics • {totalYards.toFixed(1)} total yards • avg ${avgPerYard.toFixed(2)}/yd</div>
                </div>
                <div className="reference-table-wrapper" style={{ marginTop: "1rem" }}>
                  <table className="reference-table"><thead><tr><th>Fabric</th><th>Yards</th><th>$/Yd</th><th>Value</th></tr></thead><tbody>
                    {itemsWithValue.map((item, i) => (<tr key={i}><td>{item.name || "Unnamed"}</td><td>{parseFloat(item.yards).toFixed(1)}</td><td style={{ fontFamily: "var(--font-mono)" }}>${parseFloat(item.pricePerYd).toFixed(2)}</td><td style={{ fontFamily: "var(--font-mono)" }}>${calcValue(item).toFixed(2)}</td></tr>))}
                    <tr style={{ fontWeight: 700 }}><td>TOTAL</td><td>{totalYards.toFixed(1)}</td><td>${avgPerYard.toFixed(2)}</td><td style={{ color: "var(--color-accent-primary)" }}>${totalValue.toFixed(2)}</td></tr>
                  </tbody></table>
                </div>
                <div className="toolbar" style={{ marginTop: "1rem" }}>
                  <button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard.writeText(`Stash value: $${totalValue.toFixed(2)} (${totalYards.toFixed(1)} yards)`)}><Copy size={13} /> Copy</button>
                  <button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={13} /> Print</button>
                  <button className="btn btn-secondary btn-sm" onClick={() => setItems([{ name: "", yards: "", pricePerYd: "" }])}><RotateCcw size={13} /> Clear</button>
                </div>
              </div>
            </div>
          )}
          <section className="faq-section"><h2>Frequently Asked Questions</h2><div style={{ marginTop: "1.5rem" }}>{faqItems.map((f, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{f.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
        </div>
        <aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related Tools</h4><a href="/cost/remnant-value" className="related-tool-link"><DollarSign size={14} /> Remnant Value</a><a href="/cost/per-yard" className="related-tool-link"><DollarSign size={14} /> Cost Per Yard</a><a href="/cost/project-estimator" className="related-tool-link"><DollarSign size={14} /> Project Estimator</a></div></aside>
      </div>
    </div>
  );
}