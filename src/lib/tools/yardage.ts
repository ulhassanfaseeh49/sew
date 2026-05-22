export interface YardageTool {
    id: number;
    name: string;
    slug: string;
    description: string;
    icon: string;
    subcategory: string;
}

export const yardageTools: YardageTool[] = [
    { id: 25, name: "Basic Fabric Yardage Calculator", slug: "basic-calculator", description: "Calculate yardage needed from project dimensions and fabric width", icon: "📐", subcategory: "Basic & General" },
    { id: 26, name: "Pattern Repeat Calculator", slug: "pattern-repeat-calculator", description: "Calculate extra yardage for matching pattern repeats", icon: "🔁", subcategory: "Basic & General" },
    { id: 27, name: "Directional Fabric Calculator", slug: "directional-fabric-calculator", description: "Extra yardage for one-way prints and nap fabrics", icon: "⬆️", subcategory: "Basic & General" },
    { id: 28, name: "Border Print Calculator", slug: "border-print-calculator", description: "Yardage for border print fabrics along selvage", icon: "🎨", subcategory: "Basic & General" },
    { id: 29, name: "Fabric Waste Calculator", slug: "waste-calculator", description: "Estimate fabric waste percentage by layout efficiency", icon: "♻️", subcategory: "Basic & General" },
    { id: 30, name: "Extra Yardage Buffer Calculator", slug: "buffer-calculator", description: "How much extra to buy for mistakes and shrinkage", icon: "🛡️", subcategory: "Basic & General" },
    { id: 31, name: "Lining Yardage Calculator", slug: "lining-calculator", description: "Calculate lining fabric for any garment", icon: "🧥", subcategory: "Basic & General" },
    { id: 32, name: "Interfacing Yardage Calculator", slug: "interfacing-calculator", description: "Calculate interfacing for collars, cuffs, plackets", icon: "🏷️", subcategory: "Basic & General" },
    { id: 33, name: "Underlining Yardage Calculator", slug: "underlining-calculator", description: "Cut-for-cut underlining fabric calculator", icon: "📄", subcategory: "Basic & General" },
    { id: 34, name: "Multi-Fabric Project Calculator", slug: "multi-fabric-calculator", description: "Yardage for color-blocked and multi-fabric projects", icon: "🎯", subcategory: "Basic & General" },
    { id: 35, name: "Garment Yardage (General)", slug: "garment-general", description: "Estimate yardage for any garment by measurements", icon: "👗", subcategory: "Garment Yardage" },
    { id: 36, name: "Top/Blouse Yardage", slug: "garment-top", description: "Yardage for tops by style, sleeve, and fit", icon: "👚", subcategory: "Garment Yardage" },
    { id: 37, name: "Dress Yardage", slug: "garment-dress", description: "Yardage for dresses by style and length", icon: "👗", subcategory: "Garment Yardage" },
    { id: 38, name: "Skirt Yardage", slug: "garment-skirt", description: "Yardage for skirts by style and fullness", icon: "🩱", subcategory: "Garment Yardage" },
    { id: 39, name: "Pants/Trousers Yardage", slug: "garment-pants", description: "Yardage for pants, shorts, capris", icon: "👖", subcategory: "Garment Yardage" },
    { id: 40, name: "Jacket Yardage", slug: "garment-jacket", description: "Yardage for jackets including lining", icon: "🧥", subcategory: "Garment Yardage" },
    { id: 41, name: "Coat Yardage", slug: "garment-coat", description: "Yardage for coats with lining and interfacing", icon: "🧥", subcategory: "Garment Yardage" },
    { id: 42, name: "Vest/Waistcoat Yardage", slug: "garment-vest", description: "Yardage for vests with lining options", icon: "🦺", subcategory: "Garment Yardage" },
    { id: 43, name: "Swimwear Yardage", slug: "garment-swimwear", description: "Yardage for swimsuits in stretch fabric", icon: "👙", subcategory: "Garment Yardage" },
    { id: 44, name: "Activewear/Leggings Yardage", slug: "garment-activewear", description: "Yardage for leggings, sports bras, athletic wear", icon: "🏃", subcategory: "Garment Yardage" },
    { id: 45, name: "Lingerie/Underwear Yardage", slug: "garment-lingerie", description: "Yardage for bras, panties, slips, camisoles", icon: "🩱", subcategory: "Garment Yardage" },
    { id: 46, name: "Sleepwear/Pajama Yardage", slug: "garment-sleepwear", description: "Yardage for pajama sets, nightgowns, robes", icon: "🌙", subcategory: "Garment Yardage" },
    { id: 47, name: "Uniform/Workwear Yardage", slug: "garment-workwear", description: "Yardage for scrubs, aprons, chef coats", icon: "👔", subcategory: "Garment Yardage" },
    { id: 48, name: "Bias-Cut Garment Yardage", slug: "bias-cut-garment", description: "Extra yardage for bias-cut garments (25-50% more)", icon: "↗️", subcategory: "Garment Yardage" },
    { id: 49, name: "Plus-Size Yardage Adjuster", slug: "plus-size-adjuster", description: "Adjust standard yardage for plus-size garments", icon: "➕", subcategory: "Garment Yardage" },
    { id: 50, name: "Petite Yardage Adjuster", slug: "petite-adjuster", description: "Adjust yardage for petite sizing", icon: "📏", subcategory: "Garment Yardage" },
    { id: 51, name: "Quilt Yardage (General)", slug: "quilt-general", description: "Total fabric yardage for quilts by size and blocks", icon: "🟩", subcategory: "Quilt Yardage" },
    { id: 52, name: "Quilt Backing Yardage", slug: "quilt-backing", description: "Backing fabric with overhang for any quilt size", icon: "🟫", subcategory: "Quilt Yardage" },
    { id: 53, name: "Quilt Batting Size", slug: "quilt-batting", description: "Batting size with overhang vs standard sizes", icon: "☁️", subcategory: "Quilt Yardage" },
    { id: 54, name: "Curtain/Drape Yardage", slug: "curtains", description: "Yardage for curtains by window size and fullness", icon: "🪟", subcategory: "Home Décor Yardage" },
    { id: 55, name: "Pillow/Cushion Yardage", slug: "pillows", description: "Yardage for throw pillows of any size", icon: "🛋️", subcategory: "Home Décor Yardage" },
    { id: 56, name: "Tablecloth Yardage", slug: "tablecloth", description: "Yardage for tablecloths by table size and drop", icon: "🍽️", subcategory: "Home Décor Yardage" },
    { id: 57, name: "Bed Sheet Yardage", slug: "bed-sheets", description: "Yardage for fitted and flat sheets any mattress", icon: "🛏️", subcategory: "Home Décor Yardage" },
    { id: 58, name: "Bedding/Duvet Yardage", slug: "bedding-duvet", description: "Yardage for duvet covers and bedspreads", icon: "🛌", subcategory: "Home Décor Yardage" },
    { id: 59, name: "Upholstery Yardage", slug: "upholstery", description: "Yardage for reupholstering furniture", icon: "🪑", subcategory: "Home Décor Yardage" },
    { id: 60, name: "Bag/Tote Yardage", slug: "bags", description: "Yardage for bags, totes, and purses", icon: "👜", subcategory: "Specialty Projects" },
    { id: 61, name: "Plushie/Stuffed Animal Yardage", slug: "plushie", description: "Yardage for stuffed animals and plush toys", icon: "🧸", subcategory: "Specialty Projects" },
    { id: 62, name: "Costume Yardage", slug: "costume", description: "Yardage for costumes by era and style", icon: "🎭", subcategory: "Specialty Projects" },
    { id: 63, name: "Apron Yardage", slug: "apron", description: "Yardage for aprons by style", icon: "👨‍🍳", subcategory: "Specialty Projects" },
    { id: 64, name: "Pet Bed Yardage", slug: "pet-bed", description: "Yardage for pet beds and pet accessories", icon: "🐕", subcategory: "Specialty Projects" },
    { id: 65, name: "Flag/Banner Yardage", slug: "flag-banner", description: "Yardage for flags, banners, bunting", icon: "🚩", subcategory: "Specialty Projects" },
    { id: 66, name: "Booth Display Calculator", slug: "booth-display", description: "Yardage for craft fair booth displays", icon: "🏪", subcategory: "Specialty Projects" },
];
