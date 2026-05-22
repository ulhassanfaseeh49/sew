"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { DollarSign, Copy, Printer, RotateCcw, ChevronDown, Repeat } from "lucide-react";
import styles from "../../convert/yards-to-meters/page.module.css";

export default function Page() {
  const [totalCost, setTotalCost] = useState("");
  const [wearsPerWeek, setWearsPerWeek] = useState("1");
  const [lifeYears, setLifeYears] = useState("3");
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const cost = parseFloat(totalCost) || 0;
  const wpw = parseFloat(wearsPerWeek) || 1;
  const years = parseFloat(lifeYears) || 1;
  const totalWears = wpw * 52 * years;
  const costPerWear = totalWears > 0 ? cost / totalWears : 0;
  const hasResult = cost > 0;

  const examples = [
    { item: "Fast fashion top", cost: 15, wears: 10, cpw: 1.50 },
    { item: "Quality cotton tee", cost: 35, wears: 100, cpw: 0.35 },
    { item: "Handmade linen dress", cost: 85, wears: 150, cpw: 0.57 },
    { item: "Wedding dress", cost: 2000, wears: 1, cpw: 2000 },
    { item: "Everyday jeans", cost: 60, wears: 300, cpw: 0.20 },
    { item: "Winter coat", cost: 200, wears: 250, cpw: 0.80 },
  ];

  const faqItems = [
    { q: "What is cost per wear?", a: "Divide the total garment cost by the number of times you wear it. A $100 jacket worn 200 times costs $0.50 per wear — better value than a $20 top worn 5 times ($4/wear)." },
    { q: "What is a good cost per wear?", a: "Under $1 per wear is excellent value. Under $2 is good. Over $5 per wear suggests you may want to reconsider the purchase or commit to wearing it more." },
    { q: "How does this help with sewing decisions?", a: "It justifies investing in quality fabric and your time. A $120 handmade dress worn weekly for 3 years costs $0.77/wear — far better than fast fashion." },
    { q: "Should I include making time in the cost?", a: "For personal garments, it is optional. Many sewists consider making time to be a hobby (free). For selling, always include labor." },
  ];

  return (
    <div className="container">
      <Breadcrumb items={[{ label: "Cost Calculators", href: "/cost" }, { label: "Cost Per Wear" }]} />
      <div className="calculator-layout">
        <div className="calculator-main">
          <div className={styles.toolHeader}>
            <span className="category-badge"><Repeat size={14} strokeWidth={1.5} /> Cost Tool</span>
            <h1>Cost Per Wear Calculator</h1>
            <p>Calculate the true value of a garment by dividing total cost by expected wears. Justifies investing in quality fabric.</p>
          </div>
          <div className={`glass-card ${styles.calculatorCard}`}>
            <h2 className={styles.calcTitle}>Enter Details</h2>
            <div className="calculator-form">
              <div className="calculator-form-row">
                <div className="input-group"><label className="input-label">Total garment cost ($)</label><input type="number" className="input-field" placeholder="e.g. 85.00" value={totalCost} onChange={e => setTotalCost(e.target.value)} min="0" step="0.01" /></div>
                <div className="input-group"><label className="input-label">Wears per week</label><input type="number" className="input-field" value={wearsPerWeek} onChange={e => setWearsPerWeek(e.target.value)} min="0.5" step="0.5" /></div>
                <div className="input-group"><label className="input-label">Expected lifespan (years)</label><input type="number" className="input-field" value={lifeYears} onChange={e => setLifeYears(e.target.value)} min="0.5" step="0.5" /></div>
              </div>
            </div>
            {hasResult && (
              <div className={`calculator-results ${styles.results}`}>
                <div className="result-card" style={{ background: costPerWear < 1 ? "rgba(0,128,96,0.06)" : costPerWear < 5 ? "rgba(245,158,11,0.06)" : "rgba(220,38,38,0.06)" }}>
                  <div className="result-value" style={{ color: costPerWear < 1 ? "var(--color-accent-primary)" : costPerWear < 5 ? "#d97706" : "#dc2626" }}>${costPerWear.toFixed(2)} <span style={{ fontSize: "0.5em", fontWeight: 400 }}>per wear</span></div>
                  <div className="result-label">{totalWears.toFixed(0)} total wears over {years} years — {costPerWear < 1 ? "Excellent value!" : costPerWear < 2 ? "Good value" : costPerWear < 5 ? "Fair value" : "Consider wearing more often"}</div>
                </div>
                <div className={styles.resultDetails}>
                  <div className={styles.resultRow}><span>Total cost</span><strong>${cost.toFixed(2)}</strong></div>
                  <div className={styles.resultRow}><span>Wears per week</span><strong>{wpw}</strong></div>
                  <div className={styles.resultRow}><span>Lifespan</span><strong>{years} years</strong></div>
                  <div className={styles.resultRow}><span>Total wears</span><strong>{totalWears.toFixed(0)}</strong></div>
                  <div className={styles.resultRow}><span>Cost per wear</span><strong style={{ color: "var(--color-accent-primary)" }}>${costPerWear.toFixed(2)}</strong></div>
                </div>
                <div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard.writeText(`$${costPerWear.toFixed(2)}/wear`)}><Copy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={13} /> Print</button><button className="btn btn-secondary btn-sm" onClick={() => setTotalCost("")}><RotateCcw size={13} /> Clear</button></div>
              </div>
            )}
          </div>
          <div className={`glass-card ${styles.calculatorCard}`}>
            <h2 className={styles.calcTitle}>Cost Per Wear Examples</h2>
            <div className="reference-table-wrapper"><table className="reference-table"><thead><tr><th>Item</th><th>Cost</th><th>Wears</th><th>$/Wear</th></tr></thead><tbody>{examples.map(e => (<tr key={e.item}><td>{e.item}</td><td style={{ fontFamily: "var(--font-mono)" }}>${e.cost}</td><td>{e.wears}</td><td style={{ fontFamily: "var(--font-mono)", color: e.cpw < 1 ? "var(--color-accent-primary)" : "#666" }}>${e.cpw.toFixed(2)}</td></tr>))}</tbody></table></div>
          </div>
          <section className="faq-section"><h2>Frequently Asked Questions</h2><div style={{ marginTop: "1.5rem" }}>{faqItems.map((f, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{f.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
        </div>
        <aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related Tools</h4><a href="/cost/per-garment" className="related-tool-link"><DollarSign size={14} /> Per Garment Cost</a><a href="/cost/pricing-calculator" className="related-tool-link"><DollarSign size={14} /> Pricing Calculator</a><a href="/cost/project-estimator" className="related-tool-link"><DollarSign size={14} /> Project Estimator</a></div></aside>
      </div>
    </div>
  );
}