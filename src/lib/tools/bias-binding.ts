export interface BiasBindingTool { id: number; name: string; slug: string; description: string; icon: string; }
export const biasBindingTools: BiasBindingTool[] = [
    { id: 280, name: "Bias Tape Width Calculator", slug: "tape-width", description: "Cutting width for desired finished width", icon: "📏" },
    { id: 281, name: "Bias Tape Yardage", slug: "tape-yardage", description: "How much bias tape needed", icon: "📐" },
    { id: 282, name: "Continuous Bias Strip", slug: "continuous-bias", description: "Bias tape from a fabric square", icon: "🔄" },
    { id: 283, name: "Bias Tape for Curves", slug: "curves", description: "Extra tape for curved edges", icon: "🌀" },
    { id: 284, name: "Single vs Double Fold", slug: "fold-comparator", description: "Compare fold types", icon: "⚖️" },
    { id: 285, name: "Bias Tape Joining", slug: "joining", description: "Extra length for joins", icon: "🔗" },
    { id: 286, name: "Binding Width Calculator", slug: "finished-width", description: "Cut width to finished width", icon: "📊" },
    { id: 287, name: "Quilt Binding (Perimeter)", slug: "quilt-binding", description: "Binding for quilts by perimeter", icon: "🟩" },
    { id: 288, name: "Bias Tape Maker Guide", slug: "maker-guide", description: "Which maker size to use", icon: "🔧" },
    { id: 289, name: "Piping from Bias Tape", slug: "piping-from-bias", description: "Bias tape width for piping cord", icon: "〰️" },
];
