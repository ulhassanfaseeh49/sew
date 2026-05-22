"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { DollarSign, Copy, Printer, RotateCcw, ChevronDown, Scissors } from "lucide-react";
import styles from "../../convert/yards-to-meters/page.module.css";

export default function Page() {
  const [originalPrice, setOriginalPrice] = useState("");
  const [originalYards, setOriginalYards] = useState("");
  const [remnantYards, setRemnantYards] = useState("");
  const [remnantPrice, setRemnantPrice] = useState("");
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const op = parseFloat(originalPrice) || 0;
  const oy = parseFloat(originalYards) || 0;
  const ry = parseFloat(remnantYards) || 0;
  const rp = parseFloat(remnantPrice) || 0;

  const originalTotal = op * oy;
  const originalPerYd = op;
  const remnantPerYd = ry > 0 ? rp / ry : 0;
  const hasResult = rp > 0 && ry > 0;
  const savings = op > 0 ? ((op - remnantPerYd) / op) * 100 : 0;
  const isGoodDeal = savings > 20;

  const faqItems = [
    { q: "What is a remnant?", a: "A remnant is a leftover piece of fabric from a bolt, typically sold at reduced prices. They range from half a yard to several yards." },
    { q: "What is a good deal on a remnant?", a: "20% or more off the original per-yard price is a fair deal. 30-50% off is a good deal. Over 50% off is excellent. Under 15% off is barely discounted." },
    { q: "How do I know if I have enough for my project?", a: "Measure the remnant carefully. Check your pattern yardage requirements including seam allowances. Remember: with a remnant, you cannot buy more of the same fabric." },
  ];

  return (
    <div className="container">
      <Breadcrumb items={[{ label: "Cost Calculators", href: "/cost" }, { label: "Remnant Value" }]} />
      <div className="calculator-layout">
        <div className="calculator-main">
          <div className={styles.toolHeader}>
            <span className="category-badge"><Scissors size={14} strokeWidth={1.5} /> Cost Tool</span>
            <h1>Remnant Value Calculator</h1>
            <p>Determine if a fabric remnant is actually a good deal by comparing the remnant per-yard price to the original full-bolt price.</p>
          </div>
          <div className={`glass-card ${styles.calculatorCard}`}>
            <h2 className={styles.calcTitle}>Enter Details</h2>
            <div className="calculator-form">
              <div className="calculator-form-row">
                <div className="input-group"><label className="input-label">Original price per yard ($)</label><input type="number" className="input-field" placeholder="e.g. 14.99" value={originalPrice} onChange={e => setOriginalPrice(e.target.value)} min="0" step="0.01" /></div>
              </div>
              <div className="calculator-form-row">
                <div className="input-group"><label className="input-label">Remnant length (yards)</label><input type="number" className="input-field" placeholder="e.g. 1.5" value={remnantYards} onChange={e => setRemnantYards(e.target.value)} min="0" step="0.125" /></div>
                <div className="input-group"><label className="input-label">Remnant price ($)</label><input type="number" className="input-field" placeholder="e.g. 12.00" value={remnantPrice} onChange={e => setRemnantPrice(e.target.value)} min="0" step="0.01" /></div>
              </div>
            </div>
            {hasResult && (
              <div className={`calculator-results ${styles.results}`}>
                <div className="result-card" style={{ background: isGoodDeal ? "rgba(0,128,96,0.06)" : "rgba(245,158,11,0.06)" }}>
                  <div className="result-value" style={{ color: isGoodDeal ? "var(--color-accent-primary)" : "#d97706" }}>${remnantPerYd.toFixed(2)}/yd</div>
                  <div className="result-label">{savings > 0 ? `${savings.toFixed(0)}% off original price${isGoodDeal ? " — good deal!" : " — minimal discount"}` : "No savings vs original"}</div>
                </div>
                <div className={styles.resultDetails}>
                  <div className={styles.resultRow}><span>Remnant per yard</span><strong>${remnantPerYd.toFixed(2)}/yd</strong></div>
                  {op > 0 && <div className={styles.resultRow}><span>Original per yard</span><strong>${op.toFixed(2)}/yd</strong></div>}
                  {op > 0 && <div className={styles.resultRow}><span>Savings per yard</span><strong style={{ color: savings > 0 ? "var(--color-accent-primary)" : "#dc2626" }}>{savings > 0 ? "-" : "+"}${Math.abs(op - remnantPerYd).toFixed(2)}</strong></div>}
                  <div className={styles.resultRow}><span>Remnant total</span><strong>${rp.toFixed(2)} for {ry} yd</strong></div>
                </div>
                <div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard.writeText(`Remnant: $${remnantPerYd.toFixed(2)}/yd (${savings.toFixed(0)}% off)`)}><Copy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={13} /> Print</button><button className="btn btn-secondary btn-sm" onClick={() => { setRemnantYards(""); setRemnantPrice(""); }}><RotateCcw size={13} /> Clear</button></div>
              </div>
            )}
          </div>
          <section className="faq-section"><h2>Frequently Asked Questions</h2><div style={{ marginTop: "1.5rem" }}>{faqItems.map((f, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{f.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
        </div>
        <aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related Tools</h4><a href="/cost/per-yard" className="related-tool-link"><DollarSign size={14} /> Cost Per Yard</a><a href="/cost/stash-value" className="related-tool-link"><DollarSign size={14} /> Stash Value</a><a href="/cost/fabric-comparison" className="related-tool-link"><DollarSign size={14} /> Fabric Comparison</a></div></aside>
      </div>
    </div>
  );
}