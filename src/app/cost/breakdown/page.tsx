"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { DollarSign, Copy, Printer, RotateCcw, ChevronDown, FileText, Plus, Trash2 } from "lucide-react";
import styles from "../../convert/yards-to-meters/page.module.css";

interface CostLine { label: string; amount: string; }

export default function Page() {
  const [projectName, setProjectName] = useState("");
  const [fabricLines, setFabricLines] = useState<CostLine[]>([{ label: "Main fabric", amount: "" }, { label: "Lining", amount: "" }]);
  const [notionLines, setNotionLines] = useState<CostLine[]>([{ label: "Thread", amount: "3.50" }, { label: "Zipper", amount: "" }, { label: "Buttons", amount: "" }]);
  const [patternCost, setPatternCost] = useState("");
  const [patternUses, setPatternUses] = useState("1");
  const [overheadLines, setOverheadLines] = useState<CostLine[]>([{ label: "Machine depreciation", amount: "" }, { label: "Electricity", amount: "" }]);
  const [shipping, setShipping] = useState("");
  const [laborDesign, setLaborDesign] = useState("");
  const [laborCutting, setLaborCutting] = useState("");
  const [laborSewing, setLaborSewing] = useState("");
  const [laborFinishing, setLaborFinishing] = useState("");
  const [laborRate, setLaborRate] = useState("25");
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const sumLines = (lines: CostLine[]) => lines.reduce((s, l) => s + (parseFloat(l.amount) || 0), 0);
  const fabricTotal = sumLines(fabricLines);
  const notionTotal = sumLines(notionLines);
  const patShare = (parseFloat(patternCost) || 0) / Math.max(parseInt(patternUses) || 1, 1);
  const overheadTotal = sumLines(overheadLines);
  const sh = parseFloat(shipping) || 0;
  const lr = parseFloat(laborRate) || 0;
  const laborHrs = (parseFloat(laborDesign) || 0) + (parseFloat(laborCutting) || 0) + (parseFloat(laborSewing) || 0) + (parseFloat(laborFinishing) || 0);
  const laborCost = laborHrs * lr;
  const materialTotal = fabricTotal + notionTotal + patShare + overheadTotal + sh;
  const grandTotal = materialTotal + laborCost;
  const hasResult = grandTotal > 0;

  const categories = [
    { name: "Fabric & Textiles", amount: fabricTotal, pct: grandTotal > 0 ? (fabricTotal / grandTotal) * 100 : 0 },
    { name: "Notions", amount: notionTotal, pct: grandTotal > 0 ? (notionTotal / grandTotal) * 100 : 0 },
    { name: "Pattern", amount: patShare, pct: grandTotal > 0 ? (patShare / grandTotal) * 100 : 0 },
    { name: "Overhead", amount: overheadTotal, pct: grandTotal > 0 ? (overheadTotal / grandTotal) * 100 : 0 },
    { name: "Shipping", amount: sh, pct: grandTotal > 0 ? (sh / grandTotal) * 100 : 0 },
    { name: "Labor", amount: laborCost, pct: grandTotal > 0 ? (laborCost / grandTotal) * 100 : 0 },
  ].filter(c => c.amount > 0);

  const updateLine = (setter: (v: CostLine[]) => void, lines: CostLine[], i: number, field: keyof CostLine, val: string) => {
    const n = [...lines]; n[i] = { ...n[i], [field]: val }; setter(n);
  };
  const addLine = (setter: (v: CostLine[]) => void, lines: CostLine[]) => setter([...lines, { label: "", amount: "" }]);
  const removeLine = (setter: (v: CostLine[]) => void, lines: CostLine[], i: number) => setter(lines.filter((_, j) => j !== i));

  const faqItems = [
    { q: "Why do I need a detailed cost breakdown?", a: "For pricing commissions accurately, tax documentation, understanding where your money goes, and making informed decisions about which costs to cut." },
    { q: "Should I include machine depreciation?", a: "For selling or commissions, yes. Divide machine cost by expected lifespan hours. A $500 machine lasting 2000 hours costs $0.25/hour." },
    { q: "How do I calculate electricity cost for sewing?", a: "A typical sewing machine uses 70-100 watts. At $0.12/kWh, that is about $0.01 per hour. It is small but adds up for production work." },
    { q: "What profit margins should I aim for?", a: "20% is minimum sustainable. 30% is comfortable. 50% allows for growth. Always price based on costs, not what you think people will pay." },
  ];

  return (
    <div className="container">
      <Breadcrumb items={[{ label: "Cost Calculators", href: "/cost" }, { label: "Complete Cost Breakdown" }]} />
      <div className="calculator-layout">
        <div className="calculator-main">
          <div className={styles.toolHeader}>
            <span className="category-badge"><FileText size={14} strokeWidth={1.5} /> Cost Tool</span>
            <h1>Complete Cost Breakdown Tool</h1>
            <p>The most detailed itemized cost tool — every fabric, notion, overhead expense, and labor hour documented for professional pricing and record keeping.</p>
          </div>

          <div className={`glass-card ${styles.calculatorCard}`}>
            <div className="input-group" style={{ maxWidth: 400 }}>
              <label className="input-label">Project name</label>
              <input type="text" className="input-field" placeholder="e.g. Navy linen blazer" value={projectName} onChange={e => setProjectName(e.target.value)} />
            </div>
          </div>

          {/* Fabrics */}
          <div className={`glass-card ${styles.calculatorCard}`}>
            <h2 className={styles.calcTitle}>Fabric &amp; Textile Costs</h2>
            {fabricLines.map((l, i) => (
              <div key={i} className="calculator-form-row" style={{ marginBottom: "0.5rem" }}>
                <div className="input-group" style={{ flex: 2 }}><input type="text" className="input-field" placeholder="Name" value={l.label} onChange={e => updateLine(setFabricLines, fabricLines, i, "label", e.target.value)} /></div>
                <div className="input-group"><input type="number" className="input-field" placeholder="$0.00" value={l.amount} onChange={e => updateLine(setFabricLines, fabricLines, i, "amount", e.target.value)} min="0" step="0.01" /></div>
                {fabricLines.length > 1 && <button className="btn btn-secondary btn-sm" onClick={() => removeLine(setFabricLines, fabricLines, i)} style={{ padding: "8px", alignSelf: "center" }}><Trash2 size={14} /></button>}
              </div>
            ))}
            <button className="btn btn-secondary btn-sm" onClick={() => addLine(setFabricLines, fabricLines)}><Plus size={13} /> Add</button>
          </div>

          {/* Notions */}
          <div className={`glass-card ${styles.calculatorCard}`}>
            <h2 className={styles.calcTitle}>Notions &amp; Supplies</h2>
            {notionLines.map((l, i) => (
              <div key={i} className="calculator-form-row" style={{ marginBottom: "0.5rem" }}>
                <div className="input-group" style={{ flex: 2 }}><input type="text" className="input-field" placeholder="Item" value={l.label} onChange={e => updateLine(setNotionLines, notionLines, i, "label", e.target.value)} /></div>
                <div className="input-group"><input type="number" className="input-field" placeholder="$0.00" value={l.amount} onChange={e => updateLine(setNotionLines, notionLines, i, "amount", e.target.value)} min="0" step="0.01" /></div>
                {notionLines.length > 1 && <button className="btn btn-secondary btn-sm" onClick={() => removeLine(setNotionLines, notionLines, i)} style={{ padding: "8px", alignSelf: "center" }}><Trash2 size={14} /></button>}
              </div>
            ))}
            <button className="btn btn-secondary btn-sm" onClick={() => addLine(setNotionLines, notionLines)}><Plus size={13} /> Add</button>
          </div>

          {/* Pattern + Overhead */}
          <div className={`glass-card ${styles.calculatorCard}`}>
            <h2 className={styles.calcTitle}>Pattern &amp; Overhead</h2>
            <div className="calculator-form">
              <div className="calculator-form-row">
                <div className="input-group"><label className="input-label">Pattern cost ($)</label><input type="number" className="input-field" placeholder="0.00" value={patternCost} onChange={e => setPatternCost(e.target.value)} min="0" step="0.01" /></div>
                <div className="input-group"><label className="input-label">Total uses</label><input type="number" className="input-field" value={patternUses} onChange={e => setPatternUses(e.target.value)} min="1" step="1" /></div>
                <div className="input-group"><label className="input-label">Shipping ($)</label><input type="number" className="input-field" placeholder="0.00" value={shipping} onChange={e => setShipping(e.target.value)} min="0" step="0.01" /></div>
              </div>
            </div>
            <h3 style={{ fontSize: "13px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", margin: "1rem 0 0.5rem", color: "var(--color-text-secondary)" }}>Equipment Overhead</h3>
            {overheadLines.map((l, i) => (
              <div key={i} className="calculator-form-row" style={{ marginBottom: "0.5rem" }}>
                <div className="input-group" style={{ flex: 2 }}><input type="text" className="input-field" value={l.label} onChange={e => updateLine(setOverheadLines, overheadLines, i, "label", e.target.value)} /></div>
                <div className="input-group"><input type="number" className="input-field" placeholder="$0.00" value={l.amount} onChange={e => updateLine(setOverheadLines, overheadLines, i, "amount", e.target.value)} min="0" step="0.01" /></div>
                {overheadLines.length > 1 && <button className="btn btn-secondary btn-sm" onClick={() => removeLine(setOverheadLines, overheadLines, i)} style={{ padding: "8px", alignSelf: "center" }}><Trash2 size={14} /></button>}
              </div>
            ))}
            <button className="btn btn-secondary btn-sm" onClick={() => addLine(setOverheadLines, overheadLines)}><Plus size={13} /> Add</button>
          </div>

          {/* Labor */}
          <div className={`glass-card ${styles.calculatorCard}`}>
            <h2 className={styles.calcTitle}>Labor Breakdown</h2>
            <div className="calculator-form">
              <div className="calculator-form-row">
                <div className="input-group"><label className="input-label">Hourly rate ($)</label><input type="number" className="input-field" value={laborRate} onChange={e => setLaborRate(e.target.value)} min="0" step="1" /></div>
              </div>
              <div className="calculator-form-row">
                <div className="input-group"><label className="input-label">Design/planning (hrs)</label><input type="number" className="input-field" placeholder="0" value={laborDesign} onChange={e => setLaborDesign(e.target.value)} min="0" step="0.25" /></div>
                <div className="input-group"><label className="input-label">Cutting (hrs)</label><input type="number" className="input-field" placeholder="0" value={laborCutting} onChange={e => setLaborCutting(e.target.value)} min="0" step="0.25" /></div>
              </div>
              <div className="calculator-form-row">
                <div className="input-group"><label className="input-label">Sewing (hrs)</label><input type="number" className="input-field" placeholder="0" value={laborSewing} onChange={e => setLaborSewing(e.target.value)} min="0" step="0.25" /></div>
                <div className="input-group"><label className="input-label">Finishing (hrs)</label><input type="number" className="input-field" placeholder="0" value={laborFinishing} onChange={e => setLaborFinishing(e.target.value)} min="0" step="0.25" /></div>
              </div>
            </div>
          </div>

          {/* Results */}
          {hasResult && (
            <div className={`glass-card ${styles.calculatorCard}`}>
              <h2 className={styles.calcTitle}>Complete Breakdown{projectName ? `: ${projectName}` : ""}</h2>
              <div className={`calculator-results ${styles.results}`}>
                <div className="result-card">
                  <div className="result-value">${grandTotal.toFixed(2)}</div>
                  <div className="result-label">{laborCost > 0 ? `Materials: $${materialTotal.toFixed(2)} + Labor: $${laborCost.toFixed(2)}` : "Total materials cost"}</div>
                </div>

                <div className="reference-table-wrapper" style={{ marginTop: "1rem" }}>
                  <table className="reference-table">
                    <thead><tr><th>Category</th><th>Amount</th><th>% of Total</th></tr></thead>
                    <tbody>
                      {categories.map(c => (
                        <tr key={c.name}>
                          <td>{c.name}</td>
                          <td style={{ fontFamily: "var(--font-mono)" }}>${c.amount.toFixed(2)}</td>
                          <td>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                              <div style={{ width: 60, height: 6, background: "var(--color-bg-tertiary)", borderRadius: 3 }}>
                                <div style={{ width: `${Math.min(c.pct, 100)}%`, height: "100%", background: "var(--color-accent-primary)", borderRadius: 3 }} />
                              </div>
                              <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px" }}>{c.pct.toFixed(0)}%</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                      <tr style={{ fontWeight: 700 }}>
                        <td>TOTAL</td>
                        <td style={{ fontFamily: "var(--font-mono)", color: "var(--color-accent-primary)" }}>${grandTotal.toFixed(2)}</td>
                        <td>100%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div style={{ marginTop: "1.25rem" }}>
                  <h3 style={{ fontSize: "14px", fontWeight: 600, marginBottom: "0.5rem" }}>Pricing Recommendations</h3>
                  <div className={styles.resultDetails}>
                    <div className={styles.resultRow}><span>Break-even</span><strong>${grandTotal.toFixed(2)}</strong></div>
                    <div className={styles.resultRow}><span>+20% profit</span><strong>${(grandTotal * 1.2).toFixed(2)}</strong></div>
                    <div className={styles.resultRow}><span>+30% profit</span><strong>${(grandTotal * 1.3).toFixed(2)}</strong></div>
                    <div className={styles.resultRow}><span>+50% profit</span><strong style={{ color: "var(--color-accent-primary)" }}>${(grandTotal * 1.5).toFixed(2)}</strong></div>
                  </div>
                </div>

                <div className="toolbar" style={{ marginTop: "1rem" }}>
                  <button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard.writeText(`${projectName || "Project"}: $${grandTotal.toFixed(2)}`)}><Copy size={13} /> Copy</button>
                  <button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={13} /> Print</button>
                  <button className="btn btn-secondary btn-sm" onClick={() => { setFabricLines([{ label: "Main fabric", amount: "" }]); setNotionLines([{ label: "Thread", amount: "3.50" }]); }}><RotateCcw size={13} /> Clear</button>
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
            <a href="/cost/per-garment" className="related-tool-link"><DollarSign size={14} /> Per Garment Cost</a>
            <a href="/cost/project-estimator" className="related-tool-link"><DollarSign size={14} /> Project Estimator</a>
          </div>
        </aside>
      </div>
    </div>
  );
}