"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { DollarSign, Copy, Printer, RotateCcw, ChevronDown, ShoppingCart, Store } from "lucide-react";
import styles from "../../convert/yards-to-meters/page.module.css";

export default function Page() {
  const [onlinePrice, setOnlinePrice] = useState("");
  const [onlineYards, setOnlineYards] = useState("");
  const [onlineShipping, setOnlineShipping] = useState("");
  const [localPrice, setLocalPrice] = useState("");
  const [localYards, setLocalYards] = useState("");
  const [localTax, setLocalTax] = useState("8");
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const op = parseFloat(onlinePrice) || 0;
  const oy = parseFloat(onlineYards) || 0;
  const os = parseFloat(onlineShipping) || 0;
  const lp = parseFloat(localPrice) || 0;
  const ly = parseFloat(localYards) || 0;
  const lt = parseFloat(localTax) || 0;

  const onlineFabricCost = op * oy;
  const onlineTotal = onlineFabricCost + os;
  const onlineTruePerYd = oy > 0 ? onlineTotal / oy : 0;

  const localFabricCost = lp * ly;
  const localTaxAmt = localFabricCost * (lt / 100);
  const localTotal = localFabricCost + localTaxAmt;
  const localTruePerYd = ly > 0 ? localTotal / ly : 0;

  const hasResult = onlineTotal > 0 && localTotal > 0;
  const cheaper = onlineTotal < localTotal ? "online" : onlineTotal > localTotal ? "local" : "same";
  const savings = Math.abs(onlineTotal - localTotal);

  const faqItems = [
    { q: "Is online fabric really cheaper?", a: "Not always. After adding $6-12 shipping, online fabric that seems cheaper often costs the same or more per yard. This tool reveals the true comparison." },
    { q: "What about online coupon codes?", a: "Apply any coupon to the online price per yard before entering it. This tool calculates based on what you will actually pay." },
    { q: "Should I factor in gas for driving to the store?", a: "For a dedicated trip, yes. At $0.67/mile (IRS rate), a 20-mile round trip costs about $13.40. For trips combined with other errands, the cost is negligible." },
    { q: "What about the ability to feel fabric before buying?", a: "This is a real advantage of local shopping. Online fabric may not match screen colors or feel as expected. Many sewists order swatches first ($1-3 each)." },
  ];

  return (
    <div className="container">
      <Breadcrumb items={[{ label: "Cost Calculators", href: "/cost" }, { label: "Online vs Local" }]} />
      <div className="calculator-layout">
        <div className="calculator-main">
          <div className={styles.toolHeader}>
            <span className="category-badge"><ShoppingCart size={14} strokeWidth={1.5} /> Cost Tool</span>
            <h1>Online vs Local Store Comparator</h1>
            <p>Compare the true cost of buying fabric online (with shipping) versus your local fabric store (with tax). Find out which option really saves money.</p>
          </div>
          <div className={`glass-card ${styles.calculatorCard}`}>
            <h2 className={styles.calcTitle}><ShoppingCart size={16} style={{ marginRight: 6 }} />Online Store</h2>
            <div className="calculator-form">
              <div className="calculator-form-row">
                <div className="input-group"><label className="input-label">Price per yard ($)</label><input type="number" className="input-field" placeholder="e.g. 9.99" value={onlinePrice} onChange={e => setOnlinePrice(e.target.value)} min="0" step="0.01" /></div>
                <div className="input-group"><label className="input-label">Yards needed</label><input type="number" className="input-field" placeholder="e.g. 3" value={onlineYards} onChange={e => setOnlineYards(e.target.value)} min="0" step="0.125" /></div>
                <div className="input-group"><label className="input-label">Shipping ($)</label><input type="number" className="input-field" placeholder="e.g. 7.99" value={onlineShipping} onChange={e => setOnlineShipping(e.target.value)} min="0" step="0.01" /></div>
              </div>
            </div>
          </div>
          <div className={`glass-card ${styles.calculatorCard}`}>
            <h2 className={styles.calcTitle}><Store size={16} style={{ marginRight: 6 }} />Local Store</h2>
            <div className="calculator-form">
              <div className="calculator-form-row">
                <div className="input-group"><label className="input-label">Price per yard ($)</label><input type="number" className="input-field" placeholder="e.g. 12.99" value={localPrice} onChange={e => setLocalPrice(e.target.value)} min="0" step="0.01" /></div>
                <div className="input-group"><label className="input-label">Yards needed</label><input type="number" className="input-field" placeholder="e.g. 3" value={localYards} onChange={e => setLocalYards(e.target.value)} min="0" step="0.125" /></div>
                <div className="input-group"><label className="input-label">Sales tax (%)</label><input type="number" className="input-field" value={localTax} onChange={e => setLocalTax(e.target.value)} min="0" step="0.1" /></div>
              </div>
            </div>
          </div>
          {hasResult && (
            <div className={`glass-card ${styles.calculatorCard}`}>
              <h2 className={styles.calcTitle}>Comparison Results</h2>
              <div className={`calculator-results ${styles.results}`}>
                <div className="result-card">
                  <div className="result-value" style={{ color: "var(--color-accent-primary)" }}>
                    {cheaper === "same" ? "Same price!" : `${cheaper === "online" ? "Online" : "Local"} saves $${savings.toFixed(2)}`}
                  </div>
                  <div className="result-label">{cheaper === "online" ? "Online is cheaper after shipping" : cheaper === "local" ? "Local is cheaper even with tax" : "Both options cost the same"}</div>
                </div>
                <div className="reference-table-wrapper" style={{ marginTop: "1rem" }}>
                  <table className="reference-table">
                    <thead><tr><th></th><th>Online</th><th>Local</th></tr></thead>
                    <tbody>
                      <tr><td>Price/yard</td><td style={{ fontFamily: "var(--font-mono)" }}>${op.toFixed(2)}</td><td style={{ fontFamily: "var(--font-mono)" }}>${lp.toFixed(2)}</td></tr>
                      <tr><td>Yards</td><td>{oy}</td><td>{ly}</td></tr>
                      <tr><td>Fabric cost</td><td style={{ fontFamily: "var(--font-mono)" }}>${onlineFabricCost.toFixed(2)}</td><td style={{ fontFamily: "var(--font-mono)" }}>${localFabricCost.toFixed(2)}</td></tr>
                      <tr><td>Shipping / Tax</td><td style={{ fontFamily: "var(--font-mono)" }}>+${os.toFixed(2)}</td><td style={{ fontFamily: "var(--font-mono)" }}>+${localTaxAmt.toFixed(2)}</td></tr>
                      <tr style={{ fontWeight: 700 }}><td>True Total</td><td style={{ fontFamily: "var(--font-mono)", color: cheaper === "online" ? "var(--color-accent-primary)" : "inherit" }}>${onlineTotal.toFixed(2)}</td><td style={{ fontFamily: "var(--font-mono)", color: cheaper === "local" ? "var(--color-accent-primary)" : "inherit" }}>${localTotal.toFixed(2)}</td></tr>
                      <tr><td>True $/yard</td><td style={{ fontFamily: "var(--font-mono)" }}>${onlineTruePerYd.toFixed(2)}</td><td style={{ fontFamily: "var(--font-mono)" }}>${localTruePerYd.toFixed(2)}</td></tr>
                    </tbody>
                  </table>
                </div>
                {os > onlineFabricCost * 0.3 && <div className="smart-tip" style={{ marginTop: "1rem" }}>Shipping adds <strong>{((os / onlineFabricCost) * 100).toFixed(0)}%</strong> to your online fabric cost. Consider buying more to spread shipping.</div>}
                <div className="toolbar" style={{ marginTop: "1rem" }}>
                  <button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard.writeText(`Online: $${onlineTotal.toFixed(2)} | Local: $${localTotal.toFixed(2)}`)}><Copy size={13} /> Copy</button>
                  <button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={13} /> Print</button>
                  <button className="btn btn-secondary btn-sm" onClick={() => { setOnlinePrice(""); setOnlineYards(""); setOnlineShipping(""); setLocalPrice(""); setLocalYards(""); }}><RotateCcw size={13} /> Clear</button>
                </div>
              </div>
            </div>
          )}
          <section className="faq-section"><h2>Frequently Asked Questions</h2><div style={{ marginTop: "1.5rem" }}>{faqItems.map((f, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{f.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
        </div>
        <aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related Tools</h4><a href="/cost/per-yard" className="related-tool-link"><DollarSign size={14} /> Cost Per Yard</a><a href="/cost/fabric-comparison" className="related-tool-link"><DollarSign size={14} /> Fabric Comparison</a><a href="/cost/currency-converter" className="related-tool-link"><DollarSign size={14} /> Currency Converter</a></div></aside>
      </div>
    </div>
  );
}