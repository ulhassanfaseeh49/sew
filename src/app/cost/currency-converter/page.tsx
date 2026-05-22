"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { DollarSign, Copy, Printer, RotateCcw, ChevronDown, ArrowRightLeft } from "lucide-react";
import styles from "../../convert/yards-to-meters/page.module.css";

const currencies = [
  { code: "USD", symbol: "$", rate: 1, label: "US Dollar" },
  { code: "EUR", symbol: "€", rate: 0.92, label: "Euro" },
  { code: "GBP", symbol: "£", rate: 0.79, label: "British Pound" },
  { code: "CAD", symbol: "C$", rate: 1.36, label: "Canadian Dollar" },
  { code: "AUD", symbol: "A$", rate: 1.53, label: "Australian Dollar" },
  { code: "JPY", symbol: "¥", rate: 149.5, label: "Japanese Yen" },
  { code: "INR", symbol: "₹", rate: 83.5, label: "Indian Rupee" },
];

export default function Page() {
  const [amount, setAmount] = useState("");
  const [fromCur, setFromCur] = useState("USD");
  const [toCur, setToCur] = useState("EUR");
  const [perYard, setPerYard] = useState("");
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const amt = parseFloat(amount) || 0;
  const from = currencies.find(c => c.code === fromCur)!;
  const to = currencies.find(c => c.code === toCur)!;
  const usdAmount = amt / from.rate;
  const converted = usdAmount * to.rate;
  const hasResult = amt > 0;
  const py = parseFloat(perYard) || 0;
  const pyConverted = py > 0 ? (py / from.rate) * to.rate : 0;
  const pyPerMeter = py > 0 ? (py / from.rate * to.rate) / 0.9144 : 0;

  const faqItems = [
    { q: "Are these exchange rates accurate?", a: "These are approximate rates for estimation only. Actual rates change daily. Check a financial site like xe.com for current rates before making large purchases." },
    { q: "How do I compare international fabric prices?", a: "Convert both prices to the same currency, then also convert to the same unit (per yard or per meter). Remember to add international shipping costs." },
    { q: "Should I buy fabric from another country?", a: "It can be worth it for specialty fabrics -- Japanese cotton, Italian wool, French lace often have better selection from their origin countries. Factor in shipping, customs, and duties." },
    { q: "What about customs fees on fabric imports?", a: "Most countries charge import duty on textile purchases over a certain value (e.g., $800 for US). Below this threshold, you typically pay no duty. Check your country's customs rules." },
  ];

  return (
    <div className="container">
      <Breadcrumb items={[{ label: "Cost Calculators", href: "/cost" }, { label: "Currency Converter" }]} />
      <div className="calculator-layout">
        <div className="calculator-main">
          <div className={styles.toolHeader}>
            <span className="category-badge"><ArrowRightLeft size={14} strokeWidth={1.5} /> Cost Tool</span>
            <h1>Fabric Shopping Currency Converter</h1>
            <p>Convert fabric prices between currencies for international fabric shopping. Includes per-yard and per-meter price conversion.</p>
          </div>
          <div className={`glass-card ${styles.calculatorCard}`}>
            <h2 className={styles.calcTitle}>Convert Amount</h2>
            <div className="calculator-form">
              <div className="calculator-form-row">
                <div className="input-group"><label className="input-label">Amount</label><input type="number" className="input-field" placeholder="e.g. 25.00" value={amount} onChange={e => setAmount(e.target.value)} min="0" step="0.01" /></div>
                <div className="input-group"><label className="input-label">From</label><select className="input-field" value={fromCur} onChange={e => setFromCur(e.target.value)}>{currencies.map(c => <option key={c.code} value={c.code}>{c.symbol} {c.code}</option>)}</select></div>
                <div className="input-group"><label className="input-label">To</label><select className="input-field" value={toCur} onChange={e => setToCur(e.target.value)}>{currencies.map(c => <option key={c.code} value={c.code}>{c.symbol} {c.code}</option>)}</select></div>
              </div>
            </div>
            {hasResult && (
              <div className={`calculator-results ${styles.results}`}>
                <div className="result-card">
                  <div className="result-value">{to.symbol}{converted.toFixed(2)} <span style={{ fontSize: "0.45em", fontWeight: 400 }}>{toCur}</span></div>
                  <div className="result-label">{from.symbol}{amt.toFixed(2)} {fromCur} = {to.symbol}{converted.toFixed(2)} {toCur}</div>
                </div>
                <div className={styles.resultDetails}>
                  <div className={styles.resultRow}><span>Exchange rate</span><strong>1 {fromCur} = {(to.rate / from.rate).toFixed(4)} {toCur}</strong></div>
                </div>
                <div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard.writeText(`${to.symbol}${converted.toFixed(2)}`)}><Copy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={13} /> Print</button><button className="btn btn-secondary btn-sm" onClick={() => setAmount("")}><RotateCcw size={13} /> Clear</button></div>
              </div>
            )}
          </div>

          <div className={`glass-card ${styles.calculatorCard}`}>
            <h2 className={styles.calcTitle}>Price Per Yard Conversion</h2>
            <div className="calculator-form">
              <div className="calculator-form-row">
                <div className="input-group"><label className="input-label">Price per yard ({from.symbol})</label><input type="number" className="input-field" placeholder="e.g. 15.00" value={perYard} onChange={e => setPerYard(e.target.value)} min="0" step="0.01" /></div>
              </div>
            </div>
            {py > 0 && (
              <div className={styles.resultDetails} style={{ marginTop: "1rem" }}>
                <div className={styles.resultRow}><span>Per yard in {toCur}</span><strong>{to.symbol}{pyConverted.toFixed(2)}/yd</strong></div>
                <div className={styles.resultRow}><span>Per meter in {toCur}</span><strong>{to.symbol}{pyPerMeter.toFixed(2)}/m</strong></div>
              </div>
            )}
          </div>

          <div className={`glass-card ${styles.calculatorCard}`}>
            <h2 className={styles.calcTitle}>Quick Reference: All Currencies</h2>
            <div className="reference-table-wrapper"><table className="reference-table"><thead><tr><th>Currency</th><th>= {from.symbol}1.00 {fromCur}</th></tr></thead><tbody>{currencies.filter(c => c.code !== fromCur).map(c => (<tr key={c.code}><td>{c.symbol} {c.label}</td><td style={{ fontFamily: "var(--font-mono)" }}>{c.symbol}{(c.rate / from.rate).toFixed(4)}</td></tr>))}</tbody></table></div>
            <div className="smart-tip" style={{ marginTop: "1rem" }}>These are approximate rates for estimation only. Check xe.com for current rates before purchasing.</div>
          </div>

          <section className="faq-section"><h2>Frequently Asked Questions</h2><div style={{ marginTop: "1.5rem" }}>{faqItems.map((f, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{f.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
        </div>
        <aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related Tools</h4><a href="/cost/per-yard" className="related-tool-link"><DollarSign size={14} /> Cost Per Yard</a><a href="/cost/per-meter" className="related-tool-link"><DollarSign size={14} /> Cost Per Meter</a><a href="/cost/online-vs-local" className="related-tool-link"><DollarSign size={14} /> Online vs Local</a></div></aside>
      </div>
    </div>
  );
}