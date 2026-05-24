"use client";
import { useState, useMemo } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { ShoppingBag, ClipboardCopy, Printer } from "lucide-react";

function toFrac(v: number): string {
  if (v <= 0) return "0"; const w = Math.floor(v); const f = v - w;
  const map: [number, string][] = [[0, ""], [0.125, "⅛"], [0.25, "¼"], [0.375, "⅜"], [0.5, "½"], [0.625, "⅝"], [0.75, "¾"], [0.875, "⅞"]];
  let best = map[0], bd = 1;
  for (const [n, s] of map) { const d = Math.abs(f - n); if (d < bd) { bd = d; best = [n, s]; } }
  if (Math.abs(f - 1) < bd) return `${w + 1}`; if (!best[1]) return w > 0 ? `${w}` : "0";
  return w > 0 ? `${w} ${best[1]}` : `${best[1]}`;
}

const sizes = [
  { key: "small", name: "Small (10×8×3)", w: 10, h: 8, d: 3 },
  { key: "medium", name: "Medium (14×12×4)", w: 14, h: 12, d: 4 },
  { key: "large", name: "Large (18×14×5)", w: 18, h: 14, d: 5 },
  { key: "xl", name: "XL Market (20×16×6)", w: 20, h: 16, d: 6 },
];

export default function Page() {
  const [sizeKey, setSizeKey] = useState("medium");
  const [pockets, setPockets] = useState(true);
  const [qty, setQty] = useState(1);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const faqItems = [
    { q: "How much fabric for a tote bag?", a: "Small: 1/2 yard. Medium: 3/4 yard. Large: 1 yard. XL: 1 1/4 yards. Add 1/4 yard for pockets." },
    { q: "Best fabric for tote bags?", a: "Canvas, duck cloth, or home dec fabric (7-10 oz). For lighter bags: quilting cotton with interfacing." },
  ];
  const spec = sizes.find(s => s.key === sizeKey) || sizes[1];
  const calc = useMemo(() => {
    const sa = 0.5;
    const bodyW = spec.w + spec.d + sa * 2;
    const bodyH = spec.h * 2 + spec.d + sa * 2;
    const pocketYd = pockets ? 0.125 : 0;
    const bodyArea = bodyW * bodyH * qty;
    const yd = Math.ceil((bodyArea / (44 * 36) + pocketYd * qty) * 4) / 4;
    const strapLen = spec.h < 10 ? 20 : spec.h < 14 ? 24 : 28;
    return { bodyW, bodyH, yd, strapLen };
  }, [spec, pockets, qty]);
  return (
    <div className="container">
      <Breadcrumb items={[{ label: "Bags", href: "/bag" }, { label: "Tote Bag" }]} />
      <div className="calculator-layout"><div className="calculator-main">
        <div className={styles.toolHeader}><span className="category-badge"><ShoppingBag size={14} /> Bag #367</span><h1>Tote Bag Yardage Calculator</h1><p>Calculate fabric for tote bags by size. Includes pockets and strap yardage.</p></div>
        <div className={`glass-card ${styles.calculatorCard}`}>
          <h2 className={styles.calcTitle}>Size &amp; Options</h2>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 8 }}>
            {sizes.map(s => (<button key={s.key} className={`btn btn-sm ${sizeKey === s.key ? "btn-primary" : "btn-ghost"}`} onClick={() => setSizeKey(s.key)} style={{ fontSize: 10 }}>{s.name}</button>))}
          </div>
          <div className="calculator-form-row">
            <div className="input-group"><label className="input-label">Qty</label><input type="number" className="input-field" value={qty} onChange={e => setQty(Math.max(1, parseInt(e.target.value) || 1))} min={1} style={{ width: 60 }} /></div>
          </div>
          <label style={{ fontSize: 11, display: "flex", alignItems: "center", gap: 4, marginTop: 6 }}><input type="checkbox" checked={pockets} onChange={e => setPockets(e.target.checked)} /> Include exterior pocket</label>
        </div>
        <div className={`glass-card ${styles.calculatorCard}`} style={{ borderLeft: "4px solid hsl(200,50%,45%)" }}>
          <h2 className={styles.calcTitle}>Fabric Needed</h2>
          <div style={{ padding: 14, background: "hsl(200,15%,95%)", borderRadius: 10, textAlign: "center", marginBottom: 12 }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "hsl(200,40%,35%)" }}>Total Fabric</div>
            <div style={{ fontSize: 36, fontWeight: 800, color: "hsl(200,50%,30%)" }}>{toFrac(calc.yd)}</div>
            <div style={{ fontSize: 10 }}>yards for {qty} bag{qty > 1 ? "s" : ""}</div>
          </div>
          <div className={styles.resultDetails}>
            <div className="result-row"><span>Cut body panel</span><strong>{calc.bodyW}&quot; × {calc.bodyH}&quot;</strong></div>
            <div className="result-row"><span>Strap length (each)</span><strong>{calc.strapLen}&quot;</strong></div>
          </div>
        </div>
        <div className="toolbar" style={{ marginBottom: 10 }}>
          <button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard.writeText(`${toFrac(calc.yd)} yd for ${qty} ${spec.name} tote bag(s)`)}><ClipboardCopy size={13} /> Copy</button>
          <button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={13} /> Print</button>
        </div>
        <section className="faq-section"><h2>FAQ</h2><div style={{ marginTop: "1.5rem" }}>{faqItems.map((f, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
      </div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/bag/bag-lining" className="related-tool-link">Bag Lining</a><a href="/bag/bag-interfacing" className="related-tool-link">Bag Interfacing</a><a href="/bag" className="related-tool-link">All Bags</a></div></aside></div>
    </div>
  );
}
