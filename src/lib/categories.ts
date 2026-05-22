// Category data used across the site
export interface Category {
    id: number;
    name: string;
    slug: string;
    icon: string;
    toolCount: number;
    description: string;
}

export const categories: Category[] = [
    { id: 1, name: "Fabric Measurement & Conversion", slug: "convert", icon: "📏", toolCount: 24, description: "Convert between yards, meters, inches, cm & fabric widths" },
    { id: 2, name: "Fabric Yardage Calculators", slug: "yardage", icon: "🧵", toolCount: 42, description: "Calculate fabric yardage for any project type" },
    { id: 3, name: "Fabric Cost Calculators", slug: "cost", icon: "💰", toolCount: 16, description: "Estimate project costs and compare fabric prices" },
    { id: 4, name: "Seam Allowance Tools", slug: "seam-allowance", icon: "✂️", toolCount: 12, description: "Calculate and convert seam allowances for any technique" },
    { id: 5, name: "Pattern Scaling & Grading", slug: "pattern", icon: "📐", toolCount: 18, description: "Scale, grade, and adjust sewing patterns" },
    { id: 6, name: "Body Measurement Tools", slug: "body", icon: "👤", toolCount: 16, description: "Measure, track, and convert body measurements" },
    { id: 7, name: "Quilt Math Tools", slug: "quilt", icon: "🟩", toolCount: 38, description: "Plan quilts, calculate blocks, binding, and yardage" },
    { id: 8, name: "Quilt Cutting Tools", slug: "cutting", icon: "🔪", toolCount: 13, description: "Optimize cutting layouts and calculate piece counts" },
    { id: 9, name: "Thread & Notion Calculators", slug: "notions", icon: "🪡", toolCount: 21, description: "Calculate thread, button, zipper, and notion needs" },
    { id: 10, name: "Garment Construction", slug: "garment", icon: "👗", toolCount: 29, description: "Darts, pleats, hems, waistbands, collars & more" },
    { id: 11, name: "Fabric Shrinkage Tools", slug: "shrinkage", icon: "🌊", toolCount: 8, description: "Estimate shrinkage and pre-wash calculations" },
    { id: 12, name: "Curtain & Window Treatments", slug: "curtains", icon: "🪟", toolCount: 17, description: "Calculate curtain yardage, fullness, and hardware" },
    { id: 13, name: "Upholstery & Home Décor", slug: "home-decor", icon: "🛋️", toolCount: 25, description: "Cushions, tablecloths, bedding, and upholstery" },
    { id: 14, name: "Bias Tape & Binding", slug: "bias-binding", icon: "🎀", toolCount: 10, description: "Calculate bias tape width, yardage, and binding" },
    { id: 15, name: "Elastic & Waistband Tools", slug: "elastic", icon: "〰️", toolCount: 9, description: "Calculate elastic lengths and waistband dimensions" },
    { id: 16, name: "Knit & Stretch Fabric", slug: "stretch", icon: "🧶", toolCount: 10, description: "Stretch percentage, negative ease, and knit tools" },
    { id: 17, name: "Embroidery & Appliqué", slug: "embroidery", icon: "🪻", toolCount: 13, description: "Thread coverage, hoop sizing, and cross-stitch" },
    { id: 18, name: "Lace & Trim Calculators", slug: "lace-trim", icon: "✨", toolCount: 11, description: "Calculate lace, ribbon, fringe, and trim yardage" },
    { id: 19, name: "Costume & Cosplay", slug: "costume", icon: "🎭", toolCount: 18, description: "Costume yardage, corsets, capes, and armor tools" },
    { id: 20, name: "Circle & Skirt Calculators", slug: "skirt", icon: "💃", toolCount: 16, description: "Circle skirts, pleated, tiered, and wrap skirts" },
    { id: 21, name: "Bag & Accessory Tools", slug: "bags", icon: "👜", toolCount: 19, description: "Tote bags, pouches, wallets, hats, and more" },
    { id: 22, name: "Baby & Children Sewing", slug: "baby-kids", icon: "👶", toolCount: 14, description: "Baby quilts, clothing, bibs, and children's sizing" },
    { id: 23, name: "Pricing & Selling Tools", slug: "pricing", icon: "🏷️", toolCount: 15, description: "Price handmade items, calculate profits and fees" },
    { id: 24, name: "Fabric Weight & Type", slug: "fabric-type", icon: "⚖️", toolCount: 13, description: "GSM converters, fabric guides, and comparators" },
    { id: 25, name: "Needle & Thread Selection", slug: "needles-thread", icon: "📌", toolCount: 10, description: "Choose the right needle and thread for your fabric" },
    { id: 26, name: "Sewing Machine Tools", slug: "machine", icon: "🏭", toolCount: 12, description: "Stitch settings, tension guides, and troubleshooting" },
    { id: 27, name: "Sustainable & Zero Waste", slug: "sustainable", icon: "♻️", toolCount: 11, description: "Reduce waste, upcycle, and sew sustainably" },
    { id: 28, name: "Reference & Education", slug: "reference", icon: "📚", toolCount: 24, description: "Glossaries, size charts, beginner guides, and references" },
];

export function getCategoryBySlug(slug: string): Category | undefined {
    return categories.find(c => c.slug === slug);
}

export function getTotalToolCount(): number {
    return categories.reduce((sum, c) => sum + c.toolCount, 0);
}
