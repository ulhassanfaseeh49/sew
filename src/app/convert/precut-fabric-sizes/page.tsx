import Breadcrumb from "@/components/ui/Breadcrumb";

const preCuts = [
    { name: "Charm Pack / Charm Square", size: '5" × 5"', count: "42 squares per pack", desc: "Perfect for small patchwork, scrappy quilts, and sampling prints" },
    { name: "Mini Charm Pack", size: '2.5" × 2.5"', count: "42 squares per pack", desc: "Tiny squares for postage stamp quilts and miniatures" },
    { name: "Layer Cake", size: '10" × 10"', count: "42 squares per pack", desc: "Large squares for big-block quilts, turns easily into HSTs" },
    { name: "Jelly Roll", size: '2.5" × 44"', count: "40 strips per roll", desc: "WOF strips for strip quilts, jelly roll races, binding" },
    { name: "Honey Bun", size: '1.5" × 44"', count: "40 strips per roll", desc: "Narrow strips for string quilts and accent strips" },
    { name: "Fat Quarter", size: '18" × 22"', count: "Individual or bundles", desc: "Versatile cut, great for medium-sized pieces" },
    { name: "Fat Eighth", size: '9" × 22"', count: "Individual or bundles", desc: "Half a fat quarter, good for small projects" },
    { name: "Dessert Roll", size: '5" × 44"', count: "40 strips per roll", desc: "WOF strips, wider than jelly roll strips" },
    { name: "Turnover", size: '6" × 6" triangle', count: "40 per pack", desc: "Pre-cut half-square triangles" },
    { name: "Jolly Bar", size: '5" × 10"', count: "40 per pack", desc: "Rectangles great for brick-style quilts" },
];

export default function PreCutFabricSizesPage() {
    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Conversion Tools", href: "/convert" }, { label: "Pre-Cut Fabric Sizes" }]} />
            <div style={{ maxWidth: "900px", margin: "0 auto", padding: "2rem 0 5rem" }}>
                <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                    <span className="category-badge" style={{ marginBottom: "1rem", display: "inline-flex" }}><span>📋</span> Reference Tool #23</span>
                    <h1>Pre-Cut Fabric Size Reference Guide</h1>
                    <p style={{ fontSize: "1.125rem", color: "var(--color-text-secondary)", maxWidth: "600px", margin: "1rem auto 0" }}>Complete guide to all pre-cut fabric sizes — charm packs, jelly rolls, layer cakes, and more.</p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {preCuts.map(pc => (
                        <div key={pc.name} className="glass-card" style={{ padding: "1.5rem", display: "flex", gap: "1.5rem", alignItems: "center" }}>
                            <div style={{ flex: 1 }}>
                                <h3 style={{ fontSize: "1.125rem", marginBottom: "0.25rem" }}>{pc.name}</h3>
                                <p style={{ fontSize: "0.875rem", color: "var(--color-text-tertiary)", marginBottom: "0.5rem" }}>{pc.desc}</p>
                            </div>
                            <div style={{ textAlign: "right", flexShrink: 0 }}>
                                <div style={{ fontFamily: "var(--font-mono)", fontSize: "1rem", fontWeight: 700, color: "var(--color-text-accent)" }}>{pc.size}</div>
                                <div style={{ fontSize: "0.75rem", color: "var(--color-text-tertiary)" }}>{pc.count}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
