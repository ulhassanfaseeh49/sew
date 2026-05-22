export interface BodyTool { id: number; name: string; slug: string; description: string; icon: string; }
export const bodyTools: BodyTool[] = [
    { id: 113, name: "How to Measure Yourself Guide", slug: "measurement-guide", description: "Step-by-step guide for taking all body measurements", icon: "📖" },
    { id: 114, name: "Body Measurement Tracker", slug: "measurement-tracker", description: "Record and track body measurements over time", icon: "📋" },
    { id: 115, name: "Ease Calculation Tool", slug: "ease-calculator", description: "Calculate wearing ease + design ease = pattern measurement", icon: "📏" },
    { id: 116, name: "US to UK Size Converter", slug: "size-us-to-uk", description: "Convert US and UK clothing sizes", icon: "🇬🇧" },
    { id: 117, name: "US to EU Size Converter", slug: "size-us-to-eu", description: "Convert US and European clothing sizes", icon: "🇪🇺" },
    { id: 118, name: "US to Asian Size Converter", slug: "size-us-to-asian", description: "Convert US and Asian clothing sizes", icon: "🌏" },
    { id: 119, name: "Universal Size Converter", slug: "size-converter-universal", description: "Convert between ANY international sizing systems", icon: "🌐" },
    { id: 120, name: "Standard Body Measurements", slug: "standard-measurements", description: "Database of standard measurements by size", icon: "📊" },
    { id: 121, name: "Pattern Size Selector", slug: "pattern-size-selector", description: "Get recommended pattern size from your measurements", icon: "🎯" },
    { id: 122, name: "Brand Size Comparator", slug: "brand-size-comparator", description: "Compare sizing between pattern brands", icon: "⚖️" },
    { id: 123, name: "Alterations Calculator", slug: "alterations-calculator", description: "Compare measurements to pattern and list needed alterations", icon: "✂️" },
    { id: 124, name: "Dress Form Size Calculator", slug: "dress-form-calculator", description: "Determine what size dress form to buy", icon: "👗" },
    { id: 125, name: "Dress Form Padding Calculator", slug: "dress-form-padding", description: "Calculate padding to match body measurements", icon: "🧵" },
    { id: 126, name: "Multi-Person Manager", slug: "multi-person", description: "Store measurements for multiple people", icon: "👥" },
    { id: 127, name: "Measurement Change Tracker", slug: "measurement-alerts", description: "Track changes and get alerts for projects", icon: "🔔" },
    { id: 128, name: "Bra Size Calculator", slug: "bra-size-calculator", description: "Calculate bra size from band and bust measurements", icon: "📐" },
];
