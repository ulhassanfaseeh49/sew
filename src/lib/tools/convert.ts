// Tool definitions for Category 1: Fabric Measurement & Conversion Tools
export interface Tool {
    id: number;
    name: string;
    slug: string;
    description: string;
    primaryUsers: string;
    crossLinks: string[];
}

export interface ToolCategory {
    name: string;
    tools: Tool[];
}

export const conversionSubCategories: ToolCategory[] = [
    {
        name: "Length Conversion Tools",
        tools: [
            { id: 1, name: "Yards to Meters Converter", slug: "yards-to-meters", description: "Convert fabric yardage to meters with common fabric yardage presets", primaryUsers: "All sewists", crossLinks: ["/convert/meters-to-yards"] },
            { id: 2, name: "Meters to Yards Converter", slug: "meters-to-yards", description: "Convert fabric meters to yards with common meter presets and fraction display", primaryUsers: "All sewists", crossLinks: ["/convert/yards-to-meters"] },
            { id: 3, name: "Inches to Centimeters Converter", slug: "inches-to-centimeters", description: "Convert inches (including fractions like 5/8\") to centimeters", primaryUsers: "All sewists", crossLinks: ["/convert/centimeters-to-inches"] },
            { id: 4, name: "Centimeters to Inches Converter", slug: "centimeters-to-inches", description: "Convert centimeters to inches with fraction display (nearest 1/16\", 1/8\", 1/4\")", primaryUsers: "All sewists", crossLinks: ["/convert/inches-to-centimeters"] },
            { id: 5, name: "Feet to Meters Converter", slug: "feet-to-meters", description: "Convert feet and inches to meters for large fabric measurements", primaryUsers: "Home decorators, upholsterers", crossLinks: ["/convert/meters-to-feet"] },
            { id: 6, name: "Meters to Feet Converter", slug: "meters-to-feet", description: "Convert meters to feet and inches", primaryUsers: "Home decorators, upholsterers", crossLinks: ["/convert/feet-to-meters"] },
            { id: 7, name: "Millimeters to Inches Converter", slug: "millimeters-to-inches", description: "Convert millimeters to inches with fraction display — for buttons, snaps, and hardware", primaryUsers: "All sewists", crossLinks: ["/convert/inches-to-millimeters"] },
            { id: 8, name: "Inches to Millimeters Converter", slug: "inches-to-millimeters", description: "Convert inches (including fractions) to millimeters", primaryUsers: "All sewists", crossLinks: ["/convert/millimeters-to-inches"] },
            { id: 9, name: "Fraction to Decimal Converter", slug: "fraction-to-decimal", description: "Convert sewing fractions (1/4\", 3/8\", 5/8\") to decimal inches with visual ruler", primaryUsers: "Beginners, pattern readers", crossLinks: ["/convert/decimal-to-fraction"] },
            { id: 10, name: "Decimal to Fraction Converter", slug: "decimal-to-fraction", description: "Convert decimal inches to nearest sewing fraction (1/16 to 7/8)", primaryUsers: "Beginners", crossLinks: ["/convert/fraction-to-decimal"] },
            { id: 11, name: "All-in-One Sewing Unit Converter", slug: "universal-sewing-converter", description: "Master converter: yards, meters, inches, cm, mm, feet in any direction", primaryUsers: "All sewists", crossLinks: ["/convert/yards-to-meters", "/convert/inches-to-centimeters"] },
        ],
    },
    {
        name: "Fabric Width Conversion Tools",
        tools: [
            { id: 12, name: "Fabric Width Converter (44/45\" to 60\")", slug: "fabric-width-44-to-60", description: "Calculate how much 60\"-wide fabric when pattern calls for 44/45\" fabric", primaryUsers: "All sewists", crossLinks: ["/convert/fabric-width-universal"] },
            { id: 13, name: "Fabric Width Converter (60\" to 108\")", slug: "fabric-width-60-to-108", description: "Convert yardage between 60\" and 108\" wide fabric for quilt backing", primaryUsers: "Quilters", crossLinks: ["/convert/fabric-width-universal"] },
            { id: 14, name: "Fabric Width Converter (36\" to 44/45\")", slug: "fabric-width-36-to-45", description: "Convert between vintage 36\"-wide and standard 44/45\" fabric", primaryUsers: "Vintage sewists", crossLinks: ["/convert/fabric-width-universal"] },
            { id: 15, name: "Universal Fabric Width Converter", slug: "fabric-width-universal", description: "Convert yardage between ANY two fabric widths with custom width inputs", primaryUsers: "All sewists", crossLinks: ["/yardage/basic-calculator"] },
            { id: 16, name: "Fabric Width Comparison Tool", slug: "fabric-width-comparison", description: "Visual side-by-side comparison showing pattern pieces on different widths", primaryUsers: "Fashion designers", crossLinks: ["/convert/fabric-width-universal"] },
        ],
    },
    {
        name: "Fabric Quantity & Bolt Tools",
        tools: [
            { id: 17, name: "Fabric Bolt Yardage Calculator", slug: "bolt-yardage-calculator", description: "Calculate total yardage on a bolt given diameter and thickness", primaryUsers: "Fabric store workers, bulk buyers", crossLinks: ["/cost/per-yard"] },
            { id: 18, name: "Fat Quarter Calculator", slug: "fat-quarter-calculator", description: "Calculate dimensions, area, and cutting from a fat quarter (18\" × 22\")", primaryUsers: "Quilters, crafters", crossLinks: ["/convert/fat-eighth-calculator"] },
            { id: 19, name: "Fat Eighth Calculator", slug: "fat-eighth-calculator", description: "Calculate dimensions, area, and cutting from a fat eighth (9\" × 22\")", primaryUsers: "Quilters", crossLinks: ["/convert/fat-quarter-calculator"] },
            { id: 20, name: "Half Yard vs Quarter Yard vs Fat Quarter", slug: "fabric-cut-comparator", description: "Visual comparison of different standard fabric cuts", primaryUsers: "Beginner quilters", crossLinks: ["/convert/fat-quarter-calculator"] },
            { id: 21, name: "Fabric Panel Size Calculator", slug: "fabric-panel-calculator", description: "Calculate printable/usable area of a fabric panel", primaryUsers: "Quilters using panels", crossLinks: ["/quilt/charm-pack-calculator"] },
            { id: 22, name: "Fabric Bolt to Project Estimator", slug: "bolt-to-project-estimator", description: "Given a bolt of X yards, how many projects can you make?", primaryUsers: "Bulk crafters, Etsy sellers", crossLinks: ["/pricing/handmade-pricing"] },
            { id: 23, name: "Pre-Cut Fabric Size Reference", slug: "precut-fabric-sizes", description: "Reference guide for all pre-cut sizes: charms, jelly rolls, layer cakes", primaryUsers: "Quilters", crossLinks: ["/quilt/charm-pack-calculator"] },
            { id: 24, name: "Fabric Area Calculator", slug: "fabric-area-calculator", description: "Calculate total area in sq inches, sq feet, sq cm, or sq meters", primaryUsers: "All sewists, designers", crossLinks: ["/cost/per-square-unit"] },
        ],
    },
];

export function getAllConversionTools(): Tool[] {
    return conversionSubCategories.flatMap(sc => sc.tools);
}

export function getConversionToolBySlug(slug: string): Tool | undefined {
    return getAllConversionTools().find(t => t.slug === slug);
}
