export interface CuttingTool { id: number; name: string; slug: string; description: string; icon: string; }
export const cuttingTools: CuttingTool[] = [
    { id: 167, name: "Strip Cutting Calculator", slug: "strip-calculator", description: "How many strips from a yard of fabric", icon: "📏" },
    { id: 168, name: "Square Cutting Calculator", slug: "square-calculator", description: "How many squares from a piece of fabric", icon: "⬜" },
    { id: 169, name: "Rectangle Cutting Calculator", slug: "rectangle-calculator", description: "How many rectangles from fabric", icon: "▬" },
    { id: 170, name: "Triangle Cutting Calculator", slug: "triangle-calculator", description: "How many triangles from fabric", icon: "🔺" },
    { id: 171, name: "Bias Strip Calculator", slug: "bias-strip-calculator", description: "Bias strips at 45° and total yield", icon: "↗️" },
    { id: 172, name: "WOF Strip Calculator", slug: "wof-strip-calculator", description: "Strips cut along width of fabric", icon: "↔️" },
    { id: 173, name: "LOF Strip Calculator", slug: "lof-strip-calculator", description: "Strips cut along length of fabric", icon: "↕️" },
    { id: 174, name: "Sub-Cut Calculator", slug: "sub-cut-calculator", description: "Sub-cuts from strips into smaller pieces", icon: "✂️" },
    { id: 175, name: "Waste Minimization Planner", slug: "waste-minimizer", description: "Optimize cutting layout to minimize waste", icon: "♻️" },
    { id: 176, name: "Cutting Layout Optimizer", slug: "layout-optimizer", description: "Optimal arrangement of pattern pieces", icon: "📐" },
    { id: 177, name: "Rotary Cutting Guide", slug: "rotary-cutting-guide", description: "Reference for rotary cutting common shapes", icon: "🔄" },
    { id: 178, name: "Usable Width Calculator", slug: "usable-width", description: "Actual usable width after selvage", icon: "📏" },
    { id: 179, name: "Fussy Cut Calculator", slug: "fussy-cut-calculator", description: "Yardage for fussy cutting specific motifs", icon: "🎯" },
];
