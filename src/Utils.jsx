export const LEGEND_ITEMS = [
    { name: 'Electricity CO₂', color: '#000000', style: 'dashed', category: 'Variable' },
    { name: 'Total GHG', color: '#000000', style: 'line', category: 'Variable' },
    { name: 'High Ambition', color: '#6accc2', style: 'line', category: 'Scenarios' },
    { name: 'Historical', color: '#000000', style: 'line', category: 'Scenarios' },
    { name: 'NDC Target', color: '#9370db', style: 'triangle', category: 'Targets' },
    { name: 'Net-Zero Target', color: '#ff0000', style: 'triangle', category: 'Targets' },
    { name: 'Upper Uncertainty', color: '#7fcac0', style: 'area', category: 'Uncertainty Range' },
    { name: 'Lower Uncertainty', color: '#7fcac0', style: 'area', category: 'Uncertainty Range' },
    { name: 'F-Gases', color: '#e6c420', style: 'area', category: 'Gases' },
    { name: 'N₂O', color: '#a05da4', style: 'area', category: 'Gases' },
    { name: 'CH₄', color: '#62b947', style: 'area', category: 'Gases' },
    { name: 'CO₂ (FFI)', color: '#b3b89f', style: 'area', category: 'Gases' }
];

// Group items by category for rendering
export const groupByCategory = (items) =>
    items.reduce((acc, item) => {
        acc[item.category] = acc[item.category] || [];
        acc[item.category].push(item);
        return acc;
    }, {});

// Precomputed group to avoid repeating work in tooltip/legend renders
export const GROUPED_LEGEND = groupByCategory(LEGEND_ITEMS);

// Canonical category groupings used by tooltip sections
export const HISTORICAL_CATEGORIES = ['Variable', 'Gases'];
export const SCENARIO_CATEGORIES = ['Scenarios', 'Targets', 'Uncertainty Range'];

// Build a name->value map from Recharts payload; filters null/undefined
export const toPayloadMap = (payload) =>
    Object.fromEntries(
        (payload || [])
            .filter((p) => p && p.value !== null && p.value !== undefined)
            .map((p) => [p.name, p.value])
    );

// Get uncertainty info for a given year label
export const getUncertaintyForYear = (data, label) => {
    const row = (data || []).find((d) => d.year === label) || {};
    const { uncertaintyLower = null, uncertaintyUpper = null } = row;
    const show = label >= 2010 && uncertaintyLower !== null && uncertaintyUpper !== null;
    return { uncertaintyLower, uncertaintyUpper, show };
};

// Check if a category has any visible items for the tooltip
export const hasVisibleItems = (items, payloadMap, showUncertainty) =>
    (items || []).some((item) => {
        if (item.name === 'Upper Uncertainty' || item.name === 'Lower Uncertainty') {
            return showUncertainty;
        }
        return payloadMap[item.name] !== undefined;
    });

// Constants for icon styles
export const ICON_STYLES = {
    dashed: {
        className: 'w-4 h-0.5 mr-2', getStyle: (color) => ({
            background: `repeating-linear-gradient(to right, ${color} 0, ${color} 3px, transparent 3px, transparent 6px)`
        })
    },
    triangle: {
        className: 'w-3 h-3 mr-2', getStyle: (color) => ({
            backgroundColor: color,
            clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'
        })
    },
    line: { className: 'w-4 h-0.5 mr-2', getStyle: (color) => ({ backgroundColor: color }) },
    area: { className: 'w-3 h-3 mr-2', getStyle: (color) => ({ backgroundColor: color }) }
};