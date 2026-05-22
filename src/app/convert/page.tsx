import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { conversionSubCategories } from "@/lib/tools/convert";
import styles from "./page.module.css";

export const metadata: Metadata = {
    title: "Fabric Measurement & Conversion Tools — Free Sewing Calculators",
    description: "24 free fabric measurement converters: yards to meters, inches to cm, fabric width converters, fat quarter calculators, and more. Convert any sewing measurement instantly.",
};

export default function ConvertHubPage() {
    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Fabric Measurement & Conversion" }]} />

            <section className={styles.hubHero}>
                <span className={styles.hubIcon}>📏</span>
                <h1>Fabric Measurement & Conversion Tools</h1>
                <p className={styles.hubDesc}>
                    24 free calculators to convert between yards, meters, inches, centimeters, and every
                    fabric measurement you need. Whether you&apos;re converting pattern requirements between
                    different fabric widths or figuring out how many pieces you can cut from a fat quarter,
                    we have the right tool for the job.
                </p>
                <div className={styles.hubStats}>
                    <div className={styles.hubStat}>
                        <span className={styles.hubStatValue}>24</span>
                        <span className={styles.hubStatLabel}>Tools</span>
                    </div>
                    <div className={styles.hubStat}>
                        <span className={styles.hubStatValue}>3</span>
                        <span className={styles.hubStatLabel}>Sub-categories</span>
                    </div>
                    <div className={styles.hubStat}>
                        <span className={styles.hubStatValue}>100%</span>
                        <span className={styles.hubStatLabel}>Free</span>
                    </div>
                </div>
            </section>

            {conversionSubCategories.map((subCat) => (
                <section key={subCat.name} className={styles.subCategory}>
                    <h2 className={styles.subCategoryTitle}>{subCat.name}</h2>
                    <div className="tool-grid">
                        {subCat.tools.map((tool) => (
                            <Link
                                key={tool.slug}
                                href={`/convert/${tool.slug}`}
                                className={`glass-card tool-card`}
                            >
                                <span className="tool-card-number">Tool #{tool.id}</span>
                                <h3 className="tool-card-title">{tool.name}</h3>
                                <p className="tool-card-desc">{tool.description}</p>
                                <span className="tool-card-link">
                                    Use Calculator <span>→</span>
                                </span>
                            </Link>
                        ))}
                    </div>
                </section>
            ))}

            {/* SEO Content */}
            <section className={styles.seoContent}>
                <h2>Why Use Fabric Measurement Converters?</h2>
                <p>
                    Sewing patterns come from all over the world, and fabric is sold in different units
                    depending on your location. US patterns typically list yardage requirements, while
                    European patterns use meters. Fabric widths vary from vintage 36&quot; bolts to modern
                    60&quot; widths and 108&quot; quilt backing. Our conversion tools eliminate guesswork and
                    prevent costly fabric-buying mistakes.
                </p>
                <h3>Common Conversion Scenarios</h3>
                <ul>
                    <li><strong>International patterns:</strong> Converting between yards and meters when buying fabric for a pattern from another country</li>
                    <li><strong>Different fabric widths:</strong> Your pattern calls for 44/45&quot; fabric but you found a beautiful 60&quot; option — how much less do you need?</li>
                    <li><strong>Pre-cut fabrics:</strong> Figuring out what you can make from charm packs, jelly rolls, fat quarters, and other pre-cuts</li>
                    <li><strong>Small measurements:</strong> Converting button sizes, snap sizes, and hardware measurements between metric and imperial</li>
                    <li><strong>Sewing fractions:</strong> Understanding what 5/8&quot; means in decimal or metric when your ruler shows different markings</li>
                </ul>
            </section>
        </div>
    );
}
