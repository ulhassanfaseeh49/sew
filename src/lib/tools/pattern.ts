export interface PatternTool {
    id: number;
    name: string;
    slug: string;
    description: string;
    icon: string;
}

export const patternTools: PatternTool[] = [
    { id: 95, name: "Pattern Size Grading Tool", slug: "size-grader", description: "Grade a pattern up or down between sizes", icon: "📊" },
    { id: 96, name: "Pattern Enlargement Calculator", slug: "enlargement-calculator", description: "Enlarge mini/booklet patterns to full size", icon: "🔍" },
    { id: 97, name: "Pattern Reduction Calculator", slug: "reduction-calculator", description: "Reduce patterns for storage or miniatures", icon: "🔎" },
    { id: 98, name: "Percentage Scaling Calculator", slug: "percentage-scaler", description: "Scale patterns by any custom percentage", icon: "📐" },
    { id: 99, name: "Copy Shop Scaling Guide", slug: "copy-shop-guide", description: "Print percentages for copy shop pattern printing", icon: "🖨️" },
    { id: 100, name: "PDF Pattern Printing Calculator", slug: "pdf-print-calculator", description: "Pages needed for printing PDF patterns at home", icon: "📄" },
    { id: 101, name: "Ease Calculator", slug: "ease-calculator", description: "Calculate wearing ease and design ease", icon: "📏" },
    { id: 102, name: "Ease Adjustment Tool", slug: "ease-adjuster", description: "Add or remove ease from a pattern", icon: "🔧" },
    { id: 103, name: "Petite/Tall Height Adjuster", slug: "height-adjuster", description: "Lengthen/shorten adjustments for height", icon: "📐" },
    { id: 104, name: "Full Bust Adjustment (FBA)", slug: "full-bust-adjustment", description: "Calculate FBA based on bust difference", icon: "👗" },
    { id: 105, name: "Small Bust Adjustment (SBA)", slug: "small-bust-adjustment", description: "Calculate SBA for reducing dart intake", icon: "👚" },
    { id: 106, name: "Swayback Adjustment", slug: "swayback-adjustment", description: "Calculate swayback pattern adjustments", icon: "🔄" },
    { id: 107, name: "Broad Shoulder Adjustment", slug: "broad-shoulder-adjustment", description: "Shoulder width adjustments", icon: "💪" },
    { id: 108, name: "Hip Adjustment Calculator", slug: "hip-adjustment", description: "Hip curve adjustments for different shapes", icon: "📐" },
    { id: 109, name: "Between Sizes Grader", slug: "between-sizes-grader", description: "Blend between two pattern sizes", icon: "🔀" },
    { id: 110, name: "Doll Clothes Scaling", slug: "doll-clothes-scaler", description: "Scale human patterns to doll sizes", icon: "🪆" },
    { id: 111, name: "Pattern Repeat Scaler", slug: "repeat-scaler", description: "Scale pattern repeats proportionally", icon: "🔁" },
    { id: 112, name: "Seam to Cutting Line Converter", slug: "seam-to-cutting-converter", description: "Convert between European seam line and American cutting line patterns", icon: "✂️" },
];
