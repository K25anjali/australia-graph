import { memo } from 'react';

// Centralized data configuration with tooltip property
const LEGEND_ITEMS = [
    { name: 'Electricity CO₂', color: '#000000', style: 'dashed', category: 'Variable', tooltip: 'CO₂ emissions from electricity production' },
    { name: 'Total GHG', color: '#000000', style: 'line', category: 'Variable', tooltip: 'Total greenhouse gas emissions' },
    { name: 'High Ambition', color: '#99cdc2', style: 'line', category: 'Scenarios', tooltip: 'High ambition scenario for emissions reduction' },
    { name: 'Historical', color: '#000000', style: 'line', category: 'Scenarios', tooltip: 'Historical emissions data' },
    { name: 'NDC Target', color: '#9370db', style: 'triangle', category: 'Targets', tooltip: 'Nationally Determined Contribution target' },
    { name: 'Net-Zero Year', color: '#ff0000', style: 'triangle', category: 'Targets', tooltip: 'Year targeted for net-zero emissions' },
    { name: 'Uncertainty Upper', color: '#4682b4', style: 'area', category: 'Uncertainty Range', tooltip: 'Upper bound of uncertainty range' },
    { name: 'Uncertainty Lower', color: '#4682b4', style: 'area', category: 'Uncertainty Range', tooltip: 'Lower bound of uncertainty range' },
    { name: 'F-Gases', color: '#f8d623', style: 'area', category: 'Gases', tooltip: 'Fluorinated gases emissions' },
    { name: 'N₂O', color: '#a05da4', style: 'area', category: 'Gases', tooltip: 'Nitrous oxide emissions' },
    { name: 'CH₄', color: '#62b947', style: 'area', category: 'Gases', tooltip: 'Methane emissions' },
    { name: 'CO₂ (FFI)', color: '#dbdfc6', style: 'area', category: 'Gases', tooltip: 'CO₂ from fossil fuels and industry' }
];

// Group items by category for rendering
const groupByCategory = (items) =>
    items.reduce((acc, item) => {
        acc[item.category] = acc[item.category] || [];
        acc[item.category].push(item);
        return acc;
    }, {});

// Constants for icon styles
const ICON_STYLES = {
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

const CustomLegend = ({ title = 'Legend' }) => {
    const groupedItems = groupByCategory(LEGEND_ITEMS);

    return (
        <div className="p-8 space-y-6 w-64 flex flex-col text-gray-800 justify-center text-xs">
            <h2 className="text-sm font-bold uppercase tracking-wide">{title}</h2>
            {Object.entries(groupedItems).map(([category, items]) => (
                <div key={category} className="space-y-2">
                    <div className="font-medium uppercase tracking-wide">{category}</div>
                    {items.map(({ name, color, style, tooltip }) => {
                        const { className, getStyle } = ICON_STYLES[style] || ICON_STYLES.area;
                        return (
                            <div key={name} className="flex items-center group relative" aria-label={tooltip}>
                                <div className={className} style={getStyle(color)} />
                                <span>{name}</span>
                                {tooltip && (
                                    <div className="absolute left-0 top-full mt-1 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 z-10 w-max max-w-xs">
                                        {tooltip}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
    );
};

export default memo(CustomLegend);