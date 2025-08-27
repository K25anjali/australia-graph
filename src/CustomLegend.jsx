import { memo } from 'react';
import { LEGEND_ITEMS, groupByCategory, ICON_STYLES } from './Utils';

const CustomLegend = () => {
    const groupedItems = groupByCategory(LEGEND_ITEMS);

    return (
        <div className="p-8 space-y-6 w-64 flex flex-col text-gray-800 justify-center text-xs">
            {Object.entries(groupedItems).map(([category, items]) => (
                <div key={category} className="space-y-2">
                    <div className="font-medium uppercase tracking-wide">{category}</div>
                    {items.map(({ name, color, style }) => {
                        const { className, getStyle } = ICON_STYLES[style] || ICON_STYLES.area;
                        return (
                            <div key={name} className="flex items-center">
                                <div className={className} style={getStyle(color)} />
                                <span>{name}</span>
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
    );
};

export default memo(CustomLegend);