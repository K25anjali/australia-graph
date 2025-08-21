import React from 'react';
import {
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
} from 'recharts';
import { data } from './data';
import CustomLegend from './CustomLegend';

const App = () => {

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-300 rounded shadow-md">
          <p className="font-medium">{`Year: ${label}`}</p>
          {payload.map((entry, index) => (
            <p key={`item-${index}`} style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value ? entry.value.toFixed(2) : 'N/A'} Mt CO₂eq/yr`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

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

  return (
    <div className="max-w-6xl mx-auto h-screen">
      <h1 className='pt-28 mb-6'>Emissions - Australia</h1>
      <div className="h-full pb-28 flex">
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

            {/* Area components with no opacity */}
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

            {/* Updated uncertainty area with solid fill */}
            <Area
              type="monotone"
              dataKey="uncertaintyLower"
              stroke="none"
              fill="transparent"
              stackId="1"
            />
            <Area
              type="monotone"
              dataKey={(d) => d.uncertaintyUpper - d.uncertaintyLower}
              stroke="none"
              fill="#add8e6"
              stackId="1"
              name="Uncertainty Range"
            />

            <Line
              type="monotone"
              dataKey="highAmbition"
              stroke="#add8e6"
              strokeWidth={2}
              dot={false}
              connectNulls={true}
              name="High Ambition"
            />
            <Line
              type="monotone"
              dataKey="historical"
              stroke="#000000"
              strokeWidth={2}
              dot={false}
              name="Total GHG (Historical)"
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
        <CustomLegend />
      </div>
    </div>
  );
};

export default App;