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

const App = () => {
  const [isTooltipActive, setIsTooltipActive] = useState(false);
  const chartRef = useRef(null);
  const COLORS = {
    // Variable
    'Electricity': '#000000',
    'Total GHG': '#000000',

    // Scenarios
    'High Ambition': '#99cdc2',
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
    'High Ambition': '#4682b4'
  };

  // Custom Tooltip Component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length && isTooltipActive) {

      const validPayload = payload.filter(entry => entry.value !== null && entry.value !== undefined);

      // Group entries by category
      const categories = {
        'Variable': ['Electricity', 'Total GHG'],
        'Scenarios': ['High Ambition', 'Historical'],
        'Targets': ['NDC Target', 'Net-Zero Year'],
        'Gases': ['CO₂ (FFI)', 'CH₄', 'N₂O', 'F-Gases'],
        'Uncertainty Range': ['Uncertainty Range'],
      };

      // Get uncertainty range values
      const uncertaintyLower = data.find(d => d.year === label)?.uncertaintyLower;
      const uncertaintyUpper = data.find(d => d.year === label)?.uncertaintyUpper;
      const showUncertainty = label >= 2010 && uncertaintyLower !== null && uncertaintyUpper !== null;

      return (
        <div className="bg-white p-4 border border-gray-300 rounded shadow-md max-w-xs">
          <p className="font-medium mb-2">{`Year: ${label}`}</p>
          {Object.entries(categories).map(([category, items]) => {
            const validItems = validPayload.filter(entry =>
              items.includes(entry.name) &&
              (entry.name !== 'Uncertainty Range' || showUncertainty)
            );
            if (validItems.length === 0) return null;

            return (
              <div key={category} className="mb-2">
                <p className="font-medium text-xs uppercase tracking-wide text-gray-900">
                  {category}
                </p>
                {validItems.map((entry, index) => (
                  <p
                    key={`item-${index}`}
                    style={{
                      color: COLORS[entry.name] || '#4682b4',
                    }}
                  >
                    {entry.name === 'Uncertainty Range'
                      ? `High Ambition: ${uncertaintyLower} - ${uncertaintyUpper} Mt CO₂eq/yr`
                      : `${entry.name}: ${entry.value} Mt CO₂eq/yr`
                    }
                  </p>
                ))}
              </div>
            );
          })}
        </div>
      );
    }
    return null;
  };

  // Custom Dot Component
  const CustomizedDot = (props) => {
    const { cx, cy, fill, strokeWidth = 1 } = props;
    return (
      <svg x={cx - 10} y={cy - 10} width={8} height={8} viewBox="0 0 20 20">
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
      className="max-w-6xl mx-auto h-screen max-md:h-auto px-4"
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
                    value: 'Emissions GHG (Mt CO₂eq/yr)',
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
                  type="monotone"
                  dataKey="co2"
                  stackId="1"
                  stroke="transparent"
                  fill="#dbdfc6"
                  fillOpacity={1}
                  name="CO₂ (FFI)"
                />
                <Area
                  type="monotone"
                  dataKey="ch4"
                  stackId="1"
                  stroke="transparent"
                  fill="#62b947"
                  fillOpacity={1}
                  name="CH₄"
                />
                <Area
                  type="monotone"
                  dataKey="n2o"
                  stackId="1"
                  stroke="transparent"
                  fill="#a05da4"
                  fillOpacity={1}
                  name="N₂O"
                />
                <Area
                  type="monotone"
                  dataKey="fGases"
                  stackId="1"
                  stroke="transparent"
                  fill="#f8d623"
                  fillOpacity={1}
                  name="F-Gases"
                />

                {/* Uncertainty area */}
                <Area
                  type="monotone"
                  dataKey="uncertaintyUpper"
                  stroke="none"
                  fill="#add8e6"
                  stackId="1"
                  name="Uncertainty Range"
                />
                <Area
                  type="monotone"
                  dataKey="uncertaintyLower"
                  stroke="none"
                  fill="transparent"
                  stackId="1"
                />
                {/* <Area
                  type="monotone"
                  dataKey={(d) => d.uncertaintyUpper - d.uncertaintyLower}
                  stroke="none"
                  fill="#add8e6"
                  stackId="1"
                  name="Uncertainty Range"
                /> */}

                {/* Line components */}
                <Line
                  type="monotone"
                  dataKey="historical"
                  stroke="#000000"
                  strokeWidth={2}
                  dot={false}
                  name="Total GHG"
                />
                <Line
                  type="monotone"
                  dataKey="highAmbition"
                  stroke="#99cdc2"
                  strokeWidth={2}
                  dot={false}
                  connectNulls={true}
                  name="High Ambition"
                />
                <Line
                  type="monotone"
                  dataKey="electricity"
                  stroke="#000000"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  name="Electricity"
                />
                <Line
                  type="monotone"
                  dataKey="ndcTarget"
                  stroke="transparent"
                  dot={<CustomizedDot fill="#9370db" stroke="#000000" strokeWidth={2} />}
                  activeDot={<CustomizedDot fill="#9370db" stroke="#000000" strokeWidth={2} />}
                  name="NDC Target"
                />
                <Line
                  type="monotone"
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