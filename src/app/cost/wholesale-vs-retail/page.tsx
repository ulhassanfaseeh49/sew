"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { DollarSign, Copy, Printer, RotateCcw, ChevronDown, ArrowRightLeft, Factory } from "lucide-react";
import styles from "../../convert/yards-to-meters/page.module.css";

export default function Page() {
  const [retailPrice, setRetailPrice] = useState("");
  const [retailYards, setRetailYards] = useState("");
  const [wholesalePrice, setWholesalePrice] = useState("");
  const [wholesaleMin, setWholesaleMin] = useState("");
  const [projectYards, setProjectYards] = useState("");
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const rp = parseFloat(retailPrice) || 0;
  const ry = parseFloat(retailYards) || 0;
  const wp = parseFloat(wholesalePrice) || 0;
  const wm = parseFloat(wholesaleMin) || 0;
  const py = parseFloat(projectYards) || 0;

  const retailTotal = rp * Math.max(ry, py);
  const wholesaleTotal = wp * Math.max(wm, py);
  const retailPerYd = rp;
  const wholesalePerYd = wp;
  const savings = rp > 0 ? ((rp - wp) / rp) * 100 : 0;

  const hasResult = rp > 0 && wp > 0;
  const breakEvenYards = rp > wp && rp > 0 ? wholesaleTotal / rp : 0;
  const excessYards = wm > py ? wm - py : 0;
  const excessValue = excessYards * wp;

  const cheaper = wholesaleTotal < retailTotal ? "wholesale" : "retail";

  const faqItems = [
    { q: "When is wholesale worth it?", a: "When you need enough yardage to meet minimum order quantities, and the per-yard savings exceed any shipping or storage costs. Usually for production runs of 5+ items." },
    { q: "What are typical wholesale minimums?", a: "Most fabric wholesalers require 10-15 yard minimums. Some require full bolts (15-20 yards). Smaller minimums of 3-5 yards exist for craft wholesalers." },
    { q: "Where do I find wholesale fabric?", a: "Fabric.com wholesale, Mood Fabrics wholesale, LA Fabric District, NYC Garment District, Alibaba for large quantities, and local textile distributors." },
    { q: "What about leftover fabric from wholesale purchases?", a: "Factor in leftover value. Use it for future projects, sell on destash groups, or include in your product line. Excess fabric is not wasted money if you can use it." },
  ];

  return (
    <div className="container">
      <Breadcrumb items={[{ label: "Cost Calculators", href: "/cost" }, { label: "Wholesale vs Retail" }]} />
      <div className="calculator-layout">
        <div className="calculator-main">
          <div className={styles.toolHeader}>
            <span className="category-badge"><Factory size={14} strokeWidth={1.5} /> Cost Tool</span>
            <h1>Wholesale vs Retail Comparator</h1>
            <p>Compare wholesale fabric pricing against retail to see if buying in bulk actually saves money after accounting for minimums and excess.</p>
          </div>
          <div className={`glass-card ${styles.calculatorCard}`}>
            <h2 className={styles.calcTitle}>Retail Option</h2>
            <div className="calculator-form">
              <div className="calculator-form-row">
                <div className="input-group"><label className="input-label">Retail price per yard ($)</label><input type="number" className="input-field" placeholder="e.g. 14.99" value={retailPrice} onChange={e => setRetailPrice(e.target.value)} min="0" step="0.01" /></div>
              </div>
            </div>
          </div>
          <div className={`glass-card ${styles.calculatorCard}`}>
            <h2 className={styles.calcTitle}>Wholesale Option</h2>
            <div className="calculator-form">
              <div className="calculator-form-row">
                <div className="input-group"><label className="input-label">Wholesale price per yard ($)</label><input type="number" className="input-field" placeholder="e.g. 7.99" value={wholesalePrice} onChange={e => setWholesalePrice(e.target.value)} min="0" step="0.01" /></div>
                <div className="input-group"><label className="input-label">Minimum order (yards)</label><input type="number" className="input-field" placeholder="e.g. 15" value={wholesaleMin} onChange={e => setWholesaleMin(e.target.value)} min="0" step="1" /></div>
              </div>
            </div>
          </div>
          <div className={`glass-card ${styles.calculatorCard}`}>
            <div className="input-group" style={{ maxWidth: 250 }}>
              <label className="input-label">Your project needs (yards)</label>
              <input type="number" className="input-field" placeholder="e.g. 6" value={projectYards} onChange={e => setProjectYards(e.target.value)} min="0" step="0.125" />
            </div>
          </div>
          {hasResult && (
            <div className={`glass-card ${styles.calculatorCard}`}>
              <h2 className={styles.calcTitle}><ArrowRightLeft size={16} style={{ marginRight: 6 }} />Comparison</h2>
              <div className={`calculator-results ${styles.results}`}>
                <div className="result-card">
                  <div className="result-value" style={{ color: "var(--color-accent-primary)" }}>{cheaper === "wholesale" ? "Wholesale" : "Retail"} saves ${Math.abs(retailTotal - wholesaleTotal).toFixed(2)}</div>
                  <div className="result-label">{savings > 0 ? `${savings.toFixed(0)}% per-yard savings at wholesale` : "Wholesale is not cheaper per yard"}</div>
                </div>
                <div className="reference-table-wrapper" style={{ marginTop: "1rem" }}>
                  <table className="reference-table"><thead><tr><th></th><th>Retail</th><th>Wholesale</th></tr></thead><tbody>
                    <tr><td>Per yard</td><td style={{ fontFamily: "var(--font-mono)" }}>${retailPerYd.toFixed(2)}</td><td style={{ fontFamily: "var(--font-mono)" }}>${wholesalePerYd.toFixed(2)}</td></tr>
                    <tr><td>Yards purchased</td><td>{Math.max(ry || py, py || 0)}</td><td>{Math.max(wm, py)}</td></tr>
                    <tr style={{ fontWeight: 700 }}><td>Total cost</td><td style={{ fontFamily: "var(--font-mono)", color: cheaper === "retail" ? "var(--color-accent-primary)" : "inherit" }}>${retailTotal.toFixed(2)}</td><td style={{ fontFamily: "var(--font-mono)", color: cheaper === "wholesale" ? "var(--color-accent-primary)" : "inherit" }}>${wholesaleTotal.toFixed(2)}</td></tr>
                    {excessYards > 0 && <tr><td>Excess fabric</td><td>0 yd</td><td>{excessYards.toFixed(1)} yd (${excessValue.toFixed(2)} value)</td></tr>}
                  </tbody></table>
                </div>
                {excessYards > 0 && <div className="smart-tip" style={{ marginTop: "1rem" }}>You will have <strong>{excessYards.toFixed(1)} extra yards</strong> worth ${excessValue.toFixed(2)}. Use for future projects or sell to recoup cost.</div>}
                <div className="toolbar" style={{ marginTop: "1rem" }}>
                  <button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard.writeText(`Retail: $${retailTotal.toFixed(2)} | Wholesale: $${wholesaleTotal.toFixed(2)}`)}><Copy size={13} /> Copy</button>
                  <button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={13} /> Print</button>
                  <button className="btn btn-secondary btn-sm" onClick={() => { setRetailPrice(""); setWholesalePrice(""); setWholesaleMin(""); setProjectYards(""); }}><RotateCcw size={13} /> Clear</button>
                </div>
              </div>
            </div>
          )}
          <section className="faq-section"><h2>Frequently Asked Questions</h2><div style={{ marginTop: "1.5rem" }}>{faqItems.map((f, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{f.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
        </div>
        <aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related Tools</h4><a href="/cost/per-yard" className="related-tool-link"><DollarSign size={14} /> Cost Per Yard</a><a href="/cost/batch-production" className="related-tool-link"><DollarSign size={14} /> Batch Production</a><a href="/cost/fabric-comparison" className="related-tool-link"><DollarSign size={14} /> Fabric Comparison</a></div></aside>
      </div>
    </div>
  );
}