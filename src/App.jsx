import React, { useState, useRef } from 'react';
import {
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
} from 'recharts';
import { data } from './data';
import CustomLegend from './CustomLegend';
import { GROUPED_LEGEND, HISTORICAL_CATEGORIES, SCENARIO_CATEGORIES, toPayloadMap, getUncertaintyForYear, hasVisibleItems } from './Utils';
const App = () => {
  const [isTooltipActive, setIsTooltipActive] = useState(false);
  const chartRef = useRef(null);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length && isTooltipActive) {
      const payloadMap = toPayloadMap(payload);
      const { uncertaintyLower, uncertaintyUpper, show: showUncertainty } = getUncertaintyForYear(data, label);

      // Helper to render a category block with its items
      const renderCategory = (category, items, catKey, showCategoryTitle = true) => {
        const visibleItems = items.filter((item) => {
          if (item.name === 'Upper Uncertainty' && showUncertainty) return true;
          if (item.name === 'Lower Uncertainty' && showUncertainty) return true;
          return payloadMap[item.name] !== undefined;
        });
        if (visibleItems.length === 0) return null;
        return (
          <div key={catKey}>
            {showCategoryTitle && (
              <h2 className="font-semibold mt-2">{category}</h2>
            )}
            {visibleItems.map((item, index) => {
              if (item.name === 'Upper Uncertainty' && showUncertainty) {
                return (
                  <p key={`${catKey}-${index}`} style={{ color: item.color }}>
                    {item.name}: {uncertaintyUpper} Mt CO₂eq/yr
                  </p>
                );
              }
              if (item.name === 'Lower Uncertainty' && showUncertainty) {
                return (
                  <p key={`${catKey}-${index}`} style={{ color: item.color }}>
                    {item.name}: {uncertaintyLower} Mt CO₂eq/yr
                  </p>
                );
              }
              return (
                <p key={`${catKey}-${index}`} style={{ color: item.color }}>
                  {item.name}: {payloadMap[item.name]} Mt CO₂eq/yr
                </p>
              );
            })}
          </div>
        );
      };

      const hasHistorical = HISTORICAL_CATEGORIES.some((categoryName) =>
        hasVisibleItems(GROUPED_LEGEND[categoryName], payloadMap, showUncertainty)
      );
      const hasScenario = SCENARIO_CATEGORIES.some((categoryName) =>
        hasVisibleItems(GROUPED_LEGEND[categoryName], payloadMap, showUncertainty)
      );

      return (
        <div className="bg-white p-4 border border-gray-400 rounded shadow-md max-w-xs">
          <p className="font-medium mb-2">{`Year: ${label}`}</p>

          {/* Historical Section */}
          {hasHistorical && (
            <>
              <h1 className="font-bold mt-2 border-b border-b-gray-400 text-[#1274A3]">Historical</h1>
              {HISTORICAL_CATEGORIES.map((category, idx) =>
                GROUPED_LEGEND[category]
                  ? renderCategory(category, GROUPED_LEGEND[category], `hist-${idx}`)
                  : null
              )}
            </>
          )}

          {/* Scenario Section */}
          {hasScenario && (
            <>
              <h1 className="font-bold mt-3 mb-2 border-b border-b-gray-300 text-[#1274A3]">Scenarios</h1>
              {SCENARIO_CATEGORIES.map((category, idx) =>
                GROUPED_LEGEND[category]
                  ? renderCategory(
                      category,
                      GROUPED_LEGEND[category],
                      `scen-${idx}`,
                      category !== 'Scenarios'
                    )
                  : null
              )}
            </>
          )}
        </div>
      );
    }
    return null;
  }; 

  // Custom Dot Component
  const CustomizedDot = ({ cx, cy, fill, stroke, strokeWidth = 1 }) => {
    if (cx == null || cy == null) return null;

    return (
      <svg x={cx - 5} y={cy - 10} width={10} height={10} viewBox="0 0 20 20">
        <path
          d="M10 0 L20 20 L0 20 Z"
          fill={fill}
          strokeWidth={strokeWidth}
        />
      </svg>
    );
  };

  // Handle clicks/taps outside the chart
  const handleOutsideClick = (event) => {
    if (chartRef.current && !chartRef.current.contains(event.target)) {
      setIsTooltipActive(false);
    }
  };

  // Handle chart interaction to show tooltip
  const handleChartInteraction = () => {
    setIsTooltipActive(true);
  };

  return (
    <div
      className="max-w-4xl mx-auto h-screen max-md:h-auto px-4"
      onClick={handleOutsideClick}
      onTouchStart={handleOutsideClick} // For mobile touch events
    >
      <div className="w-full h-full py-28 flex md:flex-row flex-col">
        <div
          className="w-full md:h-full h-[50vh] max-md:overflow-x-auto"
          ref={chartRef}
          onMouseMove={handleChartInteraction} // Show tooltip on mouse move
          onTouchStart={handleChartInteraction} // Show tooltip on touch
        >
          <div className="w-full max-md:min-w-[500px] h-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={data}
                margin={{
                  top: 0,
                  right: 0,
                  left: 0,
                  bottom: 10,
                }}
              >
                <CartesianGrid />
                <XAxis
                  dataKey="year"
                  ticks={[1990, 2000, 2010, 2020, 2030, 2040, 2050, 2060]}
                  domain={[1990, 2060]}
                  type="number"
                  tick={{ fontSize: 12 }}
                  allowDataOverflow={false}
                  padding={{ left: 40, right: 40 }}
                />
                <YAxis
                  label={{
                    value: 'GHG Emissions (MtCO₂eq/yr)',
                    angle: -90,
                    position: 'center',
                    offset: 30,
                    dx: -20,
                    fontSize: 16,
                  }}
                  ticks={[0, 200, 400, 600]}
                  domain={[-100, 700]}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} />

                {/* Area components */}
                <Area
                  type="linear"
                  dataKey="co2"
                  stackId="1"
                  stroke="transparent"
                  fill="#b3b89f"
                  fillOpacity={1}
                  name="CO₂ (FFI)"
                />
                <Area
                  type="linear"
                  dataKey="ch4"
                  stackId="1"
                  stroke="transparent"
                  fill="#62b947"
                  fillOpacity={1}
                  name="CH₄"
                />
                <Area
                  type="linear"
                  dataKey="n2o"
                  stackId="1"
                  stroke="transparent"
                  fill="#a05da4"
                  fillOpacity={1}
                  name="N₂O"
                />
                <Area
                  type="linear"
                  dataKey="fGases"
                  stackId="1"
                  stroke="transparent"
                  fill="#e6c420"
                  fillOpacity={1}
                  name="F-Gases"
                />

                {/* Uncertainty area */}
                <Area
                  type="linear"
                  dataKey="uncertaintyLower"
                  stroke="none"
                  fill="transparent"
                  stackId="1"
                />
                <Area
                  type="linear"
                  dataKey={(d) => d.uncertaintyUpper - d.uncertaintyLower}
                  stroke="none"
                  fill="#cbede9"
                  stackId="1"
                  name="Uncertainty Range"
                />

                {/* Line components */}
                <Line
                  type="linear"
                  dataKey="historical"
                  stroke="#000000"
                  strokeWidth={2}
                  dot={false}
                  name="Total GHG"
                />
                <Line
                  type="linear"
                  dataKey="highAmbition"
                  stroke="#6accc2"
                  strokeWidth={2}
                  dot={false}
                  connectNulls={true}
                  name="High Ambition"
                />
                <Line
                  type="linear"
                  dataKey="electricity"
                  stroke="#000000"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  name="Electricity CO₂"
                />
                <Line
                  type="linear"
                  dataKey="ndcTarget"
                  stroke="transparent"
                  dot={<CustomizedDot fill="#9370db" stroke="#000000" strokeWidth={2} />}
                  activeDot={<CustomizedDot fill="#9370db" stroke="#000000" strokeWidth={2} />}
                  name="NDC Target"
                />
                <Line
                  type="linear"
                  dataKey="netZero"
                  stroke="transparent"
                  dot={<CustomizedDot fill="#ff0000" stroke="#000000" strokeWidth={2} />}
                  activeDot={<CustomizedDot fill="#ff0000" stroke="#000000" strokeWidth={2} />}
                  name="Net-Zero Target"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
        <CustomLegend />
      </div>
    </div>
  );
};

export default App;