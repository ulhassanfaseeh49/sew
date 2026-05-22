export interface SeamTool {
    id: number;
    name: string;
    slug: string;
    description: string;
    icon: string;
}

export const seamTools: SeamTool[] = [
    { id: 83, name: "Seam Allowance Converter", slug: "converter", description: "Convert between common seam allowances in imperial and metric", icon: "" },
    { id: 84, name: "Seam Allowance Adder", slug: "adder", description: "Add seam allowance to finished measurements for cutting", icon: "" },
    { id: 85, name: "Seam Allowance Subtractor", slug: "subtractor", description: "Remove seam allowance to find finished dimensions", icon: "" },
    { id: 86, name: "Standard Seam Allowance Guide", slug: "standard-guide", description: "Standard seam allowances by project type", icon: "" },
    { id: 87, name: "Seam Allowance Comparison", slug: "comparison", description: "Visual comparison of different seam allowances", icon: "" },
    { id: 88, name: "Seam Allowance to Metric", slug: "metric-converter", description: "Convert imperial seam allowances to metric equivalents", icon: "" },
    { id: 89, name: "French Seam Calculator", slug: "french-seam", description: "Calculate allowance for French seams: two-pass construction", icon: "🇫🇷" },
    { id: 90, name: "Flat-Felled Seam Calculator", slug: "flat-felled", description: "Calculate allowance for flat-felled seams", icon: "" },
    { id: 91, name: "Hong Kong Seam Finish", slug: "hong-kong", description: "Calculate bias strip width for Hong Kong seam finishes", icon: "" },
    { id: 92, name: "Curved Seams Guide", slug: "curved-seams", description: "Guide for grading/clipping seam allowances on curves", icon: "" },
    { id: 93, name: "Seam Finish Comparison", slug: "finish-comparison", description: "Compare all seam finish types side by side", icon: "" },
    { id: 94, name: "Seam Allowance Grading", slug: "grading", description: "Calculate graded seam allowances for reducing bulk", icon: "" },
];
