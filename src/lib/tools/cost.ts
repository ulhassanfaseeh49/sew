export interface CostTool {
    id: number;
    name: string;
    slug: string;
    description: string;
    icon: string;
}

export const costTools: CostTool[] = [
    { id: 67, name: "Cost Per Yard Calculator", slug: "per-yard", description: "Calculate cost per yard or total cost from price per yard", icon: "" },
    { id: 68, name: "Cost Per Meter Calculator", slug: "per-meter", description: "Calculate cost per meter or total from price per meter", icon: "" },
    { id: 69, name: "Total Project Cost Estimator", slug: "project-estimator", description: "Comprehensive cost: fabric, lining, interfacing, notions, pattern", icon: "" },
    { id: 70, name: "Fabric Cost vs Budget", slug: "budget-comparator", description: "Compare project cost against a budget with alternatives", icon: "" },
    { id: 71, name: "Cost Per Garment Calculator", slug: "per-garment", description: "Total cost per garment including materials, pattern, and time", icon: "" },
    { id: 72, name: "Complete Cost Breakdown", slug: "breakdown", description: "Itemized breakdown: fabric + notions + pattern + electricity", icon: "" },
    { id: 73, name: "Handmade Item Pricing", slug: "pricing-calculator", description: "Selling price: materials + labor + overhead + profit margin", icon: "" },
    { id: 74, name: "Fabric Comparison Tool", slug: "fabric-comparison", description: "Compare costs of different fabrics for the same project", icon: "" },
    { id: 75, name: "Wholesale vs Retail Comparator", slug: "wholesale-vs-retail", description: "Compare wholesale vs retail with MOQ and shipping", icon: "" },
    { id: 76, name: "Online vs Local Store Comparator", slug: "online-vs-local", description: "Compare total cost including shipping for online vs local", icon: "" },
    { id: 77, name: "Cost Per Wear Calculator", slug: "per-wear", description: "Total garment cost ÷ estimated lifetime wears", icon: "" },
    { id: 78, name: "Cost Per Square Unit", slug: "per-square-unit", description: "Cost per square inch/cm for detailed project costing", icon: "" },
    { id: 79, name: "Remnant Value Calculator", slug: "remnant-value", description: "Value of leftover fabric based on original price", icon: "" },
    { id: 80, name: "Fabric Stash Value Estimator", slug: "stash-value", description: "Estimate total value of your entire fabric stash", icon: "" },
    { id: 81, name: "Batch Production Cost", slug: "batch-production", description: "Per-unit cost for making multiple identical items", icon: "" },
    { id: 82, name: "Currency Converter for Fabric", slug: "currency-converter", description: "Convert currencies for international fabric shopping", icon: "" },
];
