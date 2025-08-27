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
import { LEGEND_ITEMS } from './Utils';
const App = () => {
  const [isTooltipActive, setIsTooltipActive] = useState(false);
  const chartRef = useRef(null);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length && isTooltipActive) {
      const validPayload = payload.filter(
        (entry) => entry.value !== null && entry.value !== undefined
      );

      const uncertaintyLower = data.find((d) => d.year === label)?.uncertaintyLower;
      const uncertaintyUpper = data.find((d) => d.year === label)?.uncertaintyUpper;
      const showUncertainty =
        label >= 2010 &&
        uncertaintyLower !== null &&
        uncertaintyUpper !== null;

      const payloadMap = Object.fromEntries(validPayload.map((p) => [p.name, p.value]));

      const groupedItems = LEGEND_ITEMS.reduce((acc, item) => {
        if (!acc[item.category]) acc[item.category] = [];
        acc[item.category].push(item);
        return acc;
      }, {});

      return (
        <div className="bg-white p-4 border border-gray-300 rounded shadow-md max-w-xs">
          <p className="font-medium mb-2">{`Year: ${label}`}</p>
          {Object.entries(groupedItems).map(([category, items], catIndex) => {
            // Filter items in this category that actually have values to show
            const visibleItems = items.filter((item) => {
              if (item.name === "Upper Uncertainty" && showUncertainty) return true;
              if (item.name === "Lower Uncertainty" && showUncertainty) return true;
              return payloadMap[item.name] !== undefined;
            });

            if (visibleItems.length === 0) return null; // ⬅️ don't render empty categories

            return (
              <div key={catIndex}>
                <h1 className="font-semibold mt-2">{category}</h1>
                {visibleItems.map((item, index) => {
                  if (item.name === "Upper " && showUncertainty) {
                    return (
                      <p key={`${catIndex}-${index}`} style={{ color: item.color }}>
                        {item.name}: {uncertaintyUpper} Mt CO₂eq/yr
                      </p>
                    );
                  }
                  if (item.name === "Lower Uncertainty" && showUncertainty) {
                    return (
                      <p key={`${catIndex}-${index}`} style={{ color: item.color }}>
                        {item.name}: {uncertaintyLower} Mt CO₂eq/yr
                      </p>
                    );
                  }
                  return (
                    <p key={`${catIndex}-${index}`} style={{ color: item.color }}>
                      {item.name}: {payloadMap[item.name]} Mt CO₂eq/yr
                    </p>
                  );
                })}
              </div>
            );
          })}
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
                  fill="#add8e6"
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
                  stroke="#99cdc2"
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
                  name="Net-Zero Year"
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