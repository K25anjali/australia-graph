// Define color mapping
const COLORS = {
    // Variable
    'Electricity': '#000000',
    'Total GHG (Historical)': '#000000',

    // Scenarios
    'High Ambition': '#add8e6',
    'Historical': '#000000',

    // Targets
    'NDC Target': '#9370db',
    'Net-Zero Year': '#ff0000',

    // Gases
    'CO₂ (FFI)': '#dbdfc6',
    'CH₄': '#62b947',
    'N₂O': '#a05da4',
    'F-Gases': '#f8d623',

    // Uncertainty
    'High Ambition': '#add8e6'
};

const LINE_STYLES = {
    'Electricity': '1 1',
    'High Ambition': 'none',
    'Historical': 'none',
    'Total GHG (Historical)': 'none',
};

const TARGET_ITEMS = ['NDC Target', 'Net-Zero Year'];
const UNCERTAINTY_ITEMS = ['High Ambition'];
const SCENARIO_ITEMS = ['High Ambition', 'Historical'];
const GHG_LINE_ITEMS = ['Total GHG (Historical)'];

const CustomLegend = () => {
    // Group items by category in the correct order
    const categories = {
        'Variable': ['Electricity', 'Total GHG (Historical)'],
        'Scenarios': ['High Ambition', 'Historical'],
        'Targets': ['NDC Target', 'Net-Zero Year'],
        'Uncertainty Range': ['High Ambition'],
        'Gases': ['F-Gases', 'N₂O', 'CH₄', 'CO₂ (FFI)'],
    };

    return (
        <div className="p-8 space-y-6 w-64 flex flex-col text-gray-800 justify-center">
            {Object.entries(categories).map(([category, items]) => (
                <div key={category}>
                    <div className="font-medium mb-2 text-xs uppercase tracking-wide">
                        {category}
                    </div>
                    <div className="flex flex-col gap-2">
                        {items.map(item => (
                            <div key={item} className="flex items-center text-xs">
                                {LINE_STYLES[item] === '1 1' ? (
                                    // For dashed lines (Electricity)
                                    <div
                                        className="w-4 h-0.5 mr-2"
                                        style={{
                                            background: `repeating-linear-gradient(to right, ${COLORS[item]} 0, ${COLORS[item]} 3px, transparent 3px, transparent 6px)`
                                        }}
                                    />
                                ) : TARGET_ITEMS.includes(item) ? (
                                    // For targets (triangle shape)
                                    <div
                                        className="w-3 h-3 mr-2"
                                        style={{
                                            backgroundColor: COLORS[item],
                                            clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'
                                        }}
                                    />
                                ) : (category === 'Scenarios' && SCENARIO_ITEMS.includes(item)) || GHG_LINE_ITEMS.includes(item) ? (
                                    // For scenarios and GHG (line shape)
                                    <div
                                        className="w-4 h-0.5 mr-2"
                                        style={{
                                            backgroundColor: COLORS[item]
                                        }}
                                    />
                                ) : (
                                    // For solid colors (areas)
                                    <div
                                        className="w-3 h-3 mr-2"
                                        style={{
                                            backgroundColor: COLORS[item]
                                        }}
                                    />
                                )}
                                <span>{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CustomLegend;
