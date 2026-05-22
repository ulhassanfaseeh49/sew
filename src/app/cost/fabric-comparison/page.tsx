"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { DollarSign, Copy, Printer, RotateCcw, ChevronDown, ArrowRightLeft, Scale } from "lucide-react";
import styles from "../../convert/yards-to-meters/page.module.css";

interface FabricOption { name: string; pricePerYd: string; width: string; shipping: string; }

const defaultOptions: FabricOption[] = [
  { name: "Fabric A", pricePerYd: "", width: "44", shipping: "0" },
  { name: "Fabric B", pricePerYd: "", width: "44", shipping: "0" },
];

export default function Page() {
  const [projectYards, setProjectYards] = useState("");
  const [refWidth, setRefWidth] = useState("44");
  const [options, setOptions] = useState<FabricOption[]>(defaultOptions);
  const [taxPct, setTaxPct] = useState("");
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const projYd = parseFloat(projectYards) || 0;
  const refW = parseFloat(refWidth) || 44;
  const tax = parseFloat(taxPct) || 0;

  const results = options.map(o => {
    const ppy = parseFloat(o.pricePerYd) || 0;
    const w = parseFloat(o.width) || 44;
    const sh = parseFloat(o.shipping) || 0;
    const adjYards = projYd > 0 ? projYd * (refW / w) : 0;
    const adjYardsCeil = Math.ceil(adjYards * 4) / 4; // round to nearest 1/4
    const fabricCost = adjYardsCeil * ppy;
    const taxAmt = fabricCost * (tax / 100);
    const trueCost = fabricCost + sh + taxAmt;
    const truePerYd = adjYardsCeil > 0 ? trueCost / adjYardsCeil : 0;
    return { ...o, ppy, w, sh, adjYards: adjYardsCeil, fabricCost, taxAmt, trueCost, truePerYd };
  });

  const hasResult = projYd > 0 && results.some(r => r.ppy > 0);
  const bestValue = hasResult ? results.filter(r => r.ppy > 0).sort((a, b) => a.trueCost - b.trueCost)[0]?.name : "";

  const updateOption = (i: number, field: keyof FabricOption, val: string) => {
    const n = [...options]; n[i] = { ...n[i], [field]: val }; setOptions(n);
  };
  const addOption = () => { if (options.length < 5) setOptions([...options, { name: `Fabric ${String.fromCharCode(65 + options.length)}`, pricePerYd: "", width: "44", shipping: "0" }]); };
  const removeOption = (i: number) => { if (options.length > 2) setOptions(options.filter((_, j) => j !== i)); };
  const clearAll = () => { setProjectYards(""); setRefWidth("44"); setOptions(defaultOptions); setTaxPct(""); };

  const faqItems = [
    { q: "How do I compare fabrics at different widths?", a: "A wider fabric like 60 inch needs fewer yards than a 44 inch for the same project. This tool automatically adjusts yardage based on width differences." },
    { q: "Does shipping really change which fabric is cheaper?", a: "Yes, often dramatically. A cheap fabric with $8 shipping on 2 yards adds $4/yd. Always compare true all-in costs, not just price tags." },
    { q: "Should I choose the cheapest fabric?", a: "Not always. Consider fiber content, drape, durability, and how it suits your project. This tool shows you the cost difference so you can decide if the upgrade is worth it." },
    { q: "How do I compare online vs in-store fabric?", a: "Enter shipping cost for online purchases and $0 for in-store. Add your local tax rate. The true cost comparison often surprises people." },
  ];

  return (
    <div className="container">
      <Breadcrumb items={[{ label: "Cost Calculators", href: "/cost" }, { label: "Fabric Comparison" }]} />
      <div className="calculator-layout">
        <div className="calculator-main">
          <div className={styles.toolHeader}>
            <span className="category-badge"><Scale size={14} strokeWidth={1.5} /> Cost Tool</span>
            <h1>Fabric Cost Comparison Tool</h1>
            <p>Compare up to 5 fabric options side-by-side. Adjusts yardage for different widths and includes shipping and tax for true cost comparison.</p>
          </div>

          <div className={`glass-card ${styles.calculatorCard}`}>
            <h2 className={styles.calcTitle}>Project Requirements</h2>
            <div className="calculator-form">
              <div className="calculator-form-row">
                <div className="input-group"><label className="input-label">Yards needed (at reference width)</label><input type="number" className="input-field" placeholder="e.g. 3" value={projectYards} onChange={e => setProjectYards(e.target.value)} min="0" step="0.125" /></div>
                <div className="input-group">
                  <label className="input-label">Reference width (inches)</label>
                  <select className="input-field" value={refWidth} onChange={e => setRefWidth(e.target.value)}>
                    <option value="36">36&quot;</option><option value="44">44/45&quot;</option><option value="54">54&quot;</option><option value="60">60&quot;</option><option value="108">108&quot;</option>
                  </select>
                </div>
                <div className="input-group"><label className="input-label">Tax (%)</label><input type="number" className="input-field" placeholder="0" value={taxPct} onChange={e => setTaxPct(e.target.value)} min="0" step="0.1" /></div>
              </div>
            </div>
          </div>

          {options.map((o, i) => (
            <div key={i} className={`glass-card ${styles.calculatorCard}`}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <h2 className={styles.calcTitle} style={{ margin: 0 }}>{o.name}</h2>
                {options.length > 2 && <button className="btn btn-secondary btn-sm" onClick={() => removeOption(i)} style={{ fontSize: "12px" }}>Remove</button>}
              </div>
              <div className="calculator-form">
                <div className="calculator-form-row">
                  <div className="input-group">
                    <label className="input-label">Name</label>
                    <input type="text" className="input-field" value={o.name} onChange={e => updateOption(i, "name", e.target.value)} />
                  </div>
                  <div className="input-group"><label className="input-label">$/yard</label><input type="number" className="input-field" placeholder="0.00" value={o.pricePerYd} onChange={e => updateOption(i, "pricePerYd", e.target.value)} min="0" step="0.01" /></div>
                  <div className="input-group">
                    <label className="input-label">Width</label>
                    <select className="input-field" value={o.width} onChange={e => updateOption(i, "width", e.target.value)}>
                      <option value="36">36&quot;</option><option value="44">44/45&quot;</option><option value="54">54&quot;</option><option value="60">60&quot;</option><option value="108">108&quot;</option>
                    </select>
                  </div>
                  <div className="input-group"><label className="input-label">Shipping ($)</label><input type="number" className="input-field" placeholder="0" value={o.shipping} onChange={e => updateOption(i, "shipping", e.target.value)} min="0" step="0.01" /></div>
                </div>
              </div>
            </div>
          ))}
          {options.length < 5 && (
            <button className="btn btn-secondary" onClick={addOption} style={{ marginBottom: "1.5rem" }}>+ Add Fabric Option</button>
          )}

          {hasResult && (
            <div className={`glass-card ${styles.calculatorCard}`}>
              <h2 className={styles.calcTitle}><ArrowRightLeft size={16} style={{ marginRight: 6 }} />Comparison Results</h2>
              <div className="reference-table-wrapper">
                <table className="reference-table">
                  <thead>
                    <tr><th></th>{results.filter(r => r.ppy > 0).map(r => <th key={r.name}>{r.name}</th>)}</tr>
                  </thead>
                  <tbody>
                    <tr><td>Price/yard</td>{results.filter(r => r.ppy > 0).map(r => <td key={r.name} style={{ fontFamily: "var(--font-mono)" }}>${r.ppy.toFixed(2)}</td>)}</tr>
                    <tr><td>Width</td>{results.filter(r => r.ppy > 0).map(r => <td key={r.name}>{r.w}&quot;</td>)}</tr>
                    <tr><td>Adj. yardage</td>{results.filter(r => r.ppy > 0).map(r => <td key={r.name} style={{ fontFamily: "var(--font-mono)" }}>{r.adjYards.toFixed(2)} yd</td>)}</tr>
                    <tr><td>Fabric cost</td>{results.filter(r => r.ppy > 0).map(r => <td key={r.name} style={{ fontFamily: "var(--font-mono)" }}>${r.fabricCost.toFixed(2)}</td>)}</tr>
                    <tr><td>Shipping</td>{results.filter(r => r.ppy > 0).map(r => <td key={r.name} style={{ fontFamily: "var(--font-mono)" }}>${r.sh.toFixed(2)}</td>)}</tr>
                    {tax > 0 && <tr><td>Tax</td>{results.filter(r => r.ppy > 0).map(r => <td key={r.name} style={{ fontFamily: "var(--font-mono)" }}>${r.taxAmt.toFixed(2)}</td>)}</tr>}
                    <tr style={{ fontWeight: 700 }}><td>True Total</td>{results.filter(r => r.ppy > 0).map(r => <td key={r.name} style={{ fontFamily: "var(--font-mono)", color: r.name === bestValue ? "var(--color-accent-primary)" : "inherit" }}>${r.trueCost.toFixed(2)}{r.name === bestValue ? " " : ""}</td>)}</tr>
                    <tr><td>True $/yard</td>{results.filter(r => r.ppy > 0).map(r => <td key={r.name} style={{ fontFamily: "var(--font-mono)" }}>${r.truePerYd.toFixed(2)}</td>)}</tr>
                  </tbody>
                </table>
              </div>
              {bestValue && (
                <div className="smart-tip" style={{ marginTop: "1rem" }}>
                  <strong>Best value: {bestValue}</strong> — lowest true total cost including yardage adjustment, shipping, and tax.
                </div>
              )}
              <div className="toolbar" style={{ marginTop: "1rem" }}>
                <button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard.writeText(`Best: ${bestValue}`)}><Copy size={13} /> Copy</button>
                <button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={13} /> Print</button>
                <button className="btn btn-secondary btn-sm" onClick={clearAll}><RotateCcw size={13} /> Clear</button>
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
            <a href="/cost/online-vs-local" className="related-tool-link"><ArrowRightLeft size={14} /> Online vs Local</a>
            <a href="/cost/budget-comparator" className="related-tool-link"><DollarSign size={14} /> Budget Comparator</a>
            <a href="/convert/fabric-width-44-to-60" className="related-tool-link"><ArrowRightLeft size={14} /> Width Converter</a>
          </div>
        </aside>
      </div>
    </div>
  );
}