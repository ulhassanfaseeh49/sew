"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { DollarSign, Copy, Printer, RotateCcw, ChevronDown, Grid3X3 } from "lucide-react";
import styles from "../../convert/yards-to-meters/page.module.css";

const widthOptions = [36, 44, 54, 60, 108];

export default function Page() {
  const [pricePerYard, setPricePerYard] = useState("");
  const [fabricWidth, setFabricWidth] = useState("44");
  const [unit, setUnit] = useState<"sqyd" | "sqft" | "sqm">("sqyd");
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const ppy = parseFloat(pricePerYard) || 0;
  const w = parseFloat(fabricWidth) || 44;
  const widthYards = w / 36;
  const sqYdPerLinYd = widthYards * 1;
  const pricePerSqYd = sqYdPerLinYd > 0 ? ppy / sqYdPerLinYd : 0;
  const pricePerSqFt = pricePerSqYd / 9;
  const pricePerSqM = pricePerSqYd / 0.8361;
  const hasResult = ppy > 0;

  const displayPrice = unit === "sqyd" ? pricePerSqYd : unit === "sqft" ? pricePerSqFt : pricePerSqM;
  const displayUnit = unit === "sqyd" ? "sq yd" : unit === "sqft" ? "sq ft" : "sq m";

  const refTable = widthOptions.map(w2 => {
    const wy = w2 / 36;
    const sqYd = wy * 1;
    return { width: w2, sqYdPerLinYd: sqYd, pricePerSqYd: ppy > 0 ? ppy / sqYd : 0 };
  });

  const faqItems = [
    { q: "Why calculate cost per square unit?", a: "It is the only fair way to compare fabrics of different widths. A $15/yd fabric at 60 inches wide gives more fabric per dollar than a $10/yd fabric at 36 inches wide." },
    { q: "How do I calculate cost per square yard?", a: "Convert fabric width to yards (divide by 36), then divide price per linear yard by that number. Example: $12/yd at 44 inches = $12 / 1.22 = $9.82/sq yd." },
    { q: "Which unit should I use for comparison?", a: "Use square yards for quilting and home sewing in the US. Use square meters for international comparisons. Square feet is useful when comparing to upholstery or wallpaper pricing." },
  ];

  return (
    <div className="container">
      <Breadcrumb items={[{ label: "Cost Calculators", href: "/cost" }, { label: "Cost Per Square Unit" }]} />
      <div className="calculator-layout">
        <div className="calculator-main">
          <div className={styles.toolHeader}>
            <span className="category-badge"><Grid3X3 size={14} strokeWidth={1.5} /> Cost Tool</span>
            <h1>Cost Per Square Unit Calculator</h1>
            <p>Calculate the true cost per square yard, square foot, or square meter — the only fair way to compare fabrics of different widths.</p>
          </div>
          <div className={`glass-card ${styles.calculatorCard}`}>
            <h2 className={styles.calcTitle}>Enter Details</h2>
            <div className="calculator-form">
              <div className="calculator-form-row">
                <div className="input-group"><label className="input-label">Price per yard ($)</label><input type="number" className="input-field" placeholder="e.g. 12.99" value={pricePerYard} onChange={e => setPricePerYard(e.target.value)} min="0" step="0.01" /></div>
                <div className="input-group">
                  <label className="input-label">Fabric width (inches)</label>
                  <select className="input-field" value={fabricWidth} onChange={e => setFabricWidth(e.target.value)}>
                    {widthOptions.map(w2 => <option key={w2} value={w2}>{w2}&quot;</option>)}
                  </select>
                </div>
                <div className="input-group">
                  <label className="input-label">Display unit</label>
                  <select className="input-field" value={unit} onChange={e => setUnit(e.target.value as "sqyd" | "sqft" | "sqm")}>
                    <option value="sqyd">Per sq yard</option><option value="sqft">Per sq foot</option><option value="sqm">Per sq meter</option>
                  </select>
                </div>
              </div>
            </div>
            {hasResult && (
              <div className={`calculator-results ${styles.results}`}>
                <div className="result-card">
                  <div className="result-value">${displayPrice.toFixed(2)} <span style={{ fontSize: "0.5em", fontWeight: 400 }}>per {displayUnit}</span></div>
                  <div className="result-label">From ${ppy.toFixed(2)}/linear yard at {w}&quot; wide</div>
                </div>
                <div className={styles.resultDetails}>
                  <div className={styles.resultRow}><span>Per sq yard</span><strong>${pricePerSqYd.toFixed(2)}</strong></div>
                  <div className={styles.resultRow}><span>Per sq foot</span><strong>${pricePerSqFt.toFixed(3)}</strong></div>
                  <div className={styles.resultRow}><span>Per sq meter</span><strong>${pricePerSqM.toFixed(2)}</strong></div>
                  <div className={styles.resultRow}><span>Sq yards per linear yard</span><strong>{sqYdPerLinYd.toFixed(2)}</strong></div>
                </div>
                <div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard.writeText(`$${displayPrice.toFixed(2)}/${displayUnit}`)}><Copy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={13} /> Print</button><button className="btn btn-secondary btn-sm" onClick={() => setPricePerYard("")}><RotateCcw size={13} /> Clear</button></div>
              </div>
            )}
          </div>
          {hasResult && (
            <div className={`glass-card ${styles.calculatorCard}`}>
              <h2 className={styles.calcTitle}>Width Comparison at ${ppy.toFixed(2)}/yd</h2>
              <div className="reference-table-wrapper"><table className="reference-table"><thead><tr><th>Width</th><th>Sq Yd/Lin Yd</th><th>Cost/Sq Yd</th></tr></thead><tbody>{refTable.map(r => (<tr key={r.width} style={r.width === w ? { background: "rgba(0,128,96,0.04)" } : {}}><td>{r.width}&quot;</td><td style={{ fontFamily: "var(--font-mono)" }}>{r.sqYdPerLinYd.toFixed(2)}</td><td style={{ fontFamily: "var(--font-mono)" }}>${r.pricePerSqYd.toFixed(2)}</td></tr>))}</tbody></table></div>
            </div>
          )}
          <section className="faq-section"><h2>Frequently Asked Questions</h2><div style={{ marginTop: "1.5rem" }}>{faqItems.map((f, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{f.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
        </div>
        <aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related Tools</h4><a href="/cost/per-yard" className="related-tool-link"><DollarSign size={14} /> Cost Per Yard</a><a href="/cost/fabric-comparison" className="related-tool-link"><DollarSign size={14} /> Fabric Comparison</a><a href="/convert/fabric-area-calculator" className="related-tool-link"><Grid3X3 size={14} /> Area Calculator</a></div></aside>
      </div>
    </div>
  );
}