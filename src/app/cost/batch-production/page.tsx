"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { DollarSign, Copy, Printer, RotateCcw, ChevronDown, Layers, TrendingDown } from "lucide-react";
import styles from "../../convert/yards-to-meters/page.module.css";

export default function Page() {
  const [quantity, setQuantity] = useState("10");
  const [fabricPerItem, setFabricPerItem] = useState("");
  const [fabricPricePerYd, setFabricPricePerYd] = useState("");
  const [notionsPerItem, setNotionsPerItem] = useState("");
  const [threadCost, setThreadCost] = useState("3.50");
  const [laborMins, setLaborMins] = useState("");
  const [laborRate, setLaborRate] = useState("25");
  const [packagingPerItem, setPackagingPerItem] = useState("");
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const qty = Math.max(parseInt(quantity) || 1, 1);
  const fabricYdEach = parseFloat(fabricPerItem) || 0;
  const fabricPrice = parseFloat(fabricPricePerYd) || 0;
  const notions = parseFloat(notionsPerItem) || 0;
  const thread = parseFloat(threadCost) || 0;
  const mins = parseFloat(laborMins) || 0;
  const rate = parseFloat(laborRate) || 0;
  const pkg = parseFloat(packagingPerItem) || 0;

  const totalFabricYd = fabricYdEach * qty;
  const fabricCostEach = fabricYdEach * fabricPrice;
  const threadPerItem = thread / Math.max(qty, 1);
  const materialPerItem = fabricCostEach + notions + threadPerItem + pkg;
  const laborPerItem = (mins / 60) * rate;
  const totalPerItem = materialPerItem + laborPerItem;
  const grandTotal = totalPerItem * qty;
  const hasResult = materialPerItem > 0;

  const scaleRows = [1, 5, 10, 25, 50].map(q => {
    const tpi = threadPerItem * qty / q;
    const matPi = fabricCostEach + notions + tpi + pkg;
    return { qty: q, matPi, withLabor: matPi + laborPerItem, total: (matPi + laborPerItem) * q };
  });

  const faqItems = [
    { q: "How do I calculate batch production cost?", a: "Multiply per-item material costs by quantity, add shared costs (thread) divided by quantity, then add labor per item. This tool automates the entire calculation." },
    { q: "Does making more items always lower per-item cost?", a: "Yes for shared costs (thread, pattern, setup time). No for per-item costs (fabric, notions, packaging). The savings come from spreading fixed costs across more units." },
    { q: "What is the minimum viable batch size?", a: "For most handmade items, 5-10 units is the minimum for meaningful cost reduction. Below 5, you are essentially making one-offs with extra efficiency." },
    { q: "How do I price batch items for selling?", a: "Add 25-50% markup to per-item cost for wholesale, 2-3x for retail. Account for platform fees (Etsy ~11%). Link to our Pricing Calculator for detailed pricing." },
  ];

  return (
    <div className="container">
      <Breadcrumb items={[{ label: "Cost Calculators", href: "/cost" }, { label: "Batch Production" }]} />
      <div className="calculator-layout">
        <div className="calculator-main">
          <div className={styles.toolHeader}>
            <span className="category-badge"><Layers size={14} strokeWidth={1.5} /> Cost Tool</span>
            <h1>Batch Production Cost Calculator</h1>
            <p>Calculate per-item costs when making multiples. See how quantity affects your cost and find the optimal batch size for profitability.</p>
          </div>
          <div className={`glass-card ${styles.calculatorCard}`}>
            <h2 className={styles.calcTitle}>Production Details</h2>
            <div className="calculator-form">
              <div className="calculator-form-row">
                <div className="input-group"><label className="input-label">Quantity to make</label><input type="number" className="input-field" value={quantity} onChange={e => setQuantity(e.target.value)} min="1" step="1" /></div>
              </div>
              <div className="calculator-form-row">
                <div className="input-group"><label className="input-label">Fabric per item (yards)</label><input type="number" className="input-field" placeholder="e.g. 2" value={fabricPerItem} onChange={e => setFabricPerItem(e.target.value)} min="0" step="0.125" /></div>
                <div className="input-group"><label className="input-label">Fabric $/yard</label><input type="number" className="input-field" placeholder="e.g. 12.00" value={fabricPricePerYd} onChange={e => setFabricPricePerYd(e.target.value)} min="0" step="0.01" /></div>
              </div>
              <div className="calculator-form-row">
                <div className="input-group"><label className="input-label">Notions per item ($)</label><input type="number" className="input-field" placeholder="e.g. 6.00" value={notionsPerItem} onChange={e => setNotionsPerItem(e.target.value)} min="0" step="0.01" /></div>
                <div className="input-group"><label className="input-label">Thread (total, $ for batch)</label><input type="number" className="input-field" value={threadCost} onChange={e => setThreadCost(e.target.value)} min="0" step="0.01" /></div>
                <div className="input-group"><label className="input-label">Packaging per item ($)</label><input type="number" className="input-field" placeholder="0.00" value={packagingPerItem} onChange={e => setPackagingPerItem(e.target.value)} min="0" step="0.01" /></div>
              </div>
              <div className="calculator-form-row">
                <div className="input-group"><label className="input-label">Labor per item (minutes)</label><input type="number" className="input-field" placeholder="e.g. 90" value={laborMins} onChange={e => setLaborMins(e.target.value)} min="0" step="5" /></div>
                <div className="input-group"><label className="input-label">Hourly rate ($)</label><input type="number" className="input-field" value={laborRate} onChange={e => setLaborRate(e.target.value)} min="0" step="1" /></div>
              </div>
            </div>
          </div>
          {hasResult && (
            <div className={`glass-card ${styles.calculatorCard}`}>
              <h2 className={styles.calcTitle}>Batch Cost Summary</h2>
              <div className={`calculator-results ${styles.results}`}>
                <div className="result-card">
                  <div className="result-value">${totalPerItem.toFixed(2)} <span style={{ fontSize: "0.5em", fontWeight: 400 }}>per item</span></div>
                  <div className="result-label">{qty} items × ${totalPerItem.toFixed(2)} = ${grandTotal.toFixed(2)} total</div>
                </div>
                <div className={styles.resultDetails}>
                  <div className={styles.resultRow}><span>Fabric per item ({fabricYdEach} yd × ${fabricPrice}/yd)</span><strong>${fabricCostEach.toFixed(2)}</strong></div>
                  {notions > 0 && <div className={styles.resultRow}><span>Notions per item</span><strong>${notions.toFixed(2)}</strong></div>}
                  <div className={styles.resultRow}><span>Thread per item</span><strong>${threadPerItem.toFixed(2)}</strong></div>
                  {pkg > 0 && <div className={styles.resultRow}><span>Packaging per item</span><strong>${pkg.toFixed(2)}</strong></div>}
                  <div className={styles.resultRow} style={{ borderTop: "1px solid var(--color-border)", paddingTop: "0.5rem" }}>
                    <span><strong>Materials per item</strong></span><strong>${materialPerItem.toFixed(2)}</strong>
                  </div>
                  {laborPerItem > 0 && <div className={styles.resultRow}><span>Labor ({mins} min × ${rate}/hr)</span><strong>${laborPerItem.toFixed(2)}</strong></div>}
                  <div className={styles.resultRow}><span><strong>Total per item</strong></span><strong style={{ color: "var(--color-accent-primary)" }}>${totalPerItem.toFixed(2)}</strong></div>
                  <div className={styles.resultRow}><span>Total fabric needed</span><strong>{totalFabricYd.toFixed(1)} yards</strong></div>
                </div>
              </div>
            </div>
          )}
          {hasResult && (
            <div className={`glass-card ${styles.calculatorCard}`}>
              <h2 className={styles.calcTitle}><TrendingDown size={16} style={{ marginRight: 6 }} />Quantity Scale Effect</h2>
              <div className="reference-table-wrapper"><table className="reference-table"><thead><tr><th>Qty</th><th>Material/Item</th><th>With Labor</th><th>Batch Total</th></tr></thead><tbody>{scaleRows.map(r => (<tr key={r.qty} style={r.qty === qty ? { background: "rgba(0,128,96,0.04)" } : {}}><td>{r.qty}</td><td style={{ fontFamily: "var(--font-mono)" }}>${r.matPi.toFixed(2)}</td><td style={{ fontFamily: "var(--font-mono)" }}>${r.withLabor.toFixed(2)}</td><td style={{ fontFamily: "var(--font-mono)" }}>${r.total.toFixed(2)}</td></tr>))}</tbody></table></div>
            </div>
          )}
          <section className="faq-section"><h2>Frequently Asked Questions</h2><div style={{ marginTop: "1.5rem" }}>{faqItems.map((f, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{f.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
        </div>
        <aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related Tools</h4><a href="/cost/per-garment" className="related-tool-link"><DollarSign size={14} /> Per Garment Cost</a><a href="/cost/pricing-calculator" className="related-tool-link"><DollarSign size={14} /> Pricing Calculator</a><a href="/cost/wholesale-vs-retail" className="related-tool-link"><DollarSign size={14} /> Wholesale vs Retail</a></div></aside>
      </div>
    </div>
  );
}