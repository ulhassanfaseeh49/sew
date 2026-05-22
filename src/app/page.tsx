import Link from "next/link";
import { categories, getTotalToolCount } from "@/lib/categories";
import styles from "./page.module.css";

export default function HomePage() {
  const totalTools = getTotalToolCount();

  const popularTools = [
    { name: "Yards to Meters Converter", href: "/convert/yards-to-meters", icon: "📏" },
    { name: "Quilt Size Calculator", href: "/quilt/size-calculator", icon: "🟩" },
    { name: "Circle Skirt Calculator", href: "/skirt/full-circle", icon: "💃" },
    { name: "Seam Allowance Converter", href: "/seam-allowance/converter", icon: "✂️" },
    { name: "Fabric Cost Calculator", href: "/cost/per-yard", icon: "💰" },
    { name: "Curtain Yardage Calculator", href: "/curtains/yardage-calculator", icon: "🪟" },
    { name: "Body Measurement Guide", href: "/body/measurement-guide", icon: "👤" },
    { name: "Bias Tape Calculator", href: "/bias-binding/tape-yardage", icon: "🎀" },
  ];

  const stats = [
    { value: `${totalTools}+`, label: "Free Tools" },
    { value: "28", label: "Categories" },
    { value: "∞", label: "Calculations" },
    { value: "0", label: "Cost to You" },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroGlow} />
        <div className={`container ${styles.heroContent}`}>
          <div className={styles.heroBadge}>
            <span className={styles.heroBadgeDot} />
            <span>{totalTools}+ Free Sewing Tools</span>
          </div>
          <h1 className={styles.heroTitle}>
            Every Sewing Calculator
            <br />
            <span className={styles.heroAccent}>You'll Ever Need</span>
          </h1>
          <p className={styles.heroSubtitle}>
            From fabric yardage to quilt math, garment construction to pricing —
            free precision calculators for quilters, sewists, and crafters worldwide.
          </p>
          <div className={styles.heroActions}>
            <Link href="/tools-index" className="btn btn-primary btn-lg">
              Browse All Tools →
            </Link>
            <Link href="/tools-by-category" className="btn btn-secondary btn-lg">
              Explore Categories
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
      </section>

      {/* Popular Tools */}
      <section className={`section ${styles.popularSection}`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2>⚡ Popular Tools</h2>
            <p>Jump straight to the most-used calculators</p>
          </div>
          <div className={styles.popularGrid}>
            {popularTools.map((tool, i) => (
              <Link key={i} href={tool.href} className={`glass-card ${styles.popularCard}`}>
                <span className={styles.popularIcon}>{tool.icon}</span>
                <span className={styles.popularName}>{tool.name}</span>
                <span className={styles.popularArrow}>→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* All Categories */}
      <section className={`section ${styles.categoriesSection}`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2>🗂️ All 28 Categories</h2>
            <p>{totalTools} tools organized by what you need</p>
          </div>
          <div className={styles.categoryGrid}>
            {categories.map((cat, i) => (
              <Link
                key={cat.slug}
                href={`/${cat.slug}`}
                className={`glass-card ${styles.categoryCard} animate-fade-in-up delay-${Math.min(i % 5 + 1, 5)}`}
              >
                <div className={styles.categoryIcon}>{cat.icon}</div>
                <div className={styles.categoryInfo}>
                  <h3 className={styles.categoryName}>{cat.name}</h3>
                  <p className={styles.categoryDesc}>{cat.description}</p>
                </div>
                <div className={styles.categoryMeta}>
                  <span className={styles.categoryCount}>{cat.toolCount} tools</span>
                  <span className={styles.categoryArrow}>→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Browse by Project */}
      <section className={`section ${styles.popularSection}`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2>🎨 Browse by Project</h2>
            <p>Find tools for what you're making</p>
          </div>
          <div className={styles.popularGrid}>
            {[
              { name: "Quilting", href: "/tools-by-project/quilting", icon: "🧩" },
              { name: "Garment Sewing", href: "/tools-by-project/garment-sewing", icon: "👗" },
              { name: "Home Décor", href: "/tools-by-project/home-decor", icon: "🏠" },
              { name: "Bag Making", href: "/tools-by-project/bag-making", icon: "👜" },
              { name: "Baby & Kids", href: "/tools-by-project/baby-children", icon: "👶" },
              { name: "Costume & Cosplay", href: "/tools-by-project/costume-cosplay", icon: "🎭" },
              { name: "Embroidery", href: "/tools-by-project/embroidery", icon: "🪡" },
              { name: "Sustainable", href: "/tools-by-project/sustainable", icon: "♻️" },
            ].map((p, i) => (
              <Link key={i} href={p.href} className={`glass-card ${styles.popularCard}`}>
                <span className={styles.popularIcon}>{p.icon}</span>
                <span className={styles.popularName}>{p.name}</span>
                <span className={styles.popularArrow}>→</span>
              </Link>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
            <Link href="/tools-by-project" className="btn btn-secondary btn-sm">View All Project Types →</Link>
          </div>
        </div>
      </section>

      {/* Browse by User */}
      <section className={`section ${styles.popularSection}`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2>👤 Tools For You</h2>
            <p>Curated tool sets for your experience level</p>
          </div>
          <div className={styles.popularGrid}>
            {[
              { name: "Complete Beginners", href: "/tools-by-user/beginners", icon: "🌟" },
              { name: "Quilters", href: "/tools-by-user/quilters", icon: "🧩" },
              { name: "Fashion Designers", href: "/tools-by-user/fashion-designers", icon: "👗" },
              { name: "Etsy Sellers", href: "/tools-by-user/etsy-sellers", icon: "🏪" },
              { name: "Professionals", href: "/tools-by-user/professionals", icon: "✂️" },
              { name: "Textile Students", href: "/tools-by-user/students", icon: "📚" },
            ].map((u, i) => (
              <Link key={i} href={u.href} className={`glass-card ${styles.popularCard}`}>
                <span className={styles.popularIcon}>{u.icon}</span>
                <span className={styles.popularName}>{u.name}</span>
                <span className={styles.popularArrow}>→</span>
              </Link>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
            <Link href="/tools-by-user" className="btn btn-secondary btn-sm">View All User Types →</Link>
          </div>
        </div>
      </section>

      {/* Why SewTools */}
      <section className={`section ${styles.whySection}`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2>✨ Why SewTools?</h2>
            <p>Built by sewists, for sewists</p>
          </div>
          <div className={styles.featureGrid}>
            <div className={`glass-card ${styles.featureCard}`}>
              <div className={styles.featureIcon}>🎯</div>
              <h3>Precision Math</h3>
              <p>Every formula verified by experienced quilters and sewists. No rounding errors, no guesswork.</p>
            </div>
            <div className={`glass-card ${styles.featureCard}`}>
              <div className={styles.featureIcon}>📱</div>
              <h3>Mobile-First</h3>
              <p>Designed for use at the cutting table. Large buttons, clear results, works on any device.</p>
            </div>
            <div className={`glass-card ${styles.featureCard}`}>
              <div className={styles.featureIcon}>🖨️</div>
              <h3>Print & Save</h3>
              <p>Print clean results to take to your sewing room. Save calculations for later reference.</p>
            </div>
            <div className={`glass-card ${styles.featureCard}`}>
              <div className={styles.featureIcon}>🆓</div>
              <h3>100% Free</h3>
              <p>No subscriptions, no paywalls, no ads. Every tool is completely free to use, forever.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
