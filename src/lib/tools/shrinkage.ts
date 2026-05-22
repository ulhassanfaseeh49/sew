export interface ShrinkageTool { id: number; name: string; slug: string; description: string; icon: string; }
export const shrinkageTools: ShrinkageTool[] = [
    { id: 230, name: "Pre-Wash Shrinkage Estimator", slug: "pre-wash-estimator", description: "Estimate shrinkage by fabric type", icon: "💧" },
    { id: 231, name: "Buy Extra for Shrinkage", slug: "buy-extra", description: "How much extra fabric to buy", icon: "➕" },
    { id: 232, name: "Post-Wash Yardage Calculator", slug: "post-wash-yardage", description: "Resulting yardage after washing", icon: "📏" },
    { id: 233, name: "Shrinkage Percentage Calculator", slug: "percentage-calculator", description: "Calculate actual shrinkage %", icon: "📊" },
    { id: 234, name: "Fabric Shrinkage Database", slug: "fabric-database", description: "Expected shrinkage by fabric type", icon: "📋" },
    { id: 235, name: "Pre-Washing Guide", slug: "pre-washing-guide", description: "How to pre-wash different fabrics", icon: "🧺" },
    { id: 236, name: "Quilt Shrinkage Calculator", slug: "quilt-shrinkage", description: "Quilt shrinkage after first wash", icon: "🟩" },
    { id: 237, name: "Garment Shrinkage Adjuster", slug: "garment-adjuster", description: "Pattern size adjustments for shrinkage", icon: "👗" },
];
