import Link from "next/link";
import { categories, getTotalToolCount } from "@/lib/categories";
import {
  Ruler, Grid3X3, Triangle, Scissors, Calculator, Blinds, User,
  CornerDownRight, ArrowRight, Smartphone, Printer, Unlock, Link2,
  Sparkles, BookOpen
} from "lucide-react";
import styles from "./page.module.css";

export default function HomePage() {
  const totalTools = getTotalToolCount();

  const popularTools = [
    { name: "Yards to Meters Converter", href: "/convert/yards-to-meters", desc: "Convert fabric yardage to meters instantly for international patterns.", category: "CONVERSION", icon: Ruler },
    { name: "Quilt Size Calculator", href: "/quilt/size-calculator", desc: "Calculate exact quilt dimensions for any bed size with proper overhang.", category: "QUILTING", icon: Grid3X3 },
    { name: "Circle Skirt Calculator", href: "/skirt/full-circle", desc: "Get exact radius and fabric yardage for full, half, and quarter skirts.", category: "GARMENTS", icon: Triangle },
    { name: "Seam Allowance Converter", href: "/seam-allowance/converter", desc: "Convert between common seam allowances in imperial and metric.", category: "SEWING", icon: Scissors },
    { name: "Fabric Cost Calculator", href: "/cost/per-yard", desc: "Calculate total fabric cost with tax, shipping, and bulk pricing.", category: "COST", icon: Calculator },
    { name: "Curtain Yardage Calculator", href: "/curtains/yardage-calculator", desc: "Determine fabric needed for window treatments with fullness ratios.", category: "HOME DÉCOR", icon: Blinds },
    { name: "Body Measurement Guide", href: "/body/measurement-guide", desc: "Complete guide to taking accurate body measurements for sewing.", category: "BODY", icon: User },
    { name: "Bias Tape Calculator", href: "/bias-binding/tape-yardage", desc: "Calculate fabric squares needed to make continuous bias tape.", category: "BINDING", icon: CornerDownRight },
  ];

  const stats = [
    { value: `${totalTools}`, label: "Free Tools" },
    { value: "28", label: "Categories" },
    { value: "100%", label: "Free Forever" },
  ];

  const features = [
    { title: "Imperial & Metric", desc: "Toggle between measurement systems on any tool", icon: Ruler },
    { title: "Print Ready", desc: "Every result generates a clean printable reference sheet", icon: Printer },
    { title: "Mobile First", desc: "Designed for use at the cutting table, one-handed", icon: Smartphone },
    { title: "Completely Free", desc: "No premium tiers, no paywalls, no limits", icon: Unlock },
    { title: "Smart Cross-Links", desc: "Related tools suggested to complete your workflow", icon: Link2 },
    { title: "Reference Library", desc: "Glossary, size charts, and fabric encyclopedia included", icon: BookOpen },
  ];

  const steps = [
    { num: "01", title: "Find Your Tool", desc: `Search or browse ${totalTools} free calculators across 28 categories.` },
    { num: "02", title: "Enter Your Numbers", desc: "Input your measurements with imperial or metric units." },
    { num: "03", title: "Get Precise Results", desc: "Receive accurate calculations you can save, print, or share." },
  ];

  return (
    <>
      {/* Hero Section — Two Column */}
      <section className={styles.hero}>
        <div className={styles.heroGrid} aria-hidden="true" />
        <div className={styles.heroDecoration} aria-hidden="true" />
        <div className={styles.heroContent}>
          <div className={styles.heroLeft}>
            <div className={styles.heroBadge}>
              <span className={styles.heroBadgeDot} />
              <span>{totalTools} Free Sewing Calculators</span>
            </div>
            <h1 className={styles.heroTitle}>
              Precision sewing tools,
              <br />
              from first stitch to
              <br />
              <span className={styles.heroAccent}>finished seam.</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Free calculators for fabric yardage, quilt math, garment fitting,
              pattern scaling, project costing, and {totalTools - 14}+ more — built for sewists
              who measure twice.
            </p>
            <div className={styles.heroActions}>
              <Link href="/tools-index" className="btn btn-primary btn-lg">
                Explore All Tools
                <ArrowRight size={18} />
              </Link>
              <Link href="/tools-by-category" className="btn btn-ghost btn-lg">
                Browse Categories
              </Link>
            </div>
            <div className={styles.heroStats}>
              {stats.map((stat, i) => (
                <div key={i} className={styles.heroStat}>
                  <div className={styles.heroStatValue}>{stat.value}</div>
                  <div className={styles.heroStatLabel}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.heroRight}>
            <div className={styles.heroPreviewBehind} />
            <div className={styles.heroPreviewCard}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
                Circle Skirt Calculator
              </div>
              <div style={{ display: 'grid', gap: 12, marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: 4 }}>Waist</div>
                  <div style={{ padding: '10px 14px', background: 'var(--color-bg-secondary)', borderRadius: 8, border: '1px solid var(--color-border)', fontFamily: 'var(--font-mono)', fontSize: 15 }}>28 in</div>
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: 4 }}>Length</div>
                  <div style={{ padding: '10px 14px', background: 'var(--color-bg-secondary)', borderRadius: 8, border: '1px solid var(--color-border)', fontFamily: 'var(--font-mono)', fontSize: 15 }}>24 in</div>
                </div>
              </div>
              <div style={{ padding: 16, background: 'var(--color-accent-light)', borderRadius: 10, textAlign: 'center' }}>
                <div style={{ fontSize: 12, color: 'var(--color-text-tertiary)', marginBottom: 4 }}>You need</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 28, fontWeight: 700, color: 'var(--color-text-primary)' }}>2.8 yards</div>
                <div style={{ fontSize: 12, color: 'var(--color-text-tertiary)', marginTop: 2 }}>of 44/45&quot; wide fabric</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Tools */}
      <section className="section">
        <div className="container">
          <div className={styles.sectionHeader}>
            <div className={styles.sectionHeaderRow}>
              <div>
                <p className={styles.sectionOverline}>MOST USED</p>
                <h2>Popular Tools</h2>
              </div>
              <Link href="/tools-index" className={styles.sectionHeaderLink}>
                View all tools <ArrowRight size={14} />
              </Link>
            </div>
          </div>
          <div className={styles.popularGrid}>
            {popularTools.map((tool, i) => {
              const IconComp = tool.icon;
              return (
                <Link key={i} href={tool.href} className={styles.popularCard}>
                  <div className={styles.popularCardTop}>
                    <div className={styles.popularIcon}>
                      <IconComp size={24} strokeWidth={1.5} />
                    </div>
                    <span className={styles.popularTag}>{tool.category}</span>
                  </div>
                  <div className={styles.popularName}>{tool.name}</div>
                  <p className={styles.popularDesc}>{tool.desc}</p>
                  <span className={styles.popularLink}>
                    Use this tool <ArrowRight size={16} />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="section section-alt">
        <div className="container">
          <div className={styles.sectionHeader}>
            <p className={styles.sectionOverline}>{categories.length} CATEGORIES</p>
            <h2>Find the Right Tool</h2>
            <p>Browse our complete collection of sewing calculators, organized by what you need to calculate.</p>
          </div>
          <div className={styles.categoryGrid}>
            {categories.map((cat) => (
              <Link key={cat.slug} href={`/${cat.slug}`} className={styles.categoryCard}>
                <div className={styles.categoryCardTop}>
                  <div className={styles.categoryIcon} style={{ background: 'var(--color-accent-light)', color: 'var(--color-accent-primary)' }}>
                    <Sparkles size={20} strokeWidth={1.5} />
                  </div>
                  <span className={styles.categoryCount}>{cat.toolCount} tools</span>
                </div>
                <div className={styles.categoryName}>{cat.name}</div>
                <p className={styles.categoryDesc}>{cat.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section">
        <div className="container">
          <div className={styles.sectionHeader} style={{ textAlign: 'center' }}>
            <p className={styles.sectionOverline}>SIMPLE &amp; PRECISE</p>
            <h2>How It Works</h2>
          </div>
          <div className={styles.stepsGrid}>
            {steps.map((step, i) => (
              <div key={i} className={styles.stepCard}>
                <div className={styles.stepNumber}>{step.num}</div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section section-alt">
        <div className="container">
          <div className={styles.sectionHeader}>
            <p className={styles.sectionOverline}>BUILT FOR SEWISTS</p>
            <h2>Features That Matter</h2>
          </div>
          <div className={styles.featureGrid}>
            {features.map((feat, i) => {
              const FeatIcon = feat.icon;
              return (
                <div key={i} className={styles.featureCard}>
                  <div className={styles.featureIcon}>
                    <FeatIcon size={24} strokeWidth={1.5} />
                  </div>
                  <h3>{feat.title}</h3>
                  <p>{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA / Newsletter */}
      <section className="section">
        <div className={styles.ctaSection}>
          <p className={styles.ctaOverline}>STAY UPDATED</p>
          <h3 className={styles.ctaTitle}>New tools, guides, and tips</h3>
          <p className={styles.ctaSubtitle}>
            Join sewists who get our monthly newsletter with new calculator announcements and sewing tips.
          </p>
          <div className={styles.ctaForm}>
            <input type="email" className={styles.ctaInput} placeholder="Your email address" />
            <button className={styles.ctaButton}>Subscribe</button>
          </div>
          <p className={styles.ctaNote}>No spam. Unsubscribe anytime.</p>
        </div>
      </section>
    </>
  );
}
